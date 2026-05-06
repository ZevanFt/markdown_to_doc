import { MarkdownDocx, Packer } from 'markdown-docx';
import {
  Document,
  TableOfContents,
  PageNumber,
  AlignmentType,
  Footer,
  TextRun,
  Paragraph,
  type IStylesOptions,
} from 'docx';

// 中文字体配置
const cnBodyFont = { name: 'Times New Roman', eastAsia: '宋体' };

/**
 * 将 Markdown 文本转换为 docx 文档并下载
 * 论文排版：A4 纸张、标准页边距、中文字体、自动目录、页码
 */
export async function exportToDocx(markdown: string, filename?: string) {
  // 生成默认文件名: YYYYMMDD_HHmmss_zevan_md_to_doc
  if (!filename) {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    filename = `${timestamp}_zevan_md_to_doc.docx`;
  }

  // 预处理：将 \[...\] 转为 $$...$$，\(...\) 转为 $...$
  const processed = markdown
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, tex) => `$$${tex}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => `$${tex}$`);

  // 使用 MarkdownDocx 类获取 section 内容
  const converter = new MarkdownDocx(processed, {
    math: { engine: 'katex' },
    theme: {
      heading1: '000000',
      heading2: '000000',
      heading3: '000000',
      heading4: '000000',
      heading5: '000000',
      heading6: '000000',
    },
  });

  // 获取渲染后的内容块
  const content = await converter.toSection();

  // 文档默认样式：正文宋体 + 1.5 倍行距
  const docStyles: IStylesOptions = {
    default: {
      document: {
        run: {
          size: 24, // 12pt
          font: cnBodyFont,
        },
        paragraph: {
          spacing: { line: 360, lineRule: 'auto' },
        },
      },
    },
  };

  // 手动组装 Document
  const doc = new Document({
    styles: docStyles,
    features: {
      updateFields: true, // 打开 Word 时自动更新目录
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,  // A4: 210mm
              height: 16838, // A4: 297mm
              orientation: 'portrait',
            },
            margin: {
              top: 1440,    // 2.54cm
              bottom: 1440,
              left: 1800,   // 3.17cm
              right: 1800,
            },
            pageNumbers: { start: 1 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: cnBodyFont,
                    size: 18, // 9pt
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new TableOfContents('目录', {
            hyperlink: true,
            headingStyleRange: '1-6',
          }),
          new Paragraph({ spacing: { after: 200 } }),
          ...content,
        ],
      },
    ],
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
