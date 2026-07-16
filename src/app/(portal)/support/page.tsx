import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/portal/Container";

export const metadata: Metadata = { title: "Support — deoochform" };

const FAQS = [
  {
    q: "How do I share a form?",
    a: "Open the form and copy its public link (the /f/... URL). Anyone with the link can respond — no account needed.",
  },
  {
    q: "How do I export responses?",
    a: "Open a form's Responses page and click Download Excel. You get every submission with one column per field.",
  },
  {
    q: "What are the free plan limits?",
    a: "Free accounts get 2 forms and 50 total submissions. Paid plans raise these limits — see the pricing page.",
  },
  {
    q: "How do I build forms with AI?",
    a: "Create an API token under API Tokens, then connect Claude or any MCP-compatible assistant to your account. Describe the form you want and it appears in your dashboard.",
  },
  {
    q: "How do I invite teammates?",
    a: "Workspace owners can invite members from the Members page. Invited members can build forms and view responses.",
  },
  {
    q: "How do I upgrade or change my plan?",
    a: "Visit the pricing page and pick a plan. Billing is handled per workspace; contact us for Enterprise.",
  },
];

export default function SupportPage() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get help, browse common questions, or talk to us directly.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:help@deooch.com"
          className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-subtle text-brand">
            <MailIcon />
          </span>
          <p className="mt-3 text-sm font-semibold text-foreground group-hover:text-brand">
            Email support
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            help@deooch.com — we reply within one business day.
          </p>
        </a>
        <Link
          href="/pricing"
          className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-subtle text-brand">
            <TagIcon />
          </span>
          <p className="mt-3 text-sm font-semibold text-foreground group-hover:text-brand">
            Plans &amp; billing
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Compare plans, upgrade, or get an Enterprise quote.
          </p>
        </Link>
      </div>

      <h2 className="mb-3 text-base font-bold text-foreground">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              {q}
              <span aria-hidden className="text-muted-foreground transition-transform duration-150 group-open:rotate-180">
                <ChevronDownIcon />
              </span>
            </summary>
            <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Still stuck?{" "}
        <a
          href="mailto:help@deooch.com"
          className="font-semibold text-brand hover:text-brand-hover"
        >
          Email us
        </a>{" "}
          and include your form link so we can help faster.
        </p>
      </div>
    </Container>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2H2v10l9.3 9.3a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8L12 2Z" />
      <circle cx="7.5" cy="7.5" r="1" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
