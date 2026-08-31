import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', 
    '/en/:path*', 
    '/de/:path*', 
    '/pl/:path*', 
    '/fr/:path*', 
    '/es/:path*', 
    '/el/:path*', 
    '/lv/:path*', 
    '/lt/:path*', 
    '/nl/:path*', 
    '/zh/:path*', 
    '/it/:path*', 
    '/sv/:path*', 
    '/sk/:path*', 
    '/pt/:path*', 
    '/sl/:path*', 
    '/ru/:path*', 
    '/da/:path*', 
    '/fi/:path*', 
    '/bg/:path*', 
    '/cs/:path*', 
    // '/et/:path*', 
    // '/hu/:path*', 
    // '/ro/:path*', 
    // '/ja/:path*', 
    // '/ko/:path*', 
    // '/id/:path*', 
    // '/ab/:path*', 
    // '/aa/:path*', 
    // '/af/:path*', 
    // '/sq/:path*', 
    // '/ar/:path*', 
    // '/hy/:path*', 
    // '/az/:path*', 
    // '/bs/:path*', 
    // '/tl/:path*', 
    // '/hi/:path*', 
    // '/ka/:path*', 
    // '/hr/:path*', 
    // '/sr/:path*', 
    // '/th/:path*', 
    // '/vi/:path*'
  ]
};
