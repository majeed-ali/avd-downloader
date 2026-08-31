import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { inter_sans } from "../_client/libs/fonts";
import { Header } from "../_client/components/layout/header";
import { Footer } from "../_client/components/layout/footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "next-themes";
import Script from "next/script";


export const metadata: Metadata = {
  metadataBase: new URL('https://anyvideodownloader.app'),
  title: "Any Video Downloader - Download videos from YouTube and more",
  description: "Download videos from YouTube and other platforms with Any Video Downloader. Fast, easy, and free online video downloader. Save your favorite videos in MP4, MP3, and more formats.",
  icons: {
    icon: "/AVD-ICON.svg",
    shortcut: "/AVD-ICON.svg",
    apple: "/AVD-ICON.svg"
  },
  openGraph: {
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
    images: ["/AVD-BLACK-VERSION.webp"]
  }
};

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

type AppLocale = (typeof routing.locales)[number]

const Layout = async({ children, params }: LayoutProps) => {
  const { locale } = await params

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        {/* Adsterra popunder - load before </head> */}
        <Script
          id="adsterra-popunder"
          strategy="beforeInteractive"
          src="https://pl30684928.effectivecpmnetwork.com/01/15/cd/0115cd0ae2edf9dd0448fc07f212003f.js"
        />
      </head>

      <body
        className={`${inter_sans} font-inter bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-STWM2RHG9V"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              dataLayer.push(arguments);
            }

            gtag('js', new Date());
            gtag('config', 'G-STWM2RHG9V');
          `}
        </Script>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <NextIntlClientProvider messages={messages}>
            <Header />

            {children}

            <ToastContainer autoClose={3000} />

            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>

        {/* Adsterra social bar - insert right above </body> */}
        <Script
          id="adsterra-social-bar"
          strategy="afterInteractive"
          src="https://pl30684930.effectivecpmnetwork.com/9c/97/76/9c9776b971a082165b584616cbf8a79a.js"
        />
      </body>
    </html>
  );
}


export default Layout