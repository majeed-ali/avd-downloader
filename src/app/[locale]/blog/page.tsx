import type { Metadata } from 'next';
import Image from 'next/image';
import { getAllBlogPosts } from '@/lib/blog-data';
import { Breadcrumbs } from '@/app/_client/components/shared/breadcrumbs';
import { Link } from '@/i18n/routing';
import {
  getCanonicalUrl,
  getHreflangAlternates,
  getRobotsMetadata,
  isRouteIndexable
} from '@/lib/seo';

export const runtime = 'edge';

type BlogIndexProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params
}: BlogIndexProps): Promise<Metadata> {
  const { locale } = await params;
  const isIndexable = isRouteIndexable(locale, 'blog');
  const canonicalUrl = getCanonicalUrl(locale, '/blog');

  return {
    title: 'Video Downloader Guides & Tutorials | AnyVideoDownloader',
    description:
      'Step-by-step guides and tips on downloading videos from YouTube, Instagram, Facebook, and more on iPhone, Android, PC, and Mac.',
    alternates: {
      canonical: canonicalUrl,
      languages: getHreflangAlternates('blog', '/blog')
    },
    robots: getRobotsMetadata(isIndexable),
    openGraph: {
      title: 'Video Downloader Guides & Tutorials | AnyVideoDownloader',
      description:
        'Step-by-step guides and tips on downloading videos from YouTube, Instagram, Facebook, and more on iPhone, Android, PC, and Mac.',
      type: 'website',
      url: canonicalUrl,
      images: [
        {
          url: '/AVD-BLACK-VERSION.webp',
          width: 1200,
          height: 630,
          alt: 'AnyVideoDownloader Guides'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Video Downloader Guides & Tutorials | AnyVideoDownloader',
      description:
        'Step-by-step guides and tips on downloading videos from YouTube, Instagram, Facebook, and more.',
      images: ['/AVD-BLACK-VERSION.webp']
    }
  };
}

export default async function BlogIndexPage({ params }: BlogIndexProps) {
  const { locale } = await params;
  const posts = getAllBlogPosts();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/blog' }
  ];

  const canonicalUrl = getCanonicalUrl(locale, '/blog');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Video Downloader Guides & Tutorials',
    url: canonicalUrl,
    description:
      'Step-by-step tutorials and expert guides on video downloading across devices and platforms.'
  };

  return (
    <main className="px-4 lg:px-6 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-5xl mx-auto pt-8 lg:pt-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-3">
            Knowledge Center
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-4">
            Guides & Video Tutorials
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base lg:text-lg font-light">
            Comprehensive step-by-step guides, troubleshooting tips, and how-tos for downloading and managing video and audio media across iOS, Android, Windows, and Mac.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101d] shadow-sm hover:shadow-xl hover:border-cyan-500/50 transition-all group"
            >
              {post.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80">
                  <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-7 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/80 px-3 py-1 text-xs font-semibold text-cyan-800 dark:text-cyan-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors mb-3">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 line-clamp-3 mb-6 font-light leading-relaxed">
                    {post.metaDescription}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 group-hover:underline"
                  >
                    Read Full Guide →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Back to Home CTA */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070a12] p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Looking for the Online Downloader?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 max-w-xl mx-auto">
            Use our fast, free web tool to download videos from YouTube, Instagram, Facebook, and more without any software installation.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 text-xs uppercase tracking-widest font-bold transition-colors"
          >
            Go to YouTube Video Downloader
          </Link>
        </div>
      </div>
    </main>
  );
}
