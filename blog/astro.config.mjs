import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// A2A Insights — Another Star合同会社のブログ
// 本体SPA（Vite）と同居し、/blog 配下のみ静的生成する
export default defineConfig({
  site: 'https://www.another-star.jp',
  base: '/blog',
  outDir: '../dist/blog',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
