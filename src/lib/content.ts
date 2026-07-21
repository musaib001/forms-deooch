// Registry for the hand-written docs and blog pages under src/app/docs and
// src/app/blog. The pages own their prose; this owns the metadata the index
// pages and sitemap.ts need so a new page shows up in both by adding one row.
//
// ponytail: a static array, not MDX + a content pipeline. Add a build step only
// when someone who can't edit TSX needs to publish.

export type ContentEntry = {
  slug: string;
  title: string;
  description: string;
  /** ISO date. Blog only — drives the sitemap lastModified and the byline. */
  date?: string;
};

export const DOCS: ContentEntry[] = [
  {
    slug: "quickstart",
    title: "Quickstart",
    description:
      "Build your first form, publish it, and share the link — in about two minutes.",
  },
  {
    slug: "mcp-server",
    title: "MCP server",
    description:
      "Connect Claude, ChatGPT, Cursor, or any MCP client to Deooch Forms and create forms, edit fields, and read responses in chat.",
  },
  {
    slug: "field-types",
    title: "Field types",
    description:
      "All 14 field types — what each one collects, how it validates, and when to use it.",
  },
  {
    slug: "submissions-and-exports",
    title: "Submissions and exports",
    description:
      "Where responses land, how email notifications work, and how to export to CSV or Excel.",
  },
];

export const POSTS: ContentEntry[] = [
  {
    slug: "ai-form-mcp-connectors",
    title: "AI form MCP connectors, compared",
    description:
      "Every form builder with a Model Context Protocol server — Deooch Forms, Tally, Typeform, Cognito Forms, FormHug — and what each one actually lets an AI assistant do.",
    date: "2026-07-21",
  },
  {
    slug: "build-forms-with-claude",
    title: "How to build a form with Claude",
    description:
      "A worked example: connect the MCP server once, then create, edit, publish, and read a form entirely from a chat window.",
    date: "2026-07-21",
  },
  {
    slug: "what-is-an-mcp-connector",
    title: "What is an MCP connector?",
    description:
      "A plain-English explanation of the Model Context Protocol, what a connector does, and why it beats copy-pasting between your AI assistant and your tools.",
    date: "2026-07-21",
  },
];

export const docBySlug = (slug: string) => DOCS.find((d) => d.slug === slug);
export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
