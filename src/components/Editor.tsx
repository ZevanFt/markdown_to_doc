import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

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

  // 图片粘贴处理：将截图转为 base64 的 Markdown 图片语法
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;

          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            const imgMarkdown = `\n![${file.name || 'image'}](${base64})\n`;
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = value.substring(0, start) + imgMarkdown + value.substring(end);
            onChange(newValue);

            // 将光标移到图片标记之后
            requestAnimationFrame(() => {
              const cursorPos = start + imgMarkdown.length;
              textarea.selectionStart = textarea.selectionEnd = cursorPos;
              textarea.focus();
            });
          };
          reader.readAsDataURL(file);
          return;
        }
      }
    },
    [value, onChange]
  );

  // 拖拽图片处理
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement>) => {
      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;

      const imageFile = Array.from(files).find((f) => f.type.startsWith('image/'));
      if (!imageFile) return;

      e.preventDefault();
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const imgMarkdown = `\n![${imageFile.name || 'image'}](${base64})\n`;
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + imgMarkdown + value.substring(end);
        onChange(newValue);

        requestAnimationFrame(() => {
          const cursorPos = start + imgMarkdown.length;
          textarea.selectionStart = textarea.selectionEnd = cursorPos;
          textarea.focus();
        });
      };
      reader.readAsDataURL(imageFile);
    },
    [value, onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  }, []);

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
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex-1 min-w-0 w-full p-4 bg-transparent resize-none outline-none text-[14px] leading-relaxed font-mono text-text placeholder:text-text-secondary/40"
        placeholder="在此输入 Markdown 内容...（支持粘贴截图和拖拽图片）"
        spellCheck={false}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
