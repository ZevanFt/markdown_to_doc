import katex from 'katex';
import { marked } from 'marked';

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: false,
});

// 行内公式和块级公式的正则
const BLOCK_MATH_REGEX = /\$\$([\s\S]+?)\$\$/g;
const INLINE_MATH_REGEX = /\$([^\$\n]+?)\$/g;

/**
 * 渲染单个公式为 HTML
 */
function renderMath(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      trust: true,
    });
  } catch {
    return `<span class="math-error">${tex}</span>`;
  }
}

/**
 * 将 Markdown 文本解析为 HTML（支持 LaTeX 公式）
 */
export function parseMarkdown(markdown: string): string {
  // 先提取公式，替换为占位符，防止 marked 破坏公式语法
  const mathBlocks: { placeholder: string; html: string }[] = [];
  let processed = markdown;

  // 提取块级公式 $$...$$
  processed = processed.replace(BLOCK_MATH_REGEX, (_match, tex) => {
    const placeholder = `%%MATH_BLOCK_${mathBlocks.length}%%`;
    mathBlocks.push({
      placeholder,
      html: renderMath(tex, true),
    });
    return placeholder;
  });

  // 提取行内公式 $...$
  processed = processed.replace(INLINE_MATH_REGEX, (_match, tex) => {
    const placeholder = `%%MATH_INLINE_${mathBlocks.length}%%`;
    mathBlocks.push({
      placeholder,
      html: renderMath(tex, false),
    });
    return placeholder;
  });

  // 用 marked 解析 Markdown
  let html = marked.parse(processed) as string;

  // 还原公式占位符
  for (const block of mathBlocks) {
    html = html.replace(block.placeholder, block.html);
  }

  return html;
}

/**
 * 将 Markdown 文本解析为 Token 列表（用于 docx 导出）
 */
export function parseMarkdownTokens(markdown: string) {
  return marked.lexer(markdown);
}
