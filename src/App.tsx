import React, { useState, useRef, useEffect } from 'react';
import Editor, { type EditorHandle } from './components/Editor';
import Preview, { type PreviewHandle } from './components/Preview';
import FileUpload from './components/FileUpload';
import TemplatePanel from './components/TemplatePanel';
import AboutModal from './components/AboutModal';
import { useMarkdown } from './hooks/useMarkdown';
import { useToast } from './components/Toast';
import { useTheme } from './hooks/useTheme';
import { useAutoSave } from './hooks/useAutoSave';
import { useKeyboard } from './hooks/useKeyboard';
import { copyHtmlToClipboard } from './services/clipboard';
import { exportToDocx } from './services/docxExporter';
import { templates } from './templates';
import './preview.css';

const App: React.FC = () => {
  const { markdown, html, updateMarkdown, clearMarkdown, loadTemplate } = useMarkdown();
  const { showToast, ToastComponent } = useToast();
  const { toggleTheme, isDark } = useTheme();
  const { restore, clearSaved } = useAutoSave(markdown);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [syncScroll, setSyncScroll] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorHandle>(null);
  const previewRef = useRef<PreviewHandle>(null);
  const isEditorScrolling = useRef(false);
  const isPreviewScrolling = useRef(false);

  useEffect(() => {
    const savedContent = restore();
    if (savedContent && savedContent !== markdown) {
      setShowRestorePrompt(true);
    }
  }, []);

  useKeyboard({
    onCopy: handleCopy,
    onExport: handleExport,
    onClear: handleClear,
    onToggleTheme: toggleTheme,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMobileMenu(false);
      }
    };
    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMobileMenu]);

  async function handleCopy() {
    if (!html.trim()) {
      showToast('没有内容可以复制', 'error');
      return;
    }
    const success = await copyHtmlToClipboard(html);
    if (success) {
      showToast('已复制到剪贴板，可直接粘贴到 Word');
    } else {
      showToast('复制失败，请手动选择预览内容复制', 'error');
    }
  }

  async function handleExport() {
    if (!markdown.trim()) {
      showToast('没有内容可以导出', 'error');
      return;
    }
    try {
      await exportToDocx(markdown);
      showToast('文档已下载');
    } catch (err) {
      console.error('[Export] Export failed:', err);
      showToast('导出失败，请重试', 'error');
    }
  }

  function handleClear() {
    clearMarkdown();
    clearSaved();
    showToast('已清空内容');
  }

  function handleRestore() {
    const saved = restore();
    if (saved) {
      loadTemplate(saved);
      setShowRestorePrompt(false);
      showToast('已恢复上次编辑的内容');
    }
  }

  function handleDismissRestore() {
    setShowRestorePrompt(false);
    clearSaved();
  }

  // 同步滚动逻辑
  useEffect(() => {
    if (!syncScroll) return;

    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    let syncTimer: ReturnType<typeof setTimeout>;

    const handleEditorScroll = () => {
      if (isPreviewScrolling.current) return;
      isEditorScrolling.current = true;
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        isEditorScrolling.current = false;
      }, 100);

      const editorScrollRatio = editor.scrollTop() / Math.max(1, editor.scrollHeight() - editor.clientHeight());
      const previewScrollTop = editorScrollRatio * (preview.scrollHeight() - preview.clientHeight());
      preview.scrollTo(previewScrollTop);
    };

    const handlePreviewScroll = () => {
      if (isEditorScrolling.current) return;
      isPreviewScrolling.current = true;
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        isPreviewScrolling.current = false;
      }, 100);

      const previewScrollRatio = preview.scrollTop() / Math.max(1, preview.scrollHeight() - preview.clientHeight());
      const editorScrollTop = previewScrollRatio * (editor.scrollHeight() - editor.clientHeight());
      editor.scrollTo(editorScrollTop);
    };

    // 监听 textarea 的 scroll
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.addEventListener('scroll', handleEditorScroll);

    // 监听预览区的 scroll
    const previewScroll = document.querySelector('.preview-scroll-area');
    if (previewScroll) previewScroll.addEventListener('scroll', handlePreviewScroll);

    return () => {
      if (textarea) textarea.removeEventListener('scroll', handleEditorScroll);
      if (previewScroll) previewScroll.removeEventListener('scroll', handlePreviewScroll);
      clearTimeout(syncTimer);
    };
  }, [syncScroll, html]);

  return (
    <div className="h-[100dvh] flex flex-col bg-bg">
      {ToastComponent}
      <AboutModal visible={showAbout} onClose={() => setShowAbout(false)} />

      {/* 恢复提示 */}
      {showRestorePrompt && (
        <div className="shrink-0 px-4 py-2 bg-accent-light border-b border-border flex items-center justify-between gap-3">
          <span className="text-[13px] text-text">检测到上次未保存的内容，是否恢复？</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestore}
              className="px-3 py-1 text-[12px] font-medium rounded-md bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer"
            >
              恢复
            </button>
            <button
              onClick={handleDismissRestore}
              className="px-3 py-1 text-[12px] font-medium rounded-md text-text-secondary hover:text-text transition-colors cursor-pointer"
            >
              忽略
            </button>
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-5 py-2.5 bg-surface border-b border-border shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <h1 className="text-[20px] text-text tracking-tight leading-none" style={{ fontFamily: 'var(--font-serif)' }}>
            Zevan
          </h1>
          <span className="text-[11px] font-medium text-text-secondary bg-accent-subtle border border-border-light px-2 py-0.5 rounded-full leading-none">
            Markdown To Doc
          </span>
        </div>

        {/* 桌面端操作按钮 - 重新分组 */}
        <div className="hidden sm:flex items-center gap-1">
          {/* 文件操作组 */}
          <div className="flex items-center gap-1 px-1.5 py-1 rounded-lg">
            <FileUpload onFileLoad={loadTemplate} />
            <TemplatePanel onSelect={loadTemplate} />
          </div>

          <div className="w-px h-5 bg-border mx-1.5" />

          {/* 核心操作组 */}
          <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-all duration-200 cursor-pointer shadow-sm"
              title="快捷键: Ctrl+Shift+C"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              复制
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg border border-accent text-accent hover:bg-accent-light transition-all duration-200 cursor-pointer"
              title="快捷键: Ctrl+S"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              下载 .docx
            </button>
          </div>

          <div className="w-px h-5 bg-border mx-1.5" />

          {/* 工具组 */}
          <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg">
            <button
              onClick={() => setSyncScroll(!syncScroll)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
                syncScroll
                  ? 'text-accent bg-accent-subtle'
                  : 'text-text-secondary hover:bg-accent-subtle'
              }`}
              title={syncScroll ? '关闭同步滚动' : '开启同步滚动'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:text-danger hover:bg-red-50 transition-all duration-200 cursor-pointer"
              title="清空 (Ctrl+Shift+X)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:bg-accent-subtle transition-all duration-200 cursor-pointer"
              title={`切换主题 (Ctrl+K)`}
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowAbout(true)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:text-text hover:bg-accent-subtle transition-all duration-200 cursor-pointer"
              title="关于"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端菜单按钮 */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:bg-accent-subtle active:bg-accent-light transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          {showMobileMenu && (
            <div className="absolute top-full right-0 mt-1.5 w-52 bg-surface rounded-xl border border-border shadow-lg z-50 overflow-hidden">
              <div className="py-1">
                <div className="px-3 py-1.5">
                  <FileUpload onFileLoad={loadTemplate} />
                </div>
                <div className="h-px bg-border-light mx-2 my-1" />
                <div className="px-3 py-1.5">
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">模板</span>
                </div>
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => { loadTemplate(tpl.content); setShowMobileMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-accent-subtle transition-colors cursor-pointer"
                  >
                    <div className="text-[13px] font-medium text-text">{tpl.name}</div>
                    <div className="text-[11px] text-text-secondary">{tpl.description}</div>
                  </button>
                ))}
                <div className="h-px bg-border-light mx-2 my-1" />
                <button
                  onClick={() => { handleCopy(); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-text hover:bg-accent-subtle transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  复制到剪贴板
                </button>
                <button
                  onClick={() => { handleExport(); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-text hover:bg-accent-subtle transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  下载 .docx
                </button>
                <div className="h-px bg-border-light mx-2 my-1" />
                <button
                  onClick={() => { toggleTheme(); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-text hover:bg-accent-subtle transition-colors cursor-pointer"
                >
                  {isDark ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                  {isDark ? '亮色模式' : '暗色模式'}
                </button>
                <button
                  onClick={() => { handleClear(); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-danger hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  清空内容
                </button>
                <div className="h-px bg-border-light mx-2 my-1" />
                <button
                  onClick={() => { setShowAbout(true); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-text hover:bg-accent-subtle transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  关于
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 移动端 Tab 切换栏 */}
      <div className="sm:hidden flex bg-surface border-b border-border shrink-0">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-2.5 text-[13px] font-medium text-center transition-colors cursor-pointer ${
            activeTab === 'edit' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary'
          }`}
        >
          编辑
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2.5 text-[13px] font-medium text-center transition-colors cursor-pointer ${
            activeTab === 'preview' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary'
          }`}
        >
          预览
        </button>
      </div>

      {/* 主内容区 - 桌面端等宽分栏 */}
      <main className="flex-1 min-h-0 flex overflow-hidden p-3 gap-3">
        {/* 桌面端：左右等宽分栏 */}
        <div className="hidden sm:block flex-1 min-w-0 bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <Editor ref={editorRef} value={markdown} onChange={updateMarkdown} />
        </div>
        <div className="hidden sm:block flex-1 min-w-0 bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <Preview ref={previewRef} html={html} />
        </div>

        {/* 移动端：Tab 切换 */}
        <div className={`sm:hidden flex-1 min-w-0 bg-surface rounded-xl border border-border overflow-hidden shadow-sm ${activeTab === 'edit' ? '' : 'hidden'}`}>
          <Editor value={markdown} onChange={updateMarkdown} />
        </div>
        <div className={`sm:hidden flex-1 min-w-0 bg-surface rounded-xl border border-border overflow-hidden shadow-sm ${activeTab === 'preview' ? '' : 'hidden'}`}>
          <Preview html={html} />
        </div>
      </main>

      {/* 底部版权栏 */}
      <footer className="shrink-0 flex items-center justify-center px-5 py-2 bg-surface border-t border-border text-[12px] text-text-secondary">
        <span>Copyright © 2026 Zevan❤️且试新茶趁年华. All Rights Reserved.</span>
      </footer>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
