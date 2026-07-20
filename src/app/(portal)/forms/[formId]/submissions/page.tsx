import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/date";
import { SubmissionsView } from "@/components/submissions/SubmissionsView";

export default async function FormSubmissionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ formId: string }>;
  searchParams: Promise<{ s?: string }>;
}) {
  const [{ formId }, { s: openSubmissionId }] = await Promise.all([
    params,
    searchParams,
  ]);
  const supabase = await createClient();

  const [{ data: form }, { data: submissions }] = await Promise.all([
    supabase
      .from("forms")
      .select("id, title, fields, updated_at")
      .eq("id", formId)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("submissions")
      .select("id, answers, submitted_at, respondent_meta")
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false }),
  ]);

  if (!form) notFound();

  const rows = submissions ?? [];
  const count = rows.length;

  return (
    // h-full + min-h-0 chain lets the grid claim the leftover viewport and
    // scroll internally rather than growing the page.
    <div className="flex h-full min-h-0 flex-col bg-card">
      <header className="shrink-0 px-4 pb-2.5 pt-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to Forms
        </Link>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            {form.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold tabular-nums text-foreground">{count}</span>{" "}
            {count === 1 ? "response" : "responses"}
            {rows[0] && (
              <>
                <Sep />
                Last response {formatDateTime(rows[0].submitted_at)}
              </>
            )}
            {form.updated_at && (
              <>
                <Sep />
                Modified {formatDateTime(form.updated_at)}
              </>
            )}
          </p>
        </div>
      </header>

      {/* Sheet tab band: names the data surface and separates the page chrome
          from the grid, the way a spreadsheet tab does. */}
      <div className="flex shrink-0 items-center gap-2 bg-sheet px-4">
        <span className="flex items-center gap-2 rounded-t-lg bg-card px-3 py-2 text-[13px] font-semibold text-foreground">
          <span className="text-sheet">
            <GridIcon />
          </span>
          <span className="max-w-[280px] truncate">{form.title}</span>
        </span>
        <span className="ml-auto rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium tabular-nums text-sheet-foreground">
          {count} {count === 1 ? "entry" : "entries"}
        </span>
      </div>

      <SubmissionsView
        formId={formId}
        fields={form.fields}
        submissions={rows}
        openSubmissionId={openSubmissionId}
      />
    </div>
  );
}

function Sep() {
  return <span className="mx-1.5 text-border">·</span>;
}

function GridIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}
