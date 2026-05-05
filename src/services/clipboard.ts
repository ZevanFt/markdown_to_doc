/**
 * 将 HTML 富文本复制到剪贴板（Word 兼容格式）
 */
export async function copyHtmlToClipboard(html: string): Promise<boolean> {
  try {
    // 使用 Clipboard API 写入 HTML 格式
    const blob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([html], { type: 'text/plain' });

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': blob,
        'text/plain': textBlob,
      }),
    ]);
    return true;
  } catch {
    // 降级方案：使用 execCommand
    return fallbackCopy(html);
  }
}

function fallbackCopy(html: string): boolean {
  try {
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    const range = document.createRange();
    range.selectNodeContents(container);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    document.execCommand('copy');
    document.body.removeChild(container);
    return true;
  } catch {
    return false;
  }
}
