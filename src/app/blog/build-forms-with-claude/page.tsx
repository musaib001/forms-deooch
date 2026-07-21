import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import { Article, Faq } from "@/components/marketing/Article";
import { postBySlug } from "@/lib/content";
import { MCP_URL } from "@/lib/site";

const post = postBySlug("build-forms-with-claude")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: "/blog/build-forms-with-claude" },
  keywords: [
    "build a form with Claude",
    "Claude form builder",
    "create forms with AI",
    "AI form builder",
    "MCP form connector",
  ],
};

const FAQS = [
  {
    q: "Can Claude create a form for me?",
    a: "Yes, once you connect a form builder over MCP. Add the Deooch Forms connector at " + MCP_URL + " in Claude's settings, describe the form you want, and Claude calls create_form and returns a public link you can share immediately.",
  },
  {
    q: "Do I need to write any code?",
    a: "No. Connecting the MCP server is pasting a URL into a settings panel and signing in through the browser. Everything after that is plain English in the chat window.",
  },
  {
    q: "Can Claude read the responses too?",
    a: "Yes. list_submissions returns the responses to a form and get_submission returns one by id, so you can ask Claude to summarise or count answers rather than exporting a spreadsheet first.",
  },
];

export default function BuildFormsWithClaudePost() {
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
          Building a form usually means opening a form builder, dragging fields
          around, fiddling with validation, publishing, copying a link, and later
          exporting a spreadsheet to find out what people said. Connected over
          MCP, all of that happens in a chat window. Here is the whole loop, in
          the order you would actually do it.
        </p>

        <h2 id="connect">Step 1 — Connect once</h2>
        <p>
          In Claude, open <strong>Settings → Connectors → Add custom
          connector</strong> and paste:
        </p>
        <pre>
          <code>{MCP_URL}</code>
        </pre>
        <p>
          Claude opens a browser to sign in. Approve, and you are back in the
          chat with the connector live. There is no API key to store — the
          connection uses OAuth, and you can revoke it from Connected apps at any
          time. This is a one-time step; every conversation after this has the
          tools.
        </p>
        <p>
          The same URL works in ChatGPT, Cursor, Windsurf, and Zed. See the{" "}
          <Link href="/docs/mcp-server">MCP docs</Link> for per-client steps.
        </p>

        <h2 id="create">Step 2 — Describe the form</h2>
        <pre>
          <code>{`Create a conference talk submission form. I need the
speaker's name and email, the talk title, an abstract,
which track it fits (Engineering, Design, or Product),
and whether they've spoken before. Name, email, title
and abstract are required.`}</code>
        </pre>
        <p>
          Claude calls <code>create_form</code> and comes back with something
          like:
        </p>
        <pre>
          <code>{`⚒ create_form
✔ Created "Conference talk submission"
  https://forms.deooch.com/f/kx28fq`}</code>
        </pre>
        <p>
          That link is live. It renders a real form with an email field that
          validates as an email, a single-choice track selector, and a long-text
          abstract box — because Claude picked{" "}
          <Link href="/docs/field-types">field types</Link>, not just labels.
        </p>

        <h2 id="edit">Step 3 — Change your mind</h2>
        <p>Forms are never right first time. Say what is wrong:</p>
        <pre>
          <code>{`Add a "talk length" question with 20 or 40 minutes,
put it after the track, and make the abstract help text
say 200 words maximum.`}</code>
        </pre>
        <p>
          Claude reads the form with <code>get_form</code>, applies the edit, and
          sends the full field array back through <code>update_form</code>. The
          link does not change, so anything you already shared keeps working.
        </p>
        <p>
          You can also open the form in the studio and drag things around. It is
          the same form either way — the chat and the visual builder are two
          views of one record, not two products.
        </p>

        <h2 id="publish">Step 4 — Publish and share</h2>
        <p>
          Ask Claude to publish it, or flip the status in the dashboard. The
          public link works for anyone — respondents do not sign in, install
          anything, or create an account.
        </p>

        <h2 id="read">Step 5 — Ask what people said</h2>
        <p>
          This is the part that changes the shape of the work. Instead of
          exporting a CSV and reading 80 rows:
        </p>
        <pre>
          <code>{`How many talk submissions have come in, what's the
split across tracks, and which three abstracts are the
strongest fit for a beginner audience?`}</code>
        </pre>
        <p>
          Claude calls <code>list_submissions</code>, reads the answers, and
          answers the question. The responses are still in the dashboard, still
          exportable to{" "}
          <Link href="/docs/submissions-and-exports">CSV or Excel</Link> — you
          just did not have to go and get them.
        </p>

        <h2 id="limits">What it will not do</h2>
        <p>
          The connector exposes six tools and nothing else. Claude can create
          forms, edit them, publish or close them, and read responses. It cannot
          delete a form, touch billing, change workspace members, or see another
          workspace. If a request falls outside those six tools, it simply has no
          way to act on it.
        </p>

        <Faq items={FAQS} />

        <h2>Try it</h2>
        <p>
          <Link href="/signup">Create a free account</Link> — 2 forms and 50
          submissions, no card — then add <code>{MCP_URL}</code> as a connector
          and describe the first form you need. If you are weighing the options,{" "}
          <Link href="/blog/ai-form-mcp-connectors">
            the connector comparison
          </Link>{" "}
          covers the alternatives honestly.
        </p>
      </Article>
    </PublicShell>
  );
}
