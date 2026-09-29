import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const projectRoot = process.cwd();
const rootPlaceholder = '<div id="root"></div>';
// /about などの共通テンプレート。ページごとに複製したあと、テンプレート自体は公開しない。
const companyTemplate = 'dist/company/index.html';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

const manifestPath = path.join(projectRoot, 'dist/.vite/manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

// SSR では画像の import が /src/assets/... を返すため、ビルド後のファイル名に置き換える。
// 置き換えないと本番で 404 になり、ハイドレーションでも属性は修正されない。
function resolveBuiltAssets(html, label) {
  return html.replace(/\/(src\/assets\/[^"'\s)]+)/g, (match, source) => {
    const entry = manifest[decodeURI(source)];
    if (!entry) {
      throw new Error(`${label}: ${match} がビルド結果に見つかりません`);
    }
    return `/${entry.file}`;
  });
}

function renderRoot(element, label) {
  const html = renderToString(React.createElement(React.StrictMode, null, element));
  return `<div id="root">${resolveBuiltAssets(html, label)}</div>`;
}

function injectRoot(html, renderedRoot, label) {
  if (!html.includes(rootPlaceholder)) {
    throw new Error(`Root placeholder was not found in ${label}`);
  }
  return html.replace(rootPlaceholder, () => renderedRoot);
}

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
  server: { middlewareMode: true, ws: false },
});

try {
  for (const page of pages) {
    const module = await vite.ssrLoadModule(page.module);
    const Page = module[page.exportName];

    if (typeof Page !== 'function') {
      throw new TypeError(`${page.module} does not export ${page.exportName}`);
    }

    const outputPath = path.join(projectRoot, page.output);
    const html = await readFile(outputPath, 'utf8');
    await writeFile(outputPath, injectRoot(html, renderRoot(React.createElement(Page), page.output), page.output));
  }

  const { companyPages, companyPageJsonLd, SITE_URL } = await vite.ssrLoadModule('/src/data/companyPages.ts');
  const { CompanyPage } = await vite.ssrLoadModule('/src/pages/CompanyPage.tsx');
  const template = await readFile(path.join(projectRoot, companyTemplate), 'utf8');

  for (const page of companyPages) {
    const output = `dist/${page.slug}/index.html`;
    // JSON-LD は <script> 内に埋め込むため、</script> で閉じられないよう < をエスケープする。
    const jsonLd = JSON.stringify(companyPageJsonLd(page)).replaceAll('<', '\\u003c');
    const head = template
      .replaceAll('__PAGE_TITLE__', escapeHtml(page.title))
      .replaceAll('__PAGE_DESCRIPTION__', escapeHtml(page.description))
      .replaceAll('__PAGE_URL__', `${SITE_URL}/${page.slug}`)
      .replace('__PAGE_JSON_LD__', () => jsonLd);

    if (/__PAGE_[A-Z_]+__/.test(head)) {
      throw new Error(`Unreplaced placeholder remains in ${output}`);
    }

    const outputPath = path.join(projectRoot, output);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(
      outputPath,
      injectRoot(head, renderRoot(React.createElement(CompanyPage, { page }), output), output),
    );
  }

  await rm(path.join(projectRoot, path.dirname(companyTemplate)), { recursive: true, force: true });
  // 対応表はビルド内部の情報なので公開しない。
  await rm(path.dirname(manifestPath), { recursive: true, force: true });
} finally {
  await vite.close();
}
