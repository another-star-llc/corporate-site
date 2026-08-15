import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { blogArticles } from '../../../src/data/blogArticles';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'A2A Insights | Another Star合同会社',
    description:
      'AIエージェント間連携プロトコル A2A（Agent2Agent）の最新動向を日本語で定点観測するブログ',
    site: context.site,
    items: [
      ...blogArticles.map((article) => ({
        title: article.title,
        description: article.description,
        pubDate: new Date(article.publishedAt),
        link: `/blog/${article.slug}/`,
      })),
      ...posts.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.slug}/`,
      })),
    ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
    customData: '<language>ja</language>',
  });
}
