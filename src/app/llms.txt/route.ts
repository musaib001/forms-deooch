import { DOCS, POSTS } from "@/lib/content";
import { SITE_URL, MCP_URL } from "@/lib/site";
import { TEMPLATES } from "@/lib/forms/templates";

// llms.txt: a plain-text map of the site for AI crawlers and answer engines,
// following the llmstxt.org convention. Generated from the same registries the
// sitemap uses, so a new doc or post lands in both.
export const dynamic = "force-static";

export function GET() {
  const body = `# Deooch Forms

> An AI-native form builder with a Model Context Protocol (MCP) server. Build a
> form in the visual studio, or describe it to Claude, ChatGPT, or any
> MCP-capable assistant and have it created for you. Share a public link;
> respondents answer without an account. Read responses in the dashboard, export
> to CSV or Excel, or ask your assistant about them directly.

MCP endpoint: ${MCP_URL} (remote, streamable HTTP, OAuth — no API key)
MCP Registry name: io.github.musaib001/deooch-forms
MCP tools: create_form, update_form, get_form, list_forms, list_submissions, get_submission
Field types: 14 (short text, long text, email, phone, address, number, dropdown,
single choice, multiple choice, date, file link, file upload, signature, section heading)
Free plan: 2 forms, 50 submissions, MCP connector included, no card required

## Docs

${DOCS.map((d) => `- [${d.title}](${SITE_URL}/docs/${d.slug}): ${d.description}`).join("\n")}
- [MCP connector walkthrough](${SITE_URL}/connect): Per-client setup steps for Claude, ChatGPT, Cursor, and other MCP clients, plus common errors.

## Blog

${POSTS.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`).join("\n")}

## Templates

${TEMPLATES.map((t) => `- [${t.name}](${SITE_URL}/templates/${t.slug}): ${t.description}`).join("\n")}

## Optional

- [Pricing](${SITE_URL}/pricing): Plan limits and prices.
- [Support](${SITE_URL}/support): FAQ and contact.
- [Privacy](${SITE_URL}/privacy)
- [Terms](${SITE_URL}/terms)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
