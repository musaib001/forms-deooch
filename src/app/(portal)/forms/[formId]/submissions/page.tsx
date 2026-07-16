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
    supabase.from("forms").select("id, title, fields").eq("id", formId).single(),
    supabase
      .from("submissions")
      .select("id, answers, submitted_at, respondent_meta")
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false }),
  ]);

  if (!form) notFound();

  const count = submissions?.length ?? 0;

  return (
    <div>
      <Link
        href={`/forms/${formId}`}
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to form
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {form.title}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {count} {count === 1 ? "response" : "responses"}
          {submissions?.[0] && (
            <> · Last response {formatDateTime(submissions[0].submitted_at)}</>
          )}
        </p>
      </div>
      <SubmissionsView
        formId={formId}
        formTitle={form.title}
        fields={form.fields}
        submissions={submissions ?? []}
      />
    </div>
  );
}
