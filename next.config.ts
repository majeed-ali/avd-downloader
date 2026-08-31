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