import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";
import { buttonPrimaryClass } from "@/lib/ui";
import { quotaFor } from "@/lib/plans";
import { Container } from "@/components/portal/Container";
import {
  WorkspaceSidebar,
  isViewId,
  type ViewId,
} from "@/components/portal/WorkspaceSidebar";
import { FormRow, type FormListItem } from "@/components/portal/FormRow";

type FormRecord = {
  id: string;
  title: string;
  status: string;
  updated_at: string;
  deleted_at: string | null;
  archived_at: string | null;
  submissions: { count: number }[];
};

const EMPTY_COPY: Record<ViewId, { title: string; body: string }> = {
  all: {
    title: "No forms yet",
    body: "Create your first form to start collecting responses.",
  },
  drafts: {
    title: "No drafts",
    body: "Forms you haven't published yet will appear here.",
  },
  favorites: {
    title: "No favorites yet",
    body: "Star a form to pin it here for quick access.",
  },
  archive: {
    title: "Nothing archived",
    body: "Archived forms are hidden from your main list but keep their responses.",
  },
  trash: {
    title: "Trash is empty",
    body: "Deleted forms land here so you can restore them.",
  },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: viewParam } = await searchParams;
  const view: ViewId = isViewId(viewParam) ? viewParam : "all";

  const supabase = await createClient();
  const [profile, { data }, { data: favRows }] = await Promise.all([
    getSessionProfile(),
    supabase
      .from("forms")
      .select("id, title, status, updated_at, deleted_at, archived_at, submissions(count)")
      .order("updated_at", { ascending: false }),
    supabase.from("form_favorites").select("form_id"),
  ]);

  const favorites = new Set((favRows ?? []).map((f) => f.form_id as string));
  const all = ((data ?? []) as FormRecord[]).map(
    (f): FormListItem => ({
      id: f.id,
      title: f.title,
      status: f.status,
      updated_at: f.updated_at,
      responses: f.submissions[0]?.count ?? 0,
      favorite: favorites.has(f.id),
      archived: f.archived_at !== null,
      deleted: f.deleted_at !== null,
    })
  );

  // Trash and Archive are exclusive of the active list, so every other view is
  // filtered down from the not-deleted, not-archived set.
  const active = all.filter((f) => !f.deleted && !f.archived);
  const buckets: Record<ViewId, FormListItem[]> = {
    all: active,
    drafts: active.filter((f) => f.status === "draft"),
    favorites: active.filter((f) => f.favorite),
    archive: all.filter((f) => f.archived && !f.deleted),
    trash: all.filter((f) => f.deleted),
  };
  const counts = Object.fromEntries(
    Object.entries(buckets).map(([k, v]) => [k, v.length])
  ) as Record<ViewId, number>;

  const forms = buckets[view];
  const quota = profile ? quotaFor(profile) : { formLimit: null, submissionLimit: null };
  // Quota counts every form the user still owns, including archived — only
  // trashing one frees a slot, matching the API's `deleted_at is null` check.
  const ownedCount = all.filter((f) => !f.deleted).length;
  const atFormLimit = quota.formLimit !== null && ownedCount >= quota.formLimit;
  const totalResponses = active.reduce((sum, f) => sum + f.responses, 0);
  const atSubmissionLimit =
    quota.submissionLimit !== null && totalResponses >= quota.submissionLimit;

  return (
    <Container>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">Forms</h1>
          <Link
            href="/pricing"
            title="View plans"
            className="rounded-full bg-brand-subtle px-3 py-1 text-xs font-semibold capitalize text-brand shadow-sm transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {profile?.plan ?? "free"} plan
          </Link>
        </div>
        {atFormLimit ? (
          <span
            title={`Your plan is limited to ${quota.formLimit} forms`}
            className="cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground"
          >
            New form
          </span>
        ) : (
          <Link href="/forms/new" className={buttonPrimaryClass + " shadow-sm"}>
            <PlusIcon />
            New form
          </Link>
        )}
      </div>

      {(atFormLimit || atSubmissionLimit) && (
        <p className="mb-5 flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-subtle px-4 py-3 text-sm text-brand">
          <InfoIcon />
          <span>
            {atSubmissionLimit
              ? `You've reached the ${quota.submissionLimit}-submission limit — your forms have been closed to new responses.`
              : `You've used all ${quota.formLimit} forms on your current plan.`}{" "}
            <Link
              href="/pricing"
              className="font-semibold underline underline-offset-2 hover:text-brand-hover"
            >
              Upgrade your plan
            </Link>
          </span>
        </p>
      )}

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <aside className="shrink-0 md:w-48">
          <WorkspaceSidebar active={view} counts={counts} />
        </aside>

        <div className="min-w-0 flex-1">
          {forms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="text-base font-semibold text-foreground">
                {EMPTY_COPY[view].title}
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                {EMPTY_COPY[view].body}
              </p>
              {view === "all" && (
                <Link href="/forms/new" className={buttonPrimaryClass + " mt-5"}>
                  <PlusIcon />
                  New form
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {forms.map((form) => (
                <FormRow key={form.id} form={form} view={view} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
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
