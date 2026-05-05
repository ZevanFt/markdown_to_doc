# Zevan To Doc — 部署指南

## 方式一：Vercel 部署（推荐）

最简单的方式，支持自动部署。

### 步骤

1. 将代码推送到 GitHub 仓库
2. 登录 [Vercel](https://vercel.com)，点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置如下：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 "Deploy"，等待部署完成

### 自动部署

每次推送到 `main` 分支，Vercel 会自动重新部署。

---

## 方式二：GitHub Pages 部署

免费静态托管，适合个人项目。

### 步骤

1. 修改 `vite.config.ts`，添加 `base` 配置：

```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/zevan-to-doc/',  // 替换为你的仓库名
})
```

2. 安装 `gh-pages`：

```bash
npm install -D gh-pages
```

3. 在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. 执行部署：

```bash
npm run deploy
```

5. 在 GitHub 仓库 Settings → Pages 中选择 `gh-pages` 分支

---

## 方式三：云服务器部署（Nginx）

适合有自己服务器的场景。

### 步骤

1. 本地构建：

```bash
npm run build
```

2. 将 `dist` 目录上传到服务器：

```bash
scp -r dist/* user@your-server:/var/www/zevan/
```

3. 配置 Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/zevan;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. 重启 Nginx：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

5. 配置 HTTPS（推荐）：

```bash
sudo certbot --nginx -d your-domain.com
```

---

## 方式四：Netlify 部署

1. 登录 [Netlify](https://netlify.com)
2. 点击 "Add new site" → "Import an existing project"
3. 连接 GitHub 仓库
4. 配置：
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. 点击 "Deploy site"

---

## 部署后检查清单

- [ ] 页面正常加载，无白屏
- [ ] 移动端适配正常
- [ ] 暗色模式切换正常
- [ ] Markdown 解析和预览正常
- [ ] 复制到剪贴板功能正常
- [ ] 下载 .docx 功能正常
- [ ] 文件上传功能正常
- [ ] LaTeX 公式渲染正常
- [ ] 自动保存和恢复正常
- [ ] 快捷键正常工作
- [ ] SEO meta 标签正确
- [ ] 底部版权信息正确
