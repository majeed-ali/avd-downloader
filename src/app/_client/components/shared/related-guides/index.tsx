import { Link } from "@/i18n/routing";
import Image from "next/image";
import { BlogPost, RELATED_TOOLS } from "@/lib/blog-data";

type RelatedGuidesProps = {
  title?: string;
  subtitle?: string;
  articles?: BlogPost[];
  showTools?: boolean;
};

export const RelatedGuides = ({
  title = "Related Guides & Resources",
  subtitle = "Learn more with our step-by-step tutorials and expert download guides.",
  articles = [],
  showTools = true
}: RelatedGuidesProps) => {
  return (
    <section className="my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-2">
          Knowledge Base
        </p>
        <h2 className="font-bold text-2xl lg:text-3xl text-slate-900 dark:text-slate-100 mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300">
            {subtitle}
          </p>
        )}
      </div>

      {articles.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d121f] shadow-sm hover:shadow-lg hover:border-cyan-500/50 dark:hover:border-cyan-400/40 transition-all group"
            >
              {article.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80">
                  <Image
                    src={article.coverImage}
                    alt={article.coverImageAlt || article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block rounded-full bg-cyan-100 dark:bg-cyan-950/80 px-3 py-1 text-xs font-semibold text-cyan-800 dark:text-cyan-300">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors mb-2">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 font-light leading-relaxed">
                    {article.metaDescription}
                  </p>
                </div>
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 group-hover:underline"
                >
                  Read Guide →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {showTools && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#070b14] p-6 lg:p-8 max-w-5xl mx-auto">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4 text-center">
            Popular Video Tools
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {RELATED_TOOLS.map((tool) => (
              <Link
                key={tool.url}
                href={tool.url}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d101a] p-4 hover:border-cyan-500/40 transition-colors block"
              >
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">
                  {tool.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {tool.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
