import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog-data';
import { Breadcrumbs } from '@/app/_client/components/shared/breadcrumbs';
import { QuickAnswer } from '@/app/_client/components/shared/quick-answer';
import { FaqAccordion } from '@/app/_client/components/shared/faq-accordion';
import { RelatedGuides } from '@/app/_client/components/shared/related-guides';
import { Download } from '@/app/_client/components/shared/download';
import { Link } from '@/i18n/routing';
import {
  getCanonicalUrl,
  getHreflangAlternates,
  getRobotsMetadata,
  isRouteIndexable
} from '@/lib/seo';

export const runtime = 'edge';

type BlogPostPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Article Not Found | AnyVideoDownloader',
      description: 'The requested guide could not be found.'
    };
  }

  const isIndexable = isRouteIndexable(locale, 'blog');
  const canonicalUrl = getCanonicalUrl(locale, `/blog/${slug}`);
  const imageUrl = post.coverImage || '/AVD-BLACK-VERSION.webp';

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: getHreflangAlternates('blog', `/blog/${slug}`)
    },
    robots: getRobotsMetadata(isIndexable),
    openGraph: {
      title: `${post.metaTitle} | AnyVideoDownloader`,
      description: post.metaDescription,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.coverImageAlt || post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.metaTitle} | AnyVideoDownloader`,
      description: post.metaDescription,
      images: [imageUrl]
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts.filter(
    (item) => item.slug !== post.slug && (post.relatedArticles.includes(item.slug) || item.cluster === post.cluster)
  );

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/blog' },
    { name: post.h1, url: `/blog/${post.slug}` }
  ];

  const canonicalUrl = getCanonicalUrl(locale, `/blog/${slug}`);
  const imageUrl = post.coverImage
    ? `https://anyvideodownloader.app${post.coverImage}`
    : 'https://anyvideodownloader.app/AVD-BLACK-VERSION.webp';

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.h1,
        description: post.metaDescription,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: locale,
        author: {
          '@type': 'Organization',
          name: 'AnyVideoDownloader Editorial Team',
          url: 'https://anyvideodownloader.app'
        },
        publisher: {
          '@type': 'Organization',
          name: 'AnyVideoDownloader',
          logo: {
            '@type': 'ImageObject',
            url: 'https://anyvideodownloader.app/AVD-BLACK-VERSION.webp'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        image: imageUrl
      }
    ]
  };

  return (
    <main
      className="px-4 lg:px-6 pb-24"
      itemScope
      itemType="https://schema.org/Article"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <article className="max-w-4xl mx-auto pt-8 lg:pt-12">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              •
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {post.readTime}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              •
            </span>
            <time
              dateTime={post.updatedAt}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              Updated: {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
          </div>

          <h1
            itemProp="headline"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-6"
          >
            {post.h1}
          </h1>

          {/* Featured Hero Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-video w-full my-8 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt || post.h1}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          )}

          <div className="text-slate-700 dark:text-slate-300 text-base lg:text-lg leading-relaxed space-y-4">
            {post.introParagraphs.map((paragraph, idx) => (
              <p key={`intro-${idx}`}>{paragraph}</p>
            ))}
          </div>
        </header>

        {/* Quick Answer Snippet Target */}
        <QuickAnswer answer={post.quickAnswer} />

        {/* Table of Contents */}
        {post.tableOfContents.length > 0 && (
          <nav
            aria-label="Table of contents"
            className="my-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#070b14] p-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
              Table of Contents
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-cyan-700 dark:text-cyan-300">
              {post.tableOfContents.map((item, idx) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="hover:underline inline-flex items-center gap-1.5"
                  >
                    <span className="text-xs text-slate-400">{idx + 1}.</span>
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Main Content Sections */}
        <div className="space-y-12 my-12 text-slate-800 dark:text-slate-200">
          {post.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 space-y-4"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 pt-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                {section.title}
              </h2>

              {section.content.map((paragraph, idx) => (
                <p
                  key={`sec-${section.id}-${idx}`}
                  className="text-base lg:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-light"
                >
                  {paragraph}
                </p>
              ))}

              {section.listItems && (
                <ul className="my-4 space-y-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1020] p-5 lg:p-6 text-sm lg:text-base">
                  {section.listItems.map((item, idx) => (
                    <li key={`list-${idx}`} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {section.tip && (
                <div className="rounded-xl border-l-4 border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/20 p-4 text-sm lg:text-base text-cyan-900 dark:text-cyan-200">
                  <strong className="font-semibold">Tip: </strong>
                  {section.tip}
                </div>
              )}

              {section.warning && (
                <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-sm lg:text-base text-amber-900 dark:text-amber-200">
                  <strong className="font-semibold">Notice: </strong>
                  {section.warning}
                </div>
              )}

              {section.subsections?.map((sub, sIdx) => (
                <div key={`sub-${sIdx}`} className="pt-4 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {sub.title}
                  </h3>
                  {sub.content.map((subP, subPIdx) => (
                    <p
                      key={`sub-p-${subPIdx}`}
                      className="text-base lg:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-light"
                    >
                      {subP}
                    </p>
                  ))}
                  {sub.listItems && (
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700 dark:text-slate-300">
                      {sub.listItems.map((li, liIdx) => (
                        <li key={`sub-li-${liIdx}`}>{li}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Embedded Downloader Component Contextually in the guide */}
              {section.hasDownloaderHere && (
                <div className="my-10 pt-6">
                  <div className="text-center mb-6">
                    <p className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-1">
                      Online Video Converter & Downloader
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Try our free {post.targetTool.title}
                    </h3>
                  </div>
                  <Download />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Primary Tool Callout / Internal Link Card */}
        <div className="my-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 text-white p-8 text-center shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-2">
            Main Downloader Tool
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold mb-3">
            Fast, Free {post.targetTool.anchorText}
          </h3>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm lg:text-base font-light mb-6">
            Convert and download high-definition videos and audio files with no registration, no watermarks, and unlimited speeds.
          </p>
          <Link
            href={post.targetTool.url}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-8 py-3.5 text-xs uppercase tracking-[0.16em] text-slate-950 font-bold hover:bg-cyan-300 transition-colors shadow-lg"
          >
            Go to {post.targetTool.anchorText} →
          </Link>
        </div>

        {/* FAQ Accordion */}
        <FaqAccordion
          title="Frequently Asked Questions"
          subtitle={`Common questions about ${post.h1.toLowerCase()}`}
          items={post.faqs}
          ctaTargetHref="#downloadform"
          ctaText="Convert & Download Video"
        />

        {/* Topic Cluster: Related Guides & Tools */}
        <RelatedGuides
          title="More Video Downloading Guides"
          subtitle="Explore our comprehensive tutorials and platform-specific download solutions."
          articles={relatedPosts}
          showTools={true}
        />
      </article>
    </main>
  );
}
