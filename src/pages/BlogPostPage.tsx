import type { ReactNode } from 'react';
import { BlogShell, Breadcrumbs } from '../components/BlogShell';
import { ArticleCTA, RelatedArticles, TableOfContents, type RelatedLink } from '../components/ArticleSections';

export interface BlogPostPageProps {
  slug: string;
  title: string;
  shortTitle: string;
  lead: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  author: string;
  heroImage?: string;
  heroAlt?: string;
  toc: { id: string; label: string }[];
  related: RelatedLink[];
  children?: ReactNode;
}

/**
 * Markdown で書かれた定点観測記事の外枠。
 *
 * 解説記事(BlogArticlePage)と同じ BlogShell・見出し構成・目次・下部セクションを使い、
 * 本文だけを Astro 側の <Content /> から children として受け取る。
 * 見出しが取れない記事（本文を生HTMLで組んでいるもの）は目次が空になるため、
 * その場合はサイドバーを出さず1カラムで組む。
 */
export function BlogPostPage({
  slug,
  title,
  shortTitle,
  lead,
  category,
  publishedAt,
  readingTime,
  author,
  heroImage,
  heroAlt,
  toc,
  related,
  children,
}: BlogPostPageProps) {
  const hasToc = toc.length > 0;

  return (
    <BlogShell>
      <main id="main-content">
        <article>
          <header className="px-5 pb-10 pt-10 md:px-10 md:pb-16 md:pt-14">
            <div className="mx-auto max-w-6xl">
              <Breadcrumbs>{shortTitle}</Breadcrumbs>
              <div className="mx-auto mt-12 max-w-4xl text-center">
                <div className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/[0.07] px-4 py-2 text-xs tracking-[0.12em] text-cyan-200">
                  {category}
                </div>
                {/* 定点観測記事は解説記事よりタイトルが長いため、同じ書体のまま一段小さい刻みにしている。 */}
                <h1 className="mt-7 text-[2rem] font-light leading-[1.2] tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3.25rem]">
                  {title}
                </h1>
                <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-300 md:text-lg md:leading-9">
                  {lead}
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
                  <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                  <span aria-hidden="true">•</span>
                  <span>読了 {readingTime}</span>
                  <span aria-hidden="true">•</span>
                  <span>{author}</span>
                </div>
              </div>

              {heroImage && (
                <figure className="mx-auto mt-14 max-w-4xl">
                  <img
                    src={heroImage}
                    alt={heroAlt ?? ''}
                    width={1672}
                    height={941}
                    loading="eager"
                    fetchPriority="high"
                    className="w-full rounded-2xl border border-white/10"
                  />
                </figure>
              )}
            </div>
          </header>

          <div className="px-5 pb-24 md:px-10 md:pb-32">
            <div
              className={`mx-auto grid max-w-6xl gap-12 lg:items-start ${
                hasToc ? 'lg:grid-cols-[minmax(0,1fr)_15rem]' : ''
              }`}
            >
              <div className="min-w-0">
                {hasToc && (
                  <details className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 lg:hidden">
                    <summary className="cursor-pointer text-sm text-white">目次</summary>
                    <TableOfContents toc={toc} className="mt-4" />
                  </details>
                )}

                <div className="blog-prose blog-prose-md">{children}</div>

                <ArticleCTA slug={slug} />
                <RelatedArticles related={related} />
              </div>

              {hasToc && (
                <aside className="sticky top-28 hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 lg:block" aria-label="記事の目次">
                  <div className="text-xs tracking-[0.16em] uppercase text-slate-500">Contents</div>
                  <TableOfContents toc={toc} className="mt-5" />
                </aside>
              )}
            </div>
          </div>
        </article>
      </main>
    </BlogShell>
  );
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-');
  return `${year}.${month}.${day}`;
}
