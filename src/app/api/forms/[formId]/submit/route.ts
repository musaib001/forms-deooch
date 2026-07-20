import { NextResponse, after } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Field } from "@/lib/forms/schema";
import { quotaFor } from "@/lib/plans";
import { notifyOwnerOfSubmission } from "@/lib/email/notify";

const submitSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

type Params = { params: Promise<{ formId: string }> };

// Public submission is inherently identity-independent: anyone with the
// link can submit, whether they're logged out or logged into a *different*
// deoochform account. So this route reads/writes via the service-role
// client rather than the caller's own (possibly unrelated) RLS grant.
//
// ponytail: no rate limiting yet; add an Upstash/Vercel-KV token bucket
// keyed by IP+formId if abusive public submissions become a problem.
export async function POST(request: Request, { params }: Params) {
  const { formId } = await params;
  const body = submitSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: form } = await admin
    .from("forms")
    .select("id, title, status, fields, created_by")
    .eq("id", formId)
    .eq("status", "published")
    // Admin client bypasses RLS, so trashed forms must be excluded explicitly
    // or a deleted form would keep accepting public submissions.
    .is("deleted_at", null)
    .maybeSingle();

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const missingRequired = (form.fields as Field[]).some(
    (field) => field.required && !body.data.answers[field.id]
  );
  if (missingRequired) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // id comes back so the owner notification can deep-link to this response.
  const { data: submission, error } = await admin
    .from("submissions")
    .insert({
      form_id: formId,
      answers: body.data.answers,
      respondent_meta: clientMeta(request),
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Best-effort owner email, sent after the response so it adds no latency and
  // can't fail the submission.
  after(() =>
    notifyOwnerOfSubmission(
      admin,
      {
        id: form.id,
        title: form.title,
        created_by: form.created_by,
        fields: form.fields as Field[],
      },
      body.data.answers,
      submission.id
    ).catch((e) => console.error("submission notification failed", e))
  );

  await closeFormsIfFreeAccountAtCap(admin, form.created_by);

  return NextResponse.json({ ok: true }, { status: 201 });
}

// Capture respondent IP (first hop of x-forwarded-for, set by Vercel/proxies).
function clientMeta(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  const ip =
    fwd?.split(",")[0].trim() || request.headers.get("x-real-ip") || null;
  return {
    ip,
    userAgent: request.headers.get("user-agent"),
  };
}

// Self-signup accounts are capped at their plan's submission limit, across
// all of their forms. Once hit, auto-close every form they own so respondents
// get a friendly "no longer accepting responses" message instead of a raw
// error. Owner/Member profiles have no cap (quotaFor returns null).
async function closeFormsIfFreeAccountAtCap(
  admin: ReturnType<typeof createAdminClient>,
  ownerId: string
) {
  const { data: profile } = await admin
    .from("profiles")
    .select("role, plan")
    .eq("id", ownerId)
    .single();
  if (!profile) return;

  const quota = quotaFor(profile);
  if (quota.submissionLimit === null) return;

  const { data: ownerForms } = await admin
    .from("forms")
    .select("id")
    .eq("created_by", ownerId)
    .is("deleted_at", null);
  const formIds = (ownerForms ?? []).map((f) => f.id);
  if (formIds.length === 0) return;

  const { count } = await admin
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .in("form_id", formIds);

  if ((count ?? 0) >= quota.submissionLimit) {
    await admin
      .from("forms")
      .update({ status: "closed" })
      .eq("created_by", ownerId)
      .eq("status", "published")
      .is("deleted_at", null);
  }
}
