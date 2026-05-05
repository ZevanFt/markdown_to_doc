import { useEffect, useCallback } from 'react';

interface KeyboardHandlers {
  onCopy?: () => void;
  onExport?: () => void;
  onClear?: () => void;
  onToggleTheme?: () => void;
}

export function useKeyboard(handlers: KeyboardHandlers) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 忽略输入框内的快捷键（除了特定组合）
    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    // Ctrl/Cmd + Shift + C: 复制到剪贴板
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      handlers.onCopy?.();
      return;
    }

    // Ctrl/Cmd + S: 下载 .docx
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handlers.onExport?.();
      return;
    }

    // Ctrl/Cmd + K: 切换主题
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      handlers.onToggleTheme?.();
      return;
    }

    // Ctrl/Cmd + Shift + X: 清空内容
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
      e.preventDefault();
      handlers.onClear?.();
      return;
    }
  }, [handlers]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
