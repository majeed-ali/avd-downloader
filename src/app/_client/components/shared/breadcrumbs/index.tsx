import { Link } from "@/i18n/routing";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://anyvideodownloader.app${item.url === '/' ? '' : item.url}`
    }))
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.url} className="inline-flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-slate-800 dark:text-slate-200" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
