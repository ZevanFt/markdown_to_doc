import { useEffect, useCallback, useState } from 'react';

const STORAGE_KEY = 'zevan-autosave';
const SAVE_INTERVAL = 30000; // 30 秒自动保存一次

interface AutoSaveData {
  content: string;
  timestamp: number;
}

export function useAutoSave(content: string) {
  const [hasRestored, setHasRestored] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 自动保存
  useEffect(() => {
    const timer = setInterval(() => {
      if (content.trim()) {
        const data: AutoSaveData = {
          content,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setLastSaved(new Date());
      }
    }, SAVE_INTERVAL);

    return () => clearInterval(timer);
  }, [content]);

  // 立即保存（用于页面关闭前）
  const saveNow = useCallback(() => {
    if (content.trim()) {
      const data: AutoSaveData = {
        content,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [content]);

  // 页面关闭前保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveNow();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveNow]);

  // 恢复保存的内容
  const restore = useCallback((): string | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: AutoSaveData = JSON.parse(saved);
        // 只恢复 7 天内的内容
        if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
          setHasRestored(true);
          return data.content;
        }
      }
    } catch {
      // 解析失败，忽略
    }
    return null;
  }, []);

  // 清除保存的内容
  const clearSaved = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasRestored(false);
  }, []);

  return {
    lastSaved,
    hasRestored,
    restore,
    clearSaved,
    saveNow,
  };
}
