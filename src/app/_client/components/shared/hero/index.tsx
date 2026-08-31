import { useTranslations } from "next-intl"


type HeroProps = {
  vda: string
}

export const Hero = ({ vda }: HeroProps) =>{
  const translate = useTranslations(`homepage.${vda}.hero`)

  return (
    <section className="pt-16 pb-12 lg:pt-24 lg:pb-16 text-center">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300 mb-5">Fast video tools</p>
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-5">
          { translate("title") }
        </h1>
        <p className="font-light text-sm text-slate-600 dark:text-slate-300 lg:text-base max-w-3xl mx-auto mb-8">
          { translate("description") }
        </p>
        <a
          href="#downloadform"
          className="inline-flex items-center justify-center rounded-xl border border-cyan-600/50 dark:border-cyan-400/60 bg-cyan-100 dark:bg-cyan-400/20 text-cyan-700 dark:text-cyan-200 px-6 py-3 text-xs uppercase tracking-[0.14em] hover:bg-cyan-200 dark:hover:bg-cyan-400/30 transition-colors">
          Check URL and download
        </a>
        <div className="mt-10 mx-auto max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-[radial-gradient(circle_at_top,#f7fbff_0%,#eef5ff_45%,#e7f0fb_100%)] dark:bg-[radial-gradient(circle_at_top,#111a30_0%,#0b1020_45%,#060911_100%)] p-6 lg:p-8 shadow-[0_20px_45px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
          <p className="text-slate-700 dark:text-slate-300 text-sm lg:text-base">
            Download from YouTube, Instagram, Facebook, Twitch, Vimeo and more with clean output and no registration.
          </p>
        </div>
      </div>
    </section>
  )
}