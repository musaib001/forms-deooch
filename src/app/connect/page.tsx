import type { Metadata } from "next";
import Link from "next/link";
import { getSessionProfile } from "@/lib/auth/session";
import { SITE_URL, MCP_URL } from "@/lib/site";
import { Container } from "@/components/portal/Container";
import { TopBar } from "@/components/portal/TopBar";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingNav";

export const metadata: Metadata = {
  title: "MCP connectors",
  description:
    "Connect any MCP-compatible AI assistant and build forms by describing them.",
};

const TOOLS = [
  ["create_form", "Create a form and get its public link back."],
  ["update_form", "Change a form's title, description, fields, or status."],
  ["get_form", "Read one form's full definition."],
  ["list_forms", "List forms in your workspace."],
  ["list_submissions", "List responses for a form."],
  ["get_submission", "Read one response by id."],
];

const ERRORS = [
  {
    code: "401 Unauthorized",
    cause: "The connection was revoked, or the sign-in never completed.",
    fix: "Remove the connector and add it again so you're sent through sign-in from scratch.",
  },
  {
    code: "Form not found.",
    cause:
      "The form id is wrong, the form was deleted — or you're on the Free plan and the form belongs to a teammate. Free accounts only reach forms you created.",
    fix: "Ask your assistant to list your forms first and use an id from that list. If the form is a teammate's, ask a workspace owner, or upgrade.",
  },
  {
    code: "Your plan is limited to N forms. Upgrade to create more.",
    cause: "You hit the form quota for your plan. Free accounts get 2 forms.",
    fix: "Delete a form you no longer need, or upgrade on the pricing page.",
  },
  {
    code: "Connection closed / server not responding",
    cause:
      "Usually a wrong URL — a missing /api/mcp on the end, or http instead of https.",
    fix: `Remove the connector and re-add it with exactly ${MCP_URL}.`,
  },
  {
    code: "Browser doesn't open during sign-in",
    cause: "Your MCP client can't launch a browser (common over SSH or in a container).",
    fix: "Copy the sign-in URL it prints into any browser and sign in there — the connection picks up automatically once you approve.",
  },
];

const FAQS = [
  {
    q: "What can it actually see?",
    a: "Only what the six tools expose: your forms and their responses. It can create and edit forms and read submissions. It can't touch billing, members, or other workspaces.",
  },
  {
    q: "Which AI assistants does this work with?",
    a: `Any client that supports the Model Context Protocol (MCP) over remote HTTP. Add ${MCP_URL} as a custom connector and sign in when prompted.`,
  },
  {
    q: "How do I disconnect?",
    a: "Revoke the connection on the Connected apps page — it stops working immediately. Remove it from your assistant's settings too, so it stops trying to reconnect.",
  },
  {
    q: "Is the connection per-user or per-workspace?",
    a: "Per user. Your connection acts as you, with your role and plan. Teammates connect with their own accounts.",
  },
];

// Public on purpose: people evaluate the MCP integration before signing up.
// Signed-in visitors keep the portal chrome; everyone else gets marketing nav.
export default async function ConnectPage() {
  const profile = await getSessionProfile();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {profile ? (
        <TopBar
          email={profile.email}
          fullName={profile.full_name}
          role={profile.role}
          plan={profile.plan}
        />
      ) : (
        <MarketingNav />
      )}

      <main className="flex-1">
        <Container>
          <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            MCP connectors
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build forms and read responses by asking any AI assistant that
            supports MCP. Takes about a minute.
          </p>
        </div>

        <section className="mb-10">
          <FlowDiagram />
        </section>

        <section className="mb-10">
          <h2 className="mb-1 text-base font-bold text-foreground">
            Add the connector
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Signs you in through the browser. No token to copy or store.
          </p>

          <Step n={1} title="Copy the connector URL">
            <p className="mb-3 text-sm text-muted-foreground">
              This is the address your AI assistant connects to:
            </p>
            <Terminal lines={[{ text: MCP_URL }]} />
          </Step>

          <Step n={2} title="Add it as a custom connector">
            <p className="mb-3 text-sm text-muted-foreground">
              In your AI assistant&apos;s settings, add a new remote MCP connector
              (sometimes called a custom connector or MCP server) and paste in
              the URL above.
            </p>
          </Step>

          <Step n={3} title="Sign in">
            <p className="mb-3 text-sm text-muted-foreground">
              Your assistant opens a browser to deoochform — sign in and
              approve. You&apos;re sent back automatically and the connection
              shows up on{" "}
              <Link
                href="/settings/tokens"
                className="font-semibold text-brand hover:text-brand-hover"
              >
                Connected apps
              </Link>
              .
            </p>
          </Step>

          <Step n={4} title="Try it" last>
            <p className="mb-3 text-sm text-muted-foreground">
              Ask it for something in plain English:
            </p>
            <Terminal
              lines={[
                { prompt: true, text: "Create a customer feedback form with a rating and a comment box" },
                { text: "  ⚒ create_form" },
                { text: `  ✔ Created. Public link: ${SITE_URL}/f/kx28fq`, tone: "ok" },
              ]}
            />
            <p className="mt-3 text-sm text-muted-foreground">
              The form shows up on your{" "}
              <Link href="/dashboard" className="font-semibold text-brand hover:text-brand-hover">
                Forms
              </Link>{" "}
              page right away.
            </p>
          </Step>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2.5">
            <ChatGptLogo />
            <h2 className="text-base font-bold text-foreground">
              Adding it in ChatGPT (web)
            </h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            In the ChatGPT web app you add deoochform as a connector — the same
            place plugins live. Custom connectors need a plan that supports them
            (Plus, Pro, or Business), with developer mode / connectors enabled.
          </p>

          <Step n={1} title="Open Settings → Connectors">
            <p className="mb-3 text-sm text-muted-foreground">
              Click your name in ChatGPT, open{" "}
              <span className="font-semibold text-foreground">Settings</span>,
              then{" "}
              <span className="font-semibold text-foreground">Connectors</span>.
              Choose{" "}
              <span className="font-semibold text-foreground">
                Create / Add custom connector
              </span>
              .
            </p>
          </Step>

          <Step n={2} title="Fill in the connector">
            <p className="mb-3 text-sm text-muted-foreground">
              Name it <span className="font-semibold text-foreground">deoochform</span>,
              paste the MCP URL as the server address, and leave authentication
              set to <span className="font-semibold text-foreground">OAuth</span>.
            </p>
            <Terminal lines={[{ text: MCP_URL }]} />
          </Step>

          <Step n={3} title="Connect and sign in">
            <p className="mb-3 text-sm text-muted-foreground">
              Save, then click{" "}
              <span className="font-semibold text-foreground">Connect</span>.
              ChatGPT opens deoochform&apos;s sign-in — approve it and you&apos;re
              sent back with the connector linked.
            </p>
          </Step>

          <Step n={4} title="Turn it on in a chat" last>
            <p className="text-sm text-muted-foreground">
              In a conversation, open the{" "}
              <span className="font-semibold text-foreground">+</span> (tools)
              menu, enable the deoochform connector, then ask it to build a form.
            </p>
          </Step>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-base font-bold text-foreground">
            What it can do once connected
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {TOOLS.map(([name, desc]) => (
              <div key={name} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-baseline sm:gap-4">
                <code className="shrink-0 font-mono text-xs font-semibold text-brand sm:w-40">
                  {name}
                </code>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-1 text-base font-bold text-foreground">
            When something goes wrong
          </h2>
          <p className="mb-3 text-sm text-muted-foreground">
            The errors people actually hit, and what they mean.
          </p>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {ERRORS.map(({ code, cause, fix }) => (
              <details key={code} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <code className="font-mono text-xs font-semibold text-foreground">
                    {code}
                  </code>
                  <span
                    aria-hidden
                    className="shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-180"
                  >
                    <ChevronDownIcon />
                  </span>
                </summary>
                <div className="space-y-2 px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">Why: </span>
                    {cause}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Fix: </span>
                    {fix}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-base font-bold text-foreground">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  {q}
                  <span
                    aria-hidden
                    className="shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-180"
                  >
                    <ChevronDownIcon />
                  </span>
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </section>

          {!profile && (
            <section className="mb-10 rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                You&apos;ll need an account to connect
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                The connector signs in as you, so your assistant only ever sees
                your own forms. Free to start — no card required.
              </p>
              <Link
                href="/signup"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Sign up free
              </Link>
            </section>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Still stuck?{" "}
            <a
              href="mailto:help@deooch.com"
              className="font-semibold text-brand hover:text-brand-hover"
            >
              Email us
            </a>{" "}
            and paste the error your assistant printed.
          </p>
          </div>
        </Container>
      </main>

      {!profile && <MarketingFooter />}
    </div>
  );
}

function Step({
  n,
  title,
  children,
  last,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="relative pl-11">
      {!last && (
        <span
          aria-hidden
          className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
        />
      )}
      <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-subtle text-sm font-bold text-brand">
        {n}
      </span>
      <h3 className="pt-1 text-sm font-semibold text-foreground">{title}</h3>
      <div className="pb-8 pt-2">{children}</div>
    </div>
  );
}

// ponytail: terminal "screenshots" are styled markup, not images — they stay
// readable, copyable, and correct when the URL or CLI output changes.
function Terminal({
  lines,
}: {
  lines: { text: string; prompt?: boolean; tone?: "ok" }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
      <div className="flex items-center gap-1.5 border-b border-slate-700/70 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
        <span className="ml-2 text-xs font-medium text-slate-400">Terminal</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-xs leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className={line.tone === "ok" ? "text-emerald-400" : "text-slate-300"}>
            {line.prompt && <span className="select-none text-brand">$ </span>}
            {line.text}
          </div>
        ))}
      </pre>
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { label: "You ask your AI", sub: '"Build me a signup form"' },
    { label: "MCP over HTTPS", sub: "signed in as you" },
    { label: "Form in deoochform", sub: "with a public link" },
  ];
  return (
    <div className="flex flex-col items-stretch gap-2 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
      {steps.map((s, i) => (
        <div key={s.label} className="flex flex-1 items-center gap-2">
          <div className="flex-1 rounded-xl bg-muted/50 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-foreground">{s.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
          </div>
          {i < steps.length - 1 && (
            <span aria-hidden className="shrink-0 text-muted-foreground">
              <ArrowIcon />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 rotate-90 sm:rotate-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ChatGptLogo() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A5.98 5.98 0 0 0 10.75.5a6.05 6.05 0 0 0-5.77 4.19 5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .52 4.9 6.05 6.05 0 0 0 6.51 2.91A5.98 5.98 0 0 0 13.25 23.5a6.05 6.05 0 0 0 5.77-4.2 5.98 5.98 0 0 0 4-2.9 6.05 6.05 0 0 0-.74-7.1Zm-8.98 12.5a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.78.78 0 0 0 .4-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.06v5.58a4.5 4.5 0 0 1-4.5 4.49Zm-9.66-4.13a4.48 4.48 0 0 1-.54-3.02l.14.09 4.78 2.76a.78.78 0 0 0 .78 0l5.84-3.37v2.33a.07.07 0 0 1-.03.06l-4.84 2.79a4.5 4.5 0 0 1-6.13-1.64Zm-1.26-10.4a4.48 4.48 0 0 1 2.34-1.97v5.68a.78.78 0 0 0 .39.68l5.84 3.37-2.02 1.17a.07.07 0 0 1-.07 0l-4.83-2.79a4.5 4.5 0 0 1-1.65-6.14Zm16.6 3.86-5.84-3.38 2.02-1.16a.07.07 0 0 1 .07 0l4.83 2.78a4.49 4.49 0 0 1-.68 8.1V12.6a.78.78 0 0 0-.4-.67Zm2.01-3.03-.14-.08-4.77-2.78a.78.78 0 0 0-.79 0L9.7 9.13V6.8a.07.07 0 0 1 .03-.07l4.83-2.78a4.5 4.5 0 0 1 6.68 4.66ZM8.6 12.86l-2.02-1.16a.07.07 0 0 1-.04-.06V6.06a4.5 4.5 0 0 1 7.38-3.45l-.14.08L9 5.45a.78.78 0 0 0-.4.68v6.73Zm1.1-2.37L12.3 9l2.6 1.5v3l-2.6 1.5-2.6-1.5v-3Z" />
      </svg>
    </span>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
