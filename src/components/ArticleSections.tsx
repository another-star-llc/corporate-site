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
