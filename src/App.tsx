import { lazy, Suspense } from 'react';
import { MainInterface } from './components/MainInterface';
import { findCompanyPage } from './data/companyPages';
import './index.css';

// 本番の /product と /about などは、それぞれ専用の HTML（prerender 済み）が返るため App は通らない。
// ここでの振り分けは開発サーバー用なので、本番のホームにこれらのページの JS を含めない。
const DevProductPage = import.meta.env.DEV
  ? lazy(() => import('./pages/ProductPage').then((m) => ({ default: m.ProductPage })))
  : null;
const DevCompanyPage = import.meta.env.DEV
  ? lazy(() => import('./pages/CompanyPage').then((m) => ({ default: m.CompanyPage })))
  : null;

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  if (DevProductPage && pathname === '/product') {
    return (
      <Suspense fallback={null}>
        <DevProductPage />
      </Suspense>
    );
  }

  const companyPage = findCompanyPage(pathname);
  if (DevCompanyPage && companyPage) {
    return (
      <Suspense fallback={null}>
        <DevCompanyPage page={companyPage} />
      </Suspense>
    );
  }

  return (
    <div className="relative w-full min-h-[100svh] bg-black">
      <MainInterface />
    </div>
  );
}
