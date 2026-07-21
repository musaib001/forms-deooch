import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import { Article } from "@/components/marketing/Article";
import { docBySlug } from "@/lib/content";

const doc = docBySlug("submissions-and-exports")!;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/docs/submissions-and-exports" },
};

export default function SubmissionsPage() {
  return (
    <PublicShell>
      <Article section="docs" slug={doc.slug} title={doc.title} description={doc.description}>
        <p>
          Every answer to a published form lands in one place: the form&apos;s
          submissions table in your dashboard. Respondents are anonymous — they
          open the public <code>/f/&lt;slug&gt;</code> link, fill it in, and
          submit, with no account and nothing to install.
        </p>

        <h2 id="table">The submissions table</h2>
        <p>
          One row per response, one column per field, newest first. Click a row
          to see the full response on its own, including long text answers and
          uploaded files that are awkward in a cell. Sort and filter the table to
          find a particular response.
        </p>

        <h2 id="notifications">Email notifications</h2>
        <p>
          Turn on notifications for a form and you get an email each time
          someone submits, with the answers in the body — useful for forms where
          a slow reply is the failure case, like support requests or booking
          enquiries. Leave them off for high-volume forms and read the table
          instead.
        </p>

        <h2 id="export">Exporting to CSV and Excel</h2>
        <p>
          Export the whole table as <strong>CSV</strong> or{" "}
          <strong>Excel (.xlsx)</strong> from the submissions view. Both use one
          row per response with field labels as the header row, so the file opens
          straight into a pivot table or a mail merge without rework.
        </p>
        <ul>
          <li>
            <strong>CSV</strong> — for importing into another system.
          </li>
          <li>
            <strong>Excel</strong> — for reading and analysing as a spreadsheet.
          </li>
        </ul>

        <h2 id="mcp">Reading responses from an AI assistant</h2>
        <p>
          If you have the <Link href="/docs/mcp-server">MCP connector</Link> set
          up, you can skip the dashboard. <code>list_submissions</code> returns
          responses for a form and <code>get_submission</code> returns one by id,
          which means you can ask questions instead of scrolling:
        </p>
        <pre>
          <code>{`Summarise the feedback form responses from this week
and pull out the three most common complaints.`}</code>
        </pre>
        <p>
          The assistant reads the responses through the connector and answers in
          chat. It can read submissions; it cannot delete them.
        </p>

        <h2 id="closing">Closing a form</h2>
        <p>
          Set a form to <strong>closed</strong> when you are done collecting. The
          link keeps working and shows a closed message rather than 404ing, and
          no new responses are accepted. Existing responses and exports are
          unaffected.
        </p>

        <h2 id="limits">Plan limits</h2>
        <p>
          The Free plan covers 50 total submissions across 2 forms. Paid plans
          raise both, and add storage for file uploads — see{" "}
          <Link href="/pricing">pricing</Link>. Submissions already collected are
          never deleted for hitting a limit.
        </p>

        <h2>Next</h2>
        <ul>
          <li>
            <Link href="/docs/field-types">
              Field types, and what each one stores
            </Link>
          </li>
          <li>
            <Link href="/docs/mcp-server">MCP tool reference</Link>
          </li>
        </ul>
      </Article>
    </PublicShell>
  );
}
