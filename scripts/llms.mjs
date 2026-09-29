import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

// public/llms.txt のこの行を、ブログの全記事の一覧に置き換える。
// 記事の正本は blog 側（blogArticles.ts と Markdown の frontmatter）なので、
// llms.txt に記事を手で書き足す必要はない。
const marker = '<!-- ブログ記事の一覧はビルド時にここへ自動で挿入されます（scripts/llms.mjs） -->';

const site = 'https://www.another-star.jp';
const projectRoot = process.cwd();
const llmsPath = path.join(projectRoot, 'dist/llms.txt');
// blog/src/pages/llms-articles.json.js がビルド時に書き出す。
const articlesPath = path.join(projectRoot, 'dist/blog/llms-articles.json');

const articles = JSON.parse(await readFile(articlesPath, 'utf8'));
if (articles.length === 0) {
  throw new Error('llms: ブログ記事が1件も見つかりません');
}

const llms = await readFile(llmsPath, 'utf8');
if (llms.split(marker).length !== 2) {
  throw new Error(`llms: dist/llms.txt に挿入位置の目印がちょうど1つありません: ${marker}`);
}

// llmstxt.org の「- [名前](URL): 説明」の形式。説明は改行を含めない。
const list = articles
  .map(({ href, title, description }) => `- [${title}](${site}${href}): ${description.replace(/\s+/g, ' ')}`)
  .join('\n');

await writeFile(llmsPath, llms.replace(marker, () => list));
await rm(articlesPath);
