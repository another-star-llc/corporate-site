import { ArrowLeft } from 'lucide-react';
import { ContentHeadingLevelContext, getWindowContent } from '../components/WindowContents';
import { companyPages, type CompanyPage as CompanyPageData } from '../data/companyPages';

const navLinkClass = 'text-xs tracking-[0.15em] uppercase transition-colors duration-200';

// トップのモーダルと同じ本文を、URL を持つ単独ページとして表示する。
// 本文は WindowContents.tsx が正本で、ここは枠とナビだけを持つ。
export function CompanyPage({ page }: { page: CompanyPageData }) {
  return (
    <div className="min-h-[100svh] bg-[#020611] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(22,78,99,0.22),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(30,64,175,0.22),transparent_24%),linear-gradient(180deg,#040915_0%,#020611_45%,#01030b_100%)]" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <header className="sticky top-0 z-20 border-b border-white/8 bg-[#020611]/72 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm tracking-[0.16em] uppercase text-slate-300 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              Another Star
            </a>
          </div>
        </header>

        <main className="flex-1 px-4 py-10 md:py-16">
          <article className="news-popup-frame mx-auto !max-w-full">
            <div className="news-popup-titlebar">
              <div className="news-popup-pill">
                <span>{page.label}</span>
              </div>
            </div>
            <div className="news-popup-content select-text">
              <ContentHeadingLevelContext.Provider value="h1">
                {getWindowContent(page.windowId)}
              </ContentHeadingLevelContext.Provider>
            </div>
          </article>
        </main>

        <footer className="border-t border-white/8 px-6 py-8 md:px-10">
          <nav
            aria-label="サイト内リンク"
            className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3"
          >
            <a href="/product" className={`${navLinkClass} text-cyan-300 hover:text-cyan-100`}>
              PRODUCT
            </a>
            <a href="/blog/" className={`${navLinkClass} text-blue-300 hover:text-blue-100`}>
              BLOG
            </a>
            {companyPages.map((p) => (
              <a
                key={p.slug}
                href={`/${p.slug}`}
                aria-current={p.slug === page.slug ? 'page' : undefined}
                className={`${navLinkClass} ${
                  p.slug === page.slug ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {p.label}
              </a>
            ))}
          </nav>
          <p className="mx-auto mt-6 max-w-7xl text-xs tracking-[0.08em] text-slate-500">
            © Another Star合同会社
          </p>
        </footer>
      </div>
    </div>
  );
}
