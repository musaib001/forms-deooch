"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

const ERROR_MESSAGES: Record<string, string> = {
  not_invited: "That Google account hasn't been invited to this workspace.",
};

const FEATURES = [
  {
    title: "Build with AI or by hand",
    description:
      "Describe a form to Claude or GPT and it's created instantly — or build it yourself in the portal.",
    icon: SparkleIcon,
  },
  {
    title: "Share one clean link",
    description:
      "Every form gets a stable public link respondents can fill out — no account required.",
    icon: LinkIcon,
  },
  {
    title: "Export responses anytime",
    description:
      "Browse submissions in a searchable table or download the full set as an Excel file.",
    icon: TableIcon,
  },
];

async function signInWithGoogle() {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}

function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;

  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive-subtle px-4 py-3 text-sm text-destructive"
    >
      {ERROR_MESSAGES[error] ?? "Sign-in failed. Please try again."}
    </p>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-2 px-6 py-5 lg:px-10">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
          d
        </span>
        <span className="text-base font-semibold tracking-tight text-foreground">
          deoochform
        </span>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-12 px-6 py-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <section className="hidden max-w-md lg:block">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            AI-native form builder
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-foreground">
            Forms that build themselves.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Create, share, and analyze forms without leaving your chat with
            Claude — or build them by hand when you want full control.
          </p>

          <ul className="mt-10 flex flex-col gap-6">
            {FEATURES.map(({ title, description, icon: Icon }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand">
                  <Icon />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Sign in to your workspace
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use your invited Google account to continue.
              </p>
            </div>

            <div className="space-y-4">
              <Suspense fallback={null}>
                <LoginError />
              </Suspense>
              <button
                onClick={signInWithGoogle}
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground lg:text-left">
              Access is invite-only. Contact your workspace owner if you need
              an invite.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 10v10" />
    </svg>
  );
}
