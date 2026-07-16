"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  ChevronLeft,
  Copy,
  Eye,
  GripVertical,
  Link2,
  Loader2,
  Monitor,
  Plus,
  Redo2,
  Search,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
} from "lucide-react";
import {
  newFieldId,
  type Field,
  type FieldType,
  type FormStatus,
} from "@/lib/forms/schema";
import { FormPreviewModal } from "@/components/forms/FormPreviewModal";
import { LIBRARY, ITEM_BY_TYPE, type LibraryItem } from "./library";
import { Inspector } from "./Inspector";

type Doc = {
  title: string;
  description: string;
  status: FormStatus;
  fields: Field[];
};

export type ExistingForm = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  fields: Field[];
  status: FormStatus;
};

type SaveState = "saved" | "saving" | "dirty" | "error";

const DEVICE_WIDTHS = { desktop: "42rem", tablet: "30rem", mobile: "23.4375rem" } as const;
type Device = keyof typeof DEVICE_WIDTHS;

const RECENT_KEY = "deooch-recent-fields";

export function FormStudio({ existing }: { existing?: ExistingForm }) {
  const [doc, setDoc] = useState<Doc>({
    title: existing?.title ?? "Untitled form",
    description: existing?.description ?? "",
    status: existing?.status ?? "draft",
    fields: existing?.fields ?? [],
  });
  const [past, setPast] = useState<Doc[]>([]);
  const [future, setFuture] = useState<Doc[]>([]);
  const lastEdit = useRef<{ tag: string | null; at: number }>({ tag: null, at: 0 });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<FieldType[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [dragging, setDragging] = useState<LibraryItem | Field | null>(null);
  const [dropAfterId, setDropAfterId] = useState<string | null>(null);

  // id/slug live in a ref so autosave keeps working after the first POST
  // creates the form without a remount.
  const formRef = useRef({ id: existing?.id ?? null, slug: existing?.slug ?? null });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const pendingScroll = useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  /* ---------- history ---------- */

  const commit = useCallback(
    (next: Doc, tag?: string) => {
      const now = Date.now();
      const coalesce =
        tag !== undefined && tag === lastEdit.current.tag && now - lastEdit.current.at < 1200;
      lastEdit.current = { tag: tag ?? null, at: now };
      if (!coalesce) setPast((p) => [...p.slice(-49), doc]);
      setFuture([]);
      setDoc(next);
    },
    [doc]
  );

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      setFuture((f) => [doc, ...f]);
      setDoc(p[p.length - 1]);
      return p.slice(0, -1);
    });
    lastEdit.current = { tag: null, at: 0 };
  }, [doc]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      setPast((p) => [...p, doc]);
      setDoc(f[0]);
      return f.slice(1);
    });
    lastEdit.current = { tag: null, at: 0 };
  }, [doc]);

  /* ---------- autosave ---------- */

  const saveNow = useCallback(async (snapshot: Doc) => {
    if (!snapshot.title.trim() || inFlight.current) return;
    inFlight.current = true;
    setSaveState("saving");

    const body = {
      title: snapshot.title,
      description: snapshot.description,
      status: snapshot.status,
      fields: snapshot.fields.map((f) =>
        f.options ? { ...f, options: f.options.map((o) => o.trim()).filter(Boolean) } : f
      ),
    };

    try {
      const id = formRef.current.id;
      const res = await fetch(id ? `/api/forms/${id}` : "/api/forms", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          id ? body : { title: body.title, description: body.description, fields: body.fields }
        ),
      });
      if (!res.ok) throw new Error();
      if (!id) {
        const { form } = await res.json();
        formRef.current = { id: form.id, slug: form.slug };
        window.history.replaceState(null, "", `/forms/${form.id}`);
        // A brand-new form may carry a non-draft status; sync it once.
        if (body.status !== "draft") {
          await fetch(`/api/forms/${form.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: body.status }),
          });
        }
      }
      setSaveState("saved");
    } catch {
      setSaveState("error");
    } finally {
      inFlight.current = false;
    }
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaveState("dirty");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveNow(doc), 1000);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [doc, saveNow]);

  /* ---------- field ops ---------- */

  const addField = useCallback(
    (type: FieldType, index?: number) => {
      const item = ITEM_BY_TYPE[type];
      const field: Field = {
        id: newFieldId(),
        type,
        label: item ? item.name : "",
        required: false,
        order: 0,
        ...(["select", "radio", "checkbox"].includes(type)
          ? { options: ["Option 1", "Option 2"] }
          : {}),
      };
      const at = index ?? doc.fields.length;
      const fields = [...doc.fields];
      fields.splice(at, 0, field);
      commit({ ...doc, fields: fields.map((f, i) => ({ ...f, order: i })) });
      setSelectedId(field.id);
      pendingScroll.current = field.id;
      setRecent((r) => {
        const next = [type, ...r.filter((t) => t !== type)].slice(0, 4);
        try {
          localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [doc, commit]
  );

  const patchField = useCallback(
    (id: string, patch: Partial<Field>, tag?: string) => {
      commit(
        {
          ...doc,
          fields: doc.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        },
        tag
      );
    },
    [doc, commit]
  );

  const removeField = useCallback(
    (id: string) => {
      commit({
        ...doc,
        fields: doc.fields.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i })),
      });
      setSelectedId((s) => (s === id ? null : s));
    },
    [doc, commit]
  );

  const duplicateField = useCallback(
    (id: string) => {
      const i = doc.fields.findIndex((f) => f.id === id);
      if (i < 0) return;
      const copy = { ...doc.fields[i], id: newFieldId() };
      const fields = [...doc.fields];
      fields.splice(i + 1, 0, copy);
      commit({ ...doc, fields: fields.map((f, j) => ({ ...f, order: j })) });
      setSelectedId(copy.id);
      pendingScroll.current = copy.id;
    },
    [doc, commit]
  );

  useEffect(() => {
    if (!pendingScroll.current) return;
    document
      .querySelector(`[data-field-id="${pendingScroll.current}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    pendingScroll.current = null;
  }, [doc.fields]);

  /* ---------- keyboard shortcuts ---------- */

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      const inInput =
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "d" && selectedId) {
        e.preventDefault();
        duplicateField(selectedId);
        return;
      }
      if (inInput) return;
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId) {
        e.preventDefault();
        removeField(selectedId);
      }
      if (e.key === "Escape") setSelectedId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [undo, redo, selectedId, duplicateField, removeField]);

  /* ---------- drag & drop ---------- */

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragStart(e: DragStartEvent) {
    const data = e.active.data.current;
    if (data?.from === "library") setDragging(ITEM_BY_TYPE[data.type as string]);
    else setDragging(doc.fields.find((f) => f.id === e.active.id) ?? null);
  }

  function onDragOver(e: DragOverEvent) {
    if (e.active.data.current?.from !== "library") return;
    const overId = e.over?.id;
    setDropAfterId(
      overId && overId !== "canvas" ? String(overId) : overId === "canvas" ? "__end__" : null
    );
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setDragging(null);
    setDropAfterId(null);
    if (!over) return;

    if (active.data.current?.from === "library") {
      const type = active.data.current.type as FieldType;
      if (over.id === "canvas") addField(type);
      else {
        const i = doc.fields.findIndex((f) => f.id === over.id);
        addField(type, i < 0 ? undefined : i + 1);
      }
      return;
    }

    // Reorder within canvas
    if (active.id !== over.id) {
      const from = doc.fields.findIndex((f) => f.id === active.id);
      const to = doc.fields.findIndex((f) => f.id === over.id);
      if (from < 0 || to < 0) return;
      commit({
        ...doc,
        fields: arrayMove(doc.fields, from, to).map((f, i) => ({ ...f, order: i })),
      });
    }
  }

  /* ---------- misc ---------- */

  const publicUrl = formRef.current.slug
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/f/${formRef.current.slug}`
    : null;

  async function copyLink() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const selected = doc.fields.find((f) => f.id === selectedId) ?? null;

  const filteredLibrary = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LIBRARY;
    return LIBRARY.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <Toolbar
        doc={doc}
        commit={commit}
        saveState={saveState}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        undo={undo}
        redo={redo}
        device={device}
        setDevice={setDevice}
        onPreview={() => setShowPreview(true)}
        onShare={copyLink}
        copied={copied}
        hasLink={!!publicUrl}
      />

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={() => {
          setDragging(null);
          setDropAfterId(null);
        }}
      >
        <div className="flex min-h-0 flex-1">
          {/* LEFT — component library */}
          <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-r border-border bg-card lg:flex">
            <div className="sticky top-0 z-10 border-b border-border bg-card p-3">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search components"
                  aria-label="Search components"
                  className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 p-3 pb-8">
              {!query && recent.length > 0 && (
                <section>
                  <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recently used
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {recent
                      .map((t) => ITEM_BY_TYPE[t])
                      .filter(Boolean)
                      .map((item) => (
                        <LibraryCard key={"recent-" + item.type} item={item} onAdd={addField} />
                      ))}
                  </div>
                </section>
              )}
              {filteredLibrary.map((cat) => (
                <section key={cat.name}>
                  <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {cat.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.items.map((item) => (
                      <LibraryCard key={String(item.type)} item={item} onAdd={addField} />
                    ))}
                  </div>
                </section>
              ))}
              {filteredLibrary.length === 0 && (
                <p className="px-1 text-sm text-muted-foreground">
                  No components match &ldquo;{query}&rdquo;.
                </p>
              )}
            </div>
          </aside>

          {/* CENTER — canvas */}
          <Canvas
            doc={doc}
            device={device}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            commit={commit}
            patchField={patchField}
            removeField={removeField}
            duplicateField={duplicateField}
            addField={addField}
            dropAfterId={dropAfterId}
          />

          {/* RIGHT — inspector */}
          <Inspector
            key={selectedId ?? "form"}
            doc={doc}
            commit={commit}
            field={selected}
            patchField={patchField}
            formId={formRef.current.id}
            publicUrl={publicUrl}
          />
        </div>

        <DragOverlay dropAnimation={null}>
          {dragging && "name" in dragging ? (
            <div className="flex w-56 items-center gap-2.5 rounded-xl border border-brand bg-card p-3 shadow-lg">
              <dragging.icon className="h-4 w-4 text-brand" aria-hidden />
              <span className="text-sm font-semibold text-foreground">{dragging.name}</span>
            </div>
          ) : dragging ? (
            <div className="w-72 rounded-xl border border-brand bg-card p-4 opacity-90 shadow-lg">
              <p className="truncate text-sm font-semibold text-foreground">
                {(dragging as Field).label || "Untitled field"}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {showPreview && (
        <FormPreviewModal
          title={doc.title}
          description={doc.description}
          fields={doc.fields}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

/* ================= Toolbar ================= */

function Toolbar({
  doc,
  commit,
  saveState,
  canUndo,
  canRedo,
  undo,
  redo,
  device,
  setDevice,
  onPreview,
  onShare,
  copied,
  hasLink,
}: {
  doc: Doc;
  commit: (d: Doc, tag?: string) => void;
  saveState: SaveState;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  device: Device;
  setDevice: (d: Device) => void;
  onPreview: () => void;
  onShare: () => void;
  copied: boolean;
  hasLink: boolean;
}) {
  const untitled = !doc.title.trim();
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
      <Link
        href="/dashboard"
        aria-label="Back to forms"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </Link>

      <input
        value={doc.title}
        onChange={(e) => commit({ ...doc, title: e.target.value }, "title")}
        placeholder="Untitled form"
        aria-label="Form name"
        className="h-9 w-48 rounded-lg border border-transparent bg-transparent px-2 text-sm font-semibold text-foreground outline-none transition-colors hover:border-border focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40 sm:w-64"
      />

      <span
        role="status"
        className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex"
      >
        {saveState === "saving" ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> Saving…
          </>
        ) : saveState === "saved" ? (
          <>
            <Check className="h-3 w-3 text-success" aria-hidden /> Saved
          </>
        ) : saveState === "error" ? (
          <span className="text-destructive">Save failed — will retry</span>
        ) : untitled ? (
          "Name your form to save"
        ) : (
          "Unsaved changes"
        )}
      </span>

      <div className="ml-auto flex items-center gap-1.5">
        <IconBtn label="Undo (⌘Z)" onClick={undo} disabled={!canUndo}>
          <Undo2 className="h-4 w-4" aria-hidden />
        </IconBtn>
        <IconBtn label="Redo (⇧⌘Z)" onClick={redo} disabled={!canRedo}>
          <Redo2 className="h-4 w-4" aria-hidden />
        </IconBtn>

        <div
          role="group"
          aria-label="Preview width"
          className="mx-1.5 hidden items-center rounded-lg border border-border p-0.5 md:flex"
        >
          {(
            [
              ["desktop", Monitor, "Desktop view"],
              ["tablet", Tablet, "Tablet view"],
              ["mobile", Smartphone, "Mobile view"],
            ] as const
          ).map(([d, Icon, label]) => (
            <button
              key={d}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={device === d}
              onClick={() => setDevice(d)}
              className={
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                (device === d
                  ? "bg-brand-subtle text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onPreview}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Eye className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {hasLink && (
          <button
            type="button"
            onClick={onShare}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" aria-hidden />
            ) : (
              <Link2 className="h-4 w-4" aria-hidden />
            )}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
          </button>
        )}

        {doc.status === "published" ? (
          <select
            value={doc.status}
            onChange={(e) => commit({ ...doc, status: e.target.value as FormStatus })}
            aria-label="Form status"
            className="h-9 cursor-pointer rounded-lg border border-success/40 bg-success/10 px-2.5 text-sm font-semibold text-success outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="published">● Live</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        ) : (
          <button
            type="button"
            disabled={untitled}
            onClick={() => commit({ ...doc, status: "published" })}
            className="flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          >
            Publish
          </button>
        )}
      </div>
    </header>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

/* ================= Library card ================= */

function LibraryCard({
  item,
  onAdd,
}: {
  item: LibraryItem;
  onAdd: (type: FieldType) => void;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `lib-${item.type}`,
    data: { from: "library", type: item.type },
    disabled: item.comingSoon,
  });
  const Icon = item.icon;

  if (item.comingSoon) {
    return (
      <div
        aria-disabled
        title="Coming soon"
        className="relative flex cursor-not-allowed flex-col gap-1 rounded-xl border border-border bg-muted/40 p-2.5 opacity-60"
      >
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="text-xs font-semibold text-foreground">{item.name}</span>
        <span className="text-[11px] leading-tight text-muted-foreground">{item.description}</span>
        <span className="absolute right-1.5 top-1.5 rounded bg-muted px-1 py-px text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
          Soon
        </span>
      </div>
    );
  }

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      onClick={() => onAdd(item.type as FieldType)}
      title={`Add ${item.name} — click or drag to canvas`}
      className="flex cursor-grab flex-col gap-1 rounded-xl border border-border bg-card p-2.5 text-left transition-all duration-150 hover:-translate-y-px hover:border-brand/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
    >
      <Icon className="h-4 w-4 text-brand" aria-hidden />
      <span className="text-xs font-semibold text-foreground">{item.name}</span>
      <span className="text-[11px] leading-tight text-muted-foreground">{item.description}</span>
    </button>
  );
}

/* ================= Canvas ================= */

function Canvas({
  doc,
  device,
  selectedId,
  setSelectedId,
  commit,
  patchField,
  removeField,
  duplicateField,
  addField,
  dropAfterId,
}: {
  doc: Doc;
  device: Device;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  commit: (d: Doc, tag?: string) => void;
  patchField: (id: string, patch: Partial<Field>, tag?: string) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  addField: (type: FieldType) => void;
  dropAfterId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  return (
    <main
      ref={setNodeRef}
      onClick={() => setSelectedId(null)}
      className="min-w-0 flex-1 overflow-y-auto bg-muted/40 px-4 py-8"
    >
      <div
        className="mx-auto flex flex-col gap-3 transition-[max-width] duration-300"
        style={{ maxWidth: DEVICE_WIDTHS[device] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Form header card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <input
            value={doc.title}
            onChange={(e) => commit({ ...doc, title: e.target.value }, "title")}
            placeholder="Untitled form"
            aria-label="Form title"
            className="w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-2xl font-bold tracking-tight text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 hover:border-border focus-visible:border-brand"
          />
          <input
            value={doc.description}
            onChange={(e) => commit({ ...doc, description: e.target.value }, "desc")}
            placeholder="Add a description…"
            aria-label="Form description"
            className="mt-1 w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-sm text-muted-foreground outline-none transition-colors placeholder:text-muted-foreground/50 hover:border-border focus-visible:border-brand"
          />
        </div>

        <SortableContext
          items={doc.fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {doc.fields.map((field) => (
            <div key={field.id}>
              <SortableFieldCard
                field={field}
                selected={selectedId === field.id}
                onSelect={() => setSelectedId(field.id)}
                patch={(p, tag) => patchField(field.id, p, tag)}
                onRemove={() => removeField(field.id)}
                onDuplicate={() => duplicateField(field.id)}
              />
              {dropAfterId === field.id && <DropLine />}
            </div>
          ))}
        </SortableContext>

        {doc.fields.length === 0 ? (
          <div
            className={
              "flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors " +
              (isOver ? "border-brand bg-brand-subtle/50" : "border-border bg-card/50")
            }
          >
            <p className="text-sm font-semibold text-foreground">Your form is empty</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Drag a component from the library, or start with the essentials:
            </p>
            <div className="mt-1 flex flex-wrap justify-center gap-2">
              {(["text", "email", "select"] as FieldType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addField(t)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                  {ITEM_BY_TYPE[t].name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {dropAfterId === "__end__" && <DropLine />}
            <div
              className={
                "rounded-xl border border-dashed py-3 text-center text-xs font-medium transition-colors " +
                (isOver
                  ? "border-brand bg-brand-subtle/50 text-brand"
                  : "border-border/70 text-muted-foreground/60")
              }
            >
              Drop components here
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function DropLine() {
  return (
    <div className="relative my-1.5 h-0.5 rounded-full bg-brand">
      <span className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full bg-brand" />
    </div>
  );
}

/* ================= Field card ================= */

const fauxInput =
  "pointer-events-none flex h-10 w-full items-center rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground/60";

function SortableFieldCard({
  field,
  selected,
  onSelect,
  patch,
  onRemove,
  onDuplicate,
}: {
  field: Field;
  selected: boolean;
  onSelect: () => void;
  patch: (p: Partial<Field>, tag?: string) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id, data: { from: "canvas" } });

  const isHeading = field.type === "heading";
  const isChoice = ["select", "radio", "checkbox"].includes(field.type);

  return (
    <div
      ref={setNodeRef}
      data-field-id={field.id}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onSelect}
      onFocusCapture={onSelect}
      className={
        "group relative rounded-2xl border bg-card p-5 shadow-sm transition-[border-color,box-shadow] duration-150 " +
        (isDragging
          ? "z-10 opacity-40 "
          : selected
            ? "border-brand ring-2 ring-ring/30 "
            : "border-border hover:border-brand/40 ")
      }
    >
      {/* Floating toolbar */}
      <div
        className={
          "absolute -top-3.5 right-3 flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm transition-opacity duration-150 " +
          (selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100")
        }
      >
        <button
          type="button"
          title="Drag to reorder"
          aria-label="Drag to reorder"
          {...listeners}
          {...attributes}
          className="flex h-7 w-7 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" aria-hidden />
        </button>
        {!isHeading && (
          <button
            type="button"
            title={field.required ? "Make optional" : "Make required"}
            aria-label={field.required ? "Make optional" : "Make required"}
            aria-pressed={field.required}
            onClick={(e) => {
              e.stopPropagation();
              patch({ required: !field.required });
            }}
            className={
              "flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
              (field.required
                ? "bg-brand-subtle text-brand"
                : "text-muted-foreground hover:bg-muted hover:text-foreground")
            }
          >
            *
          </button>
        )}
        <button
          type="button"
          title="Duplicate (⌘D)"
          aria-label="Duplicate field"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Copy className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          title="Delete"
          aria-label="Delete field"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive-subtle hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {/* Inline-editable content */}
      {isHeading ? (
        <input
          value={field.label}
          onChange={(e) => patch({ label: e.target.value }, "label")}
          placeholder="Section heading"
          aria-label="Section heading"
          className="w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-lg font-bold text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 hover:border-border focus-visible:border-brand"
        />
      ) : (
        <>
          <div className="flex items-center gap-1">
            <input
              value={field.label}
              onChange={(e) => patch({ label: e.target.value }, "label")}
              placeholder="Field label"
              aria-label="Field label"
              className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 hover:border-border focus-visible:border-brand"
            />
            {field.required && (
              <span aria-hidden className="shrink-0 text-sm font-bold text-brand">
                *
              </span>
            )}
          </div>

          <div className="mt-2">
            <FieldBody field={field} patch={patch} />
          </div>

          <input
            value={field.helpText ?? ""}
            onChange={(e) => patch({ helpText: e.target.value }, "help")}
            placeholder="Add help text…"
            aria-label="Help text"
            className={
              "mt-1.5 w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-xs text-muted-foreground outline-none transition-colors placeholder:text-muted-foreground/40 hover:border-border focus-visible:border-brand " +
              (!field.helpText && !selected ? "hidden group-hover:block group-focus-within:block" : "")
            }
          />
        </>
      )}
    </div>
  );
}

function FieldBody({
  field,
  patch,
}: {
  field: Field;
  patch: (p: Partial<Field>, tag?: string) => void;
}) {
  const placeholderInput = (
    <input
      value={field.placeholder ?? ""}
      onChange={(e) => patch({ placeholder: e.target.value }, "placeholder")}
      placeholder="Type placeholder text…"
      aria-label="Placeholder text"
      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm italic text-muted-foreground/70 outline-none transition-[border-color] placeholder:not-italic placeholder:text-muted-foreground/40 focus-visible:border-brand"
    />
  );

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          value={field.placeholder ?? ""}
          onChange={(e) => patch({ placeholder: e.target.value }, "placeholder")}
          placeholder="Type placeholder text…"
          aria-label="Placeholder text"
          rows={2}
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm italic text-muted-foreground/70 outline-none transition-[border-color] placeholder:not-italic placeholder:text-muted-foreground/40 focus-visible:border-brand"
        />
      );
    case "date":
      return <div className={fauxInput}>📅 Respondent picks a date</div>;
    case "file":
      return (
        <div className="pointer-events-none flex h-14 w-full items-center justify-center rounded-lg border border-dashed border-input bg-background text-sm text-muted-foreground/60">
          Respondent pastes a file link
        </div>
      );
    case "select":
    case "radio":
    case "checkbox": {
      const opts = (field.options ?? []).filter(Boolean);
      return (
        <ul className="flex flex-col gap-1.5">
          {(opts.length ? opts : ["Option 1"]).slice(0, 5).map((o, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
              {field.type === "checkbox" ? (
                <span aria-hidden className="h-4 w-4 rounded border-2 border-input" />
              ) : field.type === "radio" ? (
                <span aria-hidden className="h-4 w-4 rounded-full border-2 border-input" />
              ) : (
                <span aria-hidden className="w-4 text-center text-xs text-muted-foreground">
                  {i + 1}
                </span>
              )}
              {o}
            </li>
          ))}
          {opts.length > 5 && (
            <li className="text-xs text-muted-foreground">+ {opts.length - 5} more</li>
          )}
          <li className="text-xs text-muted-foreground/60">Edit options in the panel →</li>
        </ul>
      );
    }
    default:
      return placeholderInput;
  }
}
