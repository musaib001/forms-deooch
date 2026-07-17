"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type NavItem = { href: string; label: string };

export function TopBar({
  email,
  fullName,
  role,
  plan = "free",
}: {
  email: string;
  fullName?: string | null;
  role: string;
  plan?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const nav: NavItem[] = [
    { href: "/dashboard", label: "Forms" },
    ...(role === "owner" ? [{ href: "/settings/members", label: "Members" }] : []),
    { href: "/settings/tokens", label: "Connected apps" },
    { href: "/connect", label: "Connect an AI" },
    { href: "/support", label: "Support" },
  ];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  // Pre-name accounts have full_name null and fall back to email.
  const displayName = fullName?.trim() || email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-slate-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-4 sm:px-6">
        <Link href="/dashboard" className="mr-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
            d
          </span>
          <span className="hidden text-base font-bold tracking-tight text-white sm:inline">
            deoochform
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                  (active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
        {plan === "free" && (
          <Link
            href="/pricing"
            className="hidden h-8 items-center rounded-lg bg-brand px-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex"
          >
            Upgrade
          </Link>
        )}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground ring-2 ring-white/20 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            {initial}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
            >
              <div className="border-b border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="truncate text-sm font-medium text-foreground" title={displayName}>
                  {displayName}
                </p>
                {fullName?.trim() && (
                  <p className="truncate text-xs text-muted-foreground" title={email}>
                    {email}
                  </p>
                )}
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="rounded-full bg-brand-subtle px-2 py-0.5 font-semibold capitalize text-brand">
                    {plan} plan
                  </span>
                  <Link
                    href="/pricing"
                    role="menuitem"
                    className="font-medium text-brand hover:text-brand-hover"
                  >
                    View plans
                  </Link>
                </p>
              </div>
              <Link
                href="/support"
                role="menuitem"
                className="block w-full px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
              >
                Support
              </Link>
              <button
                onClick={signOut}
                role="menuitem"
                className="w-full px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
