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

function textResult(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
}

export function createMcpServer(actor: McpActor) {
  const server = new McpServer({ name: "deoochform", version: "1.0.0" });
  const db = createAdminClient();
  // Owner/Member tokens keep full team-wide access (unchanged behavior).
  // Free-tier tokens are scoped to only the forms/submissions they own —
  // the admin client bypasses RLS, so every free-actor query below adds an
  // explicit created_by filter to compensate.
  const isTrusted = actor.role === "owner" || actor.role === "member";

  server.registerTool(
    "create_form",
    {
      description: "Create a new form and return its public link.",
      inputSchema: {
        title: z.string().min(1),
        description: z.string().optional(),
        fields: z.array(fieldSchema).default([]),
      },
    },
    async ({ title, description, fields }) => {
      const quota = quotaFor(actor);
      if (quota.formLimit !== null) {
        const { count } = await db
          .from("forms")
          .select("id", { count: "exact", head: true })
          .eq("created_by", actor.id);
        if ((count ?? 0) >= quota.formLimit) {
          return textResult({
            error: `Your plan is limited to ${quota.formLimit} forms. Upgrade to create more.`,
          });
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

      if (error) return textResult({ error: error.message });
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
      description: "Update a form's title, description, fields, or status.",
      inputSchema: {
        formId: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        fields: z.array(fieldSchema).optional(),
        status: formStatusSchema.optional(),
      },
    },
    async ({ formId, ...changes }) => {
      let query = db
        .from("forms")
        .update({ ...changes, updated_by: actor.id })
        .eq("id", formId);
      if (!isTrusted) query = query.eq("created_by", actor.id);

      const { data, error } = await query.select("id, slug, updated_at").single();
      if (error) return textResult({ error: "Form not found." });

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
      description: "Get a form's full definition.",
      inputSchema: { formId: z.string() },
    },
    async ({ formId }) => {
      let query = db.from("forms").select("*").eq("id", formId);
      if (!isTrusted) query = query.eq("created_by", actor.id);

      const { data, error } = await query.single();
      if (error) return textResult({ error: "Form not found." });

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
      description: "List forms in this workspace.",
      inputSchema: {
        status: formStatusSchema.optional(),
        limit: z.number().int().positive().max(100).default(20),
      },
    },
    async ({ status, limit }) => {
      let query = db
        .from("forms")
        .select("id, slug, title, status, created_at, submissions(count)")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (status) query = query.eq("status", status);
      if (!isTrusted) query = query.eq("created_by", actor.id);

      const { data, error } = await query;
      if (error) return textResult({ error: error.message });

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
      description: "List submissions for a form.",
      inputSchema: {
        formId: z.string(),
        limit: z.number().int().positive().max(200).default(50),
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
      if (error) return textResult({ error: error.message });

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
      description: "Get a single submission by id.",
      inputSchema: { submissionId: z.string() },
    },
    async ({ submissionId }) => {
      let query = db
        .from("submissions")
        .select("id, form_id, answers, submitted_at, forms!inner(created_by)")
        .eq("id", submissionId);
      if (!isTrusted) query = query.eq("forms.created_by", actor.id);

      const { data, error } = await query.single();
      if (error) return textResult({ error: "Submission not found." });

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
