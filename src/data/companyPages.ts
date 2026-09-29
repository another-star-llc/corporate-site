// トップのモーダル（ウィンドウ）と同じ内容を、通常の URL を持つページとしても公開する。
// 本文の正本は WindowContents.tsx にあり、ここではページ固有のメタ情報だけを持つ。
// ページの追加・変更は、この配列を編集すれば prerender・サイトマップ・ナビに反映される。
// ページを増やすときは、WindowContents.tsx の本文と vercel.json のルーティングのパターンも更新する。

export interface CompanyPage {
  /** URL のパス（先頭の / なし） */
  slug: string;
  /** getWindowContent に渡すモーダルの ID */
  windowId: string;
  /** ナビに出すラベル。トップのメニュー表記と揃える */
  label: string;
  title: string;
  description: string;
  /** schema.org の WebPage 系の型 */
  schemaType: 'AboutPage' | 'ContactPage' | 'WebPage';
}

export const SITE_URL = 'https://www.another-star.jp';

export const companyPages: CompanyPage[] = [
  {
    slug: 'about',
    windowId: 'about',
    label: 'ABOUT',
    title: '会社概要｜Another Star合同会社',
    description:
      'Another Star合同会社の会社概要。AIエージェント間の安全な連携を実現するセキュリティ基盤を開発し、NEDO主催 GENIAC-PRIZEで「みらいビジョン賞」を受賞しました。',
    schemaType: 'AboutPage',
  },
  {
    slug: 'mission',
    windowId: 'mission',
    label: 'MISSION',
    title: 'ミッション｜Another Star合同会社',
    description:
      'A2A通信の広がりとともに生じる、外部AIエージェントの真正性や間接的プロンプトインジェクションといった新しいリスクに、Another Starがどう向き合うかを紹介します。',
    schemaType: 'WebPage',
  },
  {
    slug: 'members',
    windowId: 'people',
    label: 'MEMBERS',
    title: 'メンバー紹介｜Another Star合同会社',
    description:
      'Another Star合同会社の共同創業者・開発メンバー・アドバイザーの経歴と専門領域を紹介します。',
    schemaType: 'AboutPage',
  },
  {
    slug: 'systems',
    windowId: 'systems',
    label: 'SYSTEMS',
    title: 'システム・技術紹介｜Another Star合同会社',
    description:
      'AIエージェント間セキュアマッチング・連携基盤、Browser Agent Detector、AI Bias Watcher など、Another Starが開発するシステムと技術を紹介します。',
    schemaType: 'WebPage',
  },
  {
    slug: 'contact',
    windowId: 'contact',
    label: 'CONTACT',
    title: 'お問い合わせ｜Another Star合同会社',
    description:
      'Another Star合同会社へのお問い合わせ窓口。受託開発・コンサルティング・技術提携のご相談をメールで承っています。',
    schemaType: 'ContactPage',
  },
];

export function findCompanyPage(pathname: string): CompanyPage | undefined {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  return companyPages.find((page) => page.slug === slug);
}

/** モーダル ID からページの URL パスを引く。トップのメニューのリンク先に使う */
export function companyPathForWindow(windowId: string): string | undefined {
  const page = companyPages.find((p) => p.windowId === windowId);
  return page && `/${page.slug}`;
}

export function companyPageJsonLd(page: CompanyPage) {
  const url = `${SITE_URL}/${page.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': page.schemaType,
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'ja',
    isPartOf: { '@type': 'WebSite', name: 'Another Star合同会社', url: `${SITE_URL}/` },
    about: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}
