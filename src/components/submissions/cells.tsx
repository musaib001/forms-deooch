import type { Field, FieldType } from "@/lib/forms/schema";
import { CHOICE_FIELD_TYPES } from "@/lib/forms/schema";
import { formatDate } from "@/lib/date";

export type RespondentMeta = {
  ip?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  userAgent?: string | null;
} | null;

export type Submission = {
  id: string;
  answers: Record<string, string | string[]>;
  submitted_at: string;
  respondent_meta: RespondentMeta;
};

// Solid pastel fill + near-black text: at grid density a chip has to read as a
// discrete object, which a tinted-text chip doesn't do at 13px.
const TAG_COLORS = [
  "bg-indigo-100 text-indigo-900",
  "bg-emerald-100 text-emerald-900",
  "bg-amber-100 text-amber-900",
  "bg-rose-100 text-rose-900",
  "bg-sky-100 text-sky-900",
  "bg-violet-100 text-violet-900",
  "bg-teal-100 text-teal-900",
];

// Stable per-value colour so the same option reads the same across every row.
function tagColor(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export function asArray(value: string | string[] | undefined) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function isChoice(field: Field) {
  return CHOICE_FIELD_TYPES.includes(field.type);
}

export function Tag({ value }: { value: string }) {
  return (
    <span
      className={
        "inline-flex max-w-full shrink-0 truncate rounded px-2.5 py-1 text-[13px] font-medium leading-4 " +
        tagColor(value)
      }
    >
      {value}
    </span>
  );
}

function Empty() {
  return <span className="text-muted-foreground/70">—</span>;
}

// Links stay neutral at rest: a column of orange emails fights the toolbar's
// primary actions for attention. Brand colour is the hover affordance only.
const linkClass =
  "truncate text-foreground decoration-muted-foreground/40 underline underline-offset-2 hover:text-brand hover:decoration-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

/** Renders one answer according to its field type. Used by both grid and drawer. */
export function Cell({
  field,
  value,
  multiline = false,
}: {
  field: Field;
  value: string | string[] | undefined;
  multiline?: boolean;
}) {
  const values = asArray(value).filter((v) => v !== "");
  if (values.length === 0) return <Empty />;

  if (isChoice(field)) {
    return (
      // Grid rows are a fixed height, so chips clip rather than wrap; the
      // drawer (multiline) is the place that shows every value.
      <div
        className={
          "flex gap-1 " + (multiline ? "flex-wrap" : "flex-nowrap overflow-hidden")
        }
      >
        {values.map((v) => (
          <Tag key={v} value={v} />
        ))}
      </div>
    );
  }

  const text = values.join(", ");

  switch (field.type) {
    case "email":
      return (
        <a href={`mailto:${text}`} className={"block " + linkClass}>
          {text}
        </a>
      );
    case "phone":
      return (
        <a href={`tel:${text.replace(/[^\d+]/g, "")}`} className={"block " + linkClass}>
          {text}
        </a>
      );
    case "file":
      return (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          className={"block " + linkClass}
        >
          {text}
        </a>
      );
    case "number":
      return <span className="block tabular-nums text-foreground">{text}</span>;
    case "date":
      return (
        <span className="block whitespace-nowrap text-foreground">
          {/^\d{4}-\d{2}-\d{2}/.test(text) ? formatDate(text) : text}
        </span>
      );
    default:
      return (
        <span
          className={
            multiline ? "block whitespace-pre-wrap text-foreground" : "block truncate text-foreground"
          }
          title={multiline ? undefined : text}
        >
          {text}
        </span>
      );
  }
}

export function FieldTypeIcon({ type }: { type: FieldType }) {
  const glyph: Record<FieldType, string> = {
    text: "T",
    textarea: "¶",
    email: "@",
    phone: "☎",
    number: "#",
    select: "▾",
    radio: "◉",
    checkbox: "☑",
    date: "▦",
    file: "🔗",
    heading: "H",
  };
  return (
    <span
      aria-hidden
      className="flex h-4 w-4 shrink-0 items-center justify-center text-[11px] leading-none text-muted-foreground"
    >
      {glyph[type]}
    </span>
  );
}
