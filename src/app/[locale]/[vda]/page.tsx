import type { Metadata } from 'next';
import { Download } from "@/app/_client/components/shared/download";
import { FAQs } from "@/app/_client/components/shared/faqs";
import { Features } from "@/app/_client/components/shared/features";
import { Hero } from "@/app/_client/components/shared/hero";
import { Partners } from "@/app/_client/components/shared/partners";

export const runtime = "edge";


type PageProps = {
  params: Promise<{ vda: string }>
}

const mapper: Mapper = {
  "4k-video-downloader": "4kd",
  "youtube-to-mp3": "ytmp3",
  "youtube-playlist-downloader": "ypd",
  "youtube-to-wav": "ytwav",
  "youtube-1080p-downloader": "y1080d",
  "instagram-downloader": "yvd",
  "facebook-downloader": "yvd",
  "twitch-downloader": "yvd",
  "pinterest-downloader": "yvd",
  "daily-motion-downloader": "yvd",
  "vimeo-downloader": "yvd",
}

const seoConfig: Record<string, { title: string; description: string }> = {
  "4k-video-downloader": {
    title: "4K Video Downloader - Download Ultra HD Videos Free | AnyVideoDownloader",
    description:
      "Download 4K videos online in high quality with fast conversion and unlimited access. Free 4K video downloader by AnyVideoDownloader."
  },
  "youtube-to-mp3": {
    title: "YouTube to MP3 Downloader - 320kbps Free Converter | AnyVideoDownloader",
    description:
      "Convert YouTube videos to MP3 in high quality for free. Fast online YouTube to MP3 downloader with no sign-up required."
  },
  "youtube-playlist-downloader": {
    title: "YouTube Playlist Downloader - Save Full Playlists Fast | AnyVideoDownloader",
    description:
      "Download complete YouTube playlists quickly in MP4 or MP3 format. Free YouTube playlist downloader with unlimited use."
  },
  "youtube-to-wav": {
    title: "YouTube to WAV Downloader - High Quality Audio Export | AnyVideoDownloader",
    description:
      "Convert YouTube videos to WAV audio online with clean quality and fast processing. Free YouTube to WAV downloader."
  },
  "youtube-1080p-downloader": {
    title: "YouTube 1080p Downloader - Full HD Video Downloads | AnyVideoDownloader",
    description:
      "Download YouTube videos in 1080p Full HD quality for free. Fast and reliable YouTube 1080p downloader without registration."
  },
  "instagram-downloader": {
    title: "Instagram Downloader - Download Reels, Stories & Videos | AnyVideoDownloader",
    description:
      "Download Instagram videos, reels, and stories online for free. Fast Instagram downloader with no watermark and no sign-up."
  },
  "facebook-downloader": {
    title: "Facebook Video Downloader - Save FB Videos Online | AnyVideoDownloader",
    description:
      "Download Facebook videos quickly in your preferred quality. Free Facebook downloader tool with unlimited downloads."
  },
  "twitch-downloader": {
    title: "Twitch Downloader - Download Twitch Clips and Videos | AnyVideoDownloader",
    description:
      "Save Twitch clips and videos in high quality with our free Twitch downloader. Fast processing and easy access."
  },
  "pinterest-downloader": {
    title: "Pinterest Downloader - Download Pinterest Videos Free | AnyVideoDownloader",
    description:
      "Download Pinterest videos and media online for free. Simple and fast Pinterest downloader with no registration."
  },
  "daily-motion-downloader": {
    title: "Dailymotion Downloader - Save Dailymotion Videos Online | AnyVideoDownloader",
    description:
      "Download Dailymotion videos in HD quality with a free online downloader. Fast and easy Dailymotion video saving."
  },
  "vimeo-downloader": {
    title: "Vimeo Downloader - Download Vimeo Videos in HD | AnyVideoDownloader",
    description:
      "Download Vimeo videos online in high quality for free. Easy and fast Vimeo downloader for personal use."
  }
}

const fallbackSeo = {
  title: "Video Downloader - Fast Online Downloads | AnyVideoDownloader",
  description:
    "Download videos from major platforms online for free. Fast, easy, and reliable downloader by AnyVideoDownloader."
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const vda = (await params).vda
  const seo = seoConfig[vda] ?? fallbackSeo
  const canonicalPath = `/${vda}`

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
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
      title: seo.title,
      description: seo.description,
      images: ["/AVD-BLACK-VERSION.webp"]
    }
  }
}

type Mapper = {
  [key: string]: string
}
 
const Page = async({ params }: PageProps) => {
  const vda = (await params).vda
  const seo = seoConfig[vda] ?? fallbackSeo
  const vdaKey = mapper[vda] ?? "yvd"
  const pageUrl = `https://anyvideodownloader.com/${vda}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: seo.title,
        url: pageUrl,
        description: seo.description,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://anyvideodownloader.com/AVD-BLACK-VERSION.webp'
        }
      },
      {
        '@type': 'SoftwareApplication',
        name: 'AnyVideoDownloader',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      }
    ]
  }

  return (
    <main
      className='px-5 lg:px-0'
      itemScope
      itemType='https://schema.org/WebPage'>
      <meta itemProp='name' content={seo.title} />
      <meta itemProp='description' content={seo.description} />
      <meta itemProp='image' content='/AVD-BLACK-VERSION.webp' />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero vda={ vdaKey } />
      <Download />
      <Partners />
      <FAQs vda={ vdaKey } />
      <Features vda={ vdaKey } />
    </main>
  );
}


export default Page