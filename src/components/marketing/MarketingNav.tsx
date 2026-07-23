import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

// ponytail: links drop out by breakpoint instead of a burger menu — the nav
// only has to fit brand + Log in + Start free at 360px, and everything hidden
// here is still in the footer. Add a sheet menu when the link list grows.
const LINKS = [
  { href: "/templates", label: "Templates", show: "hidden sm:block" },
  { href: "/connect", label: "MCP connectors", show: "hidden md:block" },
  { href: "/docs", label: "Docs", show: "hidden md:block" },
  { href: "/blog", label: "Blog", show: "hidden lg:block" },
  { href: "/pricing", label: "Pricing", show: "hidden sm:block" },
];

/**
 * `tone="ink"` is for pages whose first section is the dark band — without it
 * a light nav sits on top of --ink and leaves a hard seam across the fold.
 */
export function MarketingNav({ tone = "light" }: { tone?: "light" | "ink" }) {
  const ink = tone === "ink";

  const shell = ink
    ? "border-ink-border bg-ink/80"
    : "border-border bg-background/90";
  const link = ink
    ? "text-ink-muted hover:text-ink-foreground"
    : "text-muted-foreground hover:text-foreground";
  const wordmark = ink ? "text-ink-foreground" : "text-foreground";

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur ${shell}`}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <BrandMark className="h-8 w-8 shrink-0 transition-transform duration-150 ease-out group-hover:scale-105" />
          <span
            className={`whitespace-nowrap text-base font-bold tracking-tight ${wordmark}`}
          >
            Deooch Forms
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {LINKS.map(({ href, label, show }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-2 py-2 text-sm font-medium transition-colors duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${link} ${show}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            className={`whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium transition-colors duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${link}`}
          >
            Log in
          </Link>
          <Link href="/signup" className="btn btn-sm btn-brand group ml-1">
            Start free
            <ArrowRight
              aria-hidden
              className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}

const FOOTER_LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/connect", label: "MCP connectors" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Sign up" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <BrandMark className="h-6 w-6" />
          <span className="font-semibold text-foreground">Deooch Forms</span>
          <span>© {new Date().getUTCFullYear()}</span>
        </Link>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded transition-colors duration-100 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
