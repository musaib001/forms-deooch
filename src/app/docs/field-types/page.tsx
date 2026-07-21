import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import { Article } from "@/components/marketing/Article";
import { docBySlug } from "@/lib/content";

const doc = docBySlug("field-types")!;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/docs/field-types" },
};

// Mirrors FIELD_TYPE_LABELS in lib/forms/schema.ts. Kept as prose rather than
// generated from the enum: the point of the page is the "when to use it"
// column, which the schema doesn't know about.
const FIELDS = [
  ["text", "Short text", "One line of free text — names, job titles, reference numbers."],
  ["textarea", "Long text", "A multi-line box for anything open-ended: feedback, descriptions, questions."],
  ["email", "Email", "Validated as an email address before the form will submit. Use this rather than a text field if you plan to reply."],
  ["phone", "Phone", "Digits, formatted as the respondent types."],
  ["address", "Address", "A grouped street / city / region / postcode block instead of one free-text line."],
  ["number", "Number", "Numeric input only — quantities, ages, budgets."],
  ["select", "Dropdown", "One answer from a list, collapsed. Best above roughly six options."],
  ["radio", "Single choice", "One answer from a list, all options visible. Best for two to six options."],
  ["checkbox", "Multiple choice", "Any number of answers from a list."],
  ["date", "Date", "A native date picker — no format ambiguity between regions."],
  ["file", "File link", "A URL pointing at a file the respondent already hosts."],
  ["upload", "File upload", "The respondent uploads the file itself; it is stored with the response."],
  ["signature", "Signature", "A drawn signature, for consent and acknowledgement forms."],
  ["heading", "Section heading", "Display only — collects no answer. Use it to break a long form into named sections."],
] as const;

export default function FieldTypesPage() {
  return (
    <PublicShell>
      <Article section="docs" slug={doc.slug} title={doc.title} description={doc.description}>
        <p>
          Deooch Forms has 14 field types. Thirteen collect an answer; the
          fourteenth, <code>heading</code>, is a section title that collects
          nothing. Each field carries a label, an optional placeholder and help
          text, and a required flag.
        </p>

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Shown as</th>
              <th>When to use it</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map(([type, label, when]) => (
              <tr key={type}>
                <td>
                  <code>{type}</code>
                </td>
                <td>{label}</td>
                <td>{when}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="choice">Choice fields</h2>
        <p>
          <code>select</code>, <code>radio</code>, and <code>checkbox</code> take
          an <code>options</code> array of strings. <code>radio</code> and{" "}
          <code>select</code> both accept exactly one answer — the difference is
          whether the options are visible up front. Show them when there are few,
          collapse them when there are many.
        </p>

        <h2 id="required">Required fields and validation</h2>
        <p>
          Set <code>required: true</code> and the form will not submit without an
          answer. Type-level validation runs on top of that:{" "}
          <code>email</code> must look like an address, <code>number</code>{" "}
          rejects text, <code>date</code> uses a native picker. Validation runs
          in the browser and again on the server, so a crafted request cannot
          slip past it.
        </p>
        <p>
          Requiring everything is the most common mistake. Every required field
          is another reason to abandon the form — mark only what you genuinely
          cannot act without.
        </p>

        <h2 id="sections">Sections</h2>
        <p>
          A <code>heading</code> field renders as a section title in the flow of
          the form. Use them once a form covers more than one topic — Contact
          details, Your project, Consent. Do not open a form with a heading that
          repeats its title; the title already renders above the fields.
        </p>

        <h2 id="ordering">Ordering</h2>
        <p>
          Every field has an <code>order</code> number, which is what the
          renderer sorts on. In the studio you drag; over{" "}
          <Link href="/docs/mcp-server">MCP</Link> you set it explicitly — and
          since <code>update_form</code> replaces the whole array, send fields
          back with their orders already correct.
        </p>

        <h2>Next</h2>
        <ul>
          <li>
            <Link href="/docs/quickstart">Quickstart</Link>
          </li>
          <li>
            <Link href="/docs/submissions-and-exports">
              Where the answers go
            </Link>
          </li>
          <li>
            <Link href="/templates">
              Templates showing these fields in context
            </Link>
          </li>
        </ul>
      </Article>
    </PublicShell>
  );
}
