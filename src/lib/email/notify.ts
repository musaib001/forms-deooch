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
  answers: Record<string, string | string[]>,
  submissionId?: string
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
      const values = Array.isArray(v) ? v.filter(Boolean) : [String(v ?? "")];
      return { label: f.label, type: f.type, values };
    })
    .filter((r) => r.values.some((t) => t.trim() !== ""));

  const submissionsUrl = `${SITE_URL}/forms/${form.id}/submissions`;
  const submissionUrl = submissionId
    ? `${submissionsUrl}?s=${submissionId}`
    : null;
  const title = escapeHtml(form.title);
  const footer = submissionUrl
    ? `You can <a href="${submissionUrl}" style="color:#ea580c;font-weight:600;text-decoration:underline">view this response</a> or <a href="${submissionsUrl}" style="color:#ea580c;font-weight:600;text-decoration:underline">view all responses</a>.`
    : `You can <a href="${submissionsUrl}" style="color:#ea580c;font-weight:600;text-decoration:underline">view all responses</a> in your dashboard.`;

  const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5fb;padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
      <tr><td align="center" style="padding:8px 0 24px">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="background:#ea580c;border-radius:8px;width:32px;height:32px;text-align:center;color:#fff;font-size:19px;font-weight:700;line-height:32px">&#10003;</td>
          <td style="padding-left:10px;font-size:22px;font-weight:700;color:#1e1b4b;letter-spacing:-.4px">deoochform</td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#ea580c;height:6px;line-height:6px;font-size:0;border-radius:4px 4px 0 0">&nbsp;</td></tr>
      <tr><td style="background:#ffffff;padding:28px 32px 8px">
        <div style="font-size:17px;font-weight:700;color:#1e1b4b;padding-bottom:16px;border-bottom:1px solid #e7e7ef">${title}</div>
      </td></tr>
      <tr><td style="background:#ffffff;padding:8px 32px 24px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
          ${rows.map(renderRow).join("")}
        </table>
      </td></tr>
      <tr><td style="background:#ffffff;padding:0 32px 28px">
        <div style="border-top:1px solid #e7e7ef;padding-top:18px;text-align:center;color:#78716c;font-size:13px">
          ${footer}
        </div>
      </td></tr>
      <tr><td style="height:24px"></td></tr>
    </table>
  </td></tr>
</table>`;
  const text =
    `New response to "${form.title}"\n\n` +
    rows.map((r) => `${r.label}: ${r.values.join(", ")}`).join("\n") +
    (submissionUrl ? `\n\nView this response: ${submissionUrl}` : "") +
    `\nView all responses: ${submissionsUrl}`;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "deoochform <onboarding@resend.dev>",
    to,
    subject: `New response to "${form.title}"`,
    html,
    text,
  });
}

// Pastel chip palette, cycled per value so multi-selects read as distinct
// tags rather than one comma soup. Background/foreground pairs are all
// AA-contrasting on white.
const CHIPS = [
  ["#e0f2fe", "#075985"],
  ["#ede9fe", "#5b21b6"],
  ["#dcfce7", "#166534"],
  ["#fce7f3", "#9d174d"],
  ["#fef3c7", "#92400e"],
];

function renderRow(
  r: { label: string; type: string; values: string[] },
  i: number
) {
  const multi = r.type === "checkbox" || r.values.length > 1;
  const body = multi
    ? r.values
        .map((v, n) => {
          const [bg, fg] = CHIPS[n % CHIPS.length];
          return `<span style="display:inline-block;background:${bg};color:${fg};border-radius:5px;padding:5px 10px;margin:0 6px 6px 0;font-size:13px;line-height:1.2">${escapeHtml(
            v
          )}</span>`;
        })
        .join("")
    : linkify(r.values[0] ?? "");
  return `<tr>
    <td style="width:42%;padding:14px 16px 14px 0;color:#6b6f8a;vertical-align:top;line-height:1.45;border-top:${
      i === 0 ? "none" : "1px solid #f1f1f6"
    }">${escapeHtml(r.label)}</td>
    <td style="padding:14px 0;color:#1c1917;vertical-align:top;line-height:1.45;border-top:${
      i === 0 ? "none" : "1px solid #f1f1f6"
    }">${body}</td>
  </tr>`;
}

// Emails and URLs render as links, matching how the submissions table shows
// them. Anything else is plain escaped text.
function linkify(v: string) {
  const safe = escapeHtml(v);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return `<a href="mailto:${safe}" style="color:#2563eb">${safe}</a>`;
  if (/^https?:\/\/\S+$/.test(v))
    return `<a href="${safe}" style="color:#2563eb">${safe}</a>`;
  return safe;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
