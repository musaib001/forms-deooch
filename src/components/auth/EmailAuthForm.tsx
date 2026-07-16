"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { isValidEmail } from "@/lib/ui";
import { PasswordField } from "./PasswordField";

type Mode = "login" | "signup";

export function EmailAuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    let ok = true;
    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address.");
      ok = false;
    } else setEmailError(undefined);

    if (mode === "signup" && password.length < 8) {
      setPasswordError("Use at least 8 characters.");
      ok = false;
    } else if (!password) {
      setPasswordError("Enter your password.");
      ok = false;
    } else setPasswordError(undefined);

    return ok;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setLoading(false);
      if (error) {
        setFormError(error.message);
        return;
      }
      setSent(true);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setFormError(
        error.message.toLowerCase().includes("confirm")
          ? "Please confirm your email first — check your inbox."
          : "Incorrect email or password."
      );
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-subtle text-brand">
          <MailIcon />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          Confirm your email
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account, then sign in.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-semibold text-brand hover:text-brand-hover"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {formError && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive-subtle px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoFocus
          autoComplete="email"
          spellCheck={false}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailError ? "true" : undefined}
          aria-describedby={emailError ? "email-error" : undefined}
          className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive"
        />
        {emailError && (
          <p id="email-error" role="alert" className="text-[13px] font-medium text-destructive">
            {emailError}
          </p>
        )}
      </div>

      <PasswordField
        id="password"
        label="Password"
        value={password}
        onChange={setPassword}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        error={passwordError}
        hint={mode === "signup" ? "At least 8 characters." : undefined}
      />

      {mode === "login" && (
        <Link
          href="/auth/forgot"
          className="-mt-1 self-end text-[13px] font-medium text-brand hover:text-brand-hover"
        >
          Forgot password?
        </Link>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-brand-foreground transition-[background-color,transform] duration-150 hover:bg-brand-hover active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:active:translate-y-0"
      >
        {loading && (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground"
          />
        )}
        {mode === "signup"
          ? loading
            ? "Creating account…"
            : "Create account"
          : loading
            ? "Signing in…"
            : "Sign in"}
      </button>
    </form>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}
