"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/date";
import { Menu, MenuItem } from "@/components/submissions/Menu";
import type { ViewId } from "./WorkspaceSidebar";

export type FormListItem = {
  id: string;
  title: string;
  status: string;
  updated_at: string;
  responses: number;
  favorite: boolean;
  archived: boolean;
  deleted: boolean;
};

const STATUS_STYLES: Record<string, string> = {
  published: "bg-brand-subtle text-brand",
  draft: "bg-muted text-muted-foreground",
  closed: "bg-destructive-subtle text-destructive",
};

export function FormRow({ form, view }: { form: FormListItem; view: ViewId }) {
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
      className={
        "group flex items-center gap-3 border-b border-border px-4 py-3.5 transition-colors last:border-0 hover:bg-muted/60 " +
        (busy || pending ? "opacity-50" : "")
      }
    >
      <button
        type="button"
        onClick={() => organise(form.favorite ? "unfavorite" : "favorite")}
        aria-label={form.favorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={form.favorite}
        className="shrink-0 rounded p-1 transition-colors hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Star
          className={
            "h-4 w-4 " +
            (form.favorite
              ? "fill-brand text-brand"
              : "text-muted-foreground/50 group-hover:text-muted-foreground")
          }
          aria-hidden
        />
      </button>

      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-brand shadow-sm">
        <DocIcon />
      </span>

      <div className="min-w-0 flex-1">
        {inTrash ? (
          <p className="truncate text-sm font-semibold text-foreground">{form.title}</p>
        ) : (
          <Link
            href={`/forms/${form.id}`}
            className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-brand"
          >
            {form.title}
          </Link>
        )}
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">
            {form.responses}
          </span>{" "}
          {form.responses === 1 ? "submission" : "submissions"} · Last edited{" "}
          {formatDate(form.updated_at)}
        </p>
      </div>

      <span
        className={
          "hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize sm:inline " +
          (STATUS_STYLES[form.status] ?? STATUS_STYLES.draft)
        }
      >
        {form.status}
      </span>

      {/* Hover-revealed actions, Jotform-style. focus-within keeps them
          reachable for keyboard users, who never trigger :hover. */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        {inTrash ? (
          <>
            <RowLink onClick={() => organise("restore")}>Restore</RowLink>
            <RowLink onClick={deleteForever} danger>
              Delete forever
            </RowLink>
          </>
        ) : (
          <>
            <Link
              href={`/forms/${form.id}`}
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-border"
            >
              Edit Form
            </Link>
            <Link
              href={`/forms/${form.id}/submissions`}
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-border"
            >
              Responses
            </Link>
            <Menu
              align="right"
              label={() => (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-border hover:text-foreground">
                  <DotsIcon />
                </span>
              )}
            >
              {(close) => (
                <>
                  <MenuItem
                    onClick={() => {
                      organise(form.archived ? "unarchive" : "archive");
                      close();
                    }}
                  >
                    {form.archived ? "Unarchive" : "Archive"}
                  </MenuItem>
                  <MenuItem
                    danger
                    onClick={() => {
                      trash();
                      close();
                    }}
                  >
                    Move to Trash
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        )}
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
        "rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors " +
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
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
