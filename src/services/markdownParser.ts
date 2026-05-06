import katex from 'katex';
import { marked } from 'marked';

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: false,
});

// 启用 GFM 任务列表扩展
marked.use({ gfm: true });

// 行内公式和块级公式的正则
const BLOCK_MATH_REGEX = /\$\$([\s\S]+?)\$\$/g;
const INLINE_MATH_REGEX = /\$([^\$\n]+?)\$/g;
const BLOCK_MATH_BRACKET_REGEX = /\\\[([\s\S]+?)\\\]/g;
const INLINE_MATH_BRACKET_REGEX = /\\\(([\s\S]+?)\\\)/g;

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

// 高亮标记 ==...==
const HIGHLIGHT_REGEX = /==([^=]+?)==/g;

/**
 * 将 Markdown 文本解析为 HTML（支持 LaTeX 公式）
 */
export function parseMarkdown(markdown: string): string {
  // 先提取公式，替换为占位符，防止 marked 破坏公式语法
  const mathBlocks: { placeholder: string; html: string }[] = [];
  let processed = markdown;

  // 预处理：在 \[...\] 块内将 === 分数线转换为 \frac{}{} 格式
  processed = processed.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_match, content: string) => {
      // 将 "分子 \n ====... \n 分母" 转为 \frac{分子}{分母}
      const fixed = content.replace(
        /([\s\S]*?)\n\s*={3,}\s*\n([\s\S]*?)$/g,
        (_: string, num: string, den: string) => `\\frac{${num.trim()}}{${den.trim()}}`
      );
      return `\\[${fixed}\\]`;
    }
  );

  // 提取块级公式 $$...$$
  processed = processed.replace(BLOCK_MATH_REGEX, (_match, tex) => {
    const placeholder = `%%MATH_BLOCK_${mathBlocks.length}%%`;
    mathBlocks.push({
      placeholder,
      html: renderMath(tex, true),
    });
    return placeholder;
  });

  // 提取块级公式 \[...\]
  processed = processed.replace(BLOCK_MATH_BRACKET_REGEX, (_match, tex) => {
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

  // 提取行内公式 \(...\)
  processed = processed.replace(INLINE_MATH_BRACKET_REGEX, (_match, tex) => {
    const placeholder = `%%MATH_INLINE_${mathBlocks.length}%%`;
    mathBlocks.push({
      placeholder,
      html: renderMath(tex, false),
    });
    return placeholder;
  });

  // 处理高亮标记 ==...== → <mark>...</mark>
  processed = processed.replace(HIGHLIGHT_REGEX, '<mark>$1</mark>');

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
