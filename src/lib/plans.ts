// Pricing tiers. Single source of truth for the pricing page and quota
// checks. Stripe price IDs get added here when billing is wired up.

export type PlanId =
  | "free"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  /** USD per month billed annually; null = custom pricing */
  monthlyPrice: number | null;
  /** Struck-through anchor price, if discounted */
  anchorPrice?: number;
  tagline: string;
  highlight?: boolean;
  cta: string;
  /** null = unlimited */
  formLimit: number | null;
  /** null = unlimited; per month */
  submissionLimit: number | null;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    tagline: "Try it out, no card required",
    cta: "Start for free",
    formLimit: 2,
    submissionLimit: 50,
    features: ["2 forms", "50 total submissions", "AI form builder", "Excel export"],
  },
  {
    id: "bronze",
    name: "Bronze",
    monthlyPrice: 19,
    anchorPrice: 39,
    tagline: "For individuals getting serious",
    cta: "Upgrade",
    formLimit: 25,
    submissionLimit: 1_000,
    features: [
      "25 forms",
      "1,000 monthly submissions",
      "1 GB storage",
      "100,000 monthly form views",
      "Email support",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    monthlyPrice: 24,
    anchorPrice: 49,
    tagline: "Best value for small teams",
    highlight: true,
    cta: "Upgrade",
    formLimit: 50,
    submissionLimit: 2_500,
    features: [
      "50 forms",
      "2,500 monthly submissions",
      "10 GB storage",
      "1,000,000 monthly form views",
      "Priority email support",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    monthlyPrice: 64,
    anchorPrice: 129,
    tagline: "For growing businesses",
    cta: "Upgrade",
    formLimit: 100,
    submissionLimit: 10_000,
    features: [
      "100 forms",
      "10,000 monthly submissions",
      "100 GB storage",
      "10,000,000 monthly form views",
      "Priority support",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    monthlyPrice: 99,
    anchorPrice: 199,
    tagline: "For high-volume operations",
    cta: "Upgrade",
    formLimit: 250,
    submissionLimit: 50_000,
    features: [
      "250 forms",
      "50,000 monthly submissions",
      "500 GB storage",
      "Unlimited form views",
      "Priority support + onboarding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    tagline: "Custom scale, security & support",
    cta: "Contact us",
    formLimit: null,
    submissionLimit: null,
    features: [
      "Unlimited forms & submissions",
      "Multiuser platform",
      "Single Sign-On (SSO)",
      "Service Level Agreement",
      "Dedicated support",
    ],
  },
];

export function getPlan(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export type Quota = { formLimit: number | null; submissionLimit: number | null };

// Owner/Member share unlimited, team-wide access regardless of the plan value
// on their own profile row (plan billing applies to self-signup accounts).
// Everyone else is metered against their plan's limits.
export function quotaFor(profile: { role: string; plan: string }): Quota {
  if (profile.role === "owner" || profile.role === "member") {
    return { formLimit: null, submissionLimit: null };
  }
  const plan = getPlan(profile.plan);
  return { formLimit: plan.formLimit, submissionLimit: plan.submissionLimit };
}
