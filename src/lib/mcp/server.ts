import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { fieldSchema, formStatusSchema } from "@/lib/forms/schema";
import { newFormSlug } from "@/lib/forms/slug";
import { quotaFor } from "@/lib/plans";
import type { McpActor } from "./auth";

function publicUrl(slug: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}/f/${slug}`;
}

// Success: the JSON goes in structuredContent (what Apps SDK / modern clients
// read) with a text mirror for clients that only understand content blocks.
function textResult(data: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data) }],
    structuredContent: data,
  };
}

// isError skips output-schema validation, so failures must go through here
// rather than being returned as a normal { error } payload.
function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

const formSummary = {
  formId: z.string(),
  slug: z.string(),
  publicUrl: z.string(),
};

export function createMcpServer(actor: McpActor) {
  const server = new McpServer(
    { name: "deoochform", version: "1.0.0" },
    {
      instructions:
        "Forms and submissions for the authenticated deoochform workspace. " +
        "Call list_forms to find a form's id before reading or updating it. " +
        "update_form replaces whole fields arrays, so read the form first and " +
        "send the full array back with your edits applied. Share a form using " +
        "the publicUrl each tool returns.\n\n" +
        "Structuring fields: the form's title and description already render " +
        "in a header above the fields, so never add a `heading` field that " +
        "just repeats the title — it will look duplicated. For a form that " +
        "covers more than one topic, group related fields under `heading` " +
        "fields named after the topic (e.g. \"Facility Profile\", " +
        "\"Current Systems\", \"Contact Consent\") the way a well-organized " +
        "paper form uses section breaks — but skip the heading entirely for " +
        "short forms where everything is one topic.",
    }
  );
  const db = createAdminClient();
  // Owner/Member tokens keep full team-wide access (unchanged behavior).
  // Free-tier tokens are scoped to only the forms/submissions they own —
  // the admin client bypasses RLS, so every free-actor query below adds an
  // explicit created_by filter to compensate.
  const isTrusted = actor.role === "owner" || actor.role === "member";

  server.registerTool(
    "create_form",
    {
      title: "Create form",
      description: "Create a new form and return its public link.",
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      inputSchema: {
        title: z.string().min(1),
        description: z.string().optional(),
        fields: z
          .array(fieldSchema)
          .default([])
          .describe(
            "Do not open with a `heading` field that repeats the form title — " +
              "the title already renders above the fields. Use `heading` fields " +
              "only to break a multi-topic form into named sections."
          ),
      },
      outputSchema: formSummary,
    },
    async ({ title, description, fields }) => {
      const quota = quotaFor(actor);
      if (quota.formLimit !== null) {
        const { count } = await db
          .from("forms")
          .select("id", { count: "exact", head: true })
          .eq("created_by", actor.id)
          .is("deleted_at", null);
        if ((count ?? 0) >= quota.formLimit) {
          return errorResult(
            `Your plan is limited to ${quota.formLimit} forms. Upgrade to create more.`
          );
        }
      }

      const slug = newFormSlug();
      const { data, error } = await db
        .from("forms")
        .insert({
          slug,
          title,
          description,
          fields,
          created_by: actor.id,
          updated_by: actor.id,
        })
        .select("id, slug")
        .single();

      if (error) return errorResult(error.message);
      return textResult({
        formId: data.id,
        slug: data.slug,
        publicUrl: publicUrl(data.slug),
      });
    }
  );

  server.registerTool(
    "update_form",
    {
      title: "Update form",
      description: "Update a form's title, description, fields, or status.",
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
      inputSchema: {
        formId: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        fields: z
          .array(fieldSchema)
          .optional()
          .describe(
            "Do not open with a `heading` field that repeats the form title — " +
              "the title already renders above the fields. Use `heading` fields " +
              "only to break a multi-topic form into named sections."
          ),
        status: formStatusSchema.optional(),
      },
      outputSchema: { ...formSummary, updatedAt: z.string() },
    },
    async ({ formId, ...changes }) => {
      let query = db
        .from("forms")
        .update({ ...changes, updated_by: actor.id })
        .eq("id", formId)
        .is("deleted_at", null);
      if (!isTrusted) query = query.eq("created_by", actor.id);

      const { data, error } = await query.select("id, slug, updated_at").single();
      if (error) return errorResult("Form not found.");

      if (changes.fields) {
        await db
          .from("form_versions")
          .insert({ form_id: formId, fields: changes.fields, edited_by: actor.id });
      }

      return textResult({
        formId: data.id,
        slug: data.slug,
        publicUrl: publicUrl(data.slug),
        updatedAt: data.updated_at,
      });
    }
  );

  server.registerTool(
    "get_form",
    {
      title: "Get form",
      description: "Get a form's full definition.",
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      inputSchema: { formId: z.string() },
      outputSchema: {
        ...formSummary,
        title: z.string(),
        description: z.string().nullish(),
        fields: z.array(fieldSchema),
        status: formStatusSchema,
        createdAt: z.string(),
        updatedAt: z.string(),
      },
    },
    async ({ formId }) => {
      let query = db.from("forms").select("*").eq("id", formId).is("deleted_at", null);
      if (!isTrusted) query = query.eq("created_by", actor.id);

      const { data, error } = await query.single();
      if (error) return errorResult("Form not found.");

      return textResult({
        formId: data.id,
        slug: data.slug,
        publicUrl: publicUrl(data.slug),
        title: data.title,
        description: data.description,
        fields: data.fields,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
    }
  );

  server.registerTool(
    "list_forms",
    {
      title: "List forms",
      description: "List forms in this workspace.",
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      inputSchema: {
        status: formStatusSchema.optional(),
        limit: z.number().int().positive().max(100).default(20),
      },
      outputSchema: {
        forms: z.array(
          z.object({
            ...formSummary,
            title: z.string(),
            status: formStatusSchema,
            submissionCount: z.number(),
            createdAt: z.string(),
          })
        ),
      },
    },
    async ({ status, limit }) => {
      let query = db
        .from("forms")
        .select("id, slug, title, status, created_at, submissions(count)")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (status) query = query.eq("status", status);
      if (!isTrusted) query = query.eq("created_by", actor.id);

      const { data, error } = await query;
      if (error) return errorResult(error.message);

      return textResult({
        forms: (data ?? []).map((f) => ({
          formId: f.id,
          slug: f.slug,
          publicUrl: publicUrl(f.slug),
          title: f.title,
          status: f.status,
          submissionCount: (f.submissions as { count: number }[])[0]?.count ?? 0,
          createdAt: f.created_at,
        })),
      });
    }
  );

  server.registerTool(
    "list_submissions",
    {
      title: "List submissions",
      description: "List submissions for a form.",
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      inputSchema: {
        formId: z.string(),
        limit: z.number().int().positive().max(200).default(50),
      },
      outputSchema: {
        submissions: z.array(
          z.object({
            submissionId: z.string(),
            answers: z.record(z.string(), z.unknown()),
            submittedAt: z.string(),
          })
        ),
      },
    },
    async ({ formId, limit }) => {
      let query = db
        .from("submissions")
        .select("id, answers, submitted_at, forms!inner(created_by)")
        .eq("form_id", formId)
        .order("submitted_at", { ascending: false })
        .limit(limit);
      if (!isTrusted) query = query.eq("forms.created_by", actor.id);

      const { data, error } = await query;
      if (error) return errorResult(error.message);

      return textResult({
        submissions: (data ?? []).map((s) => ({
          submissionId: s.id,
          answers: s.answers,
          submittedAt: s.submitted_at,
        })),
      });
    }
  );

  server.registerTool(
    "get_submission",
    {
      title: "Get submission",
      description: "Get a single submission by id.",
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      inputSchema: { submissionId: z.string() },
      outputSchema: {
        submissionId: z.string(),
        formId: z.string(),
        answers: z.record(z.string(), z.unknown()),
        submittedAt: z.string(),
      },
    },
    async ({ submissionId }) => {
      let query = db
        .from("submissions")
        .select("id, form_id, answers, submitted_at, forms!inner(created_by)")
        .eq("id", submissionId);
      if (!isTrusted) query = query.eq("forms.created_by", actor.id);

      const { data, error } = await query.single();
      if (error) return errorResult("Submission not found.");

      return textResult({
        submissionId: data.id,
        formId: data.form_id,
        answers: data.answers,
        submittedAt: data.submitted_at,
      });
    }
  );

  return server;
}
