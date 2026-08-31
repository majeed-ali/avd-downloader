import type { Metadata } from 'next';
import Image from 'next/image';
import { Download } from '@/app/_client/components/shared/download';
import { Partners } from '@/app/_client/components/shared/partners';
import { FaqAccordion, FAQItem } from '@/app/_client/components/shared/faq-accordion';
import { getAllBlogPosts } from '@/lib/blog-data';
import { Link } from '@/i18n/routing';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'YouTube Video Downloader – Download YouTube Videos Online Free | AnyVideoDownloader',
  description:
    'Free online YouTube video downloader for eligible videos. Choose available MP4, MP3, HD, 1080p, and 4K quality options directly in your browser with no software required.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'YouTube Video Downloader – Download YouTube Videos Online Free',
    description:
      'Download eligible YouTube videos online in MP4, MP3, HD, 1080p, and 4K. Fast, web-based tool with no software installation.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/AVD-BLACK-VERSION.webp',
        width: 1200,
        height: 630,
        alt: 'YouTube Video Downloader - AnyVideoDownloader'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Video Downloader – Download YouTube Videos Online Free',
    description:
      'Free online YouTube video downloader. Save videos in MP4, MP3, HD, 1080p, and 4K directly in your browser.',
    images: ['/AVD-BLACK-VERSION.webp']
  }
};

const youtubeFaqs: FAQItem[] = [
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
  },
  {
    question: 'Does this YouTube downloader work on iPhone and iPad?',
    answer:
      'Yes. You can use AnyVideoDownloader directly in mobile Safari on iOS 13+. Downloaded files are saved to the iOS Files app (Downloads folder) and can be shared to your Photos Camera Roll.'
  },
  {
    question: 'Does it work on Android phones and tablets?',
    answer:
      'Yes. Open Google Chrome, Samsung Internet, or Firefox on Android, paste the URL, and your video will download directly into your device Downloads folder.'
  },
  {
    question: 'Do I need to install any desktop software or browser extensions?',
    answer:
      'No. AnyVideoDownloader is 100% web-based and runs entirely in your browser. There are no executable files, APKs, or extensions to install.'
  },
  {
    question: 'Why is my YouTube video download failing or not starting?',
    answer:
      'Common reasons include: 1) The video is private, members-only, or region-locked; 2) The video is currently a live broadcast; 3) The browser blocked a download pop-up confirmation; 4) Your device is low on storage space.'
  },
  {
    question: 'Is downloading YouTube videos permitted?',
    answer:
      'Our tool is intended for downloading content you own, public domain videos, Creative Commons licensed media, or videos where you have obtained explicit permission from the creator for personal offline viewing. Please respect copyright laws and platform terms of service.'
  }
];

export default function HomePage() {
  const allPosts = getAllBlogPosts();
  // Focus only on YouTube cluster guides on the main YouTube landing page
  const youtubeGuides = allPosts.filter(
    (post) => post.cluster === 'youtube' || post.slug === 'video-download-not-working' || post.slug === 'can-you-download-youtube-videos-to-watch-offline'
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'AnyVideoDownloader',
        url: 'https://anyvideodownloader.app',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://anyvideodownloader.app/en?url={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        name: 'YouTube Video Downloader – Download YouTube Videos Online Free',
        url: 'https://anyvideodownloader.app/en',
        description:
          'Free online YouTube video downloader for eligible videos. Choose available MP4, MP3, HD, 1080p, and 4K quality options directly in your browser with no software required.',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://anyvideodownloader.app/AVD-BLACK-VERSION.webp'
        }
      },
      {
        '@type': 'SoftwareApplication',
        name: 'YouTube Video Downloader',
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
      <meta itemProp="name" content="YouTube Video Downloader" />
      <meta
        itemProp="description"
        content="Download eligible YouTube videos online in MP4, MP3, HD, 1080p, and 4K for free directly in your browser."
      />
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
              YouTube Video Downloader
            </h1>
            <p className="font-light text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Download eligible YouTube videos online in MP4 or MP3. Choose from available HD, 1080p, 4K, and other quality options directly in your browser, with no software installation required.
            </p>
          </div>
        </section>

        {/* PROMINENT DOWNLOADER COMPONENT */}
        <div id="downloadform" className="scroll-mt-24">
          <Download />
        </div>

        {/* QUICK TRUST & CAPABILITY HIGHLIGHTS */}
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

        {/* TASK-FOCUSED CONTENT SECTIONS */}
        <div className="my-16 space-y-12 max-w-4xl mx-auto text-slate-800 dark:text-slate-200">
          
          {/* Section 1: How to Download */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm space-y-5">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
              How to Download YouTube Videos Online
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-light">
              Using our <strong>youtube video downloader</strong> is simple and requires only four quick steps:
            </p>
            <ol className="space-y-4 text-sm lg:text-base">
              <li className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-xs">
                  1
                </span>
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-slate-100">Copy the Video Link:</strong> Navigate to YouTube on your phone, tablet, or computer. Open the video you wish to save, click the Share button, and copy the link (or copy the URL directly from your browser’s address bar).
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-xs">
                  2
                </span>
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-slate-100">Paste the URL:</strong> Paste the copied link into the input box at the top of this page.
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-xs">
                  3
                </span>
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-slate-100">Select Format & Quality:</strong> Choose an available resolution (such as 1080p Full HD, 720p HD, 4K, or MP3 audio) from the format selector.
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-xs">
                  4
                </span>
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-slate-100">Download the File:</strong> Click the Download button to process your video. Once ready, save the file to your device storage.
                </div>
              </li>
            </ol>
          </section>

          {/* Section 2: Supported Links */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm space-y-5">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
              Supported YouTube Links
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-light">
              Our <strong>youtube downloader online</strong> supports standard public link structures across all devices:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-[#070b14]">
                <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">Standard Watch URLs:</strong>
                <code className="text-cyan-700 dark:text-cyan-300 font-mono text-[11px]">youtube.com/watch?v=...</code>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-[#070b14]">
                <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">Shortened Share URLs:</strong>
                <code className="text-cyan-700 dark:text-cyan-300 font-mono text-[11px]">youtu.be/...</code>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-[#070b14]">
                <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">YouTube Shorts:</strong>
                <code className="text-cyan-700 dark:text-cyan-300 font-mono text-[11px]">youtube.com/shorts/...</code>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-[#070b14]">
                <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">YouTube Music URLs:</strong>
                <code className="text-cyan-700 dark:text-cyan-300 font-mono text-[11px]">music.youtube.com/watch?v=...</code>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                YouTube Links That May Not Work
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-3">
                To maintain accurate expectations, the downloader cannot process the following link types:
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light list-disc list-inside">
                <li><strong>Private or Restricted Content:</strong> Videos requiring an authorized user account or age verification bypass.</li>
                <li><strong>Members-Only or Paid Content:</strong> Content behind subscription paywalls or movie rentals.</li>
                <li><strong>Active Live Broadcasts:</strong> Streams that are currently live. (You can download once the live stream ends and archives as a normal video).</li>
                <li><strong>Deleted or Geo-Restricted Videos:</strong> Videos that are unavailable in the host region or removed by the uploader.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Formats & Quality Guide */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm space-y-6">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
              YouTube Video Formats and Quality Guide
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-light">
              Our <strong>online youtube video downloader</strong> lets you choose the format that best fits your playback needs. Available quality options depend directly on the resolution uploaded by the creator.
            </p>

            {/* Quality Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                    <th className="py-3 px-3 font-bold">Quality</th>
                    <th className="py-3 px-3 font-bold">Resolution</th>
                    <th className="py-3 px-3 font-bold">Typical Use Case</th>
                    <th className="py-3 px-3 font-bold">Relative File Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-light text-slate-600 dark:text-slate-300">
                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">360p / 480p SD</td>
                    <td className="py-3 px-3 font-mono text-xs">640×360 / 854×480</td>
                    <td className="py-3 px-3">Saving mobile data & storage</td>
                    <td className="py-3 px-3 text-cyan-600 dark:text-cyan-400 font-medium">Very Compact</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">720p HD</td>
                    <td className="py-3 px-3 font-mono text-xs">1280×720</td>
                    <td className="py-3 px-3">Mobile phones & small tablets</td>
                    <td className="py-3 px-3 text-cyan-600 dark:text-cyan-400 font-medium">Light</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">1080p Full HD</td>
                    <td className="py-3 px-3 font-mono text-xs">1920×1080</td>
                    <td className="py-3 px-3">Laptops, standard monitors & TVs</td>
                    <td className="py-3 px-3 text-cyan-600 dark:text-cyan-400 font-medium">Moderate</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">1440p 2K QHD</td>
                    <td className="py-3 px-3 font-mono text-xs">2560×1440</td>
                    <td className="py-3 px-3">High-density desktop gaming screens</td>
                    <td className="py-3 px-3 text-cyan-600 dark:text-cyan-400 font-medium">Large</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">2160p 4K UHD</td>
                    <td className="py-3 px-3 font-mono text-xs">3840×2160</td>
                    <td className="py-3 px-3">Large 4K TVs, OLED displays & editing</td>
                    <td className="py-3 px-3 text-cyan-600 dark:text-cyan-400 font-medium">Very Large</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">MP3 Audio</td>
                    <td className="py-3 px-3 font-mono text-xs">Up to 320kbps</td>
                    <td className="py-3 px-3">Podcasts, music, speeches & study</td>
                    <td className="py-3 px-3 text-cyan-600 dark:text-cyan-400 font-medium">Minimal (~5-12MB)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: HD, 1080p, & 4K */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm space-y-4">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
              Download YouTube Videos in HD, 1080p and 4K
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-light">
              High-definition video has become the everyday standard. When you want crisp, balanced quality with fast download times, our dedicated{' '}
              <Link href="/youtube-1080p-downloader" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                YouTube 1080p Downloader
              </Link>{' '}
              delivers Full HD streams with synchronized audio.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-light">
              For cinematic documentaries, nature films, and high-frame-rate gaming footage uploaded in true 2160p resolution, visit our dedicated{' '}
              <Link href="/4k-video-downloader" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                4K Video Downloader
              </Link>{' '}
              to save ultra-high-definition media files.
            </p>
          </section>

          {/* Section 5: MP4 Videos */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm space-y-4">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
              Download YouTube Videos as MP4
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-light">
              MP4 (MPEG-4 Part 14) is the most widely supported digital video container in existence. When you save a video as an MP4, it plays natively on Apple devices, Android phones, Windows laptops, QuickTime, VLC, smart TVs, and vehicle media consoles without requiring third-party video codecs.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-light">
              Our <strong>youtube mp4 downloader</strong> preserves the original H.264 video stream and AAC audio track to ensure maximum playback fidelity and cross-device compatibility.
            </p>
          </section>

          {/* Section 6: MP3 Audio Extraction */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm space-y-4">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
              Download YouTube Audio as MP3
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-light">
              If you only need the soundtrack, speech, or lecture from a video, there is no need to store a large video file. You can extract high-quality audio tracks in seconds using our{' '}
              <Link href="/youtube-to-mp3" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                YouTube to MP3
              </Link>{' '}
              converter. If you require uncompressed studio-grade audio for sound editing in a DAW, explore our{' '}
              <Link href="/youtube-to-wav" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                YouTube to WAV
              </Link>{' '}
              tool.
            </p>
          </section>

          {/* Section 7: Device Compatibility */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm space-y-5">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
              Download YouTube Videos on Any Device
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/60 dark:bg-[#070b14]/60">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">On iPhone & iPad</h3>
                <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-2">
                  Use Safari on iOS 13+. Saved files go directly to the iOS Files app (Downloads folder) and can be shared to your Photos Camera Roll in two taps.
                </p>
                <Link
                  href="/blog/how-to-download-youtube-videos-on-iphone"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  Read iPhone guide →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/60 dark:bg-[#070b14]/60">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">On Android Devices</h3>
                <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-2">
                  Works directly in Google Chrome or Samsung Internet. Downloaded MP4 files appear immediately in Google Files, VLC, and your gallery.
                </p>
                <Link
                  href="/blog/how-to-download-youtube-videos-on-android"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  Read Android guide →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/60 dark:bg-[#070b14]/60">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">On Windows PC</h3>
                <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-2">
                  Paste the URL in Microsoft Edge, Chrome, or Firefox. The video saves straight into your Windows Downloads folder for instant full-resolution viewing.
                </p>
                <Link
                  href="/blog/how-to-download-youtube-videos-on-pc"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  Read PC guide →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/60 dark:bg-[#070b14]/60">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">On Mac (macOS)</h3>
                <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-2">
                  Open Safari or Chrome on macOS. Files download to Finder (Downloads folder), ready for QuickTime playback or AirDrop sharing.
                </p>
                <Link
                  href="/blog/how-to-download-youtube-videos-on-mac"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  Read Mac guide →
                </Link>
              </div>
            </div>
          </section>

          {/* Section 8: Troubleshooting */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm space-y-4">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
              YouTube Video Download Troubleshooting
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-light">
              If you experience an issue when trying to download a video, review these common causes and fixes:
            </p>
            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light">
              <div className="border-l-2 border-cyan-500 pl-4 py-1">
                <strong className="font-semibold text-slate-900 dark:text-slate-100 block mb-0.5">Invalid or Shortened URL:</strong>
                Ensure you copied the full video link (e.g. <code>youtube.com/watch?v=...</code> or <code>youtu.be/...</code>). Double-check that there are no accidental spaces.
              </div>
              <div className="border-l-2 border-cyan-500 pl-4 py-1">
                <strong className="font-semibold text-slate-900 dark:text-slate-100 block mb-0.5">Browser Pop-up Blocked:</strong>
                Some mobile browsers block automatic download prompts. Look at your address bar for a "Pop-up blocked" warning and tap "Allow".
              </div>
              <div className="border-l-2 border-cyan-500 pl-4 py-1">
                <strong className="font-semibold text-slate-900 dark:text-slate-100 block mb-0.5">1080p or 4K Option Missing:</strong>
                The source video was not uploaded in that resolution. Check YouTube quality settings to confirm the creator published a 1080p or 4K master file.
              </div>
              <div className="border-l-2 border-cyan-500 pl-4 py-1">
                <strong className="font-semibold text-slate-900 dark:text-slate-100 block mb-0.5">Insufficient Device Storage:</strong>
                High-definition 1080p and 4K video files require ample storage. Verify that your phone or computer has sufficient free disk space.
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/blog/video-download-not-working"
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                Read our complete troubleshooting guide →
              </Link>
            </div>
          </section>

          {/* Section 9: Why Use AnyVideoDownloader */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm space-y-4">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">
              Why Use AnyVideoDownloader
            </h2>
            <div className="grid sm:grid-cols-3 gap-5 pt-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">Web-Based Access</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Operates entirely in your browser without requiring desktop software or mobile app installations.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">Multiple Formats</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Choose between standard MP4 video streams, high-resolution WEBM, or standalone MP3 audio files.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">Selectable Qualities</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Select available resolutions from 360p up to Full HD 1080p and 4K UHD based on your connection speed.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">Mobile & Desktop</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Responsive design tailored for iPhone, iPad, Android phones, Windows laptops, and macOS computers.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">No Account Required</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  No sign-up forms, passwords, or personal email addresses needed to process your downloads.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">Fast Processing</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Quick server-side stream resolution delivers ready download links directly in your browser.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10: Topic Cluster: YouTube Guides Only */}
          <section className="rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0e1a] shadow-sm">
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

          {/* Section 11: Comprehensive FAQs */}
          <FaqAccordion
            title="YouTube Downloader FAQs"
            subtitle="Everything you need to know about downloading YouTube videos online."
            items={youtubeFaqs}
            ctaTargetHref="#downloadform"
            ctaText="Start Downloading YouTube Videos"
          />

          {/* Section 12: Final Call to Action */}
          <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 lg:p-12 text-center shadow-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-2">
              Free Web Application
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
              Ready to Download Your YouTube Video?
            </h2>
            <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-light mb-8 leading-relaxed">
              Paste your YouTube link into our online video downloader above to save your video in high-definition MP4 or extract crisp MP3 audio.
            </p>
            <a
              href="#downloadform"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-8 py-3.5 text-xs uppercase tracking-[0.16em] text-slate-950 font-bold hover:bg-cyan-300 transition-colors shadow-lg"
            >
              Start Downloading Now ↑
            </a>
          </section>

        </div>
      </div>
    </main>
  );
}