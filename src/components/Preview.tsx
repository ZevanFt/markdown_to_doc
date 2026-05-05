import React, { forwardRef, useRef, useImperativeHandle } from 'react';

interface PreviewProps {
  html: string;
}

export interface PreviewHandle {
  scrollTop: () => number;
  scrollTo: (top: number) => void;
  scrollHeight: () => number;
  clientHeight: () => number;
}

const Preview = forwardRef<PreviewHandle, PreviewProps>(({ html }, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollTop: () => scrollRef.current?.scrollTop ?? 0,
    scrollTo: (top: number) => {
      if (scrollRef.current) scrollRef.current.scrollTop = top;
    },
    scrollHeight: () => scrollRef.current?.scrollHeight ?? 0,
    clientHeight: () => scrollRef.current?.clientHeight ?? 0,
  }));

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-light bg-accent-subtle shrink-0">
        <span className="text-[11px] font-semibold text-text-secondary tracking-wide uppercase">
          预览
        </span>
        <span className="text-[11px] text-text-secondary">Word 兼容格式</span>
      </div>
      <div ref={scrollRef} className="preview-scroll-area flex-1 overflow-auto p-6 bg-paper">
        <div
          className="doc-preview"
          style={{
            minHeight: '100%',
            width: '100%',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
