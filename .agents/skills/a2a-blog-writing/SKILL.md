---
name: a2a-blog-writing
description: Plan, write, revise, validate, and prepare PR-ready Japanese A2A Insights Markdown articles in the corporate-site repository. Use when OpenClaw or Codex creates or edits A2A, MCP, Agent Card, agent security, implementation, market-news, evergreen, or field-report content; when an article must match existing A2A Insights style; or when frontmatter, a 1672x941 WebP hero image, site rendering, RSS, and PR checks must be aligned.
---

# A2A Insights記事を作成する

公開記事の品質基準とcorporate-siteの実装契約を同時に満たす。OpenClaw側の候補選定や根拠収集は入力として受け取り、最終的なMarkdown、画像、表示、検証結果をこのリポジトリで正本化する。

## 必須資料を読む

執筆や編集の前に、次を最後まで読む。

- [編集・執筆基準](references/editorial-style.md)
- [リポジトリ実装契約](references/repository-contract.md)

さらに、作業時点の実装を正本として次を確認する。

- `blog/src/content/config.ts`
- `blog/src/pages/[...slug].astro`
- `src/pages/BlogPostPage.tsx`
- `blog/src/content/posts/`の関連性が高い記事と新しい記事を2〜3本
- `src/data/blogArticles.ts`の近いテーマの記事
- `docs/seo-keyword-map.md`（存在する場合）

既存記事と実装が参照資料と異なる場合は、現行実装を優先し、Skillも同じPRで更新する。

## 入力を確認する

公開可能な原稿を作る前に、少なくとも次をそろえる。

- 記事種別: ニュース解説、常設解説、実測・定点観測
- 想定読者、読者の前提知識、読後にできるようにすること
- 一次情報のURL、公開日、取得日、対象バージョン
- 事実、解釈、未確認事項を区別できる根拠
- 速報性がある場合は情報基準日時と、後日更新が必要な点
- OpenClaw経由では、審査済み原稿、一次情報一覧、情報基準日時、承認状態を受け渡す

入力が不足する場合は、足りない事実を推測で補わない。一次情報を追加調査するか、未確認と明記して記事の射程を狭める。

OpenClawからは少なくとも次の公開可能な情報を受け取る。内部IDやhashは受け渡し検証に使っても、記事やPR本文へ転記しない。

```yaml
articleType: news
topic: "記事の主題"
approvalStatus: approved
informationCutoff: "2026-08-15T09:00:00+09:00"
targetVersion: "対象製品・仕様の版"
sources:
  - title: "一次情報の名称"
    publisher: "提供元"
    url: "https://..."
    publishedAt: "2026-08-15"
    verifiedAt: "2026-08-15"
confirmedFacts: []
interpretations: []
unknowns: []
```

## 記事を設計する

1. 既存記事との重複と検索意図を確認する。
2. 読者、前提知識、読後目標を1文ずつ内部メモにする。
3. 本文の主要なH2を4〜5個に絞る。`参照した一次情報`はこの数に含めない。
4. 冒頭で結論、定義、または「何が変わったか」を直接答える。
5. 重要な判断材料、制約、責任境界、確認できなかったことを構成へ入れる。

内部メモは公開本文へ貼り付けない。

## Markdownを書く

- 新規記事は原則 `blog/src/content/posts/<slug>.md` に作る。
- 本文にH1を置かない。H1はfrontmatterの`title`から生成される。
- 主要区切りにはMarkdownのH2を使い、目次へ反映させる。
- 比較は表、順序は番号付きリスト、導入判断はチェックリストを使う。
- 重要な主張の直後に一次情報へのリンクを置き、末尾に`## 参照した一次情報`を設ける。
- 仕様や提供状況には対象バージョンと「YYYY年MM月時点」を書く。
- サイト共通のCTA、著者欄、隣接記事ナビを本文へ重複させない。
- 生HTMLや記事内CSSは、通常のMarkdownでは表現できず、目次やレスポンシブ表示への影響を検証できる場合だけ使う。

Current Full KG、Judge PASS、candidate_id、source_id、内部ハッシュなどの内部処理語を公開本文へ出さない。OAuth claimやSAML assertionのような技術用語は、内部管理語と区別して正確に使う。根拠から自然な日本語へ書き直す。会社や製品の訴求は論点と直接関係するときだけ行う。

## 画像とfrontmatterを作る

リポジトリ実装契約に従い、Markdownと同じPRへアイキャッチ画像を追加する。

- 画像は `1672x941` のWebPにする。
- 配置は `blog/public/<slug>-eyecatch.webp` とする。
- `heroImage`は `/blog/<slug>-eyecatch.webp` とする。
- 既存のネイビー、黒、白、シアン、インディゴ系の見た目へそろえる。
- 根拠のない数値、架空のUI、ログ、企業ロゴを描かない。
- `heroAlt`には装飾ではなく、画像が伝える関係や状況を書く。
- `author`を自動で追加しない。作業時点のスキーマとレンダラーが両方対応している場合だけ、既存記事と整合する値を明示する。
- 現行表示で使われていない`breaking`は`false`にする。

画像生成機能が使える場合も、生成結果をそのまま採用せず、寸法、可読性、事実性、ファイルサイズを確認する。

## 機械検証と表示確認を行う

記事単体の契約を検証する。

```bash
python3 .agents/skills/a2a-blog-writing/scripts/validate_article.py \
  blog/src/content/posts/<slug>.md
```

次にサイト全体を検証する。

```bash
npm run build
```

生成された記事詳細、ブログ一覧、RSS、sitemapを確認する。長いタイトル、表の横スクロール、目次、hero、OG画像、JSON-LD、カテゴリ、CTA、前後記事ナビは画面幅を変えて目視する。検証できない項目はPR本文に明記する。

画面確認では`npm run dev`を起動し、`http://localhost:3000/blog/<slug>/`と`http://localhost:3000/blog/`をデスクトップ幅とモバイル幅で開く。確認後は開発サーバーを停止する。

## PRを準備する

- 専用ブランチを作り、`git diff --check`、`git status --short`で意図しないlockfileや生成物がないことを確認する。
- Markdownと対応するWebPを同じPRへ含める。
- 新しいMarkdown記事を`src/data/blogArticles.ts`へ重複登録しない。
- OpenClawから作成した場合は、使用した一次情報、情報基準日、検証コマンド、手動確認項目をPR本文へ記録する。
- OpenClawの既存出力に必須frontmatterまたはWebPが欠ける場合は、そのまま受け入れず、この契約を満たすまで補完して再検証する。
- 意図したファイルだけをcommitしてpushし、確認結果を添えてdraft PRを作る。
- 自動でmergeしない。公開判断は人間のレビューに残す。
- このSkillの複製を別リポジトリで独自改変しない。OpenClaw側の収集・審査Skillと、corporate-site側の公開契約を分離し、公開物はこのSkillの版で検証する。

完了条件は、原稿が読みやすいことだけではない。Markdown、画像、frontmatter、一覧、詳細、OG、JSON-LD、RSS、sitemap、ビルド、PRの全てが一貫していることを確認する。
