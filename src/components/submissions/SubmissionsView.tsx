"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Field, FieldType } from "@/lib/forms/schema";
import { CHOICE_FIELD_TYPES, isInputField } from "@/lib/forms/schema";
import { formatDate, formatDateTime } from "@/lib/date";

type RespondentMeta = {
  ip?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  userAgent?: string | null;
} | null;

type Submission = {
  id: string;
  answers: Record<string, string | string[]>;
  submitted_at: string;
  respondent_meta: RespondentMeta;
};

const TAG_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
];

function tagColor(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

function asArray(value: string | string[] | undefined) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function isChoice(field: Field) {
  return CHOICE_FIELD_TYPES.includes(field.type);
}

function Tag({ value }: { value: string }) {
  return (
    <span
      className={"inline-flex rounded-md px-2 py-0.5 text-xs font-medium " + tagColor(value)}
    >
      {value}
    </span>
  );
}

function Cell({ field, value }: { field: Field; value: string | string[] | undefined }) {
  const values = asArray(value).filter((v) => v !== "");
  if (values.length === 0) return <span className="text-muted-foreground/50">—</span>;
  if (isChoice(field)) {
    return (
      <div className="flex flex-wrap gap-1">
        {values.map((v) => (
          <Tag key={v} value={v} />
        ))}
      </div>
    );
  }
  return <span className="text-foreground">{values.join(", ")}</span>;
}

export function SubmissionsView({
  formId,
  formTitle,
  fields,
  submissions,
}: {
  formId: string;
  formTitle: string;
  fields: Field[];
  submissions: Submission[];
}) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const columns = useMemo(
    () => [...fields].filter(isInputField).sort((a, b) => a.order - b.order),
    [fields]
  );
  const choiceColumns = useMemo(
    () => columns.filter((f) => isChoice(f) && (f.options?.length ?? 0) > 0),
    [columns]
  );
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter((s) => {
      if (
        q &&
        !columns.some((f) =>
          asArray(s.answers[f.id]).join(" ").toLowerCase().includes(q)
        )
      )
        return false;
      for (const [fieldId, value] of Object.entries(filters)) {
        if (!value) continue;
        if (!asArray(s.answers[fieldId]).includes(value)) return false;
      }
      return true;
    });
  }, [query, filters, submissions, columns]);

  const close = useCallback(() => setSelectedIndex(null), []);
  const step = useCallback(
    (delta: number) => {
      setSelectedIndex((i) => {
        if (i === null) return i;
        const next = i + delta;
        return next >= 0 && next < filtered.length ? next : i;
      });
    },
    [filtered.length]
  );

  const current = selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {/* Sheet tab band */}
        <div className="flex items-center gap-2.5 bg-brand px-4 py-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-brand-foreground">
            <GridIcon />
          </span>
          <span className="truncate text-sm font-semibold text-brand-foreground">
            {formTitle}
          </span>
          <span className="ml-auto shrink-0 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium tabular-nums text-brand-foreground">
            {filtered.length === submissions.length
              ? `${submissions.length} ${submissions.length === 1 ? "entry" : "entries"}`
              : `${filtered.length} of ${submissions.length} entries`}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search responses"
              className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
          {choiceColumns.length > 0 && (
            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                (activeFilterCount > 0
                  ? "border-brand bg-brand-subtle text-brand"
                  : "border-border bg-card text-foreground hover:bg-muted")
              }
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-0.5 rounded-full bg-brand px-1.5 text-xs font-semibold text-brand-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>
        {submissions.length > 0 && (
          <a
            href={`/api/forms/${formId}/export`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-[background-color,transform] duration-150 hover:bg-brand-hover active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
            </svg>
            Download Excel
          </a>
        )}
      </div>

      {showFilters && choiceColumns.length > 0 && (
        <div className="flex flex-wrap items-end gap-3 border-b border-border bg-muted/30 px-4 py-3">
          {choiceColumns.map((field) => (
            <label key={field.id} className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-muted-foreground">{field.label}</span>
              <select
                value={filters[field.id] ?? ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, [field.id]: e.target.value }))}
                className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-sm text-foreground outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="">All</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
          ))}
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters({})}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {submissions.length === 0 ? (
        <EmptyState title="No submissions yet" body="Share the public link and responses will appear here." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matches" body="No responses match your search or filters." />
      ) : (
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="w-12 whitespace-nowrap px-3 py-3 text-center font-semibold" aria-label="Row number">#</th>
                <th className="min-w-[150px] whitespace-nowrap px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden className="flex h-4 w-4 items-center justify-center rounded bg-muted text-[10px] font-semibold leading-none text-muted-foreground">▦</span>
                    Submitted
                  </span>
                </th>
                <th className="min-w-[140px] whitespace-nowrap px-4 py-3 font-semibold">IP Address</th>
                {columns.map((field) => (
                  <th key={field.id} className="min-w-[180px] whitespace-nowrap px-4 py-3 font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <FieldTypeIcon type={field.type} />
                      {field.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const ip = s.respondent_meta?.ip;
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedIndex(i)}
                    className="group cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="w-12 whitespace-nowrap px-3 py-3 text-center text-xs tabular-nums text-muted-foreground/70">
                      {i + 1}
                    </td>
                    <td className="relative min-w-[150px] whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(s.submitted_at)}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIndex(i);
                        }}
                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md bg-brand px-2.5 py-1 text-xs font-semibold text-brand-foreground opacity-0 shadow-sm transition-opacity duration-150 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                      >
                        <ExpandIcon /> View
                      </button>
                    </td>
                    <td className="min-w-[140px] whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                      {ip ?? <span className="font-sans text-muted-foreground/50">—</span>}
                    </td>
                    {columns.map((field) => (
                      <td key={field.id} className="min-w-[180px] px-4 py-3 align-top">
                        <Cell field={field} value={s.answers[field.id]} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>

      <SubmissionDrawer
        open={current !== null}
        submission={current}
        fields={columns}
        index={selectedIndex ?? 0}
        total={filtered.length}
        onClose={close}
        onStep={step}
      />
    </div>
  );
}

function SubmissionDrawer({
  open,
  submission,
  fields,
  index,
  total,
  onClose,
  onStep,
}: {
  open: boolean;
  submission: Submission | null;
  fields: Field[];
  index: number;
  total: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") onStep(1);
      if (e.key === "ArrowUp") onStep(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onStep]);

  const ip = submission?.respondent_meta?.ip;

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={
          "fixed inset-0 z-40 bg-foreground/30 transition-opacity duration-200 " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Submission details"
        className={
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col bg-card shadow-xl transition-transform duration-200 ease-out " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onStep(-1)}
              disabled={index <= 0}
              aria-label="Previous entry"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            >
              <ChevronIcon dir="up" />
            </button>
            <button
              onClick={() => onStep(1)}
              disabled={index >= total - 1}
              aria-label="Next entry"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            >
              <ChevronIcon dir="down" />
            </button>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {total > 0 ? `${index + 1} of ${total}` : "—"}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {submission && (
          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-muted/30 px-5 py-4">
              <p className="text-lg font-semibold text-foreground">
                Entry #{index + 1}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(submission.submitted_at)}
              </p>
            </div>
            <dl className="divide-y divide-border">
              <Row label="IP Address">
                {ip ? (
                  <span className="font-mono text-sm">{ip}</span>
                ) : (
                  <span className="text-muted-foreground/50">Unknown</span>
                )}
              </Row>
              {fields.map((field) => {
                const values = asArray(submission.answers[field.id]).filter((v) => v !== "");
                return (
                  <Row key={field.id} label={field.label}>
                    {values.length === 0 ? (
                      <span className="text-muted-foreground/50">No answer</span>
                    ) : isChoice(field) ? (
                      <div className="flex flex-wrap gap-1.5">
                        {values.map((v) => <Tag key={v} value={v} />)}
                      </div>
                    ) : (
                      values.join(", ")
                    )}
                  </Row>
                );
              })}
            </dl>
          </div>
        )}
      </aside>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-3.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function FieldTypeIcon({ type }: { type: FieldType }) {
  const glyph: Record<FieldType, string> = {
    text: "T", textarea: "¶", email: "@", phone: "☎", number: "#",
    select: "▾", radio: "◉", checkbox: "☑", date: "▦", file: "🔗", heading: "H",
  };
  return (
    <span
      aria-hidden
      className="flex h-4 w-4 items-center justify-center rounded bg-muted text-[10px] font-semibold leading-none text-muted-foreground"
    >
      {glyph[type]}
    </span>
  );
}

function GridIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: "up" | "down" }) {
  return (
    <svg
      className={"h-4 w-4 " + (dir === "up" ? "" : "rotate-180")}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
