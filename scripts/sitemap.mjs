import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import process from 'node:process';

const execFileAsync = promisify(execFile);

const site = 'https://www.another-star.jp';
const projectRoot = process.cwd();
const output = 'dist/sitemap.xml';

// ブログ配下は blog/ 側の @astrojs/sitemap が記事ごとの lastmod 付きで出すため、
// ここでは扱わない。robots.txt が両方のサイトマップを指している。
const pages = [
  {
    loc: `${site}/`,
    // そのページを構成するソース。ここの最終コミット日を lastmod にする。
    sources: ['index.html', 'src/App.tsx', 'src/components', 'src/index.css'],
  },
  {
    loc: `${site}/product`,
    sources: ['product/index.html', 'src/pages/ProductPage.tsx'],
  },
];

/**
 * ページを構成するソースの最終コミット日（YYYY-MM-DD）。
 *
 * lastmod は「間違った日付を書く」より「書かない」方が無害なので、
 * git が使えない環境や浅いクローンで辿れなかった場合は undefined を返す。
 * changefreq と priority は Google が無視するため出力しない。
 */
async function lastCommitDate(sources) {
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['log', '-1', '--format=%cs', '--', ...sources],
      { cwd: projectRoot },
    );
    const date = stdout.trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
  } catch {
    return undefined;
  }
}

const entries = await Promise.all(
  pages.map(async (page) => {
    const lastmod = await lastCommitDate(page.sources);
    return [
      '  <url>',
      `    <loc>${page.loc}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      '  </url>',
    ].join('\n');
  }),
);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries,
  '</urlset>',
  '',
].join('\n');

await writeFile(path.join(projectRoot, output), xml);

const missing = pages.length - (xml.match(/<lastmod>/g) ?? []).length;
if (missing > 0) {
  console.warn(`sitemap: ${missing} 件の lastmod を git から取得できなかったため省略しました`);
}
