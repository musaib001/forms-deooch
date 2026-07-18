import type { Metadata } from "next";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingNav";
import { PricingCards } from "@/components/marketing/PricingCards";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing that scales with you. Start free.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Pricing
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Start free. Upgrade when you outgrow it. Cancel anytime.
            </p>
          </div>
          <PricingCards />
          <p className="mt-10 text-center text-sm text-muted-foreground">
            All prices in USD, billed annually. Need something custom?{" "}
            <a
              href="mailto:sales@deooch.com"
              className="font-semibold text-brand hover:text-brand-hover"
            >
              Talk to us
            </a>
            .
          </p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
