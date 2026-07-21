import Link from "next/link";
import { SITE_URL } from "@/lib/site";

// Typography for long-form pages. Tailwind's typography plugin isn't installed
// and this is the only place that needs prose rules, so they live here as
// descendant variants rather than as a new dependency.
const PROSE = [
  "max-w-none text-[15px] leading-7 text-muted-foreground",
  "[&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground",
  "[&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground",
  "[&_p]:mt-4",
  "[&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc",
  "[&_ol]:mt-4 [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:list-decimal",
  "[&_li]:pl-1 [&_li>strong]:text-foreground",
  "[&_strong]:font-semibold [&_strong]:text-foreground",
  "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-hover",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground",
  "[&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-card [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-6",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left",
  "[&_th]:border-b [&_th]:border-border [&_th]:pb-2 [&_th]:pr-4 [&_th]:text-sm [&_th]:font-semibold [&_th]:text-foreground",
  "[&_td]:border-b [&_td]:border-border [&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top",
].join(" ");

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className={PROSE}>{children}</div>;
}

type Section = "docs" | "blog";

const SECTION_LABEL: Record<Section, string> = {
  docs: "Docs",
  blog: "Blog",
};

type ArticleProps = {
  section: Section;
  slug: string;
  title: string;
  description: string;
  /** Blog only: ISO publish date. Drives the byline and Article schema. */
  date?: string;
  children: React.ReactNode;
};

/**
 * Shared frame for a single docs or blog page: breadcrumb, H1, standfirst, and
 * the structured data that makes the page eligible for rich results and
 * quotable by AI search. Every long-form page renders through this so the
 * schema can't drift page to page.
 */
export function Article({
  section,
  slug,
  title,
  description,
  date,
  children,
}: ArticleProps) {
  const url = `${SITE_URL}/${section}/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": section === "docs" ? "TechArticle" : "BlogPosting",
        "@id": `${url}#article`,
        headline: title,
        description,
        url,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        ...(date ? { datePublished: date, dateModified: date } : {}),
        author: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: SECTION_LABEL[section],
            item: `${SITE_URL}/${section}`,
          },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm font-medium text-muted-foreground">
        <Link href={`/${section}`} className="text-brand hover:text-brand-hover">
          {SECTION_LABEL[section]}
        </Link>
        <span className="px-2" aria-hidden>
          ›
        </span>
        {title}
      </nav>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
      {date && (
        <p className="mt-3 text-sm text-muted-foreground">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </time>
        </p>
      )}
      <hr className="my-8 border-border" />
      <Prose>{children}</Prose>
    </article>
  );
}

/** FAQ block + FAQPage schema. Google reads these; so do AI answer engines. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2>Frequently asked questions</h2>
      <dl>
        {items.map(({ q, a }) => (
          <div key={q} className="mt-6">
            <dt className="font-semibold text-foreground">{q}</dt>
            <dd className="mt-2">{a}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
