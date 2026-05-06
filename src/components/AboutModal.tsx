import React, { useRef, useEffect } from 'react';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (visible) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* 弹窗 */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-surface rounded-2xl border border-border shadow-xl overflow-hidden"
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        {/* 头部 */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-2">
          <h2
            className="text-[22px] text-text tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Zevan
          </h2>
          <span className="text-[11px] font-medium text-text-secondary bg-accent-subtle border border-border-light px-2 py-0.5 rounded-full">
            Markdown To Doc
          </span>
        </div>

        {/* 内容 */}
        <div className="px-6 pb-6 space-y-4">
          <p className="text-[14px] text-text leading-relaxed">
            一款免费的在线 Markdown 转 Word 文档工具。支持实时预览、LaTeX 数学公式、一键复制到剪贴板或导出 .docx 文件。
          </p>

          <div className="space-y-2.5 text-[13px] text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>完整的 Markdown 语法支持（GFM）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>LaTeX 行内公式与块级公式渲染</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>一键复制富文本，粘贴到 Word 保留格式</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>导出标准 .docx 文件下载</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>纯前端运行，数据不离开浏览器</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-light">
            <p className="text-[13px] text-text-secondary">
              技术栈：React + TypeScript + Tailwind CSS + KaTeX
            </p>
          </div>

          {/* 开源许可 */}
          <div className="pt-2 border-t border-border-light">
            <p className="text-[12px] font-medium text-text-secondary mb-2">开源许可</p>
            <div className="space-y-1 text-[11px] text-text-secondary/70">
              <div className="flex justify-between"><span>React</span><span>MIT</span></div>
              <div className="flex justify-between"><span>marked</span><span>MIT</span></div>
              <div className="flex justify-between"><span>KaTeX</span><span>MIT</span></div>
              <div className="flex justify-between"><span>docx</span><span>MIT</span></div>
              <div className="flex justify-between"><span>markdown-docx</span><span>MIT</span></div>
              <div className="flex justify-between"><span>Mermaid</span><span>MIT</span></div>
              <div className="flex justify-between"><span>highlight.js</span><span>BSD-3</span></div>
              <div className="flex justify-between"><span>TypeScript</span><span>Apache-2.0</span></div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 bg-accent-subtle border-t border-border-light flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer"
          >
            知道了
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AboutModal;
