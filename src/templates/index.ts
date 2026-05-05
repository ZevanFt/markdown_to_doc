export const templates = [
  {
    id: 'basic',
    name: '基础语法',
    description: '标题、加粗、斜体、列表等基础 Markdown 语法',
    content: `# 基础 Markdown 语法示例

## 文本格式

这是一段普通文本。支持 **加粗**、*斜体*、~~删除线~~ 和 \`行内代码\`。

也可以组合使用：***加粗斜体***、**~~加粗删除线~~**

## 列表

### 无序列表
- 第一项
- 第二项
  - 嵌套项 A
  - 嵌套项 B
- 第三项

### 有序列表
1. 步骤一
2. 步骤二
3. 步骤三

## 引用

> 这是一段引用文本。
> 可以跨越多行。

## 分割线

---

## 链接

这是一个 [示例链接](https://example.com)。
`,
  },
  {
    id: 'table',
    name: '表格示例',
    description: 'Markdown 表格语法演示',
    content: `# 数据表格示例

## 员工信息表

| 姓名 | 部门 | 职位 | 工龄 |
|------|------|------|------|
| 张三 | 技术部 | 高级工程师 | 5年 |
| 李四 | 产品部 | 产品经理 | 3年 |
| 王五 | 设计部 | UI设计师 | 2年 |
| 赵六 | 市场部 | 市场总监 | 8年 |

## 季度业绩

| 季度 | 营收（万元） | 同比增长 |
|------|-------------|---------|
| Q1 | 1200 | +15% |
| Q2 | 1450 | +20.8% |
| Q3 | 1380 | -4.8% |
| Q4 | 1600 | +15.9% |
`,
  },
  {
    id: 'code',
    name: '代码块',
    description: '代码块和行内代码示例',
    content: `# 代码示例

## 行内代码

使用 \`console.log()\` 输出调试信息。

CSS 中使用 \`display: flex\` 创建弹性布局。

## 代码块

### JavaScript

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### Python

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
\`\`\`
`,
  },
  {
    id: 'full',
    name: '完整文档',
    description: '包含所有语法元素的完整文档示例',
    content: `# 项目技术方案

**文档版本**: v1.0  
**编写日期**: 2026-05-05  
**负责人**: 张三

---

## 1. 项目概述

本项目旨在构建一个高性能的在线文档处理系统，支持 Markdown 编辑、实时预览和多格式导出。

### 1.1 核心目标

- 支持完整的 Markdown 语法解析
- 提供所见即所得的编辑体验
- 支持导出为 Word、PDF 等格式

### 1.2 技术选型

| 技术 | 用途 | 版本 |
|------|------|------|
| React | 前端框架 | 19.x |
| TypeScript | 类型安全 | 5.x |
| Vite | 构建工具 | 6.x |
| Tailwind CSS | 样式方案 | 4.x |

## 2. 系统架构

### 2.1 前端架构

\`\`\`
src/
├── components/    # UI 组件
├── services/      # 业务服务
├── hooks/         # 自定义 Hooks
└── templates/     # 模板数据
\`\`\`

### 2.2 核心流程

1. 用户输入 Markdown 文本
2. 解析引擎实时转换为结构化数据
3. 渲染引擎将数据渲染为富文本预览
4. 用户可选择复制或下载

## 3. 关键实现

> 代码块使用等宽字体渲染，表格支持对齐方式，引用块使用左侧边框标识。

### 3.1 性能优化

- 使用 \`debounce\` 减少频繁解析
- 虚拟滚动处理大文档
- Web Worker 异步解析

### 3.2 兼容性

导出的 Word 文档兼容以下版本：
- Microsoft Word 2016+
- WPS Office 2019+
- LibreOffice 7.0+

---

*本文档为内部技术方案，仅供参考。*
`,
  },
  {
    id: 'math',
    name: '数学公式',
    description: 'LaTeX 行内公式和块级公式示例',
    content: `# 数学公式示例

## 行内公式

质能方程 $E = mc^2$ 是物理学中最著名的公式之一。

欧拉公式 $e^{i\\pi} + 1 = 0$ 被誉为最美的数学公式。

二次方程的求根公式为 $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$。

## 块级公式

### 高斯积分

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

### 麦克斯韦方程组

$$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$$

$$\\nabla \\times \\mathbf{H} = \\mathbf{J} + \\frac{\\partial \\mathbf{D}}{\\partial t}$$

### 矩阵

$$A = \\begin{pmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{pmatrix}$$

### 求和与极限

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$

### 傅里叶变换

$$\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) \\, e^{-2\\pi i x \\xi} \\, dx$$
`,
  },
];
