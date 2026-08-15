import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().min(1).default('ニュース解説'),
    readingTime: z.string().min(1).default('5分'),
    heroImage: z.string().startsWith('/').optional(),
    heroAlt: z.string().optional(),
    featured: z.boolean().default(false),
    // 臨時号（重大ニュース即日号）フラグ
    breaking: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
