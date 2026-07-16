import { expect, test } from "vitest";
import { buildSubmissionsCsv, buildSubmissionsJson } from "./csv";
import type { Field } from "@/lib/forms/schema";

const fields: Field[] = [
  { id: "b", type: "text", label: "Name", required: false, order: 2 },
  { id: "a", type: "checkbox", label: "Tags", required: false, order: 1 },
  { id: "h", type: "heading", label: "Section", required: false, order: 0 },
];

const rows = [
  {
    answers: { b: 'He said "hi", loudly', a: ["x", "y"] },
    submitted_at: "2026-07-15T10:00:00.000Z",
  },
];

test("orders by field order, drops headings, joins multi-values", () => {
  const csv = buildSubmissionsCsv(fields, rows);
  const [header, row] = csv.split("\r\n");
  // heading excluded; "Tags" (order 1) before "Name" (order 2)
  expect(header).toBe('"Tags","Name","Submitted At"');
  expect(row).toContain('"x, y"');
});

test("escapes embedded quotes by doubling them", () => {
  const row = buildSubmissionsCsv(fields, rows).split("\r\n")[1];
  expect(row).toContain('"He said ""hi"", loudly"');
});

test("neutralises formula-injection prefixes", () => {
  const evil = [
    { answers: { b: "=cmd|'/c calc'!A1", a: "+1" }, submitted_at: "2026-07-15T10:00:00.000Z" },
  ];
  const row = buildSubmissionsCsv(fields, evil).split("\r\n")[1];
  expect(row).toContain(`"'=cmd|'/c calc'!A1"`);
  expect(row).toContain(`"'+1"`);
});

test("json export keys by label and omits headings", () => {
  const parsed = JSON.parse(buildSubmissionsJson(fields, rows));
  expect(parsed).toEqual([
    { submittedAt: "2026-07-15T10:00:00.000Z", Tags: "x, y", Name: 'He said "hi", loudly' },
  ]);
  expect(Object.keys(parsed[0])).not.toContain("Section");
});
