"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import type { Field } from "@/lib/forms/schema";
import { isInputField } from "@/lib/forms/schema";
import { formatDate } from "@/lib/date";
import { Cell, FieldTypeIcon, asArray, isChoice, type Submission } from "./cells";
import { SubmissionDrawer } from "./SubmissionDrawer";
import { Menu, MenuItem } from "./Menu";

const ROW_COL = "__row";
const SUBMITTED_COL = "__submitted";
const ACTIONS_COL = "__actions";

// Sticky columns must paint over scrolling cells; the header row paints over
// everything. Header cells carry their own opaque bg-muted, so they only need
// the offset. Body cells use bg-inherit to pick up the row's own stripe / hover
// / selected colour instead of punching a hole in it.
const STICKY_LEFT_HEAD = "sticky left-0";
const STICKY_RIGHT_HEAD = "sticky right-0";
const STICKY_LEFT_BODY = "sticky left-0 bg-inherit";
const STICKY_RIGHT_BODY = "sticky right-0 bg-inherit";

export function SubmissionsView({
  formId,
  fields,
  submissions,
  openSubmissionId,
}: {
  formId: string;
  fields: Field[];
  submissions: Submission[];
  // Deep link target from the "view this response" link in notification email.
  openSubmissionId?: string;
}) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const [globalFilter, setGlobalFilter] = useState("");
  const [choiceFilters, setChoiceFilters] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  // ponytail: selectedIndex is a position in the *table's* rows, which only
  // matches `submissions` order while no filter/sort is applied — true on the
  // first render a deep link lands on, which is the only time this runs.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    if (!openSubmissionId) return null;
    const i = submissions.findIndex((s) => s.id === openSubmissionId);
    return i === -1 ? null : i;
  });
  const [deleting, setDeleting] = useState<string | null>(null);

  const inputFields = useMemo(
    () => [...fields].filter(isInputField).sort((a, b) => a.order - b.order),
    [fields]
  );
  const choiceFields = useMemo(
    () => inputFields.filter((f) => isChoice(f) && (f.options?.length ?? 0) > 0),
    [inputFields]
  );

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() => [
    ROW_COL,
    SUBMITTED_COL,
    ...inputFields.map((f) => f.id),
    ACTIONS_COL,
  ]);

  // Choice filters run outside TanStack: they're AND-ed across fields and match
  // whole values, which the built-in per-column filters don't express cleanly.
  const data = useMemo(() => {
    const active = Object.entries(choiceFilters).filter(([, v]) => v);
    if (active.length === 0) return submissions;
    return submissions.filter((s) =>
      active.every(([fieldId, value]) => asArray(s.answers[fieldId]).includes(value))
    );
  }, [submissions, choiceFilters]);

  const onDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this response? This cannot be undone.")) return;
      setDeleting(id);
      const res = await fetch(`/api/forms/${formId}/submissions/${id}`, {
        method: "DELETE",
      });
      setDeleting(null);
      if (!res.ok) {
        alert("Could not delete that response. Please try again.");
        return;
      }
      setSelectedIndex(null);
      startRefresh(() => router.refresh());
    },
    [formId, router]
  );

  const columns = useMemo<ColumnDef<Submission>[]>(() => {
    const fieldCols: ColumnDef<Submission>[] = inputFields.map((field) => ({
      id: field.id,
      accessorFn: (row) => asArray(row.answers[field.id]).filter(Boolean).join(" "),
      // "alphanumeric" sorts embedded numbers naturally (9 before 10), which
      // plain string sort gets wrong on number fields.
      sortingFn: field.type === "number" ? "alphanumeric" : "auto",
      size: field.type === "textarea" ? 280 : 190,
      minSize: 90,
      meta: { label: field.label },
      header: () => (
        <HeaderLabel icon={<FieldTypeIcon type={field.type} />} label={field.label} />
      ),
      cell: ({ row }) => <Cell field={field} value={row.original.answers[field.id]} />,
    }));

    return [
      {
        id: ROW_COL,
        size: 68,
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        header: ({ table }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              label="Select all responses"
            />
            <span className="text-muted-foreground">#</span>
          </div>
        ),
        // Rendered by the tbody map: row.index is the position in the original
        // data array, so it shows stale numbering once a sort is applied. The
        // map index is the actual display position.
        cell: () => null,
      },
      {
        id: SUBMITTED_COL,
        accessorFn: (row) => row.submitted_at,
        sortingFn: "datetime",
        size: 150,
        minSize: 110,
        enableGlobalFilter: false,
        header: () => <HeaderLabel icon={<FieldTypeIcon type="date" />} label="Submitted" />,
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-foreground">
            {formatDate(getValue<string>())}
          </span>
        ),
      },
      ...fieldCols,
      {
        id: ACTIONS_COL,
        size: 116,
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: () => null, // rendered by the row so it can read hover state
      },
    ];
  }, [inputFields]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility, columnOrder, rowSelection },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;
  const current = selectedIndex !== null ? rows[selectedIndex]?.original ?? null : null;
  const step = useCallback(
    (delta: number) =>
      setSelectedIndex((i) => {
        if (i === null) return i;
        const next = i + delta;
        return next >= 0 && next < rows.length ? next : i;
      }),
    [rows.length]
  );

  const activeFilters = Object.values(choiceFilters).filter(Boolean).length;
  const selectedCount = Object.keys(rowSelection).length;

  // Keep column order stable if a field is added/removed on the form.
  const orderedLeafIds = table.getVisibleLeafColumns().map((c) => c.id);

  function moveColumn(id: string, dir: -1 | 1) {
    setColumnOrder((prev) => {
      const order = prev.length ? [...prev] : orderedLeafIds;
      const from = order.indexOf(id);
      const to = from + dir;
      // Clamp inside the field range: the row-number and actions columns are
      // pinned to the edges and must not be displaced.
      if (from < 1 || to < 1 || to > order.length - 2) return prev;
      [order[from], order[to]] = [order[to], order[from]];
      return order;
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Toolbar
        formId={formId}
        query={globalFilter}
        onQuery={setGlobalFilter}
        choiceFields={choiceFields}
        choiceFilters={choiceFilters}
        onChoiceFilters={setChoiceFilters}
        activeFilters={activeFilters}
        table={table}
        sorting={sorting}
        onSorting={setSorting}
        selectedCount={selectedCount}
        isRefreshing={isRefreshing}
        onRefresh={() => startRefresh(() => router.refresh())}
      />

      {submissions.length === 0 ? (
        <EmptyState formId={formId} />
      ) : rows.length === 0 ? (
        <NoMatches
          onClear={() => {
            setGlobalFilter("");
            setChoiceFilters({});
          }}
        />
      ) : (
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain [scrollbar-width:thin]">
          {/* border-separate keeps th borders painted while the header is sticky;
              border-collapse drops them on scroll in WebKit. */}
          <table
            style={{ width: table.getTotalSize() }}
            className="min-w-full border-separate border-spacing-0 text-left text-sm"
          >
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    const pinned =
                      header.column.id === ROW_COL
                        ? STICKY_LEFT_HEAD
                        : header.column.id === ACTIONS_COL
                          ? STICKY_RIGHT_HEAD
                          : "";
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        scope="col"
                        className={
                          "group/th sticky top-0 h-10 border-b border-r border-border bg-muted px-3 text-left text-[13px] font-semibold text-foreground " +
                          (pinned ? `${pinned} z-30 ` : "z-20 ")
                        }
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="min-w-0 flex-1">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                          {sorted && (
                            <SortArrow dir={sorted === "asc" ? "asc" : "desc"} />
                          )}
                          {header.column.getCanSort() && (
                            <ColumnMenu
                              column={header.column}
                              onMove={moveColumn}
                            />
                          )}
                        </div>
                        {header.column.getCanResize() && (
                          <span
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            onClick={(e) => e.stopPropagation()}
                            role="separator"
                            aria-orientation="vertical"
                            className={
                              "absolute right-0 top-0 h-full w-1.5 cursor-col-resize touch-none select-none hover:bg-brand/40 " +
                              (header.column.getIsResizing() ? "bg-brand" : "")
                            }
                          />
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const selected = row.getIsSelected();
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedIndex(i)}
                    className={
                      // Hover stays neutral: a full-width brand tint on every
                      // row competes with the toolbar's primary actions and is
                      // what makes a grid read as a styled HTML table.
                      "group cursor-pointer transition-colors " +
                      (selected
                        ? "bg-sky-50 hover:bg-sky-100"
                        : i % 2 === 1
                          ? "bg-muted/30 hover:bg-muted"
                          : "bg-card hover:bg-muted") +
                      (deleting === row.original.id ? " opacity-40" : "")
                    }
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isRowCol = cell.column.id === ROW_COL;
                      const isActions = cell.column.id === ACTIONS_COL;
                      return (
                        <td
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className={
                            "h-11 overflow-hidden border-b border-r border-border px-3 align-middle " +
                            (isRowCol ? `${STICKY_LEFT_BODY} z-10 ` : "") +
                            (isActions ? `${STICKY_RIGHT_BODY} z-10 ` : "")
                          }
                        >
                          {isRowCol ? (
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selected}
                                onChange={row.getToggleSelectedHandler()}
                                label={`Select row ${i + 1}`}
                              />
                              <span className="tabular-nums text-muted-foreground">
                                {i + 1}
                              </span>
                            </div>
                          ) : isActions ? (
                            <RowActions
                              onView={() => setSelectedIndex(i)}
                              onDelete={() => onDelete(row.original.id)}
                            />
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <SubmissionDrawer
        open={current !== null}
        submission={current}
        fields={inputFields}
        index={selectedIndex ?? 0}
        total={rows.length}
        onClose={() => setSelectedIndex(null)}
        onStep={step}
        onDelete={onDelete}
      />
    </div>
  );
}

function HeaderLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {icon}
      <span className="truncate" title={label}>
        {label}
      </span>
    </span>
  );
}

function SortArrow({ dir }: { dir: "asc" | "desc" }) {
  return (
    <svg
      className={"h-3 w-3 shrink-0 text-brand " + (dir === "desc" ? "rotate-180" : "")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

type Col = ReturnType<
  ReturnType<typeof useReactTable<Submission>>["getHeaderGroups"]
>[number]["headers"][number]["column"];

function ColumnMenu({
  column,
  onMove,
}: {
  column: Col;
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  return (
    <Menu
      align="right"
      label={() => (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground/70 transition-colors hover:bg-border hover:text-foreground">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <circle cx="12" cy="5" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="12" cy="19" r="1.8" />
          </svg>
        </span>
      )}
    >
      {(close) => (
        <>
          <MenuItem
            onClick={() => {
              column.toggleSorting(false);
              close();
            }}
          >
            Sort ascending
          </MenuItem>
          <MenuItem
            onClick={() => {
              column.toggleSorting(true);
              close();
            }}
          >
            Sort descending
          </MenuItem>
          {column.getIsSorted() && (
            <MenuItem
              onClick={() => {
                column.clearSorting();
                close();
              }}
            >
              Clear sort
            </MenuItem>
          )}
          <div className="my-1 h-px bg-border" />
          <MenuItem
            onClick={() => {
              onMove(column.id, -1);
              close();
            }}
          >
            Move left
          </MenuItem>
          <MenuItem
            onClick={() => {
              onMove(column.id, 1);
              close();
            }}
          >
            Move right
          </MenuItem>
          {column.getCanHide() && (
            <>
              <div className="my-1 h-px bg-border" />
              <MenuItem
                onClick={() => {
                  column.toggleVisibility(false);
                  close();
                }}
              >
                Hide column
              </MenuItem>
            </>
          )}
        </>
      )}
    </Menu>
  );
}

function RowActions({
  onView,
  onDelete,
}: {
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onView();
        }}
        className="flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-brand pl-2 pr-2.5 text-xs font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
        View
      </button>
      <IconButton
        label="Delete response"
        danger
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        </svg>
      </IconButton>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  danger = false,
  children,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={
        "flex h-7 w-7 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
        (danger
          ? "text-muted-foreground hover:bg-destructive-subtle hover:text-destructive"
          : "text-muted-foreground hover:bg-border hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (e: unknown) => void;
  label: string;
}) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      ref={(el) => {
        if (el) el.indeterminate = indeterminate && !checked;
      }}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-brand"
    />
  );
}

function EmptyState({ formId }: { formId: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <svg
        className="mb-5 h-28 w-28 text-border"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="18" y="14" width="84" height="92" rx="8" />
        <path d="M18 40h84M46 14v92" className="opacity-60" />
        <path d="M60 58h30M60 74h30" className="opacity-40" />
        <circle cx="88" cy="92" r="20" fill="var(--card)" />
        <path d="M88 84v16M80 92h16" className="text-brand" strokeWidth={3.5} />
      </svg>
      <p className="text-base font-semibold text-foreground">No submissions yet</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Share your form&apos;s public link and responses will land here in real time.
      </p>
      <a
        href={`/forms/${formId}`}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Open Form
      </a>
    </div>
  );
}

function NoMatches({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-base font-semibold text-foreground">No matching responses</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Nothing matches your search or filters.
      </p>
      <button
        onClick={onClear}
        className="mt-4 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Clear search and filters
      </button>
    </div>
  );
}

function Toolbar({
  formId,
  query,
  onQuery,
  choiceFields,
  choiceFilters,
  onChoiceFilters,
  activeFilters,
  table,
  sorting,
  onSorting,
  selectedCount,
  isRefreshing,
  onRefresh,
}: {
  formId: string;
  query: string;
  onQuery: (v: string) => void;
  choiceFields: Field[];
  choiceFilters: Record<string, string>;
  onChoiceFilters: (v: Record<string, string>) => void;
  activeFilters: number;
  table: ReturnType<typeof useReactTable<Submission>>;
  sorting: SortingState;
  onSorting: (v: SortingState) => void;
  selectedCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((c) => c.getCanHide() && c.id !== SUBMITTED_COL);
  const hiddenCount = hideableColumns.filter((c) => !c.getIsVisible()).length;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-card px-4 py-2.5">
      <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search all responses"
          className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      {choiceFields.length > 0 && (
        <Menu
          label={() => (
            <ToolbarChip active={activeFilters > 0} count={activeFilters}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" />
              </svg>
              Filter
            </ToolbarChip>
          )}
        >
          {() => (
            <div className="w-64 p-3">
              {choiceFields.map((field) => (
                <label key={field.id} className="mb-2.5 block last:mb-0">
                  <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                    {field.label}
                  </span>
                  <select
                    value={choiceFilters[field.id] ?? ""}
                    onChange={(e) =>
                      onChoiceFilters({ ...choiceFilters, [field.id]: e.target.value })
                    }
                    className="h-8 w-full rounded-lg border border-input bg-card px-2 text-sm text-foreground outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <option value="">All</option>
                    {(field.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              {activeFilters > 0 && (
                <button
                  onClick={() => onChoiceFilters({})}
                  className="mt-2 w-full rounded-lg border border-border px-2 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </Menu>
      )}

      <Menu
        label={() => (
          <ToolbarChip active={sorting.length > 0} count={sorting.length}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
              <path d="M3 6h12M3 12h9M3 18h6M17 8l4-4 4 4M21 4v16" />
            </svg>
            Sort
          </ToolbarChip>
        )}
      >
        {() => (
          <div className="w-60 p-1">
            {table
              .getAllLeafColumns()
              .filter((c) => c.getCanSort())
              .map((c) => {
                const dir = c.getIsSorted();
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-muted"
                  >
                    <span className="flex-1 truncate text-sm font-medium text-foreground">
                      {c.id === SUBMITTED_COL ? "Submitted" : columnLabel(table, c.id)}
                    </span>
                    <SortToggle
                      active={dir === "asc"}
                      onClick={() => c.toggleSorting(false, true)}
                      label="Ascending"
                      dir="asc"
                    />
                    <SortToggle
                      active={dir === "desc"}
                      onClick={() => c.toggleSorting(true, true)}
                      label="Descending"
                      dir="desc"
                    />
                  </div>
                );
              })}
            {sorting.length > 0 && (
              <button
                onClick={() => onSorting([])}
                className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Clear sorting
              </button>
            )}
            <p className="px-2 pt-2 text-[11px] leading-snug text-muted-foreground">
              Pick more than one column to sort by several at once.
            </p>
          </div>
        )}
      </Menu>

      <Menu
        label={() => (
          <ToolbarChip active={hiddenCount > 0} count={hiddenCount}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18M15 3v18" />
            </svg>
            Columns
          </ToolbarChip>
        )}
      >
        {() => (
          <div className="max-h-72 w-56 overflow-y-auto p-1">
            {hideableColumns.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={c.getIsVisible()}
                  onChange={c.getToggleVisibilityHandler()}
                  className="h-3.5 w-3.5 accent-brand"
                />
                <span className="truncate text-sm font-medium text-foreground">
                  {columnLabel(table, c.id)}
                </span>
              </label>
            ))}
          </div>
        )}
      </Menu>

      <div className="ml-auto flex items-center gap-2">
        {selectedCount > 0 && (
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800 tabular-nums">
            {selectedCount} selected
          </span>
        )}

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          <svg
            className={"h-4 w-4 " + (isRefreshing ? "animate-spin" : "")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" />
          </svg>
          Refresh
        </button>

        <Menu
          align="right"
          label={() => (
            <span className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
              </svg>
              Export
            </span>
          )}
        >
          {(close) => (
            <>
              <ExportItem formId={formId} format="csv" label="Export CSV" onDone={close} />
              <ExportItem formId={formId} format="xlsx" label="Export Excel" onDone={close} />
              <ExportItem formId={formId} format="json" label="Export JSON" onDone={close} />
            </>
          )}
        </Menu>
      </div>
    </div>
  );
}

function ExportItem({
  formId,
  format,
  label,
  onDone,
}: {
  formId: string;
  format: string;
  label: string;
  onDone: () => void;
}) {
  return (
    <a
      role="menuitem"
      href={`/api/forms/${formId}/export?format=${format}`}
      onClick={onDone}
      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      {label}
    </a>
  );
}

function columnLabel(
  table: ReturnType<typeof useReactTable<Submission>>,
  id: string
) {
  if (id === SUBMITTED_COL) return "Submitted";
  const meta = table.getColumn(id)?.columnDef.meta as { label?: string } | undefined;
  return meta?.label ?? id;
}

function SortToggle({
  active,
  onClick,
  label,
  dir,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dir: "asc" | "desc";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={
        "flex h-6 w-6 items-center justify-center rounded transition-colors " +
        (active
          ? "bg-brand text-brand-foreground"
          : "text-muted-foreground hover:bg-border hover:text-foreground")
      }
    >
      <svg
        className={"h-3 w-3 " + (dir === "desc" ? "rotate-180" : "")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}

function ToolbarChip({
  active,
  count,
  children,
}: {
  active: boolean;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <span
      className={
        "flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors " +
        (active
          ? "border-brand bg-brand-subtle text-brand"
          : "border-border bg-card text-foreground hover:bg-muted")
      }
    >
      {children}
      {count > 0 && (
        <span className="rounded-full bg-brand px-1.5 text-xs font-bold text-brand-foreground tabular-nums">
          {count}
        </span>
      )}
    </span>
  );
}
