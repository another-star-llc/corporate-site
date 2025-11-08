# Another Star合同会社 公式ウェブサイト

Another Star合同会社の公式ウェブサイトです。生成AIの安全性確保技術開発に取り組む企業として、GENIAC-PRIZE領域03への挑戦を軸とした企業サイトです。

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

### プレビュー
```bash
pnpm run preview
```

## ライセンス

© 2024 Another Star合同会社. All rights reserved.

## 開発者

このウェブサイトは、Manusを使用して開発されました。
