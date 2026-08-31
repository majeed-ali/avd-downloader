import type { Metadata } from 'next';
import { Download } from "@/app/_client/components/shared/download";
import { Features } from "@/app/_client/components/shared/features";
import { Hero } from "@/app/_client/components/shared/hero";
import { Partners } from "@/app/_client/components/shared/partners";
import { FaqAccordion, FAQItem } from "@/app/_client/components/shared/faq-accordion";
import { Breadcrumbs } from "@/app/_client/components/shared/breadcrumbs";
import {
  getCanonicalUrl,
  getHreflangAlternates,
  getRobotsMetadata,
  isRouteIndexable,
  getLocaleMessages,
  RouteCategory
} from "@/lib/seo";

export const runtime = "edge";

type PageProps = {
  params: Promise<{
    locale: string;
    vda: string;
  }>;
};

type ToolConfig = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  vdaKey: string;
  h1: string;
  breadcrumbName: string;
  introTitle: string;
  introParagraphs: string[];
  faqs: FAQItem[];
  clusterCategory: 'youtube' | 'instagram' | 'facebook' | 'vimeo' | 'audio';
};

const CORE_TOOL_SLUG_MAP: Record<string, string> = {
  "4k-video-downloader": "4kd",
  "youtube-to-mp3": "ytmp3",
  "youtube-playlist-downloader": "ypd",
  "youtube-to-wav": "ytwav",
  "youtube-1080p-downloader": "y1080d"
};

const toolConfigs: Record<string, ToolConfig> = {
  "4k-video-downloader": {
    title: "YouTube Downloader 4K",
    metaTitle: "YouTube Downloader 4K – Download YouTube Videos in 4K",
    metaDescription: "Download eligible YouTube videos in 4K quality online. Paste a YouTube URL, choose the available video quality, and download your video using our online 4K video downloader.",
    vdaKey: "4kd",
    h1: "YouTube Downloader 4K",
    breadcrumbName: "YouTube Downloader 4K",
    introTitle: "Download Ultra HD 4K Content in True 2160p Resolution",
    introParagraphs: [
      "4K Ultra HD video offers 3840x2160 pixels of crystal-clear resolution with over 8.3 million pixels of detail. When watching scenic documentaries, high-frame-rate gaming footage, or film trailers, 4K quality brings unparalleled clarity.",
      "Our web-based 4K Video Downloader enables you to process and save 4K video streams directly to your computer, tablet, or mobile device without installing third-party software. Enjoy cinema-grade playback on your 4K television, OLED monitor, or high-density display."
    ],
    faqs: [
      {
        question: "Can I download true 4K (2160p) resolution videos?",
        answer: "Yes, if the original source video was uploaded in 4K resolution (2160p), our tool will offer the 4K MP4/WEBM format option for download."
      },
      {
        question: "Why are 4K video files significantly larger than 1080p?",
        answer: "A 4K frame contains four times the pixel count of a standard 1080p Full HD video. This higher visual data density means 4K files require more storage space and higher bandwidth to download."
      },
      {
        question: "Do I need special software to play downloaded 4K videos?",
        answer: "Most modern devices and default media players (VLC, QuickTime, Windows Media Player) support 4K playback out of the box, provided your device has a capable graphics processor."
      },
      {
        question: "Is the 4K Video Downloader free with unlimited downloads?",
        answer: "Yes, AnyVideoDownloader is completely free with no usage caps, subscriptions, or watermarks."
      }
    ],
    clusterCategory: "youtube"
  },
  "youtube-to-mp3": {
    title: "YouTube to MP3 Converter",
    metaTitle: "YouTube to MP3 Converter - Free 320kbps Audio Downloader",
    metaDescription: "Convert YouTube videos to high-quality 320kbps MP3 audio online for free. Fast, unlimited, and no registration required with AnyVideoDownloader.",
    vdaKey: "ytmp3",
    h1: "YouTube to MP3 Converter",
    breadcrumbName: "YouTube to MP3",
    introTitle: "Convert and Extract High-Bitrate MP3 Audio",
    introParagraphs: [
      "Extracting audio from video streams is the ideal way to enjoy podcasts, DJ sets, lectures, study music, and speeches on the go. MP3 is universally compatible across every smartphone, car stereo, portable audio player, and desktop.",
      "Our online YouTube to MP3 converter extracts the audio stream and encodes it at optimal bitrates (up to 320kbps) so you can build your personal offline listening library effortlessly."
    ],
    faqs: [
      {
        question: "What audio bitrate does this YouTube to MP3 converter output?",
        answer: "Our converter processes audio at high fidelity, delivering up to 320kbps MP3 audio depending on the source video's original audio stream quality."
      },
      {
        question: "Can I play the downloaded MP3 files on my phone and car stereo?",
        answer: "Yes! MP3 is the most universally compatible audio format in existence. It works seamlessly across iPhone, Android, Apple CarPlay, Android Auto, and USB flash drives."
      },
      {
        question: "How long does it take to convert a YouTube video to MP3?",
        answer: "Most conversions complete in just a few seconds, depending on the length of the video and current server load."
      },
      {
        question: "Is there a limit on how many MP3s I can convert?",
        answer: "No. You can convert and download as many eligible videos as you need with zero restrictions."
      }
    ],
    clusterCategory: "audio"
  },
  "youtube-playlist-downloader": {
    title: "YouTube Playlist Downloader",
    metaTitle: "YouTube Playlist Downloader - Download Full Playlists Online",
    metaDescription: "Download complete YouTube playlists quickly in MP4 or MP3 format. Free online YouTube playlist downloader with unlimited use and high speed.",
    vdaKey: "ypd",
    h1: "YouTube Playlist Downloader",
    breadcrumbName: "Playlist Downloader",
    introTitle: "Save Entire Playlists and Series Effortlessly",
    introParagraphs: [
      "Instead of copying and pasting individual video URLs one by one, a playlist downloader helps you process video series, albums, and educational courses in an organized workflow.",
      "Whether you are archiving a tutorial series, saving a music playlist for road trips, or compiling lecture sets, our online tool makes playlist handling fast and organized."
    ],
    faqs: [
      {
        question: "Can I download an entire playlist at once?",
        answer: "Yes, paste the playlist link into the downloader to view and save the included video tracks in high quality."
      },
      {
        question: "Can I convert YouTube playlists directly to MP3 files?",
        answer: "Yes, you can choose the MP3 audio format to download music playlists or podcast albums as individual audio tracks."
      },
      {
        question: "Is there a limit to how many videos a playlist can contain?",
        answer: "AnyVideoDownloader processes large public playlists efficiently with no restrictions on track counts."
      }
    ],
    clusterCategory: "youtube"
  },
  "youtube-to-wav": {
    title: "YouTube to WAV Converter",
    metaTitle: "YouTube to WAV Converter - Lossless Audio Downloader Online",
    metaDescription: "Extract uncompressed, high-fidelity WAV audio from YouTube videos online for free. Studio quality with no registration needed.",
    vdaKey: "ytwav",
    h1: "YouTube to WAV Converter",
    breadcrumbName: "YouTube to WAV",
    introTitle: "High-Fidelity Uncompressed WAV Audio Extraction",
    introParagraphs: [
      "WAV (Waveform Audio File Format) is the gold standard for audio editing, music production, and professional broadcasting. Unlike lossy MP3 compression, WAV files retain full waveform fidelity with no compression artifacts.",
      "Use our YouTube to WAV converter to pull pristine audio streams directly into your digital audio workstation (DAW) for remixing, sampling, or critical listening."
    ],
    faqs: [
      {
        question: "What is the difference between MP3 and WAV?",
        answer: "MP3 is a compressed format designed to save space, while WAV is an uncompressed lossless format that retains maximum original sound detail, making it ideal for music editing and DAWs."
      },
      {
        question: "Can I open downloaded WAV files in Audacity or Premiere?",
        answer: "Yes, WAV files are universally supported across Audacity, Adobe Premiere Pro, Ableton Live, FL Studio, Logic Pro, and all major media players."
      },
      {
        question: "Is the WAV converter free?",
        answer: "Yes, our tool provides free, unlimited conversions with no watermarks."
      }
    ],
    clusterCategory: "audio"
  },
  "youtube-1080p-downloader": {
    title: "YouTube 1080p Downloader",
    metaTitle: "YouTube 1080p Downloader - Download Full HD 1080p Videos",
    metaDescription: "Download YouTube videos in 1080p Full HD online with crisp audio. Free, fast, and works directly in your web browser.",
    vdaKey: "y1080d",
    h1: "YouTube 1080p Downloader",
    breadcrumbName: "1080p Downloader",
    introTitle: "Crisp Full HD Video Downloads with Synchronized Audio",
    introParagraphs: [
      "1080p Full HD (1920x1080 pixels) provides the ideal balance between pin-sharp visual clarity, manageable file sizes, and fast download speeds. It looks stunning on modern laptops, smart TVs, and smartphones.",
      "Our 1080p downloader retrieves the full-resolution 1080p stream and combines it seamlessly with the high-bitrate audio track for instant playback."
    ],
    faqs: [
      {
        question: "Does the 1080p download include audio?",
        answer: "Yes. Our tool automatically multiplexes the high-definition 1080p video stream with the synchronized audio track into a single playable MP4 file."
      },
      {
        question: "Can I download 1080p videos at 60 frames per second (1080p60)?",
        answer: "Yes, if the creator uploaded the source video at 60fps (common in gaming and sports videos), our downloader preserves the smooth 60fps frame rate."
      },
      {
        question: "How fast is the 1080p download process?",
        answer: "Streams are processed within seconds on our high-speed servers, delivering immediate download links to your browser."
      }
    ],
    clusterCategory: "youtube"
  },
  "instagram-downloader": {
    title: "Instagram Video Downloader",
    metaTitle: "Instagram Video Downloader: Save Reels & Posts in HD",
    metaDescription: "Download Instagram Reels, videos, and IGTV clips online in HD MP4 format. Free, unlimited, and no Instagram login required.",
    vdaKey: "yvd",
    h1: "Instagram Video Downloader",
    breadcrumbName: "Instagram Downloader",
    introTitle: "Save Instagram Reels, Videos, and Clips in Seconds",
    introParagraphs: [
      "Instagram is the premier social platform for short-form entertainment, creator reels, tutorials, and memorable lifestyle videos. Saving these clips allows you to enjoy them offline or repurpose your own content across platforms.",
      "With AnyVideoDownloader, simply copy the share link from any public Instagram post and paste it here to download the high-definition MP4 video directly to your camera roll or computer."
    ],
    faqs: [
      {
        question: "How do I download an Instagram Reel on my phone?",
        answer: "Open the Instagram app, tap the 'Share' icon on the reel, select 'Copy link', paste it into our downloader in Safari or Chrome, and tap Download."
      },
      {
        question: "Do I need to log into my Instagram account?",
        answer: "No. You never need to enter your Instagram login credentials. Simply paste the link of any public post."
      },
      {
        question: "Can I download private Instagram posts?",
        answer: "No. For privacy and security reasons, our tool only processes publicly available Instagram videos and reels."
      }
    ],
    clusterCategory: "instagram"
  },
  "facebook-downloader": {
    title: "Facebook Video Downloader",
    metaTitle: "Facebook Video Downloader: Save FB Videos in HD",
    metaDescription: "Download Facebook videos, Watch clips, and public reels online for free in MP4 format. Fast, unlimited, and no software required.",
    vdaKey: "yvd",
    h1: "Facebook Video Downloader",
    breadcrumbName: "Facebook Downloader",
    introTitle: "Download Public Facebook Videos in High Definition",
    introParagraphs: [
      "Facebook hosts millions of engaging videos, documentaries, sports highlights, and creator clips on Facebook Watch. Saving these clips makes offline watching easy when you have no data connection.",
      "With our free online Facebook video downloader, simply paste the post link to receive high-definition MP4 download links in seconds."
    ],
    faqs: [
      {
        question: "How do I get the link to a Facebook video?",
        answer: "Click the 'Share' button on the Facebook post and select 'Copy link', or copy the URL directly from your browser's address bar."
      },
      {
        question: "Can I download Facebook videos on iPhone and Android?",
        answer: "Yes! Our web application works directly in mobile browsers like Safari and Chrome on both iOS and Android devices."
      },
      {
        question: "Are Facebook live videos supported?",
        answer: "Once a Facebook Live broadcast has ended and is published as a regular video post, you can download it using our tool."
      }
    ],
    clusterCategory: "facebook"
  },
  "twitch-downloader": {
    title: "Twitch Downloader",
    metaTitle: "Twitch Downloader: Save Clips & Stream VODs in 1080p",
    metaDescription: "Save Twitch clips, highlights, and stream VODs in high quality with our free online Twitch downloader. Fast, simple, and web-based.",
    vdaKey: "yvd",
    h1: "Twitch Downloader",
    breadcrumbName: "Twitch Downloader",
    introTitle: "Save Epic Gaming Moments, Clips, and Stream Highlights",
    introParagraphs: [
      "Twitch streamers produce unforgettable gaming moments, funny highlights, and esports tournaments every day. Because Twitch VODs expire after a certain number of days, saving your favorite clips is essential.",
      "Our Twitch downloader lets you preserve top clips and broadcast segments in their original 1080p/60fps quality with crystal-clear audio."
    ],
    faqs: [
      {
        question: "How do I download a Twitch clip?",
        answer: "Copy the clip URL from Twitch (e.g. clips.twitch.tv/...), paste it into our tool, and tap Download to save the MP4 video."
      },
      {
        question: "Are 60fps Twitch clips supported?",
        answer: "Yes, our downloader preserves the original source frame rate (including 1080p60) for smooth esports and gameplay footage."
      },
      {
        question: "Can I extract audio only from a Twitch stream?",
        answer: "Yes, you can choose the MP3 audio format to download talk shows, podcasts, or music sets from Twitch."
      }
    ],
    clusterCategory: "youtube"
  },
  "pinterest-downloader": {
    title: "Pinterest Video Downloader",
    metaTitle: "Pinterest Video Downloader: Save Video Pins Free",
    metaDescription: "Download Pinterest videos, Idea Pins, and GIF animations online for free. Fast and simple Pinterest downloader with no registration.",
    vdaKey: "yvd",
    h1: "Pinterest Video Downloader",
    breadcrumbName: "Pinterest Downloader",
    introTitle: "Save Pinterest Video Pins, DIY Tutorials, and Idea Pins",
    introParagraphs: [
      "Pinterest is packed with creative inspiration, cooking recipes, home decor ideas, and craft tutorials. Saving video pins directly to your camera roll makes referencing them while offline seamless.",
      "Paste any Pinterest pin URL into our online downloader to save the video file directly in high-definition MP4 format."
    ],
    faqs: [
      {
        question: "How do I copy a video pin link from the Pinterest app?",
        answer: "Tap the 'Share' or 'Send' button on any video pin and select 'Copy link'."
      },
      {
        question: "Can I save Idea Pins and GIF pins?",
        answer: "Yes! Our downloader supports standard video pins, multi-page Idea Pins, and animated GIF links."
      },
      {
        question: "Are there watermarks added to downloaded Pinterest videos?",
        answer: "No, downloads are clean and untouched with zero watermarks."
      }
    ],
    clusterCategory: "youtube"
  },
  "daily-motion-downloader": {
    title: "Dailymotion Video Downloader",
    metaTitle: "Dailymotion Video Downloader: Save Videos in HD",
    metaDescription: "Download Dailymotion videos online for free in 720p, 1080p, and MP3. Fast, simple, and web-based with AnyVideoDownloader.",
    vdaKey: "yvd",
    h1: "Dailymotion Video Downloader",
    breadcrumbName: "Dailymotion Downloader",
    introTitle: "Download Dailymotion News, Shows, and Music Videos",
    introParagraphs: [
      "Dailymotion is home to rich international news broadcasts, documentaries, sports recaps, and independent film projects. Saving these videos enables smooth offline playback on any device.",
      "Paste the Dailymotion video link to extract high-quality MP4 video or MP3 audio streams in seconds."
    ],
    faqs: [
      {
        question: "What qualities are available for Dailymotion downloads?",
        answer: "We support all qualities made available by the creator on Dailymotion, from 480p SD up to 1080p Full HD."
      },
      {
        question: "Can I download Dailymotion videos on mobile?",
        answer: "Yes! Works seamlessly in mobile Safari (iOS) and Chrome (Android)."
      }
    ],
    clusterCategory: "youtube"
  },
  "vimeo-downloader": {
    title: "Vimeo Video Downloader",
    metaTitle: "Vimeo Video Downloader: Save HD & 4K Videos Online",
    metaDescription: "Save public Vimeo videos in 1080p, 4K, and MP4 format online for free. High-speed, browser-based Vimeo downloader.",
    vdaKey: "yvd",
    h1: "Vimeo Video Downloader",
    breadcrumbName: "Vimeo Downloader",
    introTitle: "Download High-Bitrate Vimeo Videos and Showreels",
    introParagraphs: [
      "Vimeo is renowned for its high-bitrate video hosting, favored by filmmakers, animators, and commercial creators. Enjoying these artistic masterpieces offline preserves full color grading and detail.",
      "Paste any public Vimeo video link into our downloader to retrieve high-resolution MP4 video files."
    ],
    faqs: [
      {
        question: "Does this downloader preserve Vimeo's high bitrate quality?",
        answer: "Yes, our tool fetches the direct source MP4 stream to preserve original color, sound, and visual fidelity."
      },
      {
        question: "Can I download password-protected Vimeo videos?",
        answer: "Our tool processes publicly accessible Vimeo videos. Password-protected or domain-restricted videos cannot be processed for privacy reasons."
      }
    ],
    clusterCategory: "vimeo"
  }
};

const fallbackConfig: ToolConfig = {
  title: "Online Video Downloader",
  metaTitle: "Online Video Downloader - Download Videos Free",
  metaDescription: "Download videos online from popular platforms in MP4 and MP3 format for free with AnyVideoDownloader.",
  vdaKey: "yvd",
  h1: "Online Video Downloader",
  breadcrumbName: "Downloader",
  introTitle: "Fast Online Video Downloader",
  introParagraphs: [
    "Download and convert videos from popular streaming platforms directly in your browser with no registration or software installation."
  ],
  faqs: [
    {
      question: "How do I download videos with this tool?",
      answer: "Paste your video link into the URL input above, choose your desired quality or format, and tap Download."
    },
    {
      question: "Is this tool free?",
      answer: "Yes, AnyVideoDownloader is completely free with no usage limits."
    }
  ],
  clusterCategory: "youtube"
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, vda } = await params;
  const config = toolConfigs[vda] ?? fallbackConfig;
  const isCoreTool = Boolean(CORE_TOOL_SLUG_MAP[vda]);
  const category: RouteCategory = isCoreTool ? 'core-tool' : 'non-core-tool';
  const isIndexable = isRouteIndexable(locale, category);

  const messages = await getLocaleMessages(locale);
  const toolMsgKey = CORE_TOOL_SLUG_MAP[vda];
  const toolMsg = toolMsgKey ? messages.homepage?.[toolMsgKey] : null;

  const title = toolMsg?.hero?.title
    ? `${toolMsg.hero.title} – AnyVideoDownloader`
    : config.metaTitle;

  const description = toolMsg?.hero?.description || config.metaDescription;
  const canonicalPath = `/${vda}`;
  const canonicalUrl = getCanonicalUrl(locale, canonicalPath);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: getHreflangAlternates(category, canonicalPath)
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

const Page = async ({ params }: PageProps) => {
  const { locale, vda } = await params;
  const config = toolConfigs[vda] ?? fallbackConfig;
  const isCoreTool = Boolean(CORE_TOOL_SLUG_MAP[vda]);
  const pageUrl = getCanonicalUrl(locale, `/${vda}`);

  const messages = await getLocaleMessages(locale);
  const toolMsgKey = CORE_TOOL_SLUG_MAP[vda];
  const toolMsg = toolMsgKey ? messages.homepage?.[toolMsgKey] : null;

  const localizedTitle = toolMsg?.hero?.title || config.title;
  const localizedDescription = toolMsg?.hero?.description || config.metaDescription;

  // Localized FAQs
  const rawListFaqs: FAQItem[] = toolMsg?.faqs?.list || [];
  const rawBrandingFaqs: FAQItem[] = toolMsg?.faqs?.branding?.questions || [];
  const combinedFaqs: FAQItem[] = [...rawListFaqs, ...rawBrandingFaqs];
  const faqs = combinedFaqs.length > 0 ? combinedFaqs : config.faqs;

  const introHeading = toolMsg?.faqs?.heading || config.introTitle;
  const introParagraphs: string[] =
    toolMsg?.faqs?.intro2 && toolMsg.faqs.intro2.length > 0
      ? toolMsg.faqs.intro2
      : toolMsg?.faqs?.intro1 && toolMsg.faqs.intro1.length > 0
      ? toolMsg.faqs.intro1
      : config.introParagraphs;

  const brandingTitle = toolMsg?.faqs?.branding?.title;
  const brandingIntro: string[] = toolMsg?.faqs?.branding?.intro || [];
  const brandingSteps: string[] = toolMsg?.faqs?.branding?.list || [];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: localizedTitle, url: `/${vda}` }
  ];

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
        <Hero vda={config.vdaKey} />
        <Download />
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
                  <p key={`vda-intro-${idx}`}>{p}</p>
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
                    <p key={`vda-branding-intro-${idx}`}>{p}</p>
                  ))}
                </div>
              )}
              <ol className="space-y-3 pt-2">
                {brandingSteps.map((step, idx) => (
                  <li key={`vda-step-${idx}`} className="flex items-start gap-3.5 text-sm lg:text-base text-slate-700 dark:text-slate-300">
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
          ctaTargetHref="#downloadform"
          ctaText={`Start ${localizedTitle}`}
        />

        <Features vda={config.vdaKey} />
      </div>
    </main>
  );
};

export default Page;