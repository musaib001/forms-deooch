import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";
import { buildSubmissionsWorkbook } from "@/lib/export/xlsx";
import { buildSubmissionsCsv, buildSubmissionsJson } from "@/lib/export/csv";

type Params = { params: Promise<{ formId: string }> };

const FORMATS = ["xlsx", "csv", "json"] as const;
type Format = (typeof FORMATS)[number];

export async function GET(request: Request, { params }: Params) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requested = new URL(request.url).searchParams.get("format") ?? "xlsx";
  if (!FORMATS.includes(requested as Format)) {
    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  }
  const format = requested as Format;

  const { formId } = await params;
  const supabase = await createClient();

  const [{ data: form }, { data: submissions }] = await Promise.all([
    supabase.from("forms").select("title, slug, fields").eq("id", formId).single(),
    supabase
      .from("submissions")
      .select("answers, submitted_at")
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false }),
  ]);

  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  const rows = submissions ?? [];
  const filename = `${form.slug}-submissions.${format}`;
  const disposition = `attachment; filename="${filename}"`;

  if (format === "csv") {
    return new NextResponse(buildSubmissionsCsv(form.fields, rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": disposition,
      },
    });
  }

  if (format === "json") {
    return new NextResponse(buildSubmissionsJson(form.fields, rows), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": disposition,
      },
    });
  }

  const buffer = await buildSubmissionsWorkbook(form.title, form.fields, rows);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": disposition,
    },
  });
}
