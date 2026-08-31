import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllBlogPosts } from '@/lib/blog-data';

const BASE_URL = 'https://anyvideodownloader.app';

const TOOL_ROUTES = [
  '',
  '/4k-video-downloader',
  '/youtube-to-mp3',
  '/youtube-playlist-downloader',
  '/youtube-to-wav',
  '/youtube-1080p-downloader',
  '/instagram-downloader',
  '/facebook-downloader',
  '/twitch-downloader',
  '/pinterest-downloader',
  '/daily-motion-downloader',
  '/vimeo-downloader'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const currentDate = new Date();
  const blogPosts = getAllBlogPosts();

  for (const locale of routing.locales) {
    // 1. Transactional tool routes
    for (const route of TOOL_ROUTES) {
      const isHome = route === '';
      const priority = isHome ? 1.0 : route.includes('4k') || route.includes('mp3') || route.includes('1080p') ? 0.9 : 0.8;
      const changeFrequency = isHome ? 'daily' : 'weekly';

      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency,
        priority
      });
    }

    // 2. Blog index
    sitemapEntries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    });

    // 3. Blog articles
    for (const post of blogPosts) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7
      });
    }
  }

  return sitemapEntries;
}
