import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import { Article, Faq } from "@/components/marketing/Article";
import { postBySlug } from "@/lib/content";
import { MCP_URL } from "@/lib/site";

const post = postBySlug("what-is-an-mcp-connector")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: "/blog/what-is-an-mcp-connector" },
  keywords: [
    "what is an MCP connector",
    "Model Context Protocol",
    "MCP server",
    "AI connector",
    "MCP forms",
  ],
};

const FAQS = [
  {
    q: "What is an MCP connector?",
    a: "An MCP connector is a server that exposes a tool's capabilities to AI assistants over the Model Context Protocol, an open standard maintained by Anthropic and adopted across the industry. Instead of every AI app writing a bespoke integration for every tool, a tool ships one MCP server and every MCP-capable assistant can use it.",
  },
  {
    q: "What is the difference between an MCP server and an MCP connector?",
    a: "They are usually the same thing described from opposite ends. The tool vendor builds an MCP server; you add it to your assistant as a connector. Some products use 'connector' specifically for a hosted remote server you add by URL, as opposed to a local server you install.",
  },
  {
    q: "Is MCP secure?",
    a: "The protocol supports OAuth, so a remote connector can authenticate you the same way any other web app does, without you storing an API key in a config file. The real security boundary is the tool list: a server can only do what its tools expose, so read them before connecting. A server with no delete tool cannot delete anything.",
  },
  {
    q: "Which assistants support MCP connectors?",
    a: "Claude, ChatGPT with custom connectors enabled, Cursor, Windsurf, Zed, and a growing set of smaller clients. Remote servers reached over HTTPS work in web clients; local stdio servers generally do not.",
  },
];

export default function WhatIsMcpPost() {
  return (
    <PublicShell>
      <Article
        section="blog"
        slug={post.slug}
        title={post.title}
        description={post.description}
        date={post.date}
      >
        <p>
          An <strong>MCP connector</strong> is a standard way to let an AI
          assistant use a tool you already have. MCP stands for{" "}
          <strong>Model Context Protocol</strong> — an open standard, originally
          from Anthropic, now supported across most AI clients. The usual analogy
          is USB-C: one plug shape, so every device does not need its own cable.
        </p>

        <h2 id="problem">The problem it solves</h2>
        <p>
          Before MCP, connecting an assistant to a tool meant someone writing a
          bespoke integration for that specific pair. Ten assistants and ten
          tools meant a hundred integrations that nobody was going to build. In
          practice you did the integration yourself, by hand, in the worst
          possible way: copying data out of one window and pasting it into a
          prompt, then copying the answer back.
        </p>
        <p>
          With MCP, a tool ships <em>one</em> server. Every MCP-capable assistant
          can use it. Ten plus ten instead of ten times ten.
        </p>

        <h2 id="how">How it works</h2>
        <ol>
          <li>
            <strong>The tool exposes tools.</strong> An MCP server declares a
            list of named operations with typed inputs — for a form builder that
            might be <code>create_form</code> or <code>list_submissions</code>.
          </li>
          <li>
            <strong>You add the connector once.</strong> In a remote setup you
            paste an HTTPS URL into your assistant&apos;s settings and sign in
            through the browser with OAuth. No key to copy or store.
          </li>
          <li>
            <strong>The assistant calls tools when they help.</strong> You write
            plain English; the assistant decides which tool to call, calls it,
            and works the result into its reply.
          </li>
        </ol>
        <p>
          The important consequence: <strong>the tool list is the permission
          model</strong>. An assistant cannot do something the server does not
          expose, no matter how it is asked. This is why reading a connector&apos;s
          tool list is a genuinely useful thirty seconds — it tells you more than
          any security page.
        </p>

        <h2 id="remote-vs-local">Remote versus local connectors</h2>
        <ul>
          <li>
            <strong>Remote (hosted).</strong> The vendor runs the server; you add
            a URL. Works in web clients like ChatGPT and Claude on the web.
            Authentication is normally OAuth.
          </li>
          <li>
            <strong>Local (stdio).</strong> You install and run the server on
            your own machine, usually via a config file. Good for developer tools
            and local files, awkward for a web client, and it needs credentials
            on disk.
          </li>
        </ul>
        <p>
          If you mainly use an assistant in a browser, check that a connector is
          offered as a hosted endpoint before getting attached to it.
        </p>

        <h2 id="forms">What this looks like for forms</h2>
        <p>
          Forms are a good fit, because the work has always been split awkwardly
          across two places: building the form in one tool, then reading the
          answers in a spreadsheet. Connected over MCP, both sides move into the
          conversation:
        </p>
        <pre>
          <code>{`Create a customer feedback form with a rating and a
comment box, then tell me what people say once
responses start coming in.`}</code>
        </pre>
        <p>
          Deooch Forms is a form builder with exactly this in mind. The connector
          is a hosted endpoint at <code>{MCP_URL}</code>, authenticated with
          OAuth, exposing six tools — create, update and read forms, and read
          submissions. No delete tool, no billing access. It is on every plan,
          including the free one, and it is published to the MCP Registry as{" "}
          <code>io.github.musaib001/deooch-forms</code>.
        </p>

        <Faq items={FAQS} />

        <h2>Further reading</h2>
        <ul>
          <li>
            <Link href="/docs/mcp-server">
              The Deooch Forms MCP server: setup and tool reference
            </Link>
          </li>
          <li>
            <Link href="/blog/ai-form-mcp-connectors">
              AI form MCP connectors, compared
            </Link>
          </li>
          <li>
            <Link href="/blog/build-forms-with-claude">
              Building a form with Claude, end to end
            </Link>
          </li>
        </ul>
      </Article>
    </PublicShell>
  );
}
