import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import { Article, Faq } from "@/components/marketing/Article";
import { postBySlug } from "@/lib/content";
import { MCP_URL } from "@/lib/site";

const post = postBySlug("ai-form-mcp-connectors")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: "/blog/ai-form-mcp-connectors" },
  keywords: [
    "AI form MCP connector",
    "form builder MCP server",
    "Tally MCP alternative",
    "Typeform MCP",
    "Cognito Forms MCP connector",
    "MCP forms",
  ],
};

const FAQS = [
  {
    q: "What is the best MCP connector for forms?",
    a: "It depends on what you want the assistant to do. If you want it to create forms from a plain-English description and read the responses back, pick a connector with both write and read tools — Deooch Forms, Tally MCP, and Cognito Forms all cover that ground. If you only need to query existing responses in a form tool your team already pays for, the connector from that vendor is the pragmatic choice.",
  },
  {
    q: "Do MCP form connectors work with ChatGPT as well as Claude?",
    a: "Remote MCP servers work with any client that supports the protocol over HTTP, which now includes Claude, ChatGPT with custom connectors enabled, Cursor, Windsurf, and Zed. A connector that only ships as a local stdio server is harder to use from a web client, so check whether a vendor offers a hosted HTTPS endpoint.",
  },
  {
    q: "Is it safe to let an AI assistant edit my forms?",
    a: "It depends on the tool surface the connector exposes. Read the tool list before connecting: a connector with no delete tool cannot delete anything, no matter what the assistant is asked. Deooch Forms exposes six tools — create, update, and read forms and submissions — with no delete and no access to billing or workspace members.",
  },
  {
    q: "What does an MCP connector cost?",
    a: "Usually nothing beyond the form tool's own plan; the connector is a feature rather than a separate product. Some vendors gate it behind higher tiers. Deooch Forms includes the MCP server on every plan, including the free one.",
  },
];

export default function AiFormMcpConnectorsPost() {
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
          Most form builders have shipped a Model Context Protocol server in the
          past year. They are not the same product. Some let an assistant author
          a form from scratch; some only let it read what has already come in.
          Some are hosted endpoints you paste into a settings panel; some are
          local processes you install. Here is the honest map, and where Deooch
          Forms sits on it.
        </p>
        <p>
          Details change — treat this as a starting point and check each
          vendor&apos;s own docs before committing.
        </p>

        <h2 id="what-to-compare">The four things that actually differ</h2>
        <ol>
          <li>
            <strong>Can it create a form, or only read one?</strong> This is the
            big split. Read-only connectors are a reporting tool. Write-capable
            connectors replace the form-building session entirely.
          </li>
          <li>
            <strong>Remote or local?</strong> A hosted HTTPS endpoint works from
            ChatGPT and Claude on the web. A local stdio server does not.
          </li>
          <li>
            <strong>What is in the tool surface?</strong> The tools are the
            permission model. No delete tool means nothing gets deleted.
          </li>
          <li>
            <strong>Which plan is it on?</strong> Several vendors put the
            connector behind an upper tier.
          </li>
        </ol>

        <h2 id="deooch">Deooch Forms</h2>
        <p>
          A form builder with the MCP server as the point rather than an add-on.
          The endpoint is <code>{MCP_URL}</code>, hosted, OAuth-authenticated, and
          included on every plan including the free one. Six tools:{" "}
          <code>create_form</code>, <code>update_form</code>, <code>get_form</code>
          , <code>list_forms</code>, <code>list_submissions</code>,{" "}
          <code>get_submission</code>.
        </p>
        <ul>
          <li>
            <strong>Create from a description.</strong> &ldquo;A workshop signup
            with name, email, session choice, and dietary requirements&rdquo;
            becomes a published form with a shareable link in one turn.
          </li>
          <li>
            <strong>Read responses back in the same conversation.</strong> Ask
            for a summary of this week&apos;s feedback instead of exporting a CSV
            and reading it yourself.
          </li>
          <li>
            <strong>No delete tool.</strong> The assistant can close a form to
            stop new responses; it cannot destroy one. Billing and workspace
            members are outside the surface entirely.
          </li>
          <li>
            <strong>Respondents never sign in.</strong> Forms are public links.
          </li>
          <li>
            <strong>Published to the MCP Registry</strong> as{" "}
            <code>io.github.musaib001/deooch-forms</code>.
          </li>
        </ul>
        <p>
          Where it is weaker: it is a younger product than the incumbents below,
          with a smaller template library and no long tail of third-party
          integrations. If you need deep Salesforce or HubSpot wiring today, that
          is a real gap.
        </p>
        <p>
          <Link href="/docs/mcp-server">Setup and full tool reference →</Link>
        </p>

        <h2 id="tally">Tally MCP</h2>
        <p>
          Tally offers a free MCP server that lets an assistant create, update,
          and retrieve form data, with guardrails limiting destructive
          operations. A sensible pick if you are already a Tally user and like
          its free tier, which is unusually generous.
        </p>

        <h2 id="typeform">Typeform MCP</h2>
        <p>
          Typeform&apos;s connector is OAuth-based and oriented toward asking
          questions about forms and responses and completing actions
          conversationally. The obvious choice if your team already builds in
          Typeform and mainly wants a conversational way to query results.
        </p>

        <h2 id="cognito">Cognito Forms MCP Connector</h2>
        <p>
          Cognito Forms exposes an MCP connector that lets AI apps create forms
          from plain-language descriptions, manage submissions, and retrieve form
          documents — positioned at its enterprise tier. Worth a look if you need
          Cognito&apos;s heavier calculation and workflow features and can meet
          the plan requirement.
        </p>

        <h2 id="others">FormHug, FormDesigner, and the long tail</h2>
        <p>
          Several smaller servers turn an MCP client into a form interface —
          FormHug offers a remote server for managing entries and editing fields
          without opening a dashboard, and FormDesigner exposes form creation and
          editing to AI clients. Newer and less proven than the names above, but
          the whole point of an open protocol is that switching costs are low.
        </p>

        <h2 id="choosing">How to choose in five minutes</h2>
        <ul>
          <li>
            <strong>Already committed to a form tool?</strong> Use its connector.
            Migrating forms to get a marginally better tool surface is rarely
            worth it.
          </li>
          <li>
            <strong>Starting fresh and want AI-first authoring?</strong> Pick a
            product where the connector was designed in rather than retrofitted,
            and check that <code>create_form</code> is in the tool list.
          </li>
          <li>
            <strong>Using ChatGPT or Claude on the web?</strong> Confirm the
            connector is a hosted HTTPS endpoint, not a local install.
          </li>
          <li>
            <strong>Nervous about access?</strong> Read the tool list, not the
            marketing page. It is the whole permission model, and it takes thirty
            seconds.
          </li>
        </ul>

        <Faq items={FAQS} />

        <h2>Try the Deooch Forms connector</h2>
        <p>
          Add <code>{MCP_URL}</code> as a custom connector in Claude, ChatGPT, or
          Cursor, sign in when the browser opens, and ask for a form. The{" "}
          <Link href="/docs/mcp-server">docs</Link> have per-client steps, and the{" "}
          <Link href="/blog/build-forms-with-claude">
            worked example with Claude
          </Link>{" "}
          runs the whole thing end to end. Free plan, no card.
        </p>
      </Article>
    </PublicShell>
  );
}
