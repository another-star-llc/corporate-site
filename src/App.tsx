import { MainInterface } from './components/MainInterface';
import { ProductPage } from './pages/ProductPage';
import './index.css';

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  if (pathname === '/product') {
    return <ProductPage />;
  }

  return (
    <div className="relative w-full min-h-[100svh] bg-black">
      <MainInterface />
    </div>
  );
}
