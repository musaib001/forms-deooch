import Link from "next/link";
import { PLANS } from "@/lib/plans";

export function PricingCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`relative flex flex-col rounded-2xl border bg-card p-6 ${
            plan.highlight
              ? "border-brand shadow-lg shadow-brand/10 ring-1 ring-brand"
              : "border-border"
          }`}
        >
          {plan.highlight && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-foreground">
              Best value
            </span>
          )}

          <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{plan.tagline}</p>

          <div className="mt-4 flex items-baseline gap-2">
            {plan.monthlyPrice === null ? (
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                Custom
              </span>
            ) : (
              <>
                {plan.anchorPrice && (
                  <span className="text-sm font-semibold text-muted-foreground line-through">
                    ${plan.anchorPrice}
                  </span>
                )}
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  ${plan.monthlyPrice}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </>
            )}
          </div>
          {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Billed annually at ${plan.monthlyPrice * 12}
            </p>
          )}

          <Link
            href={plan.id === "enterprise" ? "mailto:sales@deoochform.com" : "/signup"}
            className={`mt-5 flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors ${
              plan.highlight
                ? "bg-brand text-brand-foreground hover:bg-brand-hover"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {plan.cta}
          </Link>

          <ul className="mt-5 flex flex-col gap-2.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-success"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
