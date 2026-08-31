import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Languages } from "./languages"
import Image from "next/image"


const links = [
  {
    label: "Youtube Video Downloader",
    link: "/"
  },
  {
    label: "4k Video Downloader",
    link: "/4k-video-downloader"
  },
  {
    label: "Youtube to MP3",
    link: "/youtube-to-mp3"
  },
  {
    label: "Youtube Playlist Downloader",
    link: "/youtube-playlist-downloader"
  },
  {
    label: "Youtube to WAV",
    link: "/youtube-to-wav"
  },
  {
    label: "Youtube 1080p Downloader",
    link: "/youtube-1080p-downloader"
  },
  {
    label: "Instagram Downloader",
    link: "/instagram-downloader"
  },
  {
    label: "Facebook Downloader",
    link: "/facebook-downloader"
  },
  {
    label: "Twitch Downloader",
    link: "/twitch-downloader"
  },
  {
    label: "Vimeo Downloader",
    link: "/vimeo-downloader"
  },
  {
    label: "Guides & Tutorials",
    link: "/blog"
  }
]

export const Footer = () =>{
  const translate = useTranslations("footer")

  const renderLinks = () =>{
    const mappedLinks = links.map(link => (
      <li
        key={ link.link }
        className="text-[15px] font-light mb-8">
        <Link href={link.link}>
          { link.label }
        </Link>
      </li>
    ))

    return mappedLinks
  }

  return (
    <footer className="bg-white dark:bg-dark_heading px-5 pt-32 pb-8 lg:flex lg:flex-wrap lg:items-start lg:gap-x-14">
      <div className="pb-8 border-b-2 border-b-gray-200 dark:border-b-gray-800 mb-8 lg:border-none">
        <Link
          className="inline-flex items-center max-w-max mx-auto" 
          href="/">
          <>
            <Image
              src="/AVD-BLACK-VERSION.webp"
              alt="AVD logo"
              width={180}
              height={52}
              className="h-9 w-auto dark:hidden"
            />
            <Image
              src="/AVD-WHITE-VERSION.webp"
              alt="AVD logo"
              width={180}
              height={52}
              className="hidden h-9 w-auto dark:block"
            />
          </>
        </Link>
      </div>
      <div className="text-center lg:text-left">
        <h3 className="text-xl font-bold text-heading_main dark:text-dark_heading_main mb-4">{ translate("more_links") }</h3>
        <ul className="text-base_one dark:text-dark_base_one lg:grid lg:grid-cols-2 lg:gap-x-10">
          { renderLinks() }
          {/* <li
            className="text-[15px] font-light mb-8">
            <Link href="/contact">
              Contact
            </Link>
          </li> */}
        </ul>
      </div>
      <div className="text-center lg:text-left lg:max-w-[45%]">
        <h3 className="text-xl font-bold text-heading_main dark:text-dark_heading_main mb-4">{ translate("languages") }</h3>
        <Languages />
      </div>
      <div className="lg:basis-full p-4">
        <div className="border-t-2 pt-16 border-t-gray-200 dark:border-t-gray-800">
          <p className="font-light text-sm text-base_one dark:text-dark_base_one">Copyright © 2026 All Rights Reseved.</p>
          <p
            className="font-light text-sm text-base_one dark:text-dark_base_one text-right decoration-wavy"
            dangerouslySetInnerHTML={{
              __html: '<!--email_off--><a href="mailto:support@anyvideodownloader.app" class="underline">Contact</a><!--/email_off-->.'
            }}
          />
        </div>
      </div>
    </footer>
  )
}