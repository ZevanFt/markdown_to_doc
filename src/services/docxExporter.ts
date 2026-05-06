/**
 * 将 Markdown 文本转换为 docx 文档并下载
 * 论文排版：A4 纸张、标准页边距、中文字体、自动目录、页码
 * 使用动态导入，仅在用户点击导出时加载 docx 库
 */
export async function exportToDocx(markdown: string, filename?: string) {
  // 动态导入（懒加载，减小首屏 bundle）
  const { MarkdownDocx, Packer } = await import('markdown-docx');
  const {
    Document,
    TableOfContents,
    PageNumber,
    AlignmentType,
    Footer,
    TextRun,
    Paragraph,
  } = await import('docx');

  // 生成默认文件名
  if (!filename) {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    filename = `${timestamp}_zevan_md_to_doc.docx`;
  }

  // 预处理：将 \[...\] 转为 $$...$$，\(...\) 转为 $...$
  // 预处理：将 ==...== 转为 **...**（markdown-docx 不支持高亮标记）
  const processed = markdown
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, tex) => `$$${tex}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => `$${tex}$`)
    .replace(/==([^=]+?)==/g, '**$1**');

  // 中文字体配置
  const cnBodyFont = { name: 'Times New Roman', eastAsia: '宋体' };

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

  // 手动组装 Document
  const doc = new Document({
    styles: {
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
    },
    features: {
      updateFields: true,
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
              orientation: 'portrait',
            },
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1800,
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
                    size: 18,
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
