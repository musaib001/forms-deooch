# Deooch Forms

**Build a form by describing it. Share a link. Watch the responses land.**

Deooch Forms ([forms.deooch.com](https://forms.deooch.com)) is a form builder with an
MCP server bolted on. You can drag fields around in the visual studio like any other
form tool — or skip that entirely and ask Claude, ChatGPT, or any MCP-capable assistant
to build the form for you, then read the responses back the same way.

Respondents never sign in. They open a public `/f/<slug>` link, fill it in, and submit.

## What it does

- **Form studio** — 13 field types, sections, validation, required fields, live preview.
- **Public forms** — every form gets a shareable `/f/<slug>` link. No account needed to answer.
- **Submissions** — responses appear in the dashboard as they arrive, exportable to CSV/XLSX.
- **Email notifications** — get pinged when someone submits.
- **MCP server** — six tools (`create_form`, `update_form`, `get_form`, `list_forms`,
  `list_submissions`, `get_submission`) so an AI assistant can do all of the above for you.
  Published to the MCP Registry as `io.github.musaib001/deooch-forms`; setup walkthrough
  at [/connect](https://forms.deooch.com/connect).
- **Workspaces** — invite members, share forms, per-role access.

## Architecture

![deooch form builder architecture: Google OAuth via Supabase Auth, Next.js dashboard and form studio, Supabase Postgres as source of truth, public form renderer for respondents, submissions/export, and an MCP server for AI agent access](public/docs/architecture-flow.gif)

- **Creator flow** — sign in with Google via Supabase Auth → build forms in the Next.js/React Form Studio → forms are saved to Supabase Postgres.
- **Data layer** — Supabase Postgres is the source of truth (forms, fields, tokens, RLS policies).
- **Respondent flow** — anyone with the link opens the public `/f/[slug]` form (no login) and submits, which writes straight to Supabase.
- **Back to the creator** — submissions show up live in the dashboard, exportable as CSV/XLSX.
- **Automation** — an MCP server exposes forms and submissions over OAuth so AI agents can create forms or read responses programmatically.

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase (Postgres + Auth), deployed on Vercel.

## Field types

Short text · Long text · Email · Phone · Address · Number · Dropdown ·
Single choice · Multiple choice · Date · File link · File upload · Section heading

## Sample forms

Things people actually build with it. Each one is a prompt you can paste into a
connected AI assistant — it comes back with a live link.

**Employee onboarding**
> Create an employee onboarding form with a Personal Information section (full name,
> email, phone, home address), an Employment section (start date, department dropdown,
> manager), and a document upload for ID.

Uses: section headings, short text, email, phone, address, date, dropdown, file upload.

**Customer feedback**
> Create a customer feedback form: how satisfied are you (1–5 single choice), what
> did you use us for (multiple choice), and a comment box.

Uses: single choice, multiple choice, long text.

**Event registration**
> Create an event registration form with name, email, which sessions they're attending
> (multiple choice), dietary requirements (dropdown), and number of guests.

Uses: short text, email, multiple choice, dropdown, number.

**Job application**
> Create a job application form with name, email, phone, LinkedIn URL, a resume upload,
> and a "why do you want this role" long answer.

Uses: short text, email, phone, file upload, long text.

**Bug report**
> Create an internal bug report form: title, severity dropdown, steps to reproduce,
> expected vs actual behaviour, and a screenshot upload.

Uses: short text, dropdown, long text, file upload.

## Connecting an AI assistant

Add this as a remote MCP connector in your assistant's settings:

```
https://forms.deooch.com/api/mcp
```

It signs you in through the browser — no token to copy or store — and the connection
acts as you, with your role and plan. Clients that read the MCP Registry can find it
by name as `io.github.musaib001/deooch-forms` instead. Full walkthrough, including
ChatGPT web setup and the errors people actually hit, is at
[forms.deooch.com/connect](https://forms.deooch.com/connect).

## Development

```bash
npm install
npm run dev      ## http://localhost:3000
npm test         # vitest
npm run lint
```

### Layout

```
src/app/            routes — (portal) dashboard, /f/[slug] public forms, /api/mcp
src/components/     builder/ (form studio), forms/, submissions/, marketing/
src/lib/            forms/ (schema + validation), mcp/, auth/, email/, export/
supabase/migrations database schema and RLS policies
```

Read `AGENTS.md` before writing code — this repo tracks a Next.js version whose
conventions differ from what most models were trained on.
