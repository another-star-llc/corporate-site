import { useEffect } from 'react';

interface PageMetadata {
  enabled?: boolean;
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_URL = 'https://www.another-star.jp';

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function usePageMetadata({
  enabled = true,
  title,
  description,
  canonicalPath,
  image = '/og-image.jpg',
  type = 'website',
  jsonLd,
}: PageMetadata) {
  useEffect(() => {
    if (!enabled) return;

    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    document.getElementById('page-json-ld')?.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'page-json-ld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => document.getElementById('page-json-ld')?.remove();
  }, [canonicalPath, description, enabled, image, jsonLd, title, type]);
}
