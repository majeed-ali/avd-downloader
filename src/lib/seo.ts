export const BASE_URL = 'https://anyvideodownloader.app';

/**
 * Locales with verified high-quality human translations in messages/*.json.
 * Excludes 'lt' (Lithuanian) which currently contains unlocalized English duplicates.
 */
export const VERIFIED_LOCALES = [
  'en', 'de', 'pl', 'fr', 'es', 'el', 'lv', 'nl', 'zh', 'it',
  'sv', 'sk', 'pt', 'sl', 'ru', 'da', 'fi', 'bg', 'cs'
] as const;

export type VerifiedLocale = (typeof VERIFIED_LOCALES)[number];

export const CORE_TRANSLATED_TOOLS = [
  { slug: '', vdaKey: 'yvd' },
  { slug: '/4k-video-downloader', vdaKey: '4kd' },
  { slug: '/youtube-to-mp3', vdaKey: 'ytmp3' },
  { slug: '/youtube-playlist-downloader', vdaKey: 'ypd' },
  { slug: '/youtube-to-wav', vdaKey: 'ytwav' },
  { slug: '/youtube-1080p-downloader', vdaKey: 'y1080d' },
] as const;

export const NON_CORE_TOOLS = [
  '/instagram-downloader',
  '/facebook-downloader',
  '/twitch-downloader',
  '/pinterest-downloader',
  '/daily-motion-downloader',
  '/vimeo-downloader',
] as const;

export type RouteCategory = 'core-tool' | 'non-core-tool' | 'blog';

/**
 * Returns true if the page in this locale has genuine translated content (State A - Indexable).
 * Returns false if it falls back to English or has untranslated content (State B - Noindex).
 */
export function isRouteIndexable(locale: string, category: RouteCategory): boolean {
  if (category === 'core-tool') {
    return (VERIFIED_LOCALES as readonly string[]).includes(locale);
  }
  if (category === 'non-core-tool' || category === 'blog') {
    return locale === 'en';
  }
  return false;
}

/**
 * Generates an absolute self-referencing canonical URL.
 */
export function getCanonicalUrl(locale: string, path: string = ''): string {
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${BASE_URL}/${locale}${normalizedPath}`;
}

/**
 * Generates reciprocal hreflang alternates pointing ONLY to verified indexable (State A) versions.
 * Includes x-default pointing to the English equivalent.
 */
export function getHreflangAlternates(category: RouteCategory, path: string = ''): Record<string, string> {
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const alternates: Record<string, string> = {};

  if (category === 'core-tool') {
    for (const loc of VERIFIED_LOCALES) {
      alternates[loc] = `${BASE_URL}/${loc}${normalizedPath}`;
    }
    alternates['x-default'] = `${BASE_URL}/en${normalizedPath}`;
  } else {
    // Non-core tools and blog posts are only State A in English
    alternates['en'] = `${BASE_URL}/en${normalizedPath}`;
    alternates['x-default'] = `${BASE_URL}/en${normalizedPath}`;
  }

  return alternates;
}

/**
 * Returns robots metadata based on State A (indexable) vs State B (untranslated fallback).
 */
export function getRobotsMetadata(isIndexable: boolean) {
  if (isIndexable) {
    return {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    };
  }

  return {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  };
}

/**
 * Safe messages loader for server-side metadata generation & rendering.
 */
export async function getLocaleMessages(locale: string) {
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return messages;
  } catch {
    const fallback = (await import(`../../messages/en.json`)).default;
    return fallback;
  }
}
