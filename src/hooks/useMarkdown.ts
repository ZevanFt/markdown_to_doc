import { useState, useCallback, useMemo } from 'react';
import { parseMarkdown, parseMarkdownTokens } from '../services/markdownParser';

export function useMarkdown(initialValue = '') {
  const [markdown, setMarkdown] = useState(initialValue);

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);
  const tokens = useMemo(() => parseMarkdownTokens(markdown), [markdown]);

  const updateMarkdown = useCallback((value: string) => {
    setMarkdown(value);
  }, []);

  const clearMarkdown = useCallback(() => {
    setMarkdown('');
  }, []);

  const loadTemplate = useCallback((templateContent: string) => {
    setMarkdown(templateContent);
  }, []);

  return {
    markdown,
    html,
    tokens,
    updateMarkdown,
    clearMarkdown,
    loadTemplate,
  };
}
