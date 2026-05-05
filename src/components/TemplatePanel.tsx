import React, { useState, useRef, useEffect } from 'react';
import { templates } from '../templates';

interface TemplatePanelProps {
  onSelect: (content: string) => void;
}

const TemplatePanel: React.FC<TemplatePanelProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-lg text-text-secondary hover:text-text hover:bg-accent-subtle transition-all duration-200 cursor-pointer"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        模板
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-surface rounded-xl border border-border shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-border-light bg-accent-subtle">
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">选择模板</span>
          </div>
          <div className="py-1">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => {
                  onSelect(tpl.content);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-accent-subtle transition-colors cursor-pointer"
              >
                <div className="text-[13px] font-medium text-text">{tpl.name}</div>
                <div className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{tpl.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatePanel;
