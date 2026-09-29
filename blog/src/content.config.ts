import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  // 記事ファイル名（拡張子なし）がそのまま id になり、公開URL /blog/<id>/ に使われる。
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // パンくずや前後ナビのカードなど、狭い場所で使う短いタイトル。未指定なら title を使う。
    shortTitle: z.string().min(1).optional(),
    category: z.string().min(1).default('ニュース解説'),
    readingTime: z.string().min(1).default('5分'),
    heroImage: z.string().startsWith('/').optional(),
    heroAlt: z.string().optional(),
    featured: z.boolean().default(false),
    // 臨時号（重大ニュース即日号）フラグ
    breaking: z.boolean().default(false),
    draft: z.boolean().default(false),
    // slug を書くと公開URLがファイル名と変わり、サイトマップの lastmod（astro.config.mjs）と対応しなくなる。
    // 書き方に関係なくビルドで止めるため、値があればエラーにする。
    slug: z.never().optional(),
  }),
});

export const collections = { posts };
