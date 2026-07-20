"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Field } from "@/lib/forms/schema";
import { isInputField } from "@/lib/forms/schema";
import { validateField, type FieldValue } from "@/lib/forms/validation";
import { ADDRESS_PARTS, addressParts } from "@/lib/forms/address";
import { formatPhone, helpTextClass, inputClass, labelClass } from "@/lib/ui";

type Value = FieldValue;

export function PublicFormRenderer({
  formId,
  slug,
  title,
  description,
  fields,
  preview = false,
}: {
  formId: string;
  slug: string;
  title: string;
  description: string | null;
  fields: Field[];
  preview?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, Value>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewValid, setPreviewValid] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const orderedFields = [...fields].sort((a, b) => a.order - b.order);
  const inputFields = orderedFields.filter(isInputField);

  function setValue(fieldId: string, value: Value) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  }

  function onBlur(field: Field) {
    const error = validateField(field, values[field.id]);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field.id] = error;
      else delete next[field.id];
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setPreviewValid(false);

    const nextErrors: Record<string, string> = {};
    for (const field of inputFields) {
      const error = validateField(field, values[field.id]);
      if (error) nextErrors[field.id] = error;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = inputFields.find((f) => nextErrors[f.id]);
      if (firstInvalid) {
        const el = fieldRefs.current[firstInvalid.id];
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
      }
      return;
    }

    // Preview mode validates but never persists a submission.
    if (preview) {
      setPreviewValid(true);
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/forms/${formId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: values }),
    });
    setSubmitting(false);

    if (!res.ok) {
      setFormError("Something went wrong submitting the form. Please try again.");
      return;
    }

    router.push(`/f/${slug}/thank-you`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <form
        onSubmit={submit}
        noValidate
        aria-busy={submitting}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div aria-hidden className="h-1.5 bg-brand" />
        <header className="border-b border-border bg-brand-subtle px-6 py-8 text-center sm:px-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </header>

        <div className="flex flex-col gap-7 px-6 py-8 sm:px-10">
          {orderedFields.map((field) =>
            field.type === "heading" ? (
              <h2
                key={field.id}
                className="rounded-xl bg-brand-subtle px-4 py-3 text-center text-lg font-semibold text-foreground"
              >
                {field.label}
              </h2>
            ) : (
              <FieldRow
                key={field.id}
                field={field}
                formId={formId}
                preview={preview}
                value={values[field.id]}
                error={errors[field.id]}
                setValue={(v) => setValue(field.id, v)}
                onBlur={() => onBlur(field)}
                registerRef={(el) => {
                  fieldRefs.current[field.id] = el;
                }}
              />
            )
          )}

          {formError && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive-subtle px-4 py-3 text-sm text-destructive"
            >
              {formError}
            </p>
          )}

          {preview && previewValid && (
            <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              Looks good — this form would submit successfully. (Preview mode:
              nothing was saved.)
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 self-center rounded-lg bg-brand px-8 py-3 text-[15px] font-semibold text-brand-foreground shadow-sm transition-[background-color,transform] duration-100 hover:bg-brand-hover active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-70 disabled:active:translate-y-0 sm:w-auto"
          >
            {submitting && (
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground"
              />
            )}
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Powered by deoochform
      </p>
    </div>
  );
}

function FieldRow({
  field,
  formId,
  preview,
  value,
  error,
  setValue,
  onBlur,
  registerRef,
}: {
  field: Field;
  formId: string;
  preview: boolean;
  value: Value | undefined;
  error?: string;
  setValue: (value: Value) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const helpId = field.helpText ? `${field.id}-help` : undefined;
  const errorId = error ? `${field.id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
  // Address renders a fieldset of sub-inputs, so nothing owns field.id and a
  // htmlFor here would dangle. Its own <legend> names the group instead.
  const isGroup = field.type === "address";
  const Label = isGroup ? "p" : "label";

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={isGroup ? undefined : field.id} className={labelClass}>
        {field.label}
        {field.required && (
          <span className="ml-0.5 text-destructive" aria-hidden>
            *
          </span>
        )}
      </Label>
      {field.helpText && (
        <p id={helpId} className={helpTextClass}>
          {field.helpText}
        </p>
      )}
      <FieldControl
        field={field}
        formId={formId}
        preview={preview}
        value={value}
        invalid={!!error}
        describedBy={describedBy}
        setValue={setValue}
        onBlur={onBlur}
        registerRef={registerRef}
      />
      {error && (
        <p id={errorId} role="alert" className="text-[13px] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function UploadControl({
  formId,
  preview,
  value,
  invalid,
  describedBy,
  setValue,
  onBlur,
  registerRef,
}: {
  formId: string;
  preview: boolean;
  value: string | undefined;
  invalid: boolean;
  describedBy?: string;
  setValue: (value: Value) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_BYTES = 5 * 1024 * 1024;
  const allowed = (t: string) => t.startsWith("image/") || t === "application/pdf";

  function reject(message: string) {
    setError(message);
    setFileName(null);
    setValue("");
  }

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // Client-side guard for fast feedback; the server re-checks authoritatively.
    if (file.size > MAX_BYTES) return reject("File exceeds the 5 MB limit.");
    if (!allowed(file.type)) return reject("Only images and PDF files are allowed.");

    setFileName(file.name);

    // Preview never persists, and the form may still be a draft (the upload
    // endpoint only accepts published forms), so skip the network and just mark
    // the field satisfied so validation can be exercised.
    if (preview) {
      setValue(`preview://${file.name}`);
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`/api/forms/${formId}/upload`, { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return reject(json.error ?? "Upload failed. Try again.");
      setValue(json.url as string);
    } catch {
      reject("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  const hasFile = !!value && !error;

  return (
    <div className="flex flex-col gap-2">
      <label
        className={
          "flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed bg-background px-4 text-sm text-muted-foreground transition-colors " +
          (invalid ? "border-destructive" : "border-input hover:border-brand")
        }
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          ref={registerRef}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={onSelect}
          onBlur={onBlur}
          disabled={uploading}
          className="sr-only"
        />
        {uploading
          ? "Uploading…"
          : hasFile
            ? `✓ ${fileName ?? "File attached"}`
            : "Choose a file (image or PDF, up to 5 MB)"}
      </label>
      {error && <p className="text-[13px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

function FieldControl({
  field,
  formId,
  preview,
  value,
  invalid,
  describedBy,
  setValue,
  onBlur,
  registerRef,
}: {
  field: Field;
  formId: string;
  preview: boolean;
  value: Value | undefined;
  invalid: boolean;
  describedBy?: string;
  setValue: (value: Value) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const common = {
    id: field.id,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
    onBlur,
  };

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          {...common}
          ref={registerRef}
          rows={4}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    case "select":
      return (
        <select
          {...common}
          ref={registerRef}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            {field.placeholder || "Select an option…"}
          </option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case "radio":
      return (
        <fieldset className="flex flex-col gap-2" aria-describedby={describedBy}>
          {(field.options ?? []).map((opt, i) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-2.5 text-[15px] text-foreground"
            >
              <input
                type="radio"
                name={field.id}
                ref={i === 0 ? registerRef : undefined}
                checked={value === opt}
                onChange={() => setValue(opt)}
                onBlur={onBlur}
                className="h-4 w-4 accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>
      );
    case "checkbox":
      return (
        <CheckboxGroup
          field={field}
          value={(value as string[]) ?? []}
          onChange={setValue}
          onBlur={onBlur}
          registerRef={registerRef}
          describedBy={describedBy}
        />
      );
    case "date":
      return (
        <input
          {...common}
          ref={registerRef}
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    case "number":
      return (
        <input
          {...common}
          ref={registerRef}
          type="text"
          inputMode="decimal"
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    case "email":
      return (
        <input
          {...common}
          ref={registerRef}
          type="email"
          autoComplete="email"
          spellCheck={false}
          placeholder={field.placeholder || "you@example.com"}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    case "phone":
      return (
        <input
          {...common}
          ref={registerRef}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder={field.placeholder || "(555) 123-4567"}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(formatPhone(e.target.value))}
          className={inputClass}
        />
      );
    case "address":
      return (
        <AddressGroup
          field={field}
          value={value}
          invalid={invalid}
          describedBy={describedBy}
          setValue={setValue}
          onBlur={onBlur}
          registerRef={registerRef}
        />
      );
    case "file":
      return (
        <input
          {...common}
          ref={registerRef}
          type="url"
          inputMode="url"
          placeholder={field.placeholder || "https://link-to-your-file"}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
    case "upload":
      return (
        <UploadControl
          formId={formId}
          preview={preview}
          value={value as string | undefined}
          invalid={invalid}
          describedBy={describedBy}
          setValue={setValue}
          onBlur={onBlur}
          registerRef={registerRef}
        />
      );
    default:
      return (
        <input
          {...common}
          ref={registerRef}
          type="text"
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
      );
  }
}

function AddressGroup({
  field,
  value,
  invalid,
  describedBy,
  setValue,
  onBlur,
  registerRef,
}: {
  field: Field;
  value: Value | undefined;
  invalid: boolean;
  describedBy?: string;
  setValue: (value: Value) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const parts = addressParts(value);

  function setPart(index: number, next: string) {
    const updated = [...parts];
    updated[index] = next;
    setValue(updated);
  }

  return (
    <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-describedby={describedBy}>
      <legend className="sr-only">{field.label}</legend>
      {ADDRESS_PARTS.map((part, i) => {
        // Street lines span the full width; city/state/postal/country pair up.
        const fullWidth = part.key === "street1" || part.key === "street2";
        const partId = `${field.id}-${part.key}`;
        return (
          <div key={part.key} className={fullWidth ? "sm:col-span-2" : undefined}>
            <input
              id={partId}
              // Only the first input is registered for focus-on-error, and only
              // it carries the aria-invalid for the group's error message.
              ref={i === 0 ? registerRef : undefined}
              aria-invalid={i === 0 ? invalid || undefined : undefined}
              type="text"
              autoComplete={part.autoComplete}
              value={parts[i]}
              onChange={(e) => setPart(i, e.target.value)}
              onBlur={onBlur}
              className={inputClass}
            />
            {/* Caption sits under its input: the sub-label describes what was
                just typed rather than prompting for it, which is the postal-form
                convention the reference follows. */}
            <label
              htmlFor={partId}
              className="mt-1.5 block text-[13px] text-muted-foreground"
            >
              {part.label}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
}

function CheckboxGroup({
  field,
  value,
  onChange,
  onBlur,
  registerRef,
  describedBy,
}: {
  field: Field;
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  registerRef: (el: HTMLElement | null) => void;
  describedBy?: string;
}) {
  function toggle(opt: string, checked: boolean) {
    onChange(checked ? [...value, opt] : value.filter((o) => o !== opt));
  }

  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={describedBy}>
      {(field.options ?? []).map((opt, i) => (
        <label
          key={opt}
          className="flex cursor-pointer items-center gap-2.5 text-[15px] text-foreground"
        >
          <input
            type="checkbox"
            ref={i === 0 ? registerRef : undefined}
            checked={value.includes(opt)}
            onChange={(e) => toggle(opt, e.target.checked)}
            onBlur={onBlur}
            className="h-4 w-4 rounded accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {opt}
        </label>
      ))}
    </fieldset>
  );
}
