import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";
import { buttonPrimaryClass } from "@/lib/ui";
import { formatDate } from "@/lib/date";
import { FREE_FORM_LIMIT, FREE_SUBMISSION_LIMIT } from "@/lib/forms/limits";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-brand-subtle text-brand",
  draft: "bg-muted text-muted-foreground",
  closed: "bg-destructive-subtle text-destructive",
};

type FormRow = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  submissions: { count: number }[];
};

function responseCount(form: FormRow) {
  return form.submissions[0]?.count ?? 0;
}

export default async function DashboardPage() {
  const [profile, { data }] = await Promise.all([
    getSessionProfile(),
    (await createClient())
      .from("forms")
      .select("id, title, status, created_at, submissions(count)")
      .order("created_at", { ascending: false }),
  ]);

  const forms = (data ?? []) as FormRow[];
  const totalResponses = forms.reduce((sum, f) => sum + responseCount(f), 0);
  const publishedCount = forms.filter((f) => f.status === "published").length;
  const isFree = profile?.role === "free";
  const atFormLimit = isFree && forms.length >= FREE_FORM_LIMIT;
  const atSubmissionLimit = isFree && totalResponses >= FREE_SUBMISSION_LIMIT;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Forms
            </h1>
            <Link
              href="/pricing"
              title="View plans"
              className="rounded-full bg-brand-subtle px-2.5 py-0.5 text-xs font-semibold capitalize text-brand transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {profile?.plan ?? "free"} plan
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Build forms in the portal or by asking Claude.
          </p>
        </div>
        {atFormLimit ? (
          <span
            title={`Free accounts are limited to ${FREE_FORM_LIMIT} forms`}
            className="cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground"
          >
            New form
          </span>
        ) : (
          <Link href="/forms/new" className={buttonPrimaryClass}>
            <PlusIcon />
            New form
          </Link>
        )}
      </div>

      {forms.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat
            label="Forms"
            value={forms.length}
            limit={isFree ? FREE_FORM_LIMIT : undefined}
            icon={<DocIcon />}
          />
          <Stat
            label="Responses"
            value={totalResponses}
            limit={isFree ? FREE_SUBMISSION_LIMIT : undefined}
            icon={<InboxIcon />}
          />
          <Stat label="Published" value={publishedCount} icon={<GlobeIcon />} />
        </div>
      )}

      {(atFormLimit || atSubmissionLimit) && (
        <p className="mb-6 flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-subtle px-4 py-3 text-sm text-brand">
          <InfoIcon />
          <span>
            {atSubmissionLimit
              ? `You've reached the ${FREE_SUBMISSION_LIMIT}-submission limit — your forms have been closed to new responses.`
              : `You've used all ${FREE_FORM_LIMIT} forms on the free plan.`}{" "}
            <Link href="/pricing" className="font-semibold underline underline-offset-2 hover:text-brand-hover">
              Upgrade your plan
            </Link>
          </span>
        </p>
      )}

      {forms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-subtle text-brand">
            <DocIcon />
          </div>
          <p className="text-base font-semibold text-foreground">No forms yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Create your first form to start collecting responses.
          </p>
          <Link href="/forms/new" className={buttonPrimaryClass + " mt-5"}>
            <PlusIcon />
            New form
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {forms.map((form) => {
            const count = responseCount(form);
            return (
              <div
                key={form.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors duration-150 hover:border-brand/40"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Link
                    href={`/forms/${form.id}`}
                    className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-brand"
                  >
                    {form.title}
                  </Link>
                  <span
                    className={
                      "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize " +
                      (STATUS_STYLES[form.status] ?? STATUS_STYLES.draft)
                    }
                  >
                    {form.status}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-semibold tabular-nums text-foreground">
                      {count}
                    </span>{" "}
                    {count === 1 ? "response" : "responses"}
                    <span className="mx-2 text-border">·</span>
                    {formatDate(form.created_at)}
                  </span>
                  <Link
                    href={`/forms/${form.id}/submissions`}
                    className="whitespace-nowrap font-medium text-brand transition-colors hover:text-brand-hover"
                  >
                    Responses →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  limit,
  icon,
}: {
  label: string;
  value: number;
  limit?: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-brand">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums leading-none text-foreground">
          {value}
          {limit !== undefined && (
            <span className="text-base font-medium text-muted-foreground">
              {" "}
              / {limit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
