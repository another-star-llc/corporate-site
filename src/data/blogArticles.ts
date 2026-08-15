export type BlogCategory = string;

export interface BlogSource {
  title: string;
  url: string;
  publisher: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  lead: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  featured: boolean;
  heroImage: string;
  heroAlt: string;
  thumbnailIcon?: string;
  takeaways: string[];
  toc: { id: string; label: string }[];
  sources: BlogSource[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'what-is-a2a',
    title: 'A2Aとは？AIエージェント同士をつなぐ共通言語をやさしく解説',
    shortTitle: 'A2Aとは？',
    description:
      'A2A（Agent2Agent Protocol）の目的、Agent Card・Message・Task・Artifactの役割、企業導入で押さえたいセキュリティ上の注意点を解説します。',
    lead:
      'A2Aは、異なる会社やフレームワークで作られたAIエージェントが、互いの内部実装を公開せずに仕事を依頼し、進捗と成果物を受け渡すためのオープンなプロトコルです。',
    category: 'A2A基礎',
    tags: ['A2A 1.0', 'Agent Card', 'Task', '相互運用性'],
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    readingTime: '7分',
    featured: true,
    heroImage: '/blog/a2a-basics-eyecatch.webp',
    heroAlt: '依頼元のAIエージェントが複数の専門エージェントへ仕事を渡し、成果物を受け取る概念図',
    takeaways: [
      'A2Aが解決するのは、独立したAIエージェント間の相互運用です。',
      'Agent Cardで相手を知り、Message・Task・Artifactで仕事を進めます。',
      '標準化されるのは通信の枠組みであり、相手への信頼や権限管理は別途必要です。',
    ],
    toc: [
      { id: 'why-a2a', label: 'なぜA2Aが必要なのか' },
      { id: 'core-model', label: 'A2Aを構成する5つの要素' },
      { id: 'workflow', label: '依頼から成果物までの流れ' },
      { id: 'enterprise', label: '企業導入で注意すること' },
      { id: 'summary', label: 'まとめ' },
    ],
    sources: [
      {
        title: 'A2A Protocol Specification v1.0',
        url: 'https://a2a-protocol.org/latest/specification/',
        publisher: 'A2A Protocol',
      },
      {
        title: 'A2A Protocol: Core Concepts',
        url: 'https://a2a-protocol.org/latest/topics/key-concepts/',
        publisher: 'A2A Protocol',
      },
      {
        title: 'A2A Protocol Ships v1.0',
        url: 'https://a2a-protocol.org/latest/announcing-1.0/',
        publisher: 'A2A Protocol',
      },
    ],
  },
  {
    slug: 'a2a-vs-mcp',
    title: 'A2AとMCPの違いとは？役割・設計・使い分けを比較',
    shortTitle: 'A2AとMCPの違い',
    description:
      'A2AとMCPは競合ではありません。エージェント同士をつなぐA2Aと、エージェントをツールやデータへつなぐMCPの責務と併用パターンを比較します。',
    lead:
      '結論から言えば、A2Aは「エージェントとエージェント」、MCPは「AIアプリケーションとツール・データ」をつなぎます。どちらか一方を選ぶのではなく、同じシステムの異なる境界で併用するのが基本です。',
    category: 'A2A基礎',
    tags: ['MCP 2026-07-28', 'A2A 1.0', '設計判断', '比較'],
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    readingTime: '8分',
    featured: false,
    heroImage: '/blog/a2a-vs-mcp-eyecatch.webp',
    heroAlt: '上段のエージェント間連携と下段のツール・データ接続が補完し合う二層構造の概念図',
    takeaways: [
      'A2Aは、独立したエージェント間の発見・委任・タスク状態と結果の共有を扱います。',
      'MCPは、AIアプリケーションがtools・resources・promptsを利用する境界を扱います。',
      '専門エージェントの内部でMCPを使い、専門エージェント同士をA2Aでつなげられます。',
    ],
    toc: [
      { id: 'answer', label: 'まず結論：接続相手が違う' },
      { id: 'comparison', label: '6つの観点で比較' },
      { id: 'architecture', label: 'A2AとMCPを併用する構成' },
      { id: 'decision', label: 'どちらを使うべきか' },
      { id: 'security', label: '共通するセキュリティ責任' },
    ],
    sources: [
      {
        title: 'A2A and MCP',
        url: 'https://a2a-protocol.org/latest/topics/a2a-and-mcp/',
        publisher: 'A2A Protocol',
      },
      {
        title: 'A2A Protocol Specification v1.0',
        url: 'https://a2a-protocol.org/latest/specification/',
        publisher: 'A2A Protocol',
      },
      {
        title: 'Architecture overview (2026-07-28)',
        url: 'https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture',
        publisher: 'Model Context Protocol',
      },
      {
        title: 'Model Context Protocol Specification',
        url: 'https://modelcontextprotocol.io/specification/latest',
        publisher: 'Model Context Protocol',
      },
    ],
  },
  {
    slug: 'copilot-studio-a2a-agent',
    title: 'Copilot StudioでA2A対応エージェントを作成する方法',
    shortTitle: 'Copilot StudioでA2A対応エージェントを作成',
    description:
      '外部A2Aエージェントを用意し、Microsoft Copilot Studioから接続・認証・テストする手順を、2026年8月時点の公式仕様に沿って解説します。',
    lead:
      'Copilot StudioのA2A接続は2026年4月に一般提供されました。本記事では、外部に公開したA2A対応エージェントをCopilot Studioのオーケストレーターへ追加し、委任できる状態までを扱います。',
    category: 'A2A基礎',
    tags: ['Copilot Studio', 'A2A接続', '認証', 'テスト'],
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-15',
    readingTime: '12分',
    featured: false,
    heroImage: '/blog/copilot-studio-a2a-eyecatch.webp',
    heroAlt: 'ローコードで構築したワークフローを安全なゲートウェイ経由で外部A2Aエージェントへ接続する概念図',
    thumbnailIcon: '/blog/copilot-studio-icon.svg',
    takeaways: [
      'Copilot Studioは外部A2Aエージェントを追加し、専門タスクを委任できます。',
      'HTTPSエンドポイントと認証方式に加え、設定画面から取得されるAgent CardのCORS対応も必要です。',
      '現行Microsoft手順とA2A 1.0ではwell-known URIの記載が異なるため、相互運用テストが不可欠です。',
    ],
    toc: [
      { id: 'scope', label: 'この記事で作るもの' },
      { id: 'why-copilot-studio', label: 'なぜCopilot Studioなのか' },
      { id: 'prerequisites', label: '事前準備' },
      { id: 'external-agent', label: '外部A2Aエージェントを公開' },
      { id: 'connect', label: 'Copilot Studioから接続' },
      { id: 'test', label: '委任をテスト' },
      { id: 'production', label: '本番化のチェックポイント' },
    ],
    sources: [
      {
        title: 'Agent2Agent (A2A) プロトコル経由でエージェントに接続する',
        url: 'https://learn.microsoft.com/ja-jp/microsoft-copilot-studio/add-agent-agent-to-agent',
        publisher: 'Microsoft Learn',
      },
      {
        title: "What's new in Copilot Studio",
        url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/whats-new',
        publisher: 'Microsoft Learn',
      },
      {
        title: 'Licensing for agents powered by the standard harness',
        url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing',
        publisher: 'Microsoft Learn',
      },
      {
        title: 'Requirements, licensing, and subscriptions for Copilot Studio',
        url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-licensing-subscriptions',
        publisher: 'Microsoft Learn',
      },
      {
        title: 'Host an A2A agent with ASP.NET Core',
        url: 'https://learn.microsoft.com/en-us/agent-framework/hosting/self-hosting/a2a/server',
        publisher: 'Microsoft Learn',
      },
      {
        title: 'A2A Protocol Specification v1.0',
        url: 'https://a2a-protocol.org/latest/specification/',
        publisher: 'A2A Protocol',
      },
      {
        title: 'Fetch Standard: CORS protocol',
        url: 'https://fetch.spec.whatwg.org/#http-cors-protocol',
        publisher: 'WHATWG',
      },
      {
        title: 'Developer mode and MCP apps in ChatGPT',
        url: 'https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt',
        publisher: 'OpenAI Help Center',
      },
      {
        title: 'Get started with custom connectors using remote MCP',
        url: 'https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp',
        publisher: 'Claude Help Center',
      },
      {
        title: 'Register and manage A2A agents',
        url: 'https://docs.cloud.google.com/gemini/enterprise/docs/register-and-manage-an-a2a-agent',
        publisher: 'Google Cloud',
      },
      {
        title: 'Agents overview',
        url: 'https://docs.cloud.google.com/gemini/enterprise/docs/agents-overview',
        publisher: 'Google Cloud',
      },
      {
        title: 'Browse agents with Agent Gallery',
        url: 'https://docs.cloud.google.com/gemini/enterprise/docs/agent-gallery',
        publisher: 'Google Cloud',
      },
      {
        title: 'Core Assistant agent',
        url: 'https://docs.cloud.google.com/gemini/enterprise/docs/core-assistant',
        publisher: 'Google Cloud',
      },
      {
        title: 'Build custom experts with Gems',
        url: 'https://gemini.google/us/overview/gems/?hl=en',
        publisher: 'Google Gemini',
      },
      {
        title: 'Create an agent — Agent2Agent (preview)',
        url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime/create-an-agent',
        publisher: 'Google Cloud',
      },
    ],
  },
];

export interface BlogIndexArticle {
  slug: string;
  href: string;
  title: string;
  /** パンくずや関連記事カードなど、狭い場所で使う短いタイトル。 */
  shortTitle: string;
  description: string;
  category: BlogCategory;
  publishedAt: string;
  readingTime: string;
  heroImage?: string;
  heroAlt?: string;
  thumbnailIcon?: string;
  visualLabel?: string;
  featured: boolean;
}

export const blogIndexArticles: BlogIndexArticle[] = [
  ...blogArticles.map((article) => ({
    slug: article.slug,
    href: `/blog/${article.slug}/`,
    title: article.title,
    shortTitle: article.shortTitle,
    description: article.description,
    category: article.category,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
    heroImage: article.heroImage,
    heroAlt: article.heroAlt,
    thumbnailIcon: article.thumbnailIcon,
    featured: article.featured,
  })),
];

export function getBlogArticle(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}

/**
 * 発行順で前後にある記事を返す。next が新しい方、prev が古い方。端の記事は片方が undefined。
 *
 * 対象の一覧は呼び出し側から渡す。Markdown記事の情報は astro:content 経由でしか
 * 取れず、このファイル単体では全記事を組み立てられないため。
 * （blog/src/lib/articles.ts の getAllArticles() が発行順に並べたものを渡す想定）
 */
export function getAdjacentArticles(slug: string, articles: BlogIndexArticle[]) {
  const index = articles.findIndex((article) => article.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    next: index > 0 ? articles[index - 1] : undefined,
    prev: articles[index + 1],
  };
}
