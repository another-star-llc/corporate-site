import { getCollection } from 'astro:content';
import { blogIndexArticles, type BlogIndexArticle } from '../../../src/data/blogArticles';

/**
 * 一覧と前後ナビで使う全記事。
 *
 * 解説記事は blogArticles.ts、Markdown記事は frontmatter がそれぞれ正本なので、
 * 表示用の1本のリストにここで束ねる。一覧と記事ページで別々に組むと並びがずれるため、
 * 参照する場所は必ずこの関数を通す。
 *
 * 並びは発行日の新しい順。同じ発行日の記事は元の並び順のまま（sort は安定ソート）。
 */
export async function getAllArticles(): Promise<BlogIndexArticle[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const contentArticles = posts.map((post) => ({
    slug: post.slug,
    href: `/blog/${post.slug}/`,
    title: post.data.title,
    shortTitle: post.data.shortTitle ?? post.data.title,
    description: post.data.description,
    category: post.data.category,
    publishedAt: post.data.pubDate.toISOString().slice(0, 10),
    readingTime: post.data.readingTime,
    heroImage: post.data.heroImage,
    heroAlt: post.data.heroAlt,
    featured: post.data.featured,
  }));

  return [...blogIndexArticles, ...contentArticles].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );
}
