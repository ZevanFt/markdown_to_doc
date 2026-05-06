import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="h-[100dvh] flex flex-col bg-bg">
      {/* 顶部导航 - 与主页一致 */}
      <header className="flex items-center justify-between px-5 py-2.5 bg-surface border-b border-border shrink-0">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 no-underline">
          <h1 className="text-[20px] text-text tracking-tight leading-none" style={{ fontFamily: 'var(--font-serif)' }}>
            Zevan
          </h1>
          <span className="text-[11px] font-medium text-text-secondary bg-accent-subtle border border-border-light px-2 py-0.5 rounded-full leading-none">
            Markdown To Doc
          </span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg border border-accent text-accent hover:bg-accent-light transition-all duration-200 cursor-pointer no-underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          返回编辑
        </Link>
      </header>

      {/* 页面内容 */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* 标题 */}
          <div className="mb-8">
            <h2
              className="text-[28px] text-text tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              关于 Markdown To Doc
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              一款免费的在线 Markdown 转 Word 文档工具，专为科研论文写作优化。支持实时预览、LaTeX 数学公式（Word 原生 OMML 格式）、一键复制到剪贴板或导出 .docx 文件。
            </p>
          </div>

          {/* 功能特性 */}
          <section className="mb-8">
            <h3 className="text-[17px] font-semibold text-text mb-4">功能特性</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                '完整的 Markdown 语法支持（GFM）',
                'LaTeX 公式渲染（4 种写法）',
                'Word 原生 OMML 公式导出',
                '一键复制富文本到 Word',
                '导出标准 .docx 文件',
                'A4 论文排版（宋体/黑体）',
                '自动目录与页码',
                '脚注支持',
                '图片粘贴与拖拽',
                '代码语法高亮',
                'Mermaid 流程图',
                '任务列表与高亮标记',
                '暗色模式',
                '同步滚动',
                '自动保存',
                '纯前端，数据不离开浏览器',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-[13px] text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 技术栈 */}
          <section className="mb-8">
            <h3 className="text-[17px] font-semibold text-text mb-3">技术栈</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              React 19 + TypeScript + Vite + Tailwind CSS 4 + KaTeX + Mermaid + highlight.js + markdown-docx
            </p>
          </section>

          {/* 开源许可 */}
          <section className="mb-8">
            <h3 className="text-[17px] font-semibold text-text mb-3">开源许可</h3>
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-accent-subtle">
                    <th className="text-left px-4 py-2.5 font-semibold text-text">库</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-text">许可证</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {[
                    ['React', 'MIT'],
                    ['marked', 'MIT'],
                    ['KaTeX', 'MIT'],
                    ['docx', 'MIT'],
                    ['markdown-docx', 'MIT'],
                    ['Mermaid', 'MIT'],
                    ['highlight.js', 'BSD-3-Clause'],
                    ['TypeScript', 'Apache-2.0'],
                    ['Vite', 'MIT'],
                    ['Tailwind CSS', 'MIT'],
                    ['ESLint', 'MIT'],
                  ].map(([name, license]) => (
                    <tr key={name} className="text-text-secondary">
                      <td className="px-4 py-2">{name}</td>
                      <td className="px-4 py-2">
                        <span className="text-[11px] font-medium bg-accent-subtle border border-border-light px-2 py-0.5 rounded-full">
                          {license}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12px] text-text-secondary/60 mt-2">
              完整许可证文本请参阅{' '}
              <a
                href="https://github.com/ZevanFt/markdown_to_doc/blob/main/THIRD-PARTY-LICENSES.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent border-b border-accent"
              >
                THIRD-PARTY-LICENSES.md
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* 底部版权栏 - 与主页一致 */}
      <footer className="shrink-0 flex items-center justify-center px-5 py-2 bg-surface border-t border-border text-[12px] text-text-secondary">
        <span>Copyright © 2026 Zevan❤️且试新茶趁年华. All Rights Reserved.</span>
      </footer>
    </div>
  );
};

export default AboutPage;
