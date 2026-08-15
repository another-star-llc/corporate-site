import { useMemo, useState } from 'react';
import { ArrowRight, Clock3 } from 'lucide-react';
import { BlogShell, Breadcrumbs } from '../components/BlogShell';
import { blogCategories, blogIndexArticles } from '../data/blogArticles';
import { usePageMetadata } from '../hooks/usePageMetadata';

const pageDescription =
  'A2A・MCP・AIエージェント実装を、公式仕様と一次情報から読み解くAnother Starの専門メディアです。';

export function BlogIndexPage({ manageMetadata = true }: { manageMetadata?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<(typeof blogCategories)[number]>('すべて');
  const articles = activeCategory === 'すべて'
    ? blogIndexArticles
    : blogIndexArticles.filter((article) => article.category === activeCategory);
  const featured = blogIndexArticles.find((article) => article.featured) ?? blogIndexArticles[0];
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'A2A Insights',
    description: pageDescription,
    url: 'https://www.another-star.jp/blog',
    publisher: { '@type': 'Organization', name: 'Another Star合同会社' },
    blogPost: blogIndexArticles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      url: article.href.startsWith('http') ? article.href : `https://www.another-star.jp${article.href}`,
      datePublished: article.publishedAt,
    })),
  }), []);

  usePageMetadata({
    enabled: manageMetadata,
    title: 'A2A Insights｜Another Star',
    description: pageDescription,
    canonicalPath: '/blog',
    jsonLd,
  });

  return (
    <BlogShell>
      <main id="main-content">
        <section className="px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs />
            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_23rem] lg:items-end">
              <div>
                <div className="text-[0.7rem] tracking-[0.28em] uppercase text-cyan-300">Another Star Editorial</div>
                <h1 className="mt-5 text-[3.2rem] font-light leading-[0.95] tracking-[-0.035em] text-white sm:text-[5rem] lg:text-[6.5rem]">
                  A2A<br className="sm:hidden" /> Insights
                </h1>
              </div>
              <p className="max-w-xl text-base leading-8 text-slate-300 lg:pb-2">
                AIエージェントが組織や製品の境界を越えて働く時代へ。
                A2A、MCP、実装とガバナンスを、公式仕様と一次情報から読み解きます。
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-2" aria-label="記事カテゴリ">
              {blogCategories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(category)}
                    className={`min-h-11 rounded-full border px-5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                      isActive
                        ? 'border-cyan-300/60 bg-cyan-300 text-[#021018]'
                        : 'border-white/15 bg-white/[0.035] text-slate-300 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {activeCategory === 'すべて' && featured && (
          <section className="px-5 pb-16 md:px-10 md:pb-24" aria-labelledby="featured-heading">
            <div className="mx-auto max-w-7xl">
              <div className="mb-5 flex items-center gap-4">
                <h2 id="featured-heading" className="text-xs tracking-[0.2em] uppercase text-slate-300">Featured</h2>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <a
                href={featured.href}
                className="group grid overflow-hidden rounded-[1.75rem] border border-cyan-300/18 bg-white/[0.035] transition-all hover:-translate-y-1 hover:border-cyan-300/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 lg:grid-cols-[1.42fr_1fr]"
              >
                <div className="overflow-hidden bg-[#06101d]">
                  {featured.heroImage && (
                    <img
                      src={featured.heroImage}
                      alt={featured.heroAlt ?? ''}
                      width="1672"
                      height="941"
                      className="aspect-video h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-between p-7 md:p-10 lg:p-12">
                  <div>
                    <span className="text-xs tracking-[0.14em] text-cyan-300">{featured.category}</span>
                    <h3 className="mt-6 text-3xl font-light leading-tight tracking-[0.01em] text-white md:text-4xl">
                      {featured.title}
                    </h3>
                    <p className="mt-5 text-sm leading-7 text-slate-300">{featured.description}</p>
                  </div>
                  <div className="mt-9 flex items-center justify-between text-xs text-slate-400">
                    <span>{formatDate(featured.publishedAt)} · {featured.readingTime}</span>
                    <span className="inline-flex items-center gap-2 text-cyan-200">
                      読む <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </section>
        )}

        <section className="px-5 pb-24 md:px-10 md:pb-32" aria-labelledby="articles-heading">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-4">
              <h2 id="articles-heading" className="text-xs tracking-[0.2em] uppercase text-slate-300">
                {activeCategory === 'すべて' ? 'All articles' : activeCategory}
              </h2>
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs tabular-nums text-slate-500">{articles.length.toString().padStart(2, '0')}</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <a
                  key={article.slug}
                  href={article.href}
                  className="group flex min-h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-cyan-300/28 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  {article.heroImage ? (
                    <div className="relative aspect-video overflow-hidden bg-[#06101d]">
                      <img
                        src={article.heroImage}
                        alt=""
                        width="1672"
                        height="941"
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                      {article.thumbnailIcon && (
                        <span className="absolute left-5 top-5 z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-black/55 p-2.5 shadow-2xl backdrop-blur-md" aria-hidden="true">
                          <img src={article.thumbnailIcon} alt="" width="96" height="96" className="h-full w-full object-contain" />
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-5 pt-14">
                        <h3 className="line-clamp-3 text-lg font-medium leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:text-xl">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_75%_30%,rgba(34,211,238,0.2),transparent_28%),linear-gradient(145deg,#07101d,#03060d)]">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" aria-hidden="true" />
                      <span className="absolute left-5 top-5 text-[0.65rem] tracking-[0.2em] text-cyan-300/80">{article.visualLabel}</span>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-5 pt-14">
                        <h3 className="line-clamp-3 text-lg font-medium leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:text-xl">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3 text-[0.7rem] tracking-[0.08em]">
                      <span className="text-cyan-300">{article.category}</span>
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <Clock3 size={13} aria-hidden="true" /> {article.readingTime}
                      </span>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-400">{article.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-7 text-xs text-slate-500">
                      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                      <ArrowRight size={16} className="text-cyan-300 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </BlogShell>
  );
}

function formatDate(value: string) {
  return value.split('-').join('.');
}
