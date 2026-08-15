import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ProductPage } from './pages/ProductPage';
import './index.css';

const root = document.getElementById('root')!;
const page = (
  <React.StrictMode>
    <ProductPage />
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, page);
} else {
  createRoot(root).render(page);
}
