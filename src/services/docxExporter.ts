import { markdownDocx, Packer } from 'markdown-docx';

/**
 * 将 Markdown 文本转换为 docx 文档并下载
 * 使用 markdown-docx 库，支持完整的 Markdown 语法和 LaTeX 公式（OMML 原生格式）
 */
export async function exportToDocx(markdown: string, filename?: string) {
  // 生成默认文件名: YYYYMMDD_HHmmss_zevan_md_to_doc
  if (!filename) {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    filename = `${timestamp}_zevan_md_to_doc.docx`;
  }

  // 预处理：将 \[...\] 转为 $$...$$，\(...\) 转为 $...$（markdown-docx 不识别括号语法）
  const processed = markdown
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, tex) => `$$${tex}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => `$${tex}$`);

  // 使用 markdown-docx 转换（内置 KaTeX 公式支持，LaTeX → MathML → Word OMML）
  const doc = await markdownDocx(processed, {
    math: {
      engine: 'katex',
    },
  });

  // 生成 Blob 并下载
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
