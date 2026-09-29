import { getAllArticles } from '../lib/articles';

/**
 * llms.txt の記事一覧の材料。
 *
 * 一覧・前後ナビと同じ getAllArticles() を通すことで、下書きの除外と並び順をそろえる。
 * ルートの scripts/llms.mjs がビルド後にこれを読んで dist/llms.txt に差し込み、
 * このファイル自体は公開物から削除する。
 */
export async function GET() {
  const articles = (await getAllArticles()).map(({ href, title, description, publishedAt }) => ({
    href,
    title,
    description,
    publishedAt,
  }));

  return new Response(JSON.stringify(articles), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
