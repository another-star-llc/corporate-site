# corporate-site 記事実装契約

## 正本と配置

新しいA2A Insights記事は原則として次の2ファイルで構成する。

```text
blog/src/content/posts/<slug>.md
blog/public/<slug>-eyecatch.webp
```

`<slug>`は意味が安定する小文字ASCIIのkebab-caseにする。Markdownのファイル名が公開URL `/blog/<slug>/` になる。

`src/data/blogArticles.ts`と`src/pages/BlogArticlePage.tsx`は既存の手組み解説記事を支える。新しいMarkdown記事をそこへ重複登録しない。専用React UIが不可欠な記事は、影響範囲を別Issueで合意してから例外として扱う。

## frontmatter

作業時点の`blog/src/content/config.ts`を必ず読み、現行スキーマだけを使う。OpenClawまたは自動化が作る新規記事では、既定値へ暗黙に依存せず次を明示する。

```yaml
---
title: "検索意図へ直接答える記事タイトル"
shortTitle: "狭い表示でも意味が残る短縮タイトル"
description: "記事で得られる答えと主要論点を1〜2文で説明"
pubDate: 2026-08-15
tags: ["A2A", "主要テーマ", "実装論点"]
category: "ニュース解説"
readingTime: "8分"
heroImage: "/blog/<slug>-eyecatch.webp"
heroAlt: "画像が伝える関係や状況の具体的な説明"
featured: false
breaking: false
draft: false
---
```

| 項目 | 契約 |
| --- | --- |
| `title` | 記事詳細のH1、OG、JSON-LDに使う |
| `shortTitle` | パンくずと前後記事ナビ用。意味が失われない範囲で短くする |
| `description` | 一覧、記事lead、meta descriptionに使う |
| `pubDate` | `YYYY-MM-DD`。公開日を未来にしない |
| `updatedDate` | 本文または一次情報を実質的に更新したときだけ追加する |
| `tags` | JSON-LDの検索語になる。本文に実在する主要概念だけを入れる |
| `category` | 一覧のフィルタへ自動追加される。既存分類を優先する |
| `readingTime` | `N分`形式。最終稿の分量から見直す |
| `heroImage` | `/blog/<slug>-eyecatch.webp` |
| `heroAlt` | 画像の意味を説明する。タイトルを繰り返さない |
| `featured` | 通常は`false`。人間が一覧の主役を変える判断をした場合だけ`true` |
| `breaking` | 現行の一覧・詳細では未使用。表示実装を追加するまでは`false` |
| `draft` | 公開対象は`false`。レビュー中に`true`を使った場合は公開前に解除する |

`author`は作業時点の`blog/src/content/config.ts`と`blog/src/pages/[...slug].astro`が両方対応している場合だけ使う。現行mainではレンダラーが著者を管理するため、自動生成frontmatterへ追加しない。

検証スクリプトはOpenClaw出力を安定させるため、1行のscalarと`tags: ["A2A", "実装"]`形式のinline JSON配列を受け付ける。block-style配列や複数行scalarは使わない。

## 本文

- H1は書かない。
- 本文の主要区切りはMarkdownのH2にする。AstroがH2から目次を生成する。
- H3はH2の論点を分解する場合だけ使う。
- Markdownの表、リスト、引用を優先する。
- 生HTMLのH2は目次へ反映されないため、標準記事では使わない。
- 末尾のCTAと前後記事ナビは`BlogPostPage`が自動表示する。本文へ複製しない。
- 一次情報は本文中へ直接リンクし、末尾に`## 参照した一次情報`を置く。

## hero画像

| 項目 | 契約 |
| --- | --- |
| 形式 | WebP |
| 寸法 | 1672x941 |
| 名前 | `<slug>-eyecatch.webp` |
| 配置 | `blog/public/` |
| 公開パス | `/blog/<slug>-eyecatch.webp` |
| 容量目安 | 200KB以下。品質を壊す圧縮はしない |

一覧カードは重複読み上げを避けるため空altだが、記事詳細では`heroAlt`が使われる。`heroAlt`を省略しない。

生成画像が別寸法の場合は、利用可能な画像処理ツールで中央cropまたは余白調整を行い、1672x941へ書き出す。変形して縦横比を歪めない。検証スクリプトで実寸を再確認する。

## 自動反映される表示

Markdown記事はContent Collectionから次へ反映される。

- `/blog/`の記事一覧、カテゴリフィルタ、注目表示
- `/blog/<slug>/`の記事詳細、目次、CTA、前後記事
- meta title、description、canonical、OG画像
- BlogPostingとBreadcrumbListのJSON-LD
- RSS
- sitemap

表示情報の正本はfrontmatterである。TypeScript側へ同じ記事メタデータを登録しない。

## 検証

記事ファイルからリポジトリ契約を検査する。

```bash
python3 .agents/skills/a2a-blog-writing/scripts/validate_article.py \
  blog/src/content/posts/<slug>.md
```

人間が`featured: true`を明示承認した場合だけ、`--allow-featured`を付ける。

Skill自身のテストを行う。

```bash
python3 .agents/skills/a2a-blog-writing/scripts/test_validate_article.py
```

Skill構造は、利用中のskill-creator Skillに含まれる`quick_validate.py`へ`.agents/skills/a2a-blog-writing`を渡して検証する。

サイト全体をビルドする。

```bash
npm run build
```

`build:blog`がnpmの版差で`blog/package-lock.json`を書き換える場合がある。検証後に`git status --short`と`git diff --check`を実行し、記事とSkillに無関係なlockfile差分や生成物をPRへ含めない。

ビルド後は少なくとも次を確認する。

- `dist/blog/<slug>/index.html`
- `dist/blog/index.html`
- `dist/blog/rss.xml`
- `dist/blog/sitemap-0.xml`
- title、description、canonical、OG画像、JSON-LD
- heroの比率、長いH1、H2目次、表の横スクロール
- カテゴリ、CTA、前後記事ナビ

ローカル表示が可能ならデスクトップとモバイルの両方を目視する。実行できなかった確認はPR本文へ明記する。

```bash
npm run dev
# http://localhost:3000/blog/<slug>/
# http://localhost:3000/blog/
```

## PR

- MarkdownとWebPを同じPRへ含める。
- 一次情報、情報基準日、実行した検証、未確認項目をPR本文へ書く。
- 記事と無関係な生成物やローカル設定を含めない。
- 専用ブランチで意図したファイルだけをcommit・pushし、最初はdraft PRとして作る。
- 自動でmergeしない。
- 公開後に事実が変わる可能性がある記事は、更新条件または再確認日をIssueへ残す。

この検証スクリプトは、OpenClawが新しく生成する標準記事の受入れ用である。H2構造や古い画像寸法が異なる既存記事へ一括適用しない。
