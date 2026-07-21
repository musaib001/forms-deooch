import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import { Article } from "@/components/marketing/Article";
import { docBySlug } from "@/lib/content";
import { MCP_URL } from "@/lib/site";

const doc = docBySlug("quickstart")!;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/docs/quickstart" },
};

export default function QuickstartPage() {
  return (
    <PublicShell>
      <Article section="docs" slug={doc.slug} title={doc.title} description={doc.description}>
        <p>
          There are two ways to build a form in Deooch Forms: drag fields around
          in the studio, or describe the form to an AI assistant connected over
          MCP. Both produce the same thing — a form with a public link that
          anyone can fill in without an account.
        </p>

        <h2 id="account">1. Create an account</h2>
        <p>
          <Link href="/signup">Sign up</Link> with Google or an email address.
          The Free plan gives you 2 forms and 50 submissions with no card, which
          is enough to see whether this fits how you work.
        </p>

        <h2 id="build">2. Build the form</h2>
        <h3>In the studio</h3>
        <ol>
          <li>
            From the dashboard, choose <strong>New form</strong> — or start from
            a <Link href="/templates">template</Link> if one is close to what you
            need.
          </li>
          <li>
            Add fields from the palette. Drag to reorder; click a field to set
            its label, help text, placeholder, and whether it is required.
          </li>
          <li>
            Use <strong>Section heading</strong> fields to break a long form into
            named parts. The live preview on the right is the real renderer, so
            what you see is what a respondent gets.
          </li>
        </ol>

        <h3>By asking an AI assistant</h3>
        <p>
          Add <code>{MCP_URL}</code> as a custom connector in Claude, ChatGPT, or
          any MCP client (<Link href="/docs/mcp-server">full setup</Link>), then
          ask for the form in plain English:
        </p>
        <pre>
          <code>{`Create a workshop signup form with name, email,
which session they want (morning or afternoon),
and dietary requirements. Make name and email required.`}</code>
        </pre>
        <p>
          The assistant calls <code>create_form</code> and hands back the public
          link. The form appears on your dashboard immediately, and you can keep
          editing it in the studio — the two are the same form.
        </p>

        <h2 id="publish">3. Publish and share</h2>
        <p>
          A new form starts as a <strong>draft</strong>. Set it to{" "}
          <strong>published</strong> and its link goes live at{" "}
          <code>/f/&lt;slug&gt;</code>. Share that link anywhere — email, Slack, a
          QR code, an embed. Respondents never sign in.
        </p>
        <p>
          When you are done collecting, set the form to <strong>closed</strong>.
          The link keeps working but stops accepting new answers, so nobody hits
          a dead page.
        </p>

        <h2 id="responses">4. Read the responses</h2>
        <p>
          Responses appear in the dashboard as they arrive. Turn on email
          notifications to get pinged per submission, and export the lot to CSV
          or Excel when you need it elsewhere. Details in{" "}
          <Link href="/docs/submissions-and-exports">
            submissions and exports
          </Link>
          .
        </p>
        <p>
          Or ask your assistant: <em>&ldquo;How many people signed up for the
          morning session?&rdquo;</em> It calls <code>list_submissions</code> and
          counts them for you.
        </p>

        <h2>Next</h2>
        <ul>
          <li>
            <Link href="/docs/field-types">All 14 field types</Link>
          </li>
          <li>
            <Link href="/docs/mcp-server">MCP server and tool reference</Link>
          </li>
          <li>
            <Link href="/templates">Templates to start from</Link>
          </li>
        </ul>
      </Article>
    </PublicShell>
  );
}
