import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/portal/Container";

export const metadata: Metadata = { title: "Connect an AI — deoochform" };

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.deooch.com";
const MCP_URL = `${APP_URL}/api/mcp`;

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
    cause:
      "No token, a revoked token, or a typo in the Authorization header. Claude Code shows the connection as failed when you run /mcp.",
    fix: "Run /mcp and re-authenticate. If you used a token, check it wasn't revoked on the Connected apps page, then re-add the server with a fresh one.",
  },
  {
    code: "Form not found.",
    cause:
      "The form id is wrong, the form was deleted — or you're on the Free plan and the form belongs to a teammate. Free tokens only reach forms you created.",
    fix: "Ask Claude to list your forms first and use an id from that list. If the form is a teammate's, ask a workspace owner to run it, or upgrade.",
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
    fix: `Remove and re-add it: claude mcp remove deoochform, then re-run the add command with exactly ${MCP_URL}.`,
  },
  {
    code: "Browser doesn't open during /mcp login",
    cause: "Claude Code can't launch a browser (common over SSH or in a container).",
    fix: "Copy the URL Claude Code prints into any browser, sign in there, and the CLI picks the session up. Or use the API token method instead — it needs no browser.",
  },
];

const FAQS = [
  {
    q: "Do I need an API token if I use Claude Code?",
    a: "No. The OAuth method (Option 1) signs you in through the browser and Claude Code stores the connection for you. Tokens are for headless setups — CI, servers, scripts — or clients that can't do OAuth.",
  },
  {
    q: "Where do I get an API token?",
    a: "On the Connected apps page. Tokens start with dff_ and are shown only once at creation, so copy it right away. Lost it? Revoke it and create a new one.",
  },
  {
    q: "What can Claude actually see?",
    a: "Only what the six tools expose: your forms and their responses. Claude can create and edit forms and read submissions. It can't touch billing, members, or other workspaces.",
  },
  {
    q: "Does this work with ChatGPT, Gemini, or other AI assistants?",
    a: `Yes — any MCP client that supports remote HTTP servers, including Claude Desktop, claude.ai, ChatGPT, Gemini, and DeepSeek. Add ${MCP_URL} as a custom connector and sign in when prompted.`,
  },
  {
    q: "How do I disconnect?",
    a: "Revoke the connection on the Connected apps page — it stops working immediately. In Claude Code, also run claude mcp remove deoochform to drop it from your config.",
  },
  {
    q: "Is the connection per-user or per-workspace?",
    a: "Per user. Your connection acts as you, with your role and plan. Teammates connect with their own accounts.",
  },
];

export default function ConnectPage() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Connect an AI
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build forms and read responses by asking Claude, ChatGPT, Gemini,
            DeepSeek, or any MCP-compatible assistant, straight from your
            terminal. Takes about a minute.
          </p>
        </div>

        <section className="mb-10">
          <FlowDiagram />
        </section>

        <section className="mb-10">
          <h2 className="mb-1 text-base font-bold text-foreground">
            Option 1 — Claude Code (recommended)
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Signs you in through the browser. No token to copy or store.
          </p>

          <Step n={1} title="Add the server">
            <p className="mb-3 text-sm text-muted-foreground">
              Run this in your terminal, from any directory:
            </p>
            <Terminal
              lines={[
                { prompt: true, text: `claude mcp add --transport http deoochform ${MCP_URL}` },
                { text: "Added HTTP MCP server deoochform" },
              ]}
            />
          </Step>

          <Step n={2} title="Sign in">
            <p className="mb-3 text-sm text-muted-foreground">
              Start Claude Code, run <Code>/mcp</Code>, pick{" "}
              <strong className="font-semibold text-foreground">deoochform</strong>,
              and choose Authenticate. Your browser opens on deoochform — sign in
              and approve. The tab closes itself.
            </p>
            <Terminal
              lines={[
                { prompt: true, text: "claude" },
                { prompt: true, text: "/mcp" },
                { text: "  deoochform   ⚠ needs authentication  →  Authenticate" },
                { text: "  Opening browser…" },
                { text: "  deoochform   ✔ connected · 6 tools", tone: "ok" },
              ]}
            />
          </Step>

          <Step n={3} title="Try it" last>
            <p className="mb-3 text-sm text-muted-foreground">
              Ask Claude for something in plain English:
            </p>
            <Terminal
              lines={[
                { prompt: true, text: "Create a customer feedback form with a rating and a comment box" },
                { text: "  ⚒ create_form(deoochform)" },
                { text: `  ✔ Created. Public link: ${APP_URL}/f/kx28fq`, tone: "ok" },
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
          <h2 className="mb-1 text-base font-bold text-foreground">
            Option 2 — API token (headless / CI)
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Use this when no browser is available. Create a token on the{" "}
            <Link
              href="/settings/tokens"
              className="font-semibold text-brand hover:text-brand-hover"
            >
              Connected apps
            </Link>{" "}
            page — it&apos;s shown once, so copy it — then:
          </p>
          <Terminal
            lines={[
              {
                prompt: true,
                text: `claude mcp add --transport http deoochform ${MCP_URL} \\\n  --header "Authorization: Bearer dff_your_token_here"`,
              },
            ]}
          />
          <Callout>
            Treat a token like a password. Anyone holding it can read and edit your
            forms. Revoke it on Connected apps the moment it leaks.
          </Callout>
        </section>

        <section className="mb-10">
          <h2 className="mb-1 text-base font-bold text-foreground">
            Other MCP clients
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Claude Desktop, claude.ai, ChatGPT, Gemini, DeepSeek, and anything else
            that speaks remote MCP over HTTP work the same way. Add a custom
            connector pointing at this URL and sign in when prompted:
          </p>
          <Terminal lines={[{ text: MCP_URL }]} />
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-base font-bold text-foreground">
            What Claude can do once connected
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

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still stuck?{" "}
          <a
            href="mailto:help@deooch.com"
            className="font-semibold text-brand hover:text-brand-hover"
          >
            Email us
          </a>{" "}
          and paste the error Claude Code printed.
        </p>
      </div>
    </Container>
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

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
      {children}
    </code>
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
