# Another Star合同会社 公式ウェブサイト

https://www.another-star.jp/ のソースです。コーポレートサイト（Vite + React）と、技術ブログ「A2A Insights」（Astro、`/blog/`）を1つのリポジトリで管理し、Vercel で配信しています。

## 構成

| パス | 内容 | 技術 |
|---|---|---|
| `/` | ホーム（3D背景とメニュー。ABOUT などはモーダルで表示） | Vite + React、three.js |
| `/about` `/mission` `/members` `/systems` `/contact` | モーダルと同じ内容を単独ページとして公開したもの | 同上（prerender で静的HTML化） |
| `/product` | 製品紹介 | 同上 |
| `/blog/` | A2A Insights（記事一覧・記事ページ・RSS・サイトマップ） | Astro 4（`blog/`） |
| `/llms.txt` `/investors.txt` | AIエージェント・読者向けの要約と、投資家向けの情報 | テキスト（`public/`） |

主なディレクトリ:

```
src/
  components/WindowContents.tsx  会社情報の本文（モーダルと /about などの正本）
  data/companyPages.ts           /about などの URL・タイトル・説明文
  data/blogArticles.ts           ブログの解説記事（Astro 側から読み込む）
  pages/                         /product と /about など、ブログの React コンポーネント
blog/
  src/content/posts/             ブログの Markdown 記事
  src/pages/                     ブログのページ（React コンポーネントを描画）
scripts/
  prerender.mjs                  ホーム・/product・/about などを静的 HTML にする
  sitemap.mjs                    サイト本体の sitemap.xml を生成する
  llms.mjs                       llms.txt にブログの記事一覧を差し込む
public/                          そのまま配信するファイル（llms.txt、robots.txt、画像など）
.agents/skills/a2a-blog-writing/ ブログ記事の執筆・検証の基準（OpenClaw / Codex 用）
```

## 開発

Node.js 22 を使います（`.nvmrc`）。

```bash
npm install
npm run dev
```

`npm run dev` はサイト（http://localhost:3000）とブログ（Astro、ポート4321）を同時に起動し、`localhost:3000/blog/` をブログへ転送します。

- `npm run dev:site` だけで起動すると、ブログのサーバーがないため `/blog/` は 500 エラーになります
- 開発サーバーの `/llms.txt` では、記事一覧の位置に目印のコメントが表示されます（本番ではビルド時に記事一覧へ置き換わります）
- 同じネットワークのスマホから確認する場合は `npm run dev:site -- --host 0.0.0.0` を使います

## ビルド

```bash
npm run build
```

次の順に実行されます。どれかが失敗するとビルド全体が止まります。

1. `tsc` — 型チェック
2. `vite build` — サイト本体を `dist/` に出力
3. `prerender` — ホーム・`/product`・`/about` などの本文を静的 HTML に埋め込む（JavaScript なしでもクローラが本文を読めるようにするため）
4. `sitemap` — `dist/sitemap.xml` を生成（`lastmod` は各ページのソースの最終コミット日）
5. `build:blog` — ブログを `dist/blog/` に出力（`@astrojs/sitemap` がブログ用のサイトマップを出す）
6. `llms` — `dist/llms.txt` にブログの記事一覧を差し込む

ローカルで本番に近い表示を確認するには、ビルド後に `npm run preview` を使います。

## コンテンツの更新

| 更新したいもの | 編集する場所 |
|---|---|
| 会社概要・ミッション・メンバー・システム・お問い合わせの本文 | `src/components/WindowContents.tsx`（モーダルと `/about` などの両方に反映） |
| `/about` などのタイトル・説明文 | `src/data/companyPages.ts` |
| ブログ記事（ニュース・定点観測） | `blog/src/content/posts/<slug>.md` |
| ブログの解説記事 | `src/data/blogArticles.ts` |
| AIエージェント・読者向けの要約 | `public/llms.txt`（記事一覧は自動生成なので手で書かない） |
| 投資家向けの情報 | `public/investors.txt` |

### ブログ記事の追加

- ニュース・定点観測記事は `blog/src/content/posts/<slug>.md` に追加します。`<slug>` は意味のある小文字の kebab-case にします（公開URL `/blog/<slug>/` になります）
- 記事一覧・RSS・サイトマップ・llms.txt の記事一覧には自動で載ります
- OpenClaw または Codex で記事を執筆・改稿する場合は、`.agents/skills/a2a-blog-writing/SKILL.md` を公開仕様の正本として使います
- Slack で承認された記事は専用ブランチの Pull Request で受け入れ、ビルドと公開文面を確認して main にマージするまで公開とは扱いません

## デプロイ

main へのマージで Vercel が本番にデプロイします。Pull Request ごとにプレビューも作られます。

- ルーティング（`/product` や `/about` などの書き換え、末尾スラッシュのリダイレクト）は `vercel.json` で設定しています。**`/about` などのページを増やすときは、`src/data/companyPages.ts` に加えて `vercel.json` のパターンも更新してください**
- PR のマージ時にブランチは自動で削除されます

## ライセンス

© 2025 Another Star合同会社. All rights reserved.
