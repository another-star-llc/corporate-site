import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// A2A Insights — Another Star合同会社のブログ
// 本体SPA（Vite）と同居し、/blog 配下のみ静的生成する
export default defineConfig({
  site: 'https://www.another-star.jp',
  base: '/blog',
  outDir: '../dist/blog',
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  // 本体Vite(3000)経由でプロキシ表示するため、Astroの開発ツールバーを無効化。
  // ツールバーのクライアントスクリプトが /blog 外のパスで読み込まれ、
  // Vite側に流れて astro:toolbar:internal の解決に失敗するのを防ぐ。
  devToolbar: { enabled: false },
});
