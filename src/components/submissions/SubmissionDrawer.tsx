"use client";

import { useEffect } from "react";
import type { Field } from "@/lib/forms/schema";
import { formatDateTime } from "@/lib/date";
import { parseUserAgent } from "@/lib/ua";
import { Cell, type Submission } from "./cells";

export function SubmissionDrawer({
  open,
  submission,
  fields,
  index,
  total,
  onClose,
  onStep,
  onDelete,
}: {
  open: boolean;
  submission: Submission | null;
  fields: Field[];
  index: number;
  total: number;
  onClose: () => void;
  onStep: (delta: number) => void;
  onDelete: (id: string) => void;
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

  const meta = submission?.respondent_meta;
  const { browser, os } = parseUserAgent(meta?.userAgent);
  const location = [meta?.city, meta?.region, meta?.country].filter(Boolean).join(", ");

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
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[450px] transform flex-col bg-card shadow-xl transition-transform duration-200 ease-out " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
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
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {total > 0 ? `${index + 1} of ${total}` : "—"}
          </span>
          <div className="ml-auto flex items-center gap-1">
            {submission && (
              <button
                onClick={() => onDelete(submission.id)}
                className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <TrashIcon />
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              ✕
            </button>
          </div>
        </div>

        {submission && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="border-b border-border bg-muted/40 px-5 py-4">
              <p className="text-lg font-semibold text-foreground">Entry #{index + 1}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(submission.submitted_at)}
              </p>
            </div>

            <dl className="divide-y divide-border">
              {fields.map((field) => (
                <Row key={field.id} label={field.label}>
                  <Cell field={field} value={submission.answers[field.id]} multiline />
                </Row>
              ))}
            </dl>

            <div className="border-t border-border bg-muted/40 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Metadata
              </p>
            </div>
            <dl className="divide-y divide-border">
              <Row label="Submitted">{formatDateTime(submission.submitted_at)}</Row>
              <Row label="IP Address">
                {meta?.ip ? (
                  <span className="font-mono text-sm">{meta.ip}</span>
                ) : (
                  <Unknown />
                )}
              </Row>
              <Row label="Browser">{browser ?? <Unknown />}</Row>
              <Row label="Operating System">{os ?? <Unknown />}</Row>
              <Row label="Location">{location || <Unknown />}</Row>
            </dl>
          </div>
        )}
      </aside>
    </>
  );
}

function Unknown() {
  return <span className="text-muted-foreground">Unknown</span>;
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

function ChevronIcon({ dir }: { dir: "up" | "down" }) {
  return (
    <svg
      className={"h-4 w-4 " + (dir === "up" ? "" : "rotate-180")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}
