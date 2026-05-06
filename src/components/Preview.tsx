import { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react';

interface PreviewProps {
  html: string;
  isDark?: boolean;
}

export interface PreviewHandle {
  scrollTop: () => number;
  scrollTo: (top: number) => void;
  scrollHeight: () => number;
  clientHeight: () => number;
}

const Preview = forwardRef<PreviewHandle, PreviewProps>(({ html, isDark }, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hljsModule, setHljsModule] = useState<any>(null);

  // 按需加载 highlight.js 核心 + 常用语言
  useEffect(() => {
    import('highlight.js/lib/core').then(async (hljs: any) => {
      const languages = [
        'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
        'go', 'rust', 'bash', 'shell', 'json', 'xml', 'html',
        'css', 'sql', 'markdown', 'yaml', 'latex', 'matlab',
        'r', 'ruby', 'php', 'swift', 'kotlin', 'scala',
      ];
      for (const lang of languages) {
        try {
          const mod = await import(`highlight.js/lib/languages/${lang}`);
          hljs.registerLanguage(lang, mod.default);
        } catch {
          // 语言模块不存在时跳过
        }
      }
      setHljsModule(hljs);
    });
  }, []);

  // 动态加载 highlight.js 主题 CSS
  useEffect(() => {
    const loadTheme = () => {
      // 移除旧主题
      document.querySelectorAll('link[data-hljs-theme]').forEach((el) => el.remove());
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('data-hljs-theme', 'true');
      link.href = isDark
        ? 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github-dark.min.css'
        : 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github.min.css';
      document.head.appendChild(link);
    };
    loadTheme();
  }, [isDark]);

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

    const renderAll = async () => {
      const container = contentRef.current;
      if (!container) return;

      // 渲染 Mermaid 代码块（懒加载）
      const mermaidBlocks = container.querySelectorAll<HTMLElement>('pre code.language-mermaid');
      if (mermaidBlocks.length > 0) {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? 'dark' : 'default',
            securityLevel: 'loose',
          });
          for (const block of mermaidBlocks) {
            try {
              const id = `mermaid-${Math.random().toString(36).substring(2, 10)}`;
              const { svg } = await mermaid.render(id, block.textContent || '');
              const wrapper = document.createElement('div');
              wrapper.className = 'mermaid-container';
              wrapper.innerHTML = svg;
              block.parentElement?.replaceWith(wrapper);
            } catch {
              block.parentElement?.classList.add('mermaid-error');
            }
          }
        } catch {
          // mermaid 加载失败时保留原始代码
        }
      }

      // 代码块语法高亮
      if (hljsModule) {
        const codeBlocks = container.querySelectorAll<HTMLElement>('pre code');
        for (const block of codeBlocks) {
          if (block.classList.contains('language-mermaid') || block.classList.contains('hljs')) continue;
          try {
            hljsModule.highlightElement(block);
          } catch {
            // 忽略高亮失败
          }
        }
      }
    };

    const timer = setTimeout(renderAll, 100);
    return () => clearTimeout(timer);
  }, [html, hljsModule, isDark]);

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
