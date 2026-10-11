import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // prerender は開発サーバー経由で描画するため、画像の import が /src/assets/... のまま出る。
    // ビルド後のファイル名に置き換えられるよう対応表を出力する（scripts/prerender.mjs が読んで削除する）。
    manifest: true,
    // /product 用に個別の HTML を生成し、検索エンジンにも固有の title・説明文を返す。
    // company は /about などの共通テンプレートで、prerender がページごとに複製する。
    rollupOptions: {
      input: {
        home: new URL('./index.html', import.meta.url).pathname,
        product: new URL('./product/index.html', import.meta.url).pathname,
        company: new URL('./company/index.html', import.meta.url).pathname,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    open: true,
    // /blog は同時起動している Astro dev サーバー(4321)へプロキシ。
    // 本番の vercel.json と同じ振り分けを、開発でも 1URL(localhost:3000) で再現する。
    proxy: {
      '/blog': {
        target: 'http://127.0.0.1:4321',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  preview: {
    proxy: {},
  },
});
