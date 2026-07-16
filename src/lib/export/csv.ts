import type { Field } from "@/lib/forms/schema";
import { isInputField } from "@/lib/forms/schema";

type Submission = {
  answers: Record<string, string | string[]>;
  submitted_at: string;
};

export function orderedInputFields(fields: Field[]) {
  return [...fields].filter(isInputField).sort((a, b) => a.order - b.order);
}

function cell(value: string) {
  // Excel/Sheets treat a leading =, +, - or @ as a formula. Prefix with a
  // single quote so exported answers can't execute on open (CSV injection).
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function answer(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "";
}

export function buildSubmissionsCsv(fields: Field[], submissions: Submission[]) {
  const cols = orderedInputFields(fields);
  const header = [...cols.map((f) => f.label), "Submitted At"].map(cell).join(",");
  const rows = submissions.map((s) =>
    [
      ...cols.map((f) => answer(s.answers[f.id])),
      new Date(s.submitted_at).toISOString(),
    ]
      .map(cell)
      .join(",")
  );
  return [header, ...rows].join("\r\n");
}

export function buildSubmissionsJson(fields: Field[], submissions: Submission[]) {
  const cols = orderedInputFields(fields);
  return JSON.stringify(
    submissions.map((s) => ({
      submittedAt: s.submitted_at,
      ...Object.fromEntries(cols.map((f) => [f.label, answer(s.answers[f.id])])),
    })),
    null,
    2
  );
}
