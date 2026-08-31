import { CloseIcon } from "../../../svgs/icons/close"
import {Link} from '@/i18n/routing';


type HeaderNavProps = {
  onClose?: VoidFunction
}

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
    label: "Instagram downloader",
    link: "/instagram-downloader"
  },
  {
    label: "Facebook downloader",
    link: "/facebook-downloader"
  },
  {
    label: "Twitch Downloader",
    link: "/twitch-downloader"
  },
  {
    label: "Pinterest Downloader",
    link: "/pinterest-downloader"
  },
  {
    label: "Daily motion downloader",
    link: "/daily-motion-downloader"
  },
  {
    label: "Vimeo downloader",
    link: "/vimeo-downloader"
  }
]

export const HeaderNav = ({ onClose }: HeaderNavProps) =>{

  const renderLinks = () =>{
    const mappedLinks = links.map(link => (
      <li
        key={ link.link }
        className="mb-3 last:mb-0">
        <Link
          className="text-[14px] leading-5 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
          href={link.link}>
          { link.label }
        </Link>
      </li>
    ))

    return mappedLinks
  }

  return (
    <nav className="w-screen bg-slate-100 dark:bg-[#05070d] lg:bg-transparent p-4 lg:min-h-min lg:w-auto lg:p-0">
      <button
        className="block ml-auto lg:hidden text-slate-700 dark:text-slate-300" 
        onClick={ onClose? onClose : () =>{} }>
        <div>
          <CloseIcon />
        </div>
      </button>
      <ul className="pt-2 text-center lg:flex lg:items-center lg:gap-x-4 border-b border-b-slate-300 dark:border-b-slate-800 lg:border-none pb-6 lg:pb-0 mb-8 lg:mb-0">
        <li className="mb-4 lg:mb-0">
          <a
            className="text-[11px] uppercase tracking-[0.16em] text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            href="#downloadform">
            Start Downloading
          </a>
        </li>
        <li className="mb-4 lg:mb-0">
          <Link
            className="text-[11px] uppercase tracking-[0.16em] text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            href="/blog">
            Guides
          </Link>
        </li>
        <li className="relative z-30">
          <details className="group relative inline-block text-left">
            <summary className="list-none cursor-pointer text-[11px] uppercase tracking-[0.16em] text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700/80 hover:border-cyan-500/50 inline-flex items-center gap-2">
              Choose Downloader
              <span className="text-[14px] text-slate-500 dark:text-slate-500 group-open:rotate-180 transition-transform">v</span>
            </summary>
            <ul className="hidden group-open:block absolute left-0 top-[calc(100%+10px)] z-50 bg-white dark:bg-[#0d111c] border border-slate-300 dark:border-slate-800 rounded-2xl p-4 w-[300px] max-w-[84vw] shadow-[0_20px_45px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
              { renderLinks() }
            </ul>
          </details>
        </li>
      </ul>
    </nav>
  )
}