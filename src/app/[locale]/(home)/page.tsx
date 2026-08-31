import type { Metadata } from 'next';
import Image from 'next/image';
import { Download } from '@/app/_client/components/shared/download';
import { Partners } from '@/app/_client/components/shared/partners';
import { FaqAccordion, FAQItem } from '@/app/_client/components/shared/faq-accordion';
import { Features } from '@/app/_client/components/shared/features';
import { getAllBlogPosts } from '@/lib/blog-data';
import { Link } from '@/i18n/routing';
import {
  getCanonicalUrl,
  getHreflangAlternates,
  getRobotsMetadata,
  isRouteIndexable,
  getLocaleMessages
} from '@/lib/seo';

export const runtime = 'edge';

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const defaultEnglishFaqs: FAQItem[] = [
  {
    question: 'Is AnyVideoDownloader free to use?',
    answer:
      'Yes. AnyVideoDownloader provides free online conversion and downloading for supported and eligible YouTube videos. You do not need to register, create an account, or enter payment details.'
  },
  {
    question: 'How do I download a YouTube video with this tool?',
    answer:
      'Copy the YouTube video URL from your browser address bar or mobile share menu, paste it into the downloader box above, choose your preferred format and available resolution (e.g. 1080p, 720p, or MP3), and click Download.'
  },
  {
    question: 'Can I download YouTube Shorts?',
    answer:
      'Yes. Public YouTube Shorts links (e.g. youtube.com/shorts/...) are fully supported. Simply copy the Shorts link and paste it into the input box to save the vertical MP4 video.'
  },
  {
    question: 'Can I download YouTube videos in 1080p Full HD?',
    answer:
      'Yes, provided the creator uploaded the source video in 1080p or higher. Our downloader retrieves the 1080p stream and combines it with the audio track into a ready-to-play MP4 file.'
  },
  {
    question: 'Can I download YouTube videos in 4K Ultra HD?',
    answer:
      'Yes. When an eligible YouTube video has an original 4K (2160p) stream, our tool offers the 4K option for download.'
  },
  {
    question: 'Why is the 1080p or 4K option not showing for some videos?',
    answer:
      'The downloader can only provide resolutions that exist on the source upload. If a creator recorded and uploaded a video in 720p or standard definition, higher resolution options will not be available because we do not apply artificial upscaling.'
  },
  {
    question: 'Can I download YouTube videos as MP4 files?',
    answer:
      'Yes. MP4 is our primary video format because it is universally compatible across iPhones, iPads, Android devices, Windows PCs, Macs, and smart TVs without extra software.'
  },
  {
    question: 'Can I convert YouTube videos to MP3 audio?',
    answer:
      'Yes. Select "MP3 Audio" from the format dropdown before clicking download. The system will extract the audio track at high fidelity (up to 320kbps) for offline listening.'
  }
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getLocaleMessages(locale);
  const isIndexable = isRouteIndexable(locale, 'core-tool');
  const toolMsg = messages.homepage?.yvd;

  const title = toolMsg?.hero?.title
    ? `${toolMsg.hero.title} – AnyVideoDownloader`
    : 'YouTube Video Downloader – Download YouTube Videos Online Free | AnyVideoDownloader';

  const description =
    toolMsg?.hero?.description ||
    'Free online YouTube video downloader for eligible videos. Choose available MP4, MP3, HD, 1080p, and 4K quality options directly in your browser with no software required.';

  const canonicalUrl = getCanonicalUrl(locale, '');

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: getHreflangAlternates('core-tool', '')
    },
    robots: getRobotsMetadata(isIndexable),
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: [
        {
          url: '/AVD-BLACK-VERSION.webp',
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/AVD-BLACK-VERSION.webp']
    }
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getLocaleMessages(locale);
  const toolMsg = messages.homepage?.yvd;

  const localizedTitle = toolMsg?.hero?.title || 'YouTube Video Downloader';
  const localizedDescription =
    toolMsg?.hero?.description ||
    'Download eligible YouTube videos online in MP4 or MP3. Choose from available HD, 1080p, 4K, and other quality options directly in your browser, with no software installation required.';

  // Build localized FAQ list from messages
  const rawListFaqs: FAQItem[] = toolMsg?.faqs?.list || [];
  const rawBrandingFaqs: FAQItem[] = toolMsg?.faqs?.branding?.questions || [];
  const combinedFaqs: FAQItem[] = [...rawListFaqs, ...rawBrandingFaqs];
  const faqs = combinedFaqs.length > 0 ? combinedFaqs : defaultEnglishFaqs;

  const introHeading = toolMsg?.faqs?.heading || 'Experience Buffer-Free Entertainment With YouTube Video Downloader';
  const introParagraphs: string[] =
    toolMsg?.faqs?.intro2 && toolMsg.faqs.intro2.length > 0
      ? toolMsg.faqs.intro2
      : toolMsg?.faqs?.intro1 && toolMsg.faqs.intro1.length > 0
      ? toolMsg.faqs.intro1
      : [];

  const brandingTitle = toolMsg?.faqs?.branding?.title;
  const brandingIntro: string[] = toolMsg?.faqs?.branding?.intro || [];
  const brandingSteps: string[] = toolMsg?.faqs?.branding?.list || [];

  const allPosts = getAllBlogPosts();
  const youtubeGuides = allPosts.filter(
    (post) => post.cluster === 'youtube' || post.slug === 'video-download-not-working' || post.slug === 'can-you-download-youtube-videos-to-watch-offline'
  );

  const pageUrl = getCanonicalUrl(locale, '');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: localizedTitle,
    url: pageUrl,
    description: localizedDescription,
    inLanguage: locale,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://anyvideodownloader.app/AVD-BLACK-VERSION.webp'
    }
  };

  return (
    <main
      className="px-4 lg:px-6 pb-24"
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <meta itemProp="name" content={localizedTitle} />
      <meta itemProp="description" content={localizedDescription} />
      <meta itemProp="image" content="/AVD-BLACK-VERSION.webp" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-6xl mx-auto">
        {/* HERO SECTION */}
        <section className="pt-12 pb-10 lg:pt-20 lg:pb-14 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-4 font-semibold">
              Online Video Tool
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-5">
              {localizedTitle}
            </h1>
            <p className="font-light text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              {localizedDescription}
            </p>
          </div>
        </section>

        {/* PROMINENT DOWNLOADER COMPONENT */}
        <div id="downloadform" className="scroll-mt-24">
          <Download />
        </div>

        {/* TRUST & CAPABILITY HIGHLIGHTS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10 max-w-5xl mx-auto text-center">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-4 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1">100% Web-Based</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Runs smoothly in Chrome, Safari, Edge & Firefox</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-4 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1">No Software Needed</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Zero desktop installers, apps, or plugins</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-4 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1">HD & 4K Options</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Select 720p, 1080p, 4K, or MP3 when available</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-4 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1">No Registration</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Free, private access without account sign-ups</p>
          </div>
        </div>

        <Partners />

        {/* LOCALIZED CONTENT SECTION */}
        {introParagraphs.length > 0 && (
          <section className="my-16 rounded-3xl p-6 lg:p-12 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#090d18]/80 shadow-sm">
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 mb-4 text-center">
                {introHeading}
              </h2>
              <div className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed space-y-4 font-light">
                {introParagraphs.map((p, idx) => (
                  <p key={`intro-p-${idx}`}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BRANDING / STEPS SECTION IF TRANSLATED */}
        {brandingTitle && brandingSteps.length > 0 && (
          <section className="my-16 rounded-3xl p-6 lg:p-12 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#090d18]/80 shadow-sm">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 text-center">
                {brandingTitle}
              </h2>
              {brandingIntro.length > 0 && (
                <div className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed space-y-3 font-light">
                  {brandingIntro.map((p, idx) => (
                    <p key={`branding-intro-${idx}`}>{p}</p>
                  ))}
                </div>
              )}
              <ol className="space-y-3 pt-2">
                {brandingSteps.map((step, idx) => (
                  <li key={`step-${idx}`} className="flex items-start gap-3.5 text-sm lg:text-base text-slate-700 dark:text-slate-300">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* TOPIC CLUSTER (ENGLISH ONLY) */}
        {locale === 'en' && youtubeGuides.length > 0 && (
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm my-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 font-semibold mb-1">
                  Topic Cluster
                </p>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
                  Featured YouTube Guides & Tutorials
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                View All YouTube Guides →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {youtubeGuides.slice(0, 4).map((post) => (
                <article
                  key={post.slug}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070b14] shadow-sm hover:shadow-md hover:border-cyan-500/50 transition-all group"
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
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-800 dark:text-cyan-300">
                          {post.category}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{post.readTime}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors mb-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 font-light leading-relaxed">
                        {post.metaDescription}
                      </p>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 group-hover:underline"
                    >
                      Read Guide →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* LOCALIZED FAQS */}
        <FaqAccordion
          title={`${localizedTitle} ${toolMsg?.faqs?.word || 'FAQs'}`}
          subtitle={localizedDescription}
          items={faqs}
          ctaTargetHref="#downloadform"
          ctaText={`Start ${localizedTitle}`}
        />

        {/* LOCALIZED FEATURES */}
        <Features vda="yvd" />
      </div>
    </main>
  );
}