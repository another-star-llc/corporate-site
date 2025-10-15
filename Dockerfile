# Node.js 18のAlpine Linuxベースイメージを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# pnpmをグローバルにインストール
RUN npm install -g pnpm

# package.jsonとpnpm-lock.yamlをコピー（依存関係のキャッシュ最適化）
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY . .

# 開発サーバーのポートを公開
EXPOSE 5173

# 開発サーバーを起動（ホストを0.0.0.0に設定してコンテナ外からアクセス可能にする）
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]

