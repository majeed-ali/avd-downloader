type HeroProps = {
  vda: string
}

const questions = [
  {
    question: "How do I download videos from Instagram?",
    answer:
      "To download Instagram videos, copy the URL of the post, reel, or story you want to download. Paste it into our downloader, click \"Check URL\", and then click \"Download Now\"."
  },
  {
    question: "Can I download Facebook videos with this tool?",
    answer:
      "Yes! Our tool supports Facebook video downloads. Simply copy the URL of any public Facebook video, paste it into our downloader, and select your preferred format and quality."
  },
  {
    question: "Is this YouTube downloader free to use?",
    answer:
      "Absolutely! AnyVideoDownloader is completely free to use with no registration required. You can download videos from YouTube and convert them to MP3 or MP4 without any watermarks or fees."
  },
  {
    question: "Is it legal to download videos from social media platforms?",
    answer:
      "Our tool is designed for downloading videos for personal use only. Please respect copyright laws and the terms of service of each platform. Do not download and redistribute content without permission from the copyright holder."
  }
]

export const FAQs = ({ vda }: HeroProps) =>{
  void vda

  return (
    <section className="mb-24 rounded-3xl py-10 lg:py-16 px-5 lg:px-16 border border-slate-200 dark:border-slate-800 bg-[linear-gradient(180deg,#fbfdff_0%,#edf4ff_60%,#e6eef9_100%)] dark:bg-[linear-gradient(180deg,#0d1322_0%,#090d17_60%,#060a12_100%)] shadow-[0_16px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_65px_rgba(0,0,0,0.45)]">
      <h2 className="font-bold text-3xl lg:text-5xl text-slate-900 dark:text-slate-100 mb-10">Frequently Asked Questions</h2>

      <div className="space-y-6 mb-14">
        {questions.map((item, index) => (
          <article
            key={`faq-item-${index}`}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1020] p-5 lg:p-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">{item.question}</h3>
            <p className="font-light text-sm lg:text-base leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-cyan-500/40 bg-cyan-100/70 dark:bg-cyan-500/10 p-6 lg:p-8">
        <h3 className="font-bold text-2xl lg:text-3xl text-slate-900 dark:text-slate-100 mb-3">Ready to Save Your Favorite Videos?</h3>
        <p className="font-light text-sm lg:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
          Start downloading videos from Instagram, Facebook, YouTube, and more with our free tool. No registration required, no watermarks, and unlimited downloads.
        </p>
        <a
          href="#downloadform"
          className="inline-flex items-center justify-center rounded-xl border border-cyan-600 dark:border-cyan-400 bg-cyan-200 dark:bg-cyan-400/20 px-6 py-3 text-xs uppercase tracking-[0.16em] text-cyan-800 dark:text-cyan-200 hover:bg-cyan-300 dark:hover:bg-cyan-400/35 transition-colors">
          Start Downloading Now
        </a>
      </div>
    </section>
  )
}