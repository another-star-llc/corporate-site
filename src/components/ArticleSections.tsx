import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export interface RelatedLink {
  href: string;
  category: string;
  title: string;
}

/**
 * 記事末尾の共通セクション。解説記事(BlogArticlePage)と定点観測記事(BlogPostPage)の
 * 両方から使うため、記事の型に依存しない形に切り出してある。
 */
export function ArticleCTA({ slug }: { slug: string }) {
  const isImplementation = slug === 'copilot-studio-a2a-agent';
  return (
    <aside className="mt-14 rounded-3xl border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(8,145,178,0.13),rgba(79,70,229,0.08))] p-7 md:p-9">
      <ShieldCheck size={25} className="text-cyan-300" aria-hidden="true" />
      <h2 className="mt-5 text-2xl font-light text-white">
        {isImplementation ? 'A2A連携の設計・検証をご相談ください' : 'AIエージェント間の通信に、信頼レイヤーを。'}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
        {isImplementation
          ? '外部エージェントの認証、権限、監査、相互運用テストまで、企業導入に必要な論点を一緒に整理します。'
          : 'Another Starは、外部AIエージェントを安全に発見・評価・連携するための信頼基盤を開発しています。'}
      </p>
      <a href={isImplementation ? 'mailto:contact@another-star.jp' : '/product'} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#020611] transition-colors hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
        {isImplementation ? 'お問い合わせ' : 'プロダクトを見る'} <ArrowRight size={15} aria-hidden="true" />
      </a>
    </aside>
  );
}

const shareLinkClassName =
  'inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm text-white transition-colors hover:border-cyan-300/40 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300';

/**
 * 記事末尾の共有リンク（X・はてなブックマーク）。
 * どちらも公式の JS（widgets.js / bookmark_button.js）は読み込まず、ただのリンクにしている
 * （外部JSを増やさず、見た目をサイトに合わせるため）。
 */
export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  // canonical と同じ URL（trailingSlash: 'always'）。
  const url = `https://www.another-star.jp/blog/${slug}/`;
  return (
    <div className="mt-14 flex flex-wrap gap-3">
      {/* X の Web Intent。widgets.js なしでは text・url がページから自動で補われないため、明示して渡す。 */}
      <a
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Xでポスト"
        className={shareLinkClassName}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
        Xでポスト
      </a>
      {/* リンク先は、公式ボタンが使うエントリーページ（/entry/s/…）ではなく、追加画面を開く add?mode=confirm にしている。 */}
      <a
        href={`https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="はてなブックマークに追加"
        className={shareLinkClassName}
      >
        <span className="font-bold tracking-tight" aria-hidden="true">B!</span>
        はてなブックマークに追加
      </a>
    </div>
  );
}

/**
 * 発行順で前後にある記事への導線。
 * 手書きの関連記事指定だとどの記事でも同じ顔ぶれになりがちなので、発行順で機械的に出す。
 * 端の記事は片方しか無いため、次の記事だけの場合も右側に置いて位置を揃える。
 */
export function AdjacentArticles({ prev, next }: { prev?: RelatedLink; next?: RelatedLink }) {
  if (!prev && !next) return null;
  return (
    <section className="mt-16" aria-labelledby="adjacent-heading">
      <div className="mb-5 flex items-center gap-4">
        <h2 id="adjacent-heading" className="text-xs tracking-[0.18em] uppercase text-slate-400">次に読む</h2>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {prev && <AdjacentCard link={prev} direction="prev" />}
        {next && <AdjacentCard link={next} direction="next" />}
      </div>
    </section>
  );
}

function AdjacentCard({ link, direction }: { link: RelatedLink; direction: 'prev' | 'next' }) {
  const isNext = direction === 'next';
  return (
    <a
      href={link.href}
      className={`group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-cyan-300/25 hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
        isNext ? 'text-right sm:col-start-2' : ''
      }`}
    >
      <div className={`flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-300 ${isNext ? 'justify-end' : ''}`}>
        {isNext ? (
          <>次の記事 <ArrowRight size={13} aria-hidden="true" /></>
        ) : (
          <><ArrowLeft size={13} aria-hidden="true" /> 前の記事</>
        )}
      </div>
      <div className="mt-3 text-xs text-cyan-300">{link.category}</div>
      <h3 className="mt-2 text-lg font-light leading-snug text-white">{link.title}</h3>
    </a>
  );
}

export function TableOfContents({
  toc,
  className = '',
}: {
  toc: { id: string; label: string }[];
  className?: string;
}) {
  return (
    <ol className={`space-y-3 text-sm leading-6 text-slate-400 ${className}`}>
      {toc.map((item, index) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="grid grid-cols-[1.5rem_1fr] gap-2 transition-colors hover:text-cyan-200">
            <span className="tabular-nums text-slate-600">{String(index + 1).padStart(2, '0')}</span>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
