import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { blogArticles } from '../src/data/blogArticles';

const site = 'https://www.another-star.jp';
const postsDir = fileURLToPath(new URL('./src/content/posts', import.meta.url));

/**
 * URL ごとの lastmod。記事の正本が2つ（解説記事は blogArticles.ts、
 * 定点観測は Markdown の frontmatter）に分かれているため、両方から集める。
 * 更新日があればそれを、なければ発行日を使う。
 */
function buildLastmodMap() {
  const lastmod = new Map();

  for (const article of blogArticles) {
    lastmod.set(`${site}/blog/${article.slug}/`, article.updatedAt ?? article.publishedAt);
  }

  for (const file of readdirSync(postsDir).filter((name) => name.endsWith('.md'))) {
    const frontmatter = readFileSync(`${postsDir}/${file}`, 'utf8').split('---')[1] ?? '';
    const read = (key) => frontmatter.match(new RegExp(`^${key}:\\s*"?(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1];
    const date = read('updatedDate') ?? read('pubDate');
    // draft は sitemap に URL 自体が出ないため、日付が引けなくても素通しでよい。
    if (date) lastmod.set(`${site}/blog/${file.replace(/\.md$/, '')}/`, date);
  }

  // 一覧ページは最新記事の日付を持たせる。
  const newest = [...lastmod.values()].sort().at(-1);
  if (newest) lastmod.set(`${site}/blog/`, newest);

  return lastmod;
}

const lastmodByUrl = buildLastmodMap();

// A2A Insights — Another Star合同会社のブログ
// 本体SPA（Vite）と同居し、/blog 配下のみ静的生成する
export default defineConfig({
  site,
  base: '/blog',
  outDir: '../dist/blog',
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const lastmod = lastmodByUrl.get(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // 本体Vite(3000)経由でプロキシ表示するため、Astroの開発ツールバーを無効化。
  // ツールバーのクライアントスクリプトが /blog 外のパスで読み込まれ、
  // Vite側に流れて astro:toolbar:internal の解決に失敗するのを防ぐ。
  devToolbar: { enabled: false },
});
