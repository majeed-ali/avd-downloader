type QuickAnswerProps = {
  title?: string;
  answer: string;
};

export const QuickAnswer = ({
  title = "Quick Answer",
  answer
}: QuickAnswerProps) => {
  return (
    <div className="my-8 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-50/90 via-sky-50/70 to-blue-50/50 dark:from-cyan-950/40 dark:via-sky-950/30 dark:to-slate-900/60 p-6 lg:p-7 shadow-[0_10px_30px_rgba(34,211,238,0.08)]">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white text-xs font-bold">
          ✓
        </span>
        <h2 className="text-base font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
          {title}
        </h2>
      </div>
      <p className="text-slate-800 dark:text-slate-200 text-base lg:text-lg leading-relaxed font-normal">
        {answer}
      </p>
    </div>
  );
};
