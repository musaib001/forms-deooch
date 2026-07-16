import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingNav";
import { PricingCards } from "@/components/marketing/PricingCards";

const FEATURES = [
  {
    title: "Build with AI or by hand",
    description:
      "Describe a form to Claude or GPT and it's created instantly — or drag it together yourself in the builder.",
  },
  {
    title: "Share one clean link",
    description:
      "Every form gets a stable public link respondents can fill out from any device — no account required.",
  },
  {
    title: "Export responses anytime",
    description:
      "Browse submissions in a searchable table or download the full set as Excel with one click.",
  },
];

export default async function Home() {
  const profile = await getSessionProfile();
  if (profile) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
              className="flex h-12 w-full items-center justify-center rounded-lg bg-brand px-8 text-base font-semibold text-brand-foreground hover:bg-brand-hover sm:w-auto"
            >
              Sign up for free
            </Link>
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-card px-8 text-base font-semibold text-foreground hover:bg-muted sm:w-auto"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            It&apos;s free — no credit card required.
          </p>
        </section>

        {/* Features */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
            {FEATURES.map(({ title, description }) => (
              <div key={title}>
                <h2 className="text-base font-bold text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Simple pricing that scales with you
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start free, upgrade when you outgrow it.
            </p>
          </div>
          <PricingCards />
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
