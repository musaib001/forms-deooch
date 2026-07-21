import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import { DOCS } from "@/lib/content";
import { MCP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Documentation for Deooch Forms: build a form in the studio or from your AI assistant over MCP, publish a public link, collect responses, and export to Excel.",
  alternates: { canonical: "/docs" },
};

export default function DocsIndexPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Deooch Forms docs
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Deooch Forms is a form builder with a Model Context Protocol server
          attached. Drag fields around in the visual studio, or ask Claude,
          ChatGPT, or any MCP-capable assistant to build the form and read the
          responses back for you. Respondents never sign in — they open a public
          link, fill it in, and submit.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {DOCS.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand"
            >
              <h2 className="text-base font-semibold text-foreground">
                {doc.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {doc.description}
              </p>
            </Link>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold tracking-tight text-foreground">
          The short version
        </h2>
        <ul className="mt-4 space-y-3 text-[15px] leading-7 text-muted-foreground">
          <li>
            <strong className="font-semibold text-foreground">
              MCP endpoint:
            </strong>{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
              {MCP_URL}
            </code>{" "}
            — add it as a custom connector and sign in when prompted.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Six tools:</strong>{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
              create_form
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
              update_form
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
              get_form
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
              list_forms
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
              list_submissions
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
              get_submission
            </code>
            .
          </li>
          <li>
            <strong className="font-semibold text-foreground">
              Public forms:
            </strong>{" "}
            every published form gets a <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">/f/&lt;slug&gt;</code>{" "}
            link that works without an account.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Free plan:</strong>{" "}
            2 forms and 50 submissions, no card required.
          </li>
        </ul>

        <p className="mt-8 text-[15px] leading-7 text-muted-foreground">
          Setting up a connector for the first time? The{" "}
          <Link href="/connect" className="font-medium text-brand underline underline-offset-2 hover:text-brand-hover">
            MCP connector walkthrough
          </Link>{" "}
          has per-client screenshots and the errors people actually hit. Want to
          see what a finished form looks like? Start from a{" "}
          <Link href="/templates" className="font-medium text-brand underline underline-offset-2 hover:text-brand-hover">
            template
          </Link>
          .
        </p>
      </section>
    </PublicShell>
  );
}
