# TON's Space

TON 的个人学术与技术网站，用于长期维护博客、课程笔记、论文阅读、数值实验记录与项目展示。

## Tech Stack

- Astro
- Astro Theme Pure
- Markdown / MDX
- Pagefind (站内搜索)
- RSS + Sitemap
- Git + GitHub
- Vercel / Cloudflare Pages

## Local Development

```bash
pnpm install
pnpm dev
```

## Build & Preview

```bash
pnpm build
pnpm preview
```

## Content Writing

Blog 内容放在 `src/content/blog/`，Notes 内容放在 `src/content/notes/`。

示例：

- Blog: `src/content/blog/hello-world.md`
- Notes: `src/content/notes/numerical-analysis/numerical-analysis-notes-index.md`

## Deployment

### Option A: Vercel

- Framework Preset: `Astro`
- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Node.js: `18+`

### Option B: Cloudflare Pages

- Framework preset: `Astro`
- Build command: `pnpm build`
- Build output directory: `dist`
- Node.js: `18+`

## Update Workflow

```bash
git add .
git commit -m "update website content"
git push
```

推送后由部署平台自动构建并上线。

## Project Structure

```text
src/
  content/
    blog/
    notes/
  data/
    profile.ts
    projects.ts
    links.ts
    skills.ts
  pages/
    index.astro
    blog/
    notes/
    projects/
    about/
    links/
```

## Codex Agent Workflow Notes

- 使用 generale 整理这些课程笔记并发布到我的个人网站。
- 使用 generale 把 LaTeX 笔记转换为适合网站发布的 Markdown/MDX。
- 使用 generale 把 notebook 整理成网站文章。
- 使用 quantool 生成量子论文阅读笔记并放入 Notes。
- 使用 codeey 生成数值实验代码、图像、README 和报告，并将结果整理到 Projects 或 Notes。

## TODO

- GitHub username / repository URL
- 正式域名
- 头像文件（如需替换当前默认头像）
- favicon 文件（如需替换）
- Google Scholar / ORCID / CV 链接
- 友链列表
- 是否开启 Waline 评论
- 是否开启 Umami 统计
- 是否绑定自定义域名
