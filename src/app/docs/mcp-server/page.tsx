import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import { Article, Faq } from "@/components/marketing/Article";
import { docBySlug } from "@/lib/content";
import { MCP_URL, SITE_URL } from "@/lib/site";

const doc = docBySlug("mcp-server")!;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/docs/mcp-server" },
  keywords: [
    "AI form MCP connector",
    "MCP server for forms",
    "form builder MCP",
    "Claude form builder",
    "ChatGPT form connector",
    "Model Context Protocol forms",
  ],
};

const REGISTRY_NAME = "io.github.musaib001/deooch-forms";

const TOOLS = [
  {
    name: "create_form",
    what: "Create a form and get its public link back.",
    input: "title, description?, fields[]",
    output: "formId, slug, publicUrl",
  },
  {
    name: "update_form",
    what: "Change a form's title, description, fields, or status (draft / published / closed).",
    input: "formId, title?, description?, fields[]?, status?",
    output: "formId, slug, publicUrl, updatedAt",
  },
  {
    name: "get_form",
    what: "Read one form's full definition, including every field.",
    input: "formId",
    output: "formId, title, description, fields[], status, createdAt, updatedAt",
  },
  {
    name: "list_forms",
    what: "List forms in the workspace, newest first.",
    input: "status?, limit (default 20, max 100)",
    output: "forms[] — formId, title, status, submissionCount, createdAt",
  },
  {
    name: "list_submissions",
    what: "List responses to a form.",
    input: "formId, limit (default 50, max 200)",
    output: "submissions[] — submissionId, answers, submittedAt",
  },
  {
    name: "get_submission",
    what: "Read one response by id.",
    input: "submissionId",
    output: "submissionId, formId, answers, submittedAt",
  },
];

const FAQS = [
  {
    q: "What is an AI form MCP connector?",
    a: "An MCP connector is a server that speaks the Model Context Protocol, an open standard for giving AI assistants access to external tools. A form MCP connector lets an assistant such as Claude or ChatGPT create forms, edit their fields, and read the responses without you opening a dashboard. Deooch Forms exposes six such tools at " + MCP_URL + ".",
  },
  {
    q: "Which AI assistants work with Deooch Forms?",
    a: "Any client that supports remote MCP servers over HTTP — Claude (desktop, web, and Claude Code), ChatGPT, Cursor, Windsurf, Zed, and the many smaller MCP clients. In ChatGPT we're listed in the app directory, so you can install us by name; everywhere else you add the same URL. Sign-in happens in the browser via OAuth.",
  },
  {
    q: "Do I need an API key?",
    a: "No. The connector uses OAuth, so the first call opens a browser, you sign in and approve, and the client stores the token itself. There is no key to paste or keep in a config file. You can revoke the connection at any time from the Connected apps page.",
  },
  {
    q: "Can the assistant delete my forms or see my billing?",
    a: "No. The six tools are the entire surface: forms and their submissions. There is no delete tool, and nothing exposes billing, workspace members, or other workspaces. update_form can change a form's status to closed, which stops new responses without destroying anything.",
  },
  {
    q: "Is the connection per-user or per-workspace?",
    a: "Per user. The connection acts as you, with your role and your plan. Teammates connect with their own accounts. On the Free plan a connection only reaches forms you created; Owner and Member roles on paid plans reach the whole workspace.",
  },
  {
    q: "Is Deooch Forms in the MCP Registry?",
    a: `Yes — it is published as ${REGISTRY_NAME}. Clients that browse the registry can install it from there; everyone else adds ${MCP_URL} as a custom connector.`,
  },
];

export default function McpServerDocPage() {
  return (
    <PublicShell>
      <Article section="docs" slug={doc.slug} title={doc.title} description={doc.description}>
        <p>
          Deooch Forms ships an <strong>MCP server</strong> — a remote Model
          Context Protocol endpoint that turns any MCP-capable AI assistant into
          a form builder. You describe the form you want in chat; the assistant
          calls <code>create_form</code>; you get a public link back. When the
          responses come in, the same assistant reads them with{" "}
          <code>list_submissions</code>.
        </p>
        <p>
          The endpoint is <code>{MCP_URL}</code>. It speaks streamable HTTP,
          authenticates with OAuth (no API key to paste), and is published to the
          MCP Registry as <code>{REGISTRY_NAME}</code>.
        </p>

        <h2 id="connect">Connecting a client</h2>
        <p>
          Every client is the same three steps: add a remote/custom MCP
          connector, paste the URL, sign in when the browser opens.
        </p>
        <ol>
          <li>
            <strong>Claude</strong> — Settings → Connectors → Add custom
            connector → paste <code>{MCP_URL}</code>.
          </li>
          <li>
            <strong>ChatGPT</strong> — search{" "}
            <strong>deooch</strong> in the app directory and hit Install plugin;
            no URL to paste. Failing that, Settings → Connectors → Create custom
            connector, which needs a plan that supports them (Plus, Pro, or
            Business) with developer mode enabled.
          </li>
          <li>
            <strong>Cursor, Windsurf, Zed, and other config-file clients</strong>{" "}
            — add the server to the client&apos;s MCP config:
          </li>
        </ol>
        <pre>
          <code>{`{
  "mcpServers": {
    "deooch-forms": {
      "url": "${MCP_URL}"
    }
  }
}`}</code>
        </pre>
        <p>
          The first tool call opens a browser for sign-in. After you approve, the
          connection appears on your Connected apps page and the client stores
          its own token. Per-client screenshots and the errors people actually
          hit live on the{" "}
          <Link href="/connect">MCP connector walkthrough</Link>.
        </p>

        <h2 id="tools">Tool reference</h2>
        <p>
          Six tools, no more. <code>list_forms</code> is usually the first call —
          the other tools take a <code>formId</code>, and this is where you get
          one.
        </p>
        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>What it does</th>
              <th>Input</th>
              <th>Returns</th>
            </tr>
          </thead>
          <tbody>
            {TOOLS.map((tool) => (
              <tr key={tool.name}>
                <td>
                  <code>{tool.name}</code>
                </td>
                <td>{tool.what}</td>
                <td className="font-mono text-[13px]">{tool.input}</td>
                <td className="font-mono text-[13px]">{tool.output}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Editing an existing form</h3>
        <p>
          <code>update_form</code> replaces the whole <code>fields</code> array
          rather than patching it. Read the form first with{" "}
          <code>get_form</code>, apply the edit to the array you got back, and
          send the full array. Assistants handle this correctly on their own —
          it matters if you are driving the tools programmatically.
        </p>

        <h3>Field shape</h3>
        <p>
          Each entry in <code>fields</code> is an object with{" "}
          <code>id</code>, <code>type</code>, <code>label</code>,{" "}
          <code>required</code>, <code>order</code>, and optionally{" "}
          <code>placeholder</code>, <code>helpText</code>, and{" "}
          <code>options</code> for choice fields. See{" "}
          <Link href="/docs/field-types">field types</Link> for the full list of
          14 types.
        </p>
        <pre>
          <code>{`{
  "title": "Customer feedback",
  "fields": [
    { "id": "name",   "type": "text",     "label": "Your name",  "required": true,  "order": 0 },
    { "id": "rating", "type": "radio",    "label": "How did we do?", "required": true, "order": 1,
      "options": ["Great", "Fine", "Not great"] },
    { "id": "notes",  "type": "textarea", "label": "Anything else?", "required": false, "order": 2 }
  ]
}`}</code>
        </pre>

        <h2 id="permissions">What the connector can and cannot reach</h2>
        <ul>
          <li>
            <strong>Can:</strong> create forms, edit fields, publish or close a
            form, list forms, read submissions.
          </li>
          <li>
            <strong>Cannot:</strong> delete forms, touch billing, add or remove
            workspace members, or reach another workspace.
          </li>
          <li>
            <strong>Acts as you:</strong> the connection carries your role and
            plan. Free-plan connections are scoped to forms you created.
          </li>
        </ul>
        <p>
          Revoke a connection from Connected apps in Settings and it stops
          working immediately.
        </p>

        <h2 id="errors">Common errors</h2>
        <ul>
          <li>
            <strong>401 Unauthorized</strong> — the connection was revoked or
            sign-in never finished. Remove the connector and add it again.
          </li>
          <li>
            <strong>Form not found</strong> — wrong <code>formId</code>, the form
            was deleted, or it belongs to a teammate and you are on the Free
            plan. Call <code>list_forms</code> and use an id from that list.
          </li>
          <li>
            <strong>Connection closed / server not responding</strong> — almost
            always a malformed URL. It must be exactly <code>{MCP_URL}</code>,
            with the <code>/api/mcp</code> path and <code>https</code>.
          </li>
          <li>
            <strong>Plan limit</strong> — Free accounts get 2 forms. Delete one
            or <Link href="/pricing">upgrade</Link>.
          </li>
        </ul>

        <Faq items={FAQS} />

        <h2>Next</h2>
        <ul>
          <li>
            <Link href="/blog/build-forms-with-claude">
              A worked example: building a form with Claude end to end
            </Link>
          </li>
          <li>
            <Link href="/blog/ai-form-mcp-connectors">
              How the form-builder MCP connectors compare
            </Link>
          </li>
          <li>
            <Link href="/docs/submissions-and-exports">
              Reading responses and exporting to Excel
            </Link>
          </li>
        </ul>
        <p>
          Ready to try it? <Link href={`${SITE_URL}/signup`}>Create a free account</Link> —
          2 forms and 50 submissions, no card.
        </p>
      </Article>
    </PublicShell>
  );
}
