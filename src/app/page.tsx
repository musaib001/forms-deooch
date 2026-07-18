import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  FileSpreadsheet,
  Link2,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { getSessionProfile } from "@/lib/auth/session";
import { SITE_URL } from "@/lib/site";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingNav";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Build with AI or by hand",
    description:
      "Describe a form in plain English and it's created instantly — or drag it together yourself in the builder.",
  },
  {
    icon: Link2,
    title: "Share one clean link",
    description:
      "Every form gets a stable public link respondents open on any device. No account required to answer.",
  },
  {
    icon: LayoutGrid,
    title: "Responses in one place",
    description:
      "Browse submissions in a searchable table. Star, archive, and organise forms into a workspace that stays tidy.",
  },
  {
    icon: FileSpreadsheet,
    title: "Export anytime",
    description:
      "Download the full response set as Excel with one click — one column per field, no cleanup needed.",
  },
  {
    icon: Users,
    title: "Bring your team",
    description:
      "Invite teammates to build forms and read responses. Everyone connects with their own account and role.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    description:
      "Connections act as you, scoped to your workspace. Revoke any of them the moment you want it gone.",
  },
];

const STEPS = [
  { n: "1", title: "Describe it", body: "Tell your AI assistant what you need, or start from a blank form." },
  { n: "2", title: "Share the link", body: "Publish and send the public link to anyone you want to hear from." },
  { n: "3", title: "Read the results", body: "Watch responses land in a table you can search, filter, and export." },
];

const SOFTWARE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "deoochform",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "AI-native form builder. Describe a form in plain English and it builds itself; collect responses in one place and export to Excel.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to start, no credit card required.",
  },
};

export default async function Home() {
  const profile = await getSessionProfile();
  if (profile) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_JSON_LD) }}
      />
      <MarketingNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center sm:pt-24">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            AI-native form builder
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
            Powerful forms that build themselves.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Go from busywork to less work with forms you can describe in plain
            English — collect submissions, browse them in one place, and export
            everything to Excel.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-brand px-8 text-base font-semibold text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              Sign up for free
            </Link>
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-card px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            It&apos;s free — no credit card required.
          </p>
        </section>

        {/* MCP connectors spotlight — the differentiator, so it gets the
            terminal visual and its own full-bleed band. */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-subtle px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                MCP connectors
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
                Works with the AI you already use.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                deoochform speaks the Model Context Protocol, so any
                MCP-compatible assistant can build your forms and read your
                responses — signed in as you, over HTTPS. No copy-pasting, no
                plugins to maintain.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "Six tools: create, update, read forms and submissions",
                  "Signs in through your browser — nothing to store",
                  "Revoke any connection instantly",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/connect"
                className="group mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Learn more
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {/* Decorative: mirrors the terminal styling on /connect. */}
            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
              <div className="flex items-center gap-1.5 border-b border-slate-700/70 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="ml-2 text-xs font-medium text-slate-400">
                  Your AI assistant
                </span>
              </div>
              <pre className="overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed">
                <div className="text-slate-300">
                  <span className="select-none text-brand">$ </span>
                  Create a customer feedback form with a rating and a comment box
                </div>
                <div className="mt-2 text-slate-400">  ⚒ create_form</div>
                <div className="text-emerald-400">
                  {`  ✔ Created. Public link: ${SITE_URL}/f/kx28fq`}
                </div>
              </pre>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Everything you need to collect answers
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              From the first field to the final export — without the busywork in
              between.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-subtle text-brand">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground">
              Live in three steps
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              {STEPS.map(({ n, title, body }) => (
                <div key={n}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
                    {n}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Start collecting responses today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Free to start, no card required. Upgrade only when you outgrow it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-brand px-8 text-base font-semibold text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              Sign up for free
            </Link>
            <Link
              href="/pricing"
              className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-card px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              See pricing
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
