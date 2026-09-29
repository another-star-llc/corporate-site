import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { CompanyPage } from './pages/CompanyPage';
import { companyPages, findCompanyPage } from './data/companyPages';
import './index.css';

// /about /mission /members /systems /contact は同じテンプレート（company/index.html）から
// prerender で生成するため、表示するページはパスから決める。
const page = findCompanyPage(window.location.pathname) ?? companyPages[0];
const root = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <CompanyPage page={page} />
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
