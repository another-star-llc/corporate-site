# Another Star合同会社 公式ウェブサイト

Another Star合同会社の公式ウェブサイトです。AIエージェント間の安全な連携を支える信頼基盤の開発に取り組む企業として、A2A 時代のセキュリティと社会実装を見据えた企業サイトです。

## 特徴

- **3Dエフェクト**: Three.jsを使用した美しい流星エフェクトと巨大な星のアニメーション
- **レスポンシブデザイン**: デスクトップ、タブレット、モバイル対応
- **モダンUI**: React + Tailwind CSS + shadcn/ui による洗練されたデザイン

## 技術スタック

### フロントエンド
- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Three.js
- React Three Fiber
- Lucide React

### 3Dエフェクト
- 流星エフェクト（ヒーローセクション）
- 巨大な星とキラキラエフェクト（会社概要セクション）

## セクション構成

1. **ヒーローセクション**: 企業名とミッション、流星エフェクト
2. **会社概要**: GENIAC-PRIZEへの挑戦について、3D星エフェクト
3. **ミッション**: 3つの柱（安全性確保、技術革新、社会実装）
4. **メンバー紹介**: 2名のプロフィール
5. **開発チーム**: 4名体制の役割紹介（写真付き）
6. **システム紹介**: 3つの主要システム
7. **技術スタック**: 使用技術一覧
8. **お問い合わせ**: コンタクト情報

## 開発・デプロイ

### 開発環境の起動
```bash
pnpm install
pnpm run dev
```

スマホなど同一ネットワーク上の別端末から確認したい場合は、開発サーバーを LAN 向けに公開してください。

```bash
pnpm run dev --host 0.0.0.0
```

起動後、ターミナルに `Network: http://192.168.xx.xx:3000/` のような表示が出ます。スマホを同じネットワークに接続したうえで、その URL をスマホのブラウザで開くと表示確認できます。

### Dockerで起動
ローカルにNode.jsを入れずに確認したい場合はDocker Composeを利用してください。

```bash
docker-compose up -d --build  # 初回または依存更新時
docker-compose logs -f app    # ログ確認
```

ブラウザで [http://localhost:5173](http://localhost:5173) にアクセスすると開発サーバーに接続できます。停止する際は `docker-compose down` を実行してください。

### ビルド
```bash
pnpm run build
```

### ブログ記事の追加

ニュース・定点観測記事は`blog/src/content/posts/<slug>.md`へ追加します。
frontmatterの`category`が既存一覧にない場合も、記事一覧のカテゴリボタンへ自動追加されます。
記事データを`src/data/blogArticles.ts`へ重複登録する必要はありません。

Slack承認から作成された記事は、専用ブランチとPull Requestで受け入れます。
Pull Requestのビルドと公開文面を確認してmainへマージするまで、本番公開とは扱いません。
OpenClawまたはCodexで記事を執筆・改稿する場合は、公開仕様の正本として
`.agents/skills/a2a-blog-writing/SKILL.md`を使用します。

### プレビュー
```bash
pnpm run preview
```

## ライセンス

© 2024 Another Star合同会社. All rights reserved.

## 開発者

このウェブサイトは、Manusを使用して開発されました。
