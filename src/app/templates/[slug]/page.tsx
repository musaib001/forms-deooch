import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/marketing/PublicShell";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { TEMPLATES, templateBySlug } from "@/lib/forms/templates";
import { FIELD_TYPE_LABELS, isInputField } from "@/lib/forms/schema";
import { buttonPrimaryClass } from "@/lib/ui";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const template = templateBySlug((await params).slug);
  if (!template) return {};
  return { title: template.name, description: template.description };
}

export default async function TemplatePage({ params }: Params) {
  const template = templateBySlug((await params).slug);
  if (!template) notFound();

  const inputs = template.fields.filter(isInputField);

  return (
    <PublicShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.15fr_1fr]">
        {/* Live preview: the real renderer in preview mode, so what's shown
            here is exactly what a respondent gets — and the swatch row
            re-themes it in place. */}
        <div className="order-2 lg:order-1">
          <TemplatePreview template={template} />
        </div>

        <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <nav className="text-sm font-medium text-muted-foreground">
            <Link href="/templates" className="text-brand hover:text-brand-hover">
              Form templates
            </Link>
            <span className="px-2" aria-hidden>
              ›
            </span>
            {template.category}
          </nav>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {template.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {template.description}
          </p>

          <Link
            href={`/forms/new?template=${template.slug}`}
            className={buttonPrimaryClass + " mt-8 h-12 w-full text-base"}
          >
            Use template
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Opens in the builder. Nothing is saved until you edit it.
          </p>

          <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-foreground">
            Form fields
          </h2>
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
            {inputs.map((field) => (
              <li
                key={field.id}
                className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
              >
                <span className="truncate text-foreground">
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-destructive" aria-hidden>
                      *
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {FIELD_TYPE_LABELS[field.type]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PublicShell>
  );
}
