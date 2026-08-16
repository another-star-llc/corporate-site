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

async function git(...args) {
  const { stdout } = await execFileAsync('git', args, { cwd: projectRoot });
  return stdout.trim();
}

/**
 * 履歴が切り詰められているクローンでの、信用できない日付の判定材料。
 *
 * Vercel は浅いクローンでビルドするため、切り詰めの境界にあるコミットは
 * 「実際にそのファイルを変更したコミット」ではなく「履歴がそこで途切れている
 * だけのコミット」の可能性がある。特に depth=1 では親が無く、git は全ファイルを
 * そのコミットで追加されたものとして返すため、全ページに直近のデプロイ日が
 * 付いてしまう。境界コミットは親を持たないコミットとして現れる。
 */
async function truncationBoundary() {
  try {
    if ((await git('rev-parse', '--is-shallow-repository')) !== 'true') return new Set();
    return new Set((await git('rev-list', '--max-parents=0', 'HEAD')).split('\n').filter(Boolean));
  } catch {
    return new Set();
  }
}

/**
 * ページを構成するソースの最終コミット日（YYYY-MM-DD）。
 *
 * lastmod は「間違った日付を書く」より「書かない」方が無害なので、
 * git が使えない場合と、日付が信用できない場合は undefined を返す。
 * changefreq と priority は Google が無視するため出力しない。
 */
async function lastCommitDate(sources, boundary) {
  try {
    const [hash, date] = (
      await git('log', '-1', '--format=%H %cs', '--', ...sources)
    ).split(' ');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) return undefined;
    return boundary.has(hash) ? undefined : date;
  } catch {
    return undefined;
  }
}

const boundary = await truncationBoundary();

const entries = await Promise.all(
  pages.map(async (page) => {
    const lastmod = await lastCommitDate(page.sources, boundary);
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
