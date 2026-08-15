import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="blog-site min-h-[100svh] bg-[#020611] text-white">
      <a href="#main-content" className="blog-skip-link">
        本文へ移動
      </a>
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_4%,rgba(8,145,178,0.17),transparent_24%),radial-gradient(circle_at_85%_12%,rgba(79,70,229,0.16),transparent_22%),linear-gradient(180deg,#050a17_0%,#020611_46%,#01030a_100%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#020611]/88 backdrop-blur-2xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10" aria-label="メインナビゲーション">
            <a
              href="/"
              className="inline-flex min-h-11 items-center gap-2 text-xs tracking-[0.16em] uppercase text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Another Star
            </a>
            <a
              href="/blog"
              aria-current="page"
              className="inline-flex min-h-11 items-center text-xs tracking-[0.2em] uppercase text-cyan-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              BLOG
            </a>
          </nav>
        </header>

        {children}

        <footer className="border-t border-white/10 px-5 py-10 md:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs tracking-[0.08em] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Another Star LLC.</span>
            <a className="transition-colors hover:text-white" href="mailto:contact@another-star.jp">
              contact@another-star.jp
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function Breadcrumbs({ children }: { children?: ReactNode }) {
  return (
    <nav aria-label="パンくず" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
      <a href="/" className="transition-colors hover:text-white">Home</a>
      <span aria-hidden="true">/</span>
      {children ? (
        <>
          <a href="/blog" className="transition-colors hover:text-white">A2A Insights</a>
          <span aria-hidden="true">/</span>
          <span className="text-slate-300" aria-current="page">{children}</span>
        </>
      ) : (
        <span className="text-slate-300" aria-current="page">A2A Insights</span>
      )}
    </nav>
  );
}
