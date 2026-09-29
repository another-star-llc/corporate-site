import { MainInterface } from './components/MainInterface';
import { ProductPage } from './pages/ProductPage';
import { CompanyPage } from './pages/CompanyPage';
import { findCompanyPage } from './data/companyPages';
import './index.css';

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  if (pathname === '/product') {
    return <ProductPage />;
  }

  // 本番は prerender 済みの /about などが返るため、ここに来るのは開発サーバーのみ。
  const companyPage = findCompanyPage(pathname);
  if (companyPage) {
    return <CompanyPage page={companyPage} />;
  }

  return (
    <div className="relative w-full min-h-[100svh] bg-black">
      <MainInterface />
    </div>
  );
}
