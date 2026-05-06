import React, { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  danger = false,
  onConfirm,
  onCancel,
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

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
      if (e.key === 'Escape') onCancel();
    };
    if (visible) {
      document.addEventListener('keydown', handleEsc);
      // 聚焦到取消按钮（默认安全选项）
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [visible, onCancel]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* 弹窗 */}
      <div
        className="relative w-full max-w-sm bg-surface rounded-2xl border border-border shadow-xl overflow-hidden"
        style={{ animation: 'confirmModalIn 0.2s ease-out' }}
      >
        {/* 图标 + 标题 */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
                danger
                  ? 'bg-red-50 text-danger'
                  : 'bg-accent-subtle text-accent'
              }`}
            >
              {danger ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>
            <h3
              className="text-[17px] text-text tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* 内容 */}
        <div className="px-6 pb-5">
          <p className="text-[14px] text-text-secondary leading-relaxed pl-12">
            {message}
          </p>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 bg-accent-subtle/50 border-t border-border-light flex justify-end gap-2.5">
          <button
            ref={confirmBtnRef}
            onClick={onCancel}
            className="px-4 py-2 text-[13px] font-medium rounded-lg text-text-secondary hover:text-text hover:bg-surface border border-border-light transition-all duration-200 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-[13px] font-medium rounded-lg text-white transition-all duration-200 cursor-pointer shadow-sm ${
              danger
                ? 'bg-danger hover:opacity-90'
                : 'bg-accent hover:bg-accent-hover'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confirmModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
