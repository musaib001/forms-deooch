import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/date";
import { SubmissionsView } from "@/components/submissions/SubmissionsView";

export default async function FormSubmissionsPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();

  const [{ data: form }, { data: submissions }] = await Promise.all([
    supabase
      .from("forms")
      .select("id, title, fields, updated_at")
      .eq("id", formId)
      .single(),
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

      <SubmissionsView formId={formId} fields={form.fields} submissions={rows} />
    </div>
  );
}

function Sep() {
  return <span className="mx-1.5 text-border">·</span>;
}
