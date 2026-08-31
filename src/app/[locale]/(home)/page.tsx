import type { Metadata } from 'next';
import { Hero } from '@/app/_client/components/shared/hero';
import { Download } from '@/app/_client/components/shared/download';
import { Partners } from '@/app/_client/components/shared/partners';
import { FAQs } from '@/app/_client/components/shared/faqs';
import { Features } from '@/app/_client/components/shared/features';

export const runtime = 'edge';
 
export const metadata: Metadata = {
  title: 'YouTube Video Downloader - Free HD & MP3 Downloads | AnyVideoDownloader',
  description:
    'Download YouTube videos online in HD and convert to MP3 for free. Fast, unlimited, and no registration with AnyVideoDownloader.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'YouTube Video Downloader - Free HD & MP3 Downloads | AnyVideoDownloader',
    description:
      'Download YouTube videos online in HD and convert to MP3 for free. Fast, unlimited, and no registration with AnyVideoDownloader.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/AVD-BLACK-VERSION.webp',
        width: 1200,
        height: 630,
        alt: 'AnyVideoDownloader'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Video Downloader - Free HD & MP3 Downloads | AnyVideoDownloader',
    description:
      'Download YouTube videos online in HD and convert to MP3 for free. Fast, unlimited, and no registration with AnyVideoDownloader.',
    images: ['/AVD-BLACK-VERSION.webp']
  }
}
 

const Page = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'AnyVideoDownloader',
        url: 'https://anyvideodownloader.com'
      },
      {
        '@type': 'WebPage',
        name: 'YouTube Video Downloader',
        url: 'https://anyvideodownloader.com',
        description:
          'Download YouTube videos online in HD and convert to MP3 for free. Fast, unlimited, and no registration with AnyVideoDownloader.',
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
      className='px-4 lg:px-6 pb-24'
      itemScope
      itemType='https://schema.org/WebPage'>
      <meta itemProp='name' content='YouTube Video Downloader' />
      <meta
        itemProp='description'
        content='Download YouTube videos online in HD and convert to MP3 for free. Fast, unlimited, and no registration with AnyVideoDownloader.'
      />
      <meta itemProp='image' content='/AVD-BLACK-VERSION.webp' />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className='max-w-6xl mx-auto'>
        <Hero vda='yvd' />
        <Download />
        <Partners />
        <FAQs vda='yvd' />
        <Features vda='yvd' />
      </div>
    </main>
  );
}


export default Page