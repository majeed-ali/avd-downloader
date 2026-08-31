import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    'en', 'de', 'pl', 'fr', 'es', 'el', 'lv', 'lt', 'nl', 'zh', 'it', 'sv', 'sk',
    'pt', 'sl', 'ru', 'da', 'fi', 'bg', 'cs', 
  // 'et', 'hu', 'ro', 'ja', 'ko', 'id',
  // 'ab', 'aa', 'af', 'sq', 'ar', 'hy', 'az', 'bs', 'tl', 'hi', 'ka', 'hr', 'sr',
  // 'th', 'vi'
  ],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);