"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/date";
import { Menu, MenuItem } from "@/components/submissions/Menu";
import type { FormListItem } from "./FormRow";
import type { ViewId } from "./views";

// Grid-card presentation of a form. Mirrors FormRow's organise/trash/delete
// behaviour exactly — same endpoints, same optimistic refresh — just laid out
// as a card instead of a list row.
const STATUS_STYLES: Record<string, string> = {
  published: "bg-success/10 text-success",
  draft: "bg-muted text-muted-foreground",
  closed: "bg-destructive-subtle text-destructive",
};

export function FormCard({
  form,
  view,
  index,
}: {
  form: FormListItem;
  view: ViewId;
  index: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  async function organise(action: string) {
    setBusy(true);
    const res = await fetch(`/api/forms/${form.id}/organise`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    if (!res.ok) {
      alert("That didn't work. Please try again.");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function trash() {
    setBusy(true);
    const res = await fetch(`/api/forms/${form.id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) return alert("Could not move that form to Trash.");
    startTransition(() => router.refresh());
  }

  async function deleteForever() {
    if (
      !confirm(
        `Permanently delete "${form.title}" and all of its responses? This cannot be undone.`
      )
    )
      return;
    setBusy(true);
    const res = await fetch(`/api/forms/${form.id}?permanent=1`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) return alert("Could not delete that form.");
    startTransition(() => router.refresh());
  }

  const inTrash = view === "trash";

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
      className={
        "animate-rise group relative flex min-h-[168px] flex-col gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:z-30 focus-within:z-30 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_12px_30px_-12px_var(--brand)] " +
        (busy || pending ? "pointer-events-none opacity-50" : "")
      }
    >
      {/* Left accent bar, revealed on hover */}
      <span className="absolute inset-y-4 left-0 w-0.5 rounded-full bg-brand opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />

      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-brand transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105">
          <DocIcon />
        </span>
        <button
          type="button"
          onClick={() => organise(form.favorite ? "unfavorite" : "favorite")}
          aria-label={form.favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={form.favorite}
          className="ml-auto shrink-0 rounded p-1 transition-colors hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            className={
              "h-4 w-4 transition-transform hover:scale-110 " +
              (form.favorite
                ? "fill-brand text-brand"
                : "text-muted-foreground/50 group-hover:text-muted-foreground")
            }
            aria-hidden
          />
        </button>
      </div>

      <div className="min-w-0">
        {inTrash ? (
          <p className="line-clamp-2 text-sm font-semibold text-foreground">{form.title}</p>
        ) : (
          <Link
            href={`/forms/${form.id}`}
            className="line-clamp-2 block text-sm font-semibold text-foreground transition-colors hover:text-brand"
          >
            {form.title}
          </Link>
        )}
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">{form.responses}</span>
          {form.responses === 1 ? "response" : "responses"}
          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" aria-hidden />
          Edited {formatDate(form.updated_at)}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span
          className={
            "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize " +
            (STATUS_STYLES[form.status] ?? STATUS_STYLES.draft)
          }
        >
          {form.status}
        </span>

        <div className="flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          {inTrash ? (
            <>
              <RowLink onClick={() => organise("restore")}>Restore</RowLink>
              <RowLink onClick={deleteForever} danger>
                Delete
              </RowLink>
            </>
          ) : (
            <>
              <Link
                href={`/forms/${form.id}/submissions`}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-border"
              >
                Responses
              </Link>
              <Menu
                align="right"
                label={() => (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-border hover:text-foreground">
                    <DotsIcon />
                  </span>
                )}
              >
                {(close) => (
                  <>
                    <MenuItem
                      onClick={() => {
                        close();
                        router.push(`/forms/${form.id}`);
                      }}
                    >
                      Edit form
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        organise(form.archived ? "unarchive" : "archive");
                        close();
                      }}
                    >
                      {form.archived ? "Unarchive" : "Archive"}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        trash();
                        close();
                      }}
                    >
                      Move to Trash
                    </MenuItem>
                    <MenuItem
                      danger
                      onClick={() => {
                        close();
                        deleteForever();
                      }}
                    >
                      Delete permanently…
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RowLink({
  onClick,
  danger = false,
  children,
}: {
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-lg px-2 py-1 text-xs font-semibold transition-colors " +
        (danger
          ? "text-destructive hover:bg-destructive-subtle"
          : "text-foreground hover:bg-border")
      }
    >
      {children}
    </button>
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

function DotsIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}
