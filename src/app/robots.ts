import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cdn-cgi/']
      }
    ],
    sitemap: 'https://anyvideodownloader.app/sitemap.xml'
  };
}
