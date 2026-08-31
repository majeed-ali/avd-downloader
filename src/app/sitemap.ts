import type { MetadataRoute } from 'next';
import {
  BASE_URL,
  VERIFIED_LOCALES,
  CORE_TRANSLATED_TOOLS,
  NON_CORE_TOOLS
} from '@/lib/seo';
import { getAllBlogPosts } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const currentDate = new Date();
  const blogPosts = getAllBlogPosts();

  // 1. Core translated transactional tool routes (Indexable in all 19 verified locales)
  for (const locale of VERIFIED_LOCALES) {
    for (const tool of CORE_TRANSLATED_TOOLS) {
      const isHome = tool.slug === '';
      const priority = isHome
        ? 1.0
        : tool.slug.includes('4k') || tool.slug.includes('mp3') || tool.slug.includes('1080p')
        ? 0.9
        : 0.8;
      const changeFrequency = isHome ? 'daily' : 'weekly';

      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${tool.slug}`,
        lastModified: currentDate,
        changeFrequency,
        priority
      });
    }
  }

  // 2. Non-core tools (Indexable only in English until translated)
  for (const route of NON_CORE_TOOLS) {
    sitemapEntries.push({
      url: `${BASE_URL}/en${route}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    });
  }

  // 3. Blog index (Indexable only in English until translations exist)
  sitemapEntries.push({
    url: `${BASE_URL}/en/blog`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8
  });

  // 4. Blog articles (Indexable only in English until translations exist)
  for (const post of blogPosts) {
    sitemapEntries.push({
      url: `${BASE_URL}/en/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7
    });
  }

  return sitemapEntries;
}
