import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import mermaid from 'mermaid';
import hljs from 'highlight.js';

// 初始化 Mermaid 配置
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

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
  const contentRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollTop: () => scrollRef.current?.scrollTop ?? 0,
    scrollTo: (top: number) => {
      if (scrollRef.current) scrollRef.current.scrollTop = top;
    },
    scrollHeight: () => scrollRef.current?.scrollHeight ?? 0,
    clientHeight: () => scrollRef.current?.clientHeight ?? 0,
  }));

  // 渲染 Mermaid 图表和代码高亮
  useEffect(() => {
    if (!contentRef.current) return;

    const renderMermaidAndHighlight = async () => {
      const container = contentRef.current;
      if (!container) return;

      // 渲染所有 Mermaid 代码块
      const mermaidBlocks = container.querySelectorAll<HTMLElement>('pre code.language-mermaid');
      for (const block of mermaidBlocks) {
        try {
          const id = `mermaid-${Math.random().toString(36).substring(2, 10)}`;
          const { svg } = await mermaid.render(id, block.textContent || '');
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-container';
          wrapper.innerHTML = svg;
          block.parentElement?.replaceWith(wrapper);
        } catch {
          // Mermaid 渲染失败时保留原始代码
          block.parentElement?.classList.add('mermaid-error');
        }
      }

      // 代码块语法高亮
      const codeBlocks = container.querySelectorAll<HTMLElement>('pre code');
      for (const block of codeBlocks) {
        // 跳过已处理的 mermaid 块和已有高亮的块
        if (block.classList.contains('language-mermaid') || block.classList.contains('hljs')) continue;
        try {
          hljs.highlightElement(block);
        } catch {
          // 忽略高亮失败
        }
      }
    };

    // 延迟执行以确保 DOM 已更新
    const timer = setTimeout(renderMermaidAndHighlight, 100);
    return () => clearTimeout(timer);
  }, [html]);

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
          ref={contentRef}
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
