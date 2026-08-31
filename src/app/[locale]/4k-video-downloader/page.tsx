import type { Metadata } from 'next';
import { Download } from "@/app/_client/components/shared/download";
import { Partners } from "@/app/_client/components/shared/partners";
import { FaqAccordion, FAQItem } from "@/app/_client/components/shared/faq-accordion";
import { Breadcrumbs } from "@/app/_client/components/shared/breadcrumbs";
import { Features } from "@/app/_client/components/shared/features";
import {
  getCanonicalUrl,
  getHreflangAlternates,
  getRobotsMetadata,
  isRouteIndexable,
  getLocaleMessages
} from "@/lib/seo";

export const runtime = "edge";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const defaultEnglishFaqs: FAQItem[] = [
  {
    question: "Can I download YouTube videos in 4K?",
    answer:
      "Yes. When an eligible YouTube video has been uploaded and processed by the creator in 4K Ultra HD (2160p), our online downloader allows you to select the available 4K option (such as MP4 4K or WEBM 4K) to save the high-resolution file to your device."
  },
  {
    question: "Why is the 4K option not showing for some videos?",
    answer:
      "The 4K download option is only available when the original source video on YouTube was uploaded in 4K (2160p) resolution. If a video was only uploaded in 1080p, 720p, or standard definition, our downloader will provide the highest resolution made available by the creator without artificial upscaling."
  },
  {
    question: "Is 2160p the same as 4K video quality?",
    answer:
      "Yes. In digital video standards, 4K UHD corresponds to a vertical resolution of 2160 pixels (3840x2160 total pixels). On YouTube and streaming platforms, 2160p and 4K refer to the same ultra-high-definition format."
  },
  {
    question: "Can I convert or download a 1080p YouTube video as true 4K?",
    answer:
      "No. A downloader cannot create extra image detail that did not exist in the original video. If a video was recorded and published in 1080p, downloading it preserves true 1080p quality. Genuine 4K requires a 2160p source stream."
  },
  {
    question: "Are 4K video files significantly larger than 1080p files?",
    answer:
      "Yes. Because 4K video contains four times as many pixels as 1080p Full HD (over 8.29 million pixels vs. 2.07 million), 4K files have higher bitrates and can be anywhere from 3 to 6 times larger in file size."
  },
  {
    question: "Do I need to install desktop software to use this 4K downloader?",
    answer:
      "No. Our 4K video downloader works entirely through your web browser on desktop and mobile devices. There is no desktop application or browser plugin to download or install."
  }
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getLocaleMessages(locale);
  const isIndexable = isRouteIndexable(locale, 'core-tool');
  const toolMsg = messages.homepage?.['4kd'];

  const title = toolMsg?.hero?.title
    ? `${toolMsg.hero.title} – AnyVideoDownloader`
    : 'YouTube Downloader 4K – Download YouTube Videos in 4K | AnyVideoDownloader';

  const description =
    toolMsg?.hero?.description ||
    'Download eligible YouTube videos in 4K quality online. Paste a YouTube URL, choose the available video quality, and download your video using our online 4K video downloader.';

  const canonicalUrl = getCanonicalUrl(locale, '/4k-video-downloader');

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: getHreflangAlternates('core-tool', '/4k-video-downloader')
    },
    robots: getRobotsMetadata(isIndexable),
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: "/AVD-BLACK-VERSION.webp",
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/AVD-BLACK-VERSION.webp"]
    }
  };
}

export default async function FourKDownloaderPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getLocaleMessages(locale);
  const toolMsg = messages.homepage?.['4kd'];

  const localizedTitle = toolMsg?.hero?.title || "4K Video Downloader";
  const localizedDescription =
    toolMsg?.hero?.description ||
    "Download eligible YouTube videos in 4K Ultra HD resolution online. Paste a YouTube URL, select an available high-quality video format, and save your video with our fast, web-based tool.";

  // Build localized FAQ list
  const rawListFaqs: FAQItem[] = toolMsg?.faqs?.list || [];
  const rawBrandingFaqs: FAQItem[] = toolMsg?.faqs?.branding?.questions || [];
  const combinedFaqs: FAQItem[] = [...rawListFaqs, ...rawBrandingFaqs];
  const faqs = combinedFaqs.length > 0 ? combinedFaqs : defaultEnglishFaqs;

  const introHeading = toolMsg?.faqs?.heading || "4K Video Downloader: The Downloader That Does It All!";
  const introParagraphs: string[] =
    toolMsg?.faqs?.intro2 && toolMsg.faqs.intro2.length > 0
      ? toolMsg.faqs.intro2
      : toolMsg?.faqs?.intro1 && toolMsg.faqs.intro1.length > 0
      ? toolMsg.faqs.intro1
      : [];

  const brandingTitle = toolMsg?.faqs?.branding?.title;
  const brandingIntro: string[] = toolMsg?.faqs?.branding?.intro || [];
  const brandingSteps: string[] = toolMsg?.faqs?.branding?.list || [];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: localizedTitle, url: "/4k-video-downloader" }
  ];

  const pageUrl = getCanonicalUrl(locale, '/4k-video-downloader');

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

      <div className="max-w-6xl mx-auto pt-4">
        <Breadcrumbs items={breadcrumbs} />

        {/* Above-The-Fold Section */}
        <section className="pt-8 pb-10 lg:pt-14 lg:pb-12 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-3 font-semibold">
              Ultra HD Video Tool
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-4">
              {localizedTitle}
            </h1>
            <p className="font-light text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              {localizedDescription}
            </p>
          </div>
        </section>

        {/* Downloader Form Component */}
        <div id="downloader-anchor">
          <Download />
        </div>

        {/* Trust & Capability Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10 max-w-5xl mx-auto text-center">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-4 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-lg mb-1">100% Web-Based</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Runs directly in Chrome, Safari, Edge, & Firefox</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-4 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-lg mb-1">No Software Needed</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">No desktop downloads, installers, or plugins</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-4 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-lg mb-1">True 2160p UHD</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Preserves original 4K resolution when available</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-4 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-lg mb-1">Free Online Tool</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">No sign-up or registration required</p>
          </div>
        </div>

        <Partners />

        {/* Localized Informational Explanatory Section */}
        {introParagraphs.length > 0 && (
          <section className="my-16 rounded-3xl p-6 lg:p-12 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#090d18]/80 shadow-sm">
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 mb-4 text-center">
                {introHeading}
              </h2>
              <div className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed space-y-4 font-light">
                {introParagraphs.map((p, idx) => (
                  <p key={`4k-intro-${idx}`}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Localized Branding / Steps Section */}
        {brandingTitle && brandingSteps.length > 0 && (
          <section className="my-16 rounded-3xl p-6 lg:p-12 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#090d18]/80 shadow-sm">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 text-center">
                {brandingTitle}
              </h2>
              {brandingIntro.length > 0 && (
                <div className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed space-y-3 font-light">
                  {brandingIntro.map((p, idx) => (
                    <p key={`4k-branding-intro-${idx}`}>{p}</p>
                  ))}
                </div>
              )}
              <ol className="space-y-3 pt-2">
                {brandingSteps.map((step, idx) => (
                  <li key={`4k-step-${idx}`} className="flex items-start gap-3.5 text-sm lg:text-base text-slate-700 dark:text-slate-300">
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

        {/* Localized FAQs */}
        <FaqAccordion
          title={`${localizedTitle} ${toolMsg?.faqs?.word || 'FAQs'}`}
          subtitle={localizedDescription}
          items={faqs}
          ctaTargetHref="#downloader-anchor"
          ctaText={`Start ${localizedTitle}`}
        />

        {/* Localized Features */}
        <Features vda="4kd" />
      </div>
    </main>
  );
}
