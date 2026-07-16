"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";

function UrlError() {
  const error = useSearchParams().get("error");
  if (!error) return null;
  return (
    <p
      role="alert"
      className="mb-4 rounded-lg border border-destructive/30 bg-destructive-subtle px-4 py-3 text-sm text-destructive"
    >
      Sign-in failed. Please try again.
    </p>
  );
}

function LoginActions() {
  const next = useSearchParams().get("next") ?? undefined;
  return (
    <>
      <GoogleButton label="Continue with Google" next={next} />

      <Divider />

      <EmailAuthForm mode="login" next={next} />
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to build and manage your forms.
        </p>
      </div>

      <Suspense fallback={null}>
        <UrlError />
      </Suspense>

      <Suspense fallback={null}>
        <LoginActions />
      </Suspense>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:text-brand-hover">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        or
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
