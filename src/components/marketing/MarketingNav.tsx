import Link from "next/link";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
            d
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            deoochform
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/pricing"
            className="px-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="px-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"
          >
            Sign up free
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getUTCFullYear()} deoochform</p>
        <div className="flex gap-5">
          <Link href="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <a href="mailto:help@deooch.com" className="hover:text-foreground">
            Support
          </a>
          <Link href="/login" className="hover:text-foreground">
            Login
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
