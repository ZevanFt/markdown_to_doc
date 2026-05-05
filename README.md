# Zevan To Doc

一款免费的在线 Markdown 转 Word 文档工具。支持实时预览、LaTeX 数学公式、一键复制到剪贴板或导出 .docx 文件。

## 功能特性

- **实时预览** — 左侧编辑 Markdown，右侧即时渲染 Word 兼容格式
- **一键复制** — 复制富文本到剪贴板，粘贴到 Word 保留完整格式
- **导出 .docx** — 生成标准 Word 文档直接下载
- **LaTeX 公式** — 支持行内公式 `$...$` 和块级公式 `$$...$$`
- **完整语法** — 标题、加粗、斜体、列表、表格、代码块、引用、分割线等
- **文件上传** — 支持上传 .md / .markdown / .txt 文件
- **预设模板** — 内置基础语法、表格、代码块、数学公式等示例模板
- **移动端适配** — 响应式布局，移动端编辑/预览 Tab 切换
- **隐私安全** — 纯前端运行，数据不离开浏览器

## 技术栈

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- marked（Markdown 解析）
- KaTeX（LaTeX 公式渲染）
- docx + file-saver（.docx 导出）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 使用说明

1. 在左侧编辑区输入 Markdown 内容
2. 右侧预览区实时显示渲染效果
3. 点击「复制」将富文本复制到剪贴板，可直接粘贴到 Word
4. 点击「下载 .docx」生成 Word 文档下载
5. 点击「模板」加载预设示例

### 公式语法

- 行内公式：`$E = mc^2$`
- 块级公式：`$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`

## 许可证

Copyright©️2026 Zevan❤️且试新茶趁年华. All Rights Reserved.
