"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Archive,
  ChevronDown,
  ChevronRight,
  FileEdit,
  LayoutGrid,
  Star,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ViewId = "all" | "drafts" | "favorites" | "archive" | "trash";

export const VIEWS: { id: ViewId; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "drafts", label: "Drafts", icon: FileEdit },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "archive", label: "Archive", icon: Archive },
  { id: "trash", label: "Trash", icon: Trash2 },
];

export function isViewId(value: string | undefined): value is ViewId {
  return VIEWS.some((v) => v.id === value);
}

export function WorkspaceSidebar({
  active,
  counts,
}: {
  active: ViewId;
  counts: Record<ViewId, number>;
}) {
  const [teamsOpen, setTeamsOpen] = useState(false);

  return (
    <nav
      aria-label="Workspace views"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-3 shadow-sm"
    >
      <div className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/40 px-2.5 py-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground shadow-sm">
          W
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">My Workspace</p>
          <p className="text-xs text-muted-foreground">Personal</p>
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </div>

      <div className="flex flex-col gap-0.5">
        {VIEWS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          const isLastBeforeTrash = id === "archive";
          return (
            <div key={id}>
              <Link
                href={id === "all" ? "/dashboard" : `/dashboard?view=${id}`}
                aria-current={isActive ? "page" : undefined}
                className={
                  "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors " +
                  (isActive
                    ? "bg-brand-subtle text-brand"
                    : "text-foreground hover:bg-muted")
                }
              >
                {isActive && (
                  <span className="absolute -left-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand" aria-hidden />
                )}
                <span
                  className={
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors " +
                    (isActive ? "bg-brand text-brand-foreground shadow-sm" : "text-muted-foreground")
                  }
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="flex-1 truncate">{label}</span>
                {counts[id] > 0 && (
                  <span
                    className={
                      "shrink-0 text-xs font-semibold tabular-nums " +
                      (isActive ? "text-brand" : "text-muted-foreground")
                    }
                  >
                    {counts[id]}
                  </span>
                )}
              </Link>
              {isLastBeforeTrash && <div className="my-1.5 border-t border-border" />}
            </div>
          );
        })}
      </div>

      <div className="border-t border-border pt-2">
        <button
          type="button"
          onClick={() => setTeamsOpen((o) => !o)}
          aria-expanded={teamsOpen}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {teamsOpen ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          )}
          <span className="flex-1 text-left">Team Workspaces</span>
        </button>
        {teamsOpen && (
          <div className="mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
              <Users className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span>No team workspaces yet</span>
          </div>
        )}
      </div>
    </nav>
  );
}
