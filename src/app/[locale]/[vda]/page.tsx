import type { Metadata } from 'next';
import { Download } from "@/app/_client/components/shared/download";
import { Features } from "@/app/_client/components/shared/features";
import { Hero } from "@/app/_client/components/shared/hero";
import { Partners } from "@/app/_client/components/shared/partners";
import { FaqAccordion, FAQItem } from "@/app/_client/components/shared/faq-accordion";
import { Breadcrumbs } from "@/app/_client/components/shared/breadcrumbs";
import { RelatedGuides } from "@/app/_client/components/shared/related-guides";
import { getAllBlogPosts } from "@/lib/blog-data";

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
        question: "How do I download an entire YouTube playlist?",
        answer: "Copy the URL of the YouTube playlist (make sure the URL contains 'list='), paste it into our downloader, choose your preferred format, and process the items."
      },
      {
        question: "Can I choose between MP4 video and MP3 audio for playlists?",
        answer: "Yes, you can download playlist items as MP4 video files or convert them directly into MP3 audio tracks."
      },
      {
        question: "Is there a maximum number of videos allowed per playlist?",
        answer: "Our tool processes standard playlists smoothly. For very large playlists (100+ videos), we recommend processing in manageable batches for optimal download speeds."
      }
    ],
    clusterCategory: "youtube"
  },
  "youtube-to-wav": {
    title: "YouTube to WAV Converter",
    metaTitle: "YouTube to WAV Downloader - Lossless Studio Audio Converter",
    metaDescription: "Convert YouTube videos to uncompressed WAV audio online with clean fidelity. Free YouTube to WAV downloader for music production and editing.",
    vdaKey: "ytwav",
    h1: "YouTube to WAV Converter",
    breadcrumbName: "YouTube to WAV",
    introTitle: "Uncompressed PCM Audio for Producers and Sound Editors",
    introParagraphs: [
      "WAV (Waveform Audio File Format) is an uncompressed, lossless audio container widely used in professional audio editing, DAWs (such as FL Studio, Ableton Live, Logic Pro), and video post-production.",
      "Unlike lossy formats like MP3, WAV retains full uncompressed PCM audio waveforms, avoiding generation loss during repeated imports, edits, and re-exports in creative workflows."
    ],
    faqs: [
      {
        question: "What is the difference between MP3 and WAV?",
        answer: "MP3 is a compressed lossy format designed for smaller file sizes, while WAV contains uncompressed PCM audio data ideal for sound design, music production, and high-fidelity editing."
      },
      {
        question: "Can I import downloaded WAV files into FL Studio or Ableton?",
        answer: "Yes! The outputted WAV files conform to standard PCM audio specifications and can be dragged directly into any Digital Audio Workstation (DAW) or video editor."
      },
      {
        question: "Why are WAV files larger than MP3 files?",
        answer: "Because WAV does not apply perceptual compression, it stores the full raw waveform samples, resulting in file sizes roughly 5 to 10 times larger than MP3."
      }
    ],
    clusterCategory: "audio"
  },
  "youtube-1080p-downloader": {
    title: "YouTube 1080p Downloader",
    metaTitle: "YouTube 1080p Downloader - Full HD Video Downloads Free",
    metaDescription: "Download YouTube videos in 1080p Full HD quality with synchronized audio. Fast, reliable, and free YouTube 1080p downloader with no watermark.",
    vdaKey: "y1080d",
    h1: "YouTube 1080p Downloader",
    breadcrumbName: "1080p Downloader",
    introTitle: "Crisp 1080p Full HD Video Downloads with Muxed Audio",
    introParagraphs: [
      "1080p (1920x1080) Full High Definition is the universal standard for crisp, balanced video playback. It offers the ideal balance between stunning visual sharpness and manageable file sizes.",
      "Our downloader ensures that 1080p video streams are correctly combined with high-quality audio tracks so you get clean, synchronized MP4 files ready for offline viewing on laptops, phones, and TVs."
    ],
    faqs: [
      {
        question: "Does the 1080p download include audio?",
        answer: "Yes! Our system automatically combines the 1080p video stream with the best available audio stream into a single complete MP4 file."
      },
      {
        question: "What frame rate (FPS) is supported for 1080p?",
        answer: "If the source video was uploaded in 1080p60 (60 frames per second), our tool will preserve the smooth high frame rate."
      },
      {
        question: "Is 1080p compatible with iPhones and Android devices?",
        answer: "Yes, 1080p MP4 is natively supported by virtually all modern smartphones, tablets, and media players."
      }
    ],
    clusterCategory: "youtube"
  },
  "instagram-downloader": {
    title: "Instagram Downloader",
    metaTitle: "Instagram Video Downloader - Save Reels, Stories & Posts",
    metaDescription: "Download Instagram reels, stories, IGTV, and video posts online for free. Fast Instagram downloader with no watermarks and no login required.",
    vdaKey: "yvd",
    h1: "Instagram Downloader",
    breadcrumbName: "Instagram Downloader",
    introTitle: "Save Instagram Reels, Stories, and Video Posts in HD",
    introParagraphs: [
      "Instagram is home to incredible short-form creative Reels, tutorials, recipes, and memorable stories. Saving these videos allows you to archive your own content or keep inspirational clips handy.",
      "Our web-based Instagram downloader lets you download public Instagram videos directly in high definition without requiring your Instagram password or app installation."
    ],
    faqs: [
      {
        question: "Can I download Instagram Reels without watermarks?",
        answer: "Yes! The downloaded MP4 video contains the original clean video stream without added watermarks."
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
    metaTitle: "Facebook Video Downloader - Save FB Watch & Clips in HD",
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
    metaTitle: "Twitch Downloader - Download Twitch Clips & VODs Online",
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
    metaTitle: "Pinterest Video Downloader - Download Pinterest Pins Free",
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
        answer: "Tap the three dots or Share icon on the pin and select 'Copy link', then paste it into our downloader."
      },
      {
        question: "What format are Pinterest videos downloaded in?",
        answer: "Pinterest videos are converted and downloaded in universally compatible MP4 video format."
      },
      {
        question: "Does this work on mobile and desktop browsers?",
        answer: "Yes, our tool is 100% web-based and functions across iOS Safari, Android Chrome, Windows, and Mac."
      }
    ],
    clusterCategory: "youtube"
  },
  "daily-motion-downloader": {
    title: "Dailymotion Downloader",
    metaTitle: "Dailymotion Downloader - Save Dailymotion Videos in HD",
    metaDescription: "Download Dailymotion videos in 1080p, 720p, and MP3 quality for free online. Fast and easy Dailymotion video saving with no registration.",
    vdaKey: "yvd",
    h1: "Dailymotion Downloader",
    breadcrumbName: "Dailymotion Downloader",
    introTitle: "Download Dailymotion Videos and News Clips in HD",
    introParagraphs: [
      "Dailymotion features international news broadcasts, music videos, short films, and user content. Saving these streams allows for uninterrupted offline viewing anytime.",
      "Our web-based downloader processes Dailymotion links quickly, allowing you to choose between 1080p, 720p, or MP3 audio downloads."
    ],
    faqs: [
      {
        question: "Is Dailymotion video downloading free?",
        answer: "Yes, AnyVideoDownloader is completely free with no subscription or hidden charges."
      },
      {
        question: "Can I download 1080p HD Dailymotion videos?",
        answer: "Yes, if the video was uploaded in 1080p HD, our tool provides full resolution MP4 downloads."
      }
    ],
    clusterCategory: "youtube"
  },
  "vimeo-downloader": {
    title: "Vimeo Downloader",
    metaTitle: "Vimeo Downloader - Download High Quality Vimeo Videos Free",
    metaDescription: "Download Vimeo videos online in 1080p and 4K quality for free. Fast, high-bitrate Vimeo downloader for creators and filmmakers.",
    vdaKey: "yvd",
    h1: "Vimeo Downloader",
    breadcrumbName: "Vimeo Downloader",
    introTitle: "Save High-Bitrate Vimeo Films and Creator Videos",
    introParagraphs: [
      "Vimeo is renowned for hosting high-bitrate cinematic films, creative animations, music videos, and indie documentaries. Videographers and viewers appreciate Vimeo’s superior compression and color depth.",
      "Our Vimeo downloader makes it easy to download public Vimeo videos in full original fidelity for offline portfolio review and reference."
    ],
    faqs: [
      {
        question: "Can I download high-bitrate 1080p and 4K Vimeo videos?",
        answer: "Yes! Our downloader supports high-definition and 4K Vimeo video links, saving them in original MP4 quality."
      },
      {
        question: "Can I convert Vimeo videos to MP3 audio?",
        answer: "Yes, select 'MP3 Audio' in the format selector before downloading to extract the soundtrack or speech."
      }
    ],
    clusterCategory: "vimeo"
  }
};

const fallbackConfig: ToolConfig = {
  title: "Video Downloader",
  metaTitle: "Video Downloader - Fast Online Video & Audio Converter",
  metaDescription: "Download videos from major platforms online for free. Fast, easy, and reliable downloader by AnyVideoDownloader.",
  vdaKey: "yvd",
  h1: "Video Downloader",
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
  const canonicalPath = `/${locale}/${vda}`;

  return {
    title: `${config.metaTitle} | AnyVideoDownloader`,
    description: config.metaDescription,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title: `${config.metaTitle} | AnyVideoDownloader`,
      description: config.metaDescription,
      type: "website",
      url: canonicalPath,
      images: [
        {
          url: "/AVD-BLACK-VERSION.webp",
          width: 1200,
          height: 630,
          alt: "AnyVideoDownloader"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.metaTitle} | AnyVideoDownloader`,
      description: config.metaDescription,
      images: ["/AVD-BLACK-VERSION.webp"]
    }
  };
}

const Page = async ({ params }: PageProps) => {
  const { locale, vda } = await params;
  const config = toolConfigs[vda] ?? fallbackConfig;
  const pageUrl = `https://anyvideodownloader.app/${locale}/${vda}`;
  const allPosts = getAllBlogPosts();

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: config.breadcrumbName, url: `/${vda}` }
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: config.metaTitle,
        url: pageUrl,
        description: config.metaDescription,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://anyvideodownloader.app/AVD-BLACK-VERSION.webp'
        }
      },
      {
        '@type': 'SoftwareApplication',
        name: config.title,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web-based (Browser)',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      }
    ]
  };

  return (
    <main
      className="px-4 lg:px-6 pb-24"
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <meta itemProp="name" content={config.metaTitle} />
      <meta itemProp="description" content={config.metaDescription} />
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

        {/* Informational Explanatory Section */}
        <section className="my-16 rounded-3xl p-6 lg:p-12 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#090d18]/80 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 mb-4 text-center">
              {config.introTitle}
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed space-y-4 font-light">
              {config.introParagraphs.map((p, idx) => (
                <p key={`intro-${idx}`}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Tailored FAQs with Schema */}
        <FaqAccordion
          title={`${config.title} FAQs`}
          subtitle={`Frequently asked questions about using our online ${config.title.toLowerCase()}.`}
          items={config.faqs}
          ctaTargetHref="#downloadform"
          ctaText={`Start ${config.title}`}
        />

        {/* Topic Cluster: Related Guides */}
        <RelatedGuides
          title="Related Guides & Tools"
          subtitle="Learn more about downloading videos and exploring companion tools."
          articles={allPosts}
          showTools={true}
        />

        <Features vda={config.vdaKey} />
      </div>
    </main>
  );
};

export default Page;