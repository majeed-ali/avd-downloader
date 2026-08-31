import { FacebookIcon } from "@/app/_client/components/svgs/icons/facebook"
import { ImdbIcon } from "@/app/_client/components/svgs/icons/imdb"
import { SoundcloudIcon } from "@/app/_client/components/svgs/icons/soundcloud"
import { TiktokIcon } from "@/app/_client/components/svgs/icons/tiktok"
import { TwitchIcon } from "@/app/_client/components/svgs/icons/twitch"
import { TwitterIcon } from "@/app/_client/components/svgs/icons/twitter"
import { VimeoIcon } from "@/app/_client/components/svgs/icons/vimeo"
import { YoutubeIcon } from "@/app/_client/components/svgs/icons/youtube"


const partners = [
  {
    key: "youtube",
    component: <YoutubeIcon />
  },
  {
    key: "facebook",
    component: <FacebookIcon />
  },
  {
    key: "soundcloud",
    component: <SoundcloudIcon />
  },
  {
    key: "vimeo",
    component: <VimeoIcon />
  },
  {
    key: "tiktok",
    component: <TiktokIcon />
  },
  {
    key: "imdb",
    component: <ImdbIcon />
  },
  {
    key: "twitter",
    component: <TwitterIcon />
  },
  {
    key: "twitch",
    component: <TwitchIcon />
  },
]

export const Partners = () =>{

  const renderPartners = () =>{
    const mappedPartners = partners.map(partner => (
      <li 
        key={ partner.key }
        className="transition-colors text-partner hover:text-purple_main">
        { partner.component }
      </li>
    ))

    return mappedPartners
  }

  return (
    <div className="mb-20 lg:mb-36">
      <ul className="flex flex-wrap justify-center gap-11">
        { renderPartners() }
      </ul>
    </div>
  )
}