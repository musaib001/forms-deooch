"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, GitBranch } from "lucide-react";
import {
  FIELD_TYPES,
  FIELD_TYPE_LABELS,
  CHOICE_FIELD_TYPES,
  type Field,
  type FormStatus,
} from "@/lib/forms/schema";
import { OptionsEditor } from "@/components/forms/OptionsEditor";
import { DeleteFormButton } from "@/components/forms/DeleteFormButton";
import { ITEM_BY_TYPE } from "./library";

type Doc = {
  title: string;
  description: string;
  status: FormStatus;
  fields: Field[];
};

const TABS = ["General", "Validation", "Logic", "Advanced"] as const;
type Tab = (typeof TABS)[number];

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/40";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export function Inspector({
  doc,
  commit,
  field,
  patchField,
  formId,
  publicUrl,
}: {
  doc: Doc;
  commit: (d: Doc, tag?: string) => void;
  field: Field | null;
  patchField: (id: string, patch: Partial<Field>, tag?: string) => void;
  formId: string | null;
  publicUrl: string | null;
}) {
  const [tab, setTab] = useState<Tab>("General");
  const [copied, setCopied] = useState(false);

  return (
    <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-card xl:flex">
      {field ? (
        <>
          <div className="sticky top-0 z-10 border-b border-border bg-card">
            <div className="flex items-center gap-2 px-4 pt-3">
              {(() => {
                const item = ITEM_BY_TYPE[field.type];
                const Icon = item?.icon;
                return Icon ? <Icon className="h-4 w-4 text-brand" aria-hidden /> : null;
              })()}
              <span className="truncate text-sm font-semibold text-foreground">
                {ITEM_BY_TYPE[field.type]?.name ?? FIELD_TYPE_LABELS[field.type]}
              </span>
            </div>
            <div role="tablist" aria-label="Field settings" className="flex gap-1 px-3 pb-0 pt-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={
                    "rounded-t-lg border-b-2 px-2.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                    (tab === t
                      ? "border-brand text-brand"
                      : "border-transparent text-muted-foreground hover:text-foreground")
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4 pb-8">
            {tab === "General" && (
              <>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Label</span>
                  <input
                    className={inputClass}
                    value={field.label}
                    onChange={(e) => patchField(field.id, { label: e.target.value }, "label")}
                    placeholder={field.type === "heading" ? "Section heading" : "Field label"}
                  />
                </label>

                {field.type !== "heading" && !CHOICE_FIELD_TYPES.includes(field.type) && (
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>Placeholder</span>
                    <input
                      className={inputClass}
                      value={field.placeholder ?? ""}
                      onChange={(e) =>
                        patchField(field.id, { placeholder: e.target.value }, "placeholder")
                      }
                      placeholder="Shown inside the empty input"
                    />
                  </label>
                )}

                {field.type !== "heading" && (
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>Help text</span>
                    <input
                      className={inputClass}
                      value={field.helpText ?? ""}
                      onChange={(e) =>
                        patchField(field.id, { helpText: e.target.value }, "help")
                      }
                      placeholder="Shown under the field"
                    />
                  </label>
                )}

                {CHOICE_FIELD_TYPES.includes(field.type) && (
                  <OptionsEditor
                    type={field.type}
                    options={field.options ?? []}
                    onChange={(options) => patchField(field.id, { options })}
                  />
                )}
              </>
            )}

            {tab === "Validation" &&
              (field.type === "heading" ? (
                <p className="text-sm text-muted-foreground">
                  Headings are display-only — nothing to validate.
                </p>
              ) : (
                <>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        Required
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Respondents must answer before submitting.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => patchField(field.id, { required: e.target.checked })}
                      className="h-5 w-5 shrink-0 rounded accent-brand"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {field.type === "email"
                      ? "Email format is validated automatically."
                      : field.type === "number"
                        ? "Only numeric input is accepted."
                        : field.type === "phone"
                          ? "Phone characters are validated automatically."
                          : "Type-appropriate validation is applied automatically."}
                  </p>
                </>
              ))}

            {tab === "Logic" && (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-10 text-center">
                <GitBranch className="h-6 w-6 text-muted-foreground" aria-hidden />
                <p className="text-sm font-semibold text-foreground">Conditional logic</p>
                <p className="text-xs text-muted-foreground">
                  Show or hide fields based on answers. Coming soon.
                </p>
              </div>
            )}

            {tab === "Advanced" && (
              <>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Field type</span>
                  <select
                    className={inputClass}
                    value={field.type}
                    onChange={(e) =>
                      patchField(field.id, { type: e.target.value as Field["type"] })
                    }
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {FIELD_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-col gap-1.5">
                  <span className={labelClass}>Field ID</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(field.id);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    title="Copy field ID"
                    className="flex items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 text-left font-mono text-xs text-muted-foreground transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="truncate">{field.id}</span>
                    {copied ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                    ) : (
                      <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    )}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Used as the answer key in exports and the API.
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        /* -------- Form settings (nothing selected) -------- */
        <div className="flex flex-col gap-5 p-4 pb-8">
          <div>
            <h2 className="text-sm font-bold text-foreground">Form settings</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Select a field on the canvas to edit it here.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Description</span>
            <textarea
              rows={3}
              className={inputClass + " resize-none"}
              value={doc.description}
              onChange={(e) => commit({ ...doc, description: e.target.value }, "desc")}
              placeholder="Shown under the form title"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Status</span>
            <select
              className={inputClass}
              value={doc.status}
              onChange={(e) => commit({ ...doc, status: e.target.value as FormStatus })}
            >
              <option value="draft">Draft — not accepting responses</option>
              <option value="published">Published — live</option>
              <option value="closed">Closed — link works, no new responses</option>
            </select>
          </label>

          {publicUrl && (
            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>Public link</span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs text-brand transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="truncate">{publicUrl}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              </a>
            </div>
          )}

          {formId && (
            <>
              <Link
                href={`/forms/${formId}/submissions`}
                className="flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View responses
              </Link>
              <div className="mt-2 border-t border-border pt-4">
                <span className={labelClass}>Danger zone</span>
                <div className="mt-2">
                  <DeleteFormButton formId={formId} formTitle={doc.title} />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
