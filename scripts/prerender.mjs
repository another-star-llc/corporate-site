import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const projectRoot = process.cwd();
const rootPlaceholder = '<div id="root"></div>';

const pages = [
  {
    output: 'dist/index.html',
    module: '/src/App.tsx',
    exportName: 'default',
  },
  {
    output: 'dist/product/index.html',
    module: '/src/pages/ProductPage.tsx',
    exportName: 'ProductPage',
  },
];

const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  for (const page of pages) {
    const module = await vite.ssrLoadModule(page.module);
    const Page = module[page.exportName];

    if (typeof Page !== 'function') {
      throw new TypeError(`${page.module} does not export ${page.exportName}`);
    }

    const app = React.createElement(
      React.StrictMode,
      null,
      React.createElement(Page),
    );
    const renderedRoot = `<div id="root">${renderToString(app)}</div>`;
    const outputPath = path.join(projectRoot, page.output);
    const html = await readFile(outputPath, 'utf8');

    if (!html.includes(rootPlaceholder)) {
      throw new Error(`Root placeholder was not found in ${page.output}`);
    }

    await writeFile(outputPath, html.replace(rootPlaceholder, renderedRoot));
  }
} finally {
  await vite.close();
}
