import createNextIntlPlugin from 'next-intl/plugin';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
 
const withNextIntl = createNextIntlPlugin();

const projectRoot = dirname(fileURLToPath(new URL('.', import.meta.url)));
 
/** @type {import('next').NextConfig} */
const nextConfig = {
	// Keep dev and prod artifacts separate to avoid stale runtime reads.
	distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
	turbopack: {
		root: projectRoot
	},
	async redirects() {
		return [
			{
				source: '/youtube-video-downloader',
				destination: '/en',
				permanent: true
			},
			{
				source: '/:locale/youtube-video-downloader',
				destination: '/:locale',
				permanent: true
			},
			{
				source: '/video-downloader',
				destination: '/en',
				permanent: true
			},
			{
				source: '/:locale/video-downloader',
				destination: '/:locale',
				permanent: true
			},
			{
				source: '/dailymotion-video-downloader',
				destination: '/en/daily-motion-downloader',
				permanent: true
			},
			{
				source: '/:locale/dailymotion-video-downloader',
				destination: '/:locale/daily-motion-downloader',
				permanent: true
			},
			{
				source: '/facebook-video-downloader',
				destination: '/en/facebook-downloader',
				permanent: true
			},
			{
				source: '/:locale/facebook-video-downloader',
				destination: '/:locale/facebook-downloader',
				permanent: true
			},
			{
				source: '/vimeo-video-downloader',
				destination: '/en/vimeo-downloader',
				permanent: true
			},
			{
				source: '/:locale/vimeo-video-downloader',
				destination: '/:locale/vimeo-downloader',
				permanent: true
			},
			{
				source: '/instagram-video-downloader',
				destination: '/en/instagram-downloader',
				permanent: true
			},
			{
				source: '/:locale/instagram-video-downloader',
				destination: '/:locale/instagram-downloader',
				permanent: true
			},
			{
				source: '/privacy-policy',
				destination: '/en',
				permanent: true
			},
			{
				source: '/:locale/privacy-policy',
				destination: '/:locale',
				permanent: true
			},
			{
				source: '/terms-of-service',
				destination: '/en',
				permanent: true
			},
			{
				source: '/:locale/terms-of-service',
				destination: '/:locale',
				permanent: true
			}
		];
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					}
				]
			}
		];
	}
};
 
export default withNextIntl(nextConfig);