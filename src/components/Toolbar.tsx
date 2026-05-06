import React, { useCallback } from 'react';

interface ToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}

interface ToolbarAction {
  label: string;
  icon: string;
  prefix: string;
  suffix: string;
  block?: boolean;
  placeholder?: string;
}

const actions: ToolbarAction[] = [
  { label: '加粗', icon: 'B', prefix: '**', suffix: '**', placeholder: '粗体文本' },
  { label: '斜体', icon: 'I', prefix: '*', suffix: '*', placeholder: '斜体文本' },
  { label: '删除线', icon: 'S', prefix: '~~', suffix: '~~', placeholder: '删除文本' },
  { label: '高亮', icon: 'H', prefix: '==', suffix: '==', placeholder: '高亮文本' },
  { label: '行内代码', icon: '<>', prefix: '`', suffix: '`', placeholder: 'code' },
  { label: '一级标题', icon: 'H1', prefix: '# ', suffix: '', block: true },
  { label: '二级标题', icon: 'H2', prefix: '## ', suffix: '', block: true },
  { label: '三级标题', icon: 'H3', prefix: '### ', suffix: '', block: true },
  { label: '无序列表', icon: '•', prefix: '- ', suffix: '', block: true },
  { label: '有序列表', icon: '1.', prefix: '1. ', suffix: '', block: true },
  { label: '引用', icon: '❝', prefix: '> ', suffix: '', block: true },
  { label: '代码块', icon: '{}', prefix: '```\n', suffix: '\n```', block: true, placeholder: 'code' },
  { label: '链接', icon: '🔗', prefix: '[', suffix: '](url)', placeholder: '链接文本' },
  { label: '图片', icon: '🖼', prefix: '![', suffix: '](url)', placeholder: '图片描述' },
  { label: '表格', icon: '⊞', prefix: '', suffix: '', block: true, placeholder: '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |' },
  { label: '公式', icon: '∑', prefix: '$$', suffix: '$$', placeholder: 'E = mc^2' },
  { label: '分割线', icon: '—', prefix: '\n---\n', suffix: '', block: true },
];

const Toolbar: React.FC<ToolbarProps> = ({ textareaRef, value, onChange }) => {
  const insertText = useCallback(
    (action: ToolbarAction) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const text = selectedText || action.placeholder || '';

      let insertValue: string;

      if (action.block && start > 0 && value[start - 1] !== '\n') {
        insertValue = '\n' + action.prefix + text + action.suffix;
      } else {
        insertValue = action.prefix + text + action.suffix;
      }

      const newValue = value.substring(0, start) + insertValue + value.substring(end);
      onChange(newValue);

      // 选中插入的文本
      requestAnimationFrame(() => {
        const selectStart = start + (action.block && start > 0 && value[start - 1] !== '\n' ? 1 : 0) + action.prefix.length;
        const selectEnd = selectStart + text.length;
        textarea.focus();
        textarea.setSelectionRange(selectStart, selectEnd);
      });
    },
    [value, onChange, textareaRef]
  );

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border-light bg-bg overflow-x-auto shrink-0">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => insertText(action)}
          title={action.label}
          className="flex items-center justify-center w-7 h-7 rounded text-[12px] font-medium text-text-secondary hover:text-text hover:bg-accent-subtle transition-all duration-150 cursor-pointer shrink-0"
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
