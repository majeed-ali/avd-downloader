export type FAQItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  showCta?: boolean;
  ctaTargetHref?: string;
  ctaText?: string;
};

export const FaqAccordion = ({
  title = "Frequently Asked Questions",
  subtitle,
  items,
  showCta = true,
  ctaTargetHref = "#downloadform",
  ctaText = "Start Downloading Now"
}: FaqAccordionProps) => {
  return (
    <section className="my-16 rounded-3xl py-10 lg:py-16 px-5 lg:px-12 border border-slate-200 dark:border-slate-800 bg-[linear-gradient(180deg,#fbfdff_0%,#edf4ff_60%,#e6eef9_100%)] dark:bg-[linear-gradient(180deg,#0d1322_0%,#090d17_60%,#060a12_100%)] shadow-[0_16px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_65px_rgba(0,0,0,0.45)]">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="font-bold text-2xl lg:text-4xl text-slate-900 dark:text-slate-100 mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-4 max-w-4xl mx-auto mb-12">
        {items.map((item, index) => (
          <details
            key={`faq-acc-${index}`}
            className="group rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0b1020] p-5 lg:p-6 transition-all open:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-base lg:text-lg text-slate-900 dark:text-slate-100 focus:outline-none">
              <span>{item.question}</span>
              <span className="ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-sm lg:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-light">
              {item.answer}
            </div>
          </details>
        ))}
      </div>

      {showCta && (
        <div className="max-w-3xl mx-auto rounded-2xl border border-cyan-500/40 bg-cyan-100/70 dark:bg-cyan-500/10 p-6 lg:p-8 text-center">
          <h3 className="font-bold text-xl lg:text-2xl text-slate-900 dark:text-slate-100 mb-2">
            Ready to Download Your Videos?
          </h3>
          <p className="font-light text-sm lg:text-base text-slate-700 dark:text-slate-300 mb-6">
            Free online downloader with no sign-up required, no watermarks, and high speed.
          </p>
          <a
            href={ctaTargetHref}
            className="inline-flex items-center justify-center rounded-xl border border-cyan-600 dark:border-cyan-400 bg-cyan-200 dark:bg-cyan-400/20 px-6 py-3 text-xs uppercase tracking-[0.16em] text-cyan-800 dark:text-cyan-200 hover:bg-cyan-300 dark:hover:bg-cyan-400/35 transition-colors font-medium"
          >
            {ctaText}
          </a>
        </div>
      )}
    </section>
  );
};
