import { Resend } from "resend";
import type { Field } from "@/lib/forms/schema";
import { isInputField } from "@/lib/forms/schema";
import type { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/site";

type Admin = ReturnType<typeof createAdminClient>;

// Best-effort owner notification on a new submission. Scheduled via
// next/server `after()` in the submit route, so it never adds latency to the
// respondent's request and a mail outage can't fail a submission.
//
// ponytail: notifies the form's owner (created_by) only, one email per
// submission. Add a per-form on/off toggle and/or a daily digest if
// per-submission mail gets noisy at volume.
export async function notifyOwnerOfSubmission(
  admin: Admin,
  form: { id: string; title: string; created_by: string; fields: Field[] },
  answers: Record<string, string | string[]>
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Not configured (e.g. local dev) — skip silently.

  const { data: owner } = await admin
    .from("profiles")
    .select("email")
    .eq("id", form.created_by)
    .maybeSingle();
  const to = owner?.email ?? process.env.RESEND_OWNER_EMAIL;
  if (!to) return;

  const rows = form.fields
    .filter(isInputField)
    .map((f) => {
      const v = answers[f.id];
      return { label: f.label, text: Array.isArray(v) ? v.join(", ") : String(v ?? "") };
    })
    .filter((r) => r.text.trim() !== "");

  const submissionsUrl = `${SITE_URL}/forms/${form.id}/submissions`;
  const title = escapeHtml(form.title);

  const html = `
    <div style="font-family:system-ui,sans-serif;color:#1c1917">
      <h2 style="margin:0 0 12px">New response to &ldquo;${title}&rdquo;</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            (r) =>
              `<tr><td style="color:#78716c;vertical-align:top"><strong>${escapeHtml(
                r.label
              )}</strong></td><td>${escapeHtml(r.text)}</td></tr>`
          )
          .join("")}
      </table>
      <p style="margin-top:16px"><a href="${submissionsUrl}" style="color:#ea580c;font-weight:600">View all responses &rarr;</a></p>
    </div>
  `;
  const text =
    `New response to "${form.title}"\n\n` +
    rows.map((r) => `${r.label}: ${r.text}`).join("\n") +
    `\n\nView all responses: ${submissionsUrl}`;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "deoochform <onboarding@resend.dev>",
    to,
    subject: `New response to "${form.title}"`,
    html,
    text,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
