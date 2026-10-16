import type { Metadata } from "next";
import { Breadcrumbs } from "@/app/_client/components/shared/breadcrumbs";
import { OnlineVideoPlayer } from "@/app/_client/components/player/online-player";
import { AdBanner } from "@/app/_client/components/shared/ad-banner";
import { FaqAccordion, FAQItem } from "@/app/_client/components/shared/faq-accordion";
import { Features } from "@/app/_client/components/shared/features";
import { Partners } from "@/app/_client/components/shared/partners";
import {
  getCanonicalUrl,
  getHreflangAlternates,
  getRobotsMetadata,
  isRouteIndexable,
  getLocaleMessages,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const defaultFaqs: FAQItem[] = [
  {
    question: "What is TeraBox Video Downloader and how does it work?",
    answer:
      "TeraBox Video Downloader is a high-speed web utility that lets you inspect, stream, and download public video files hosted on TeraBox, 1024Tera, 1024TeraBox, NephoBox, and related cloud services directly in your browser without installing third-party apps or creating an account.",
  },
  {
    question: "Which TeraBox and cloud sharing domains are supported?",
    answer:
      "We support public share URLs from terabox.com, 1024terabox.com, 1024tera.com, terabox.app, teraboxapp.com, nephobox.com, 4funbox.com, mirrobox.com, momerybox.com, tibibox.com, freeterabox.com, diskwala.com, and flezen.com.",
  },
  {
    question: "Can I download or watch password-protected TeraBox files?",
    answer:
      "No. AnyVideoDownloader strictly honors content owners' access controls and privacy settings. If a cloud link requires an access password, has expired, or was removed by its uploader, it cannot be streamed or downloaded.",
  },
  {
    question: "Do I need to install the TeraBox app or register an account?",
    answer:
      "No desktop app, mobile client, or user account is required on AnyVideoDownloader. You can paste your link and watch or download immediately.",
  },
  {
    question: "Is video playback done directly from the browser?",
    answer:
      "Yes. Whenever the underlying service provides a browser-compatible public media source, the video streams directly within your browser's native HTML5 player for maximum speed and privacy.",
  },
];

const TERABOX_KEYWORDS =
  "terabox player, terabox downloader, iteraplay, terabox online player, terabox video player, terabox link player, terabox link opener, diskwala video player, diskwala online video player, diskwala video download, terabox web player, play terabox link online, terabox online viewer, terabox direct download, diskwala video player, diskwala online player, diskwala link opener, diskwala link downloader, diskwala player online free, diskwala se video kaise download kare, terabox player usa, terabox player canada, terabox player uk, flezen video player, flezen downloader";

const DEFAULT_TERABOX_TITLE = "TeraBox Player & Fast Downloader Online - No Login, Free";
const DEFAULT_TERABOX_DESC =
  "Fast online TeraBox video player & direct downloader. Watch TeraBox links in 1080p HD or download direct MP4 files without login or app. Best IteraPlay alternative!";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getLocaleMessages(locale);
  const isIndexable = isRouteIndexable(locale, "core-tool");

  const watchOnlineMsg = messages.watchOnline;

  const title =
    locale === "en" || !watchOnlineMsg?.metaTitle
      ? DEFAULT_TERABOX_TITLE
      : `${watchOnlineMsg.metaTitle} – AnyVideoDownloader`;

  const description =
    locale === "en" || !watchOnlineMsg?.metaDescription
      ? DEFAULT_TERABOX_DESC
      : watchOnlineMsg.metaDescription;

  const canonicalUrl = getCanonicalUrl(locale, "/terabox-downloader");

  return {
    title,
    description,
    keywords: TERABOX_KEYWORDS,
    alternates: {
      canonical: canonicalUrl,
      languages: getHreflangAlternates("core-tool", "/terabox-downloader"),
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
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/AVD-BLACK-VERSION.webp"],
    },
  };
}

export default async function TeraBoxDownloaderPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getLocaleMessages(locale);
  const watchOnlineMsg = messages.watchOnline;

  const localizedTitle =
    locale === "en"
      ? DEFAULT_TERABOX_TITLE
      : watchOnlineMsg?.hero?.title || DEFAULT_TERABOX_TITLE;
  const localizedDescription =
    locale === "en"
      ? DEFAULT_TERABOX_DESC
      : watchOnlineMsg?.hero?.description || DEFAULT_TERABOX_DESC;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "TeraBox Downloader", url: "/terabox-downloader" },
  ];

  const faqs = watchOnlineMsg?.faqs?.list?.length ? watchOnlineMsg.faqs.list : defaultFaqs;
  const canonicalUrl = getCanonicalUrl(locale, "/terabox-downloader");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: localizedTitle,
    url: canonicalUrl,
    description: localizedDescription,
    keywords: TERABOX_KEYWORDS,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    inLanguage: locale,
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq: FAQItem) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="px-4 lg:px-6 pb-24" itemScope itemType="https://schema.org/WebPage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="max-w-6xl mx-auto pt-4">
        <Breadcrumbs items={breadcrumbs} />

        {/* HERO SECTION */}
        <section className="pt-8 pb-10 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-3 font-semibold">
              TeraBox & Cloud Media Player
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-4">
              {localizedTitle}
            </h1>
            <p className="font-light text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              {localizedDescription}
            </p>
          </div>
        </section>

        {/* ONLINE PLAYER COMPONENT */}
        <div id="player-form" className="scroll-mt-24 mb-12">
          <OnlineVideoPlayer
            locale={locale}
            translations={{
              placeholder: watchOnlineMsg?.form?.placeholder,
              paste: watchOnlineMsg?.form?.paste,
              clear: watchOnlineMsg?.form?.clear,
              watch: watchOnlineMsg?.form?.watch,
              analyzing: watchOnlineMsg?.form?.analyzing,
              supportedDomains: watchOnlineMsg?.form?.supportedDomains,
              download: watchOnlineMsg?.player?.download,
              copyLink: watchOnlineMsg?.player?.copyLink,
              copied: watchOnlineMsg?.player?.copied,
            }}
          />
        </div>

        {/* ADSTERRA NATIVE BANNER (SAFELY BELOW PLAYER CONTROLS) */}
        <div className="my-10">
          <AdBanner type="adsterra-native" />
        </div>

        {/* VALUE PROPOSITIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12 max-w-5xl mx-auto text-center">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-5 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1">
              Direct Playback
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Stream authorized TeraBox videos directly in your browser without waiting
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-5 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1">
              No Registration
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              No signups, passwords, or accounts required on AnyVideoDownloader
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-5 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1">
              1024Tera & Mirrors
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Compatible with 1024Tera, 1024TeraBox, NephoBox, 4FunBox & more
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] p-5 shadow-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1">
              Fast MP4 Download
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Retrieve direct offline download links when permitted by the host
            </p>
          </div>
        </div>

        <Partners />

        {/* INSTRUCTIONAL GUIDE SECTION */}
        <section className="my-16 rounded-3xl p-6 lg:p-12 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#090d18]/80 shadow-sm">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 text-center">
              How to Download and Watch TeraBox Videos Online
            </h2>

            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-sm">
                    1
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Copy TeraBox Link</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  Copy the share link from TeraBox, 1024TeraBox, 1024Tera, or NephoBox (e.g. terabox.com/s/1... or 1024terabox.com/s/1...).
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-sm">
                    2
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Paste & Analyze</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  Paste the URL into our player box above and click &ldquo;Watch Video&rdquo;. Our service resolves the public media stream.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-sm">
                    3
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Watch or Download</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  Enjoy fullscreen in-browser streaming or click the verified download button to save the MP4 video offline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <FaqAccordion
          title="TeraBox Downloader FAQs"
          subtitle="Frequently asked questions about watching and downloading TeraBox and cloud video links."
          items={faqs}
          ctaTargetHref="#player-form"
          ctaText="Start Watching"
        />

        <Features vda="yvd" />
      </div>
    </main>
  );
}
