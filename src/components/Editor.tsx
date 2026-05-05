import React, { useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface EditorHandle {
  scrollTop: () => number;
  scrollTo: (top: number) => void;
  scrollHeight: () => number;
  clientHeight: () => number;
}

const Editor = forwardRef<EditorHandle, EditorProps>(({ value, onChange }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollTop: () => textareaRef.current?.scrollTop ?? 0,
    scrollTo: (top: number) => {
      if (textareaRef.current) textareaRef.current.scrollTop = top;
    },
    scrollHeight: () => textareaRef.current?.scrollHeight ?? 0,
    clientHeight: () => textareaRef.current?.clientHeight ?? 0,
  }));

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);

        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange]
  );

  return (
    <div ref={containerRef} className="flex flex-col h-full min-w-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-light bg-accent-subtle shrink-0">
        <span className="text-[11px] font-semibold text-text-secondary tracking-wide uppercase">
          Markdown
        </span>
        <span className="text-[11px] text-text-secondary">
          {value.length} 字符
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-0 w-full p-4 bg-transparent resize-none outline-none text-[14px] leading-relaxed font-mono text-text placeholder:text-text-secondary/40"
        placeholder="在此输入 Markdown 内容..."
        spellCheck={false}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
