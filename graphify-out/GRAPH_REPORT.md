# Graph Report - deoochform  (2026-07-16)

## Corpus Check
- 97 files · ~25,587 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 416 nodes · 747 edges · 25 communities (19 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e57d625e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- SubmissionsView.tsx
- EmailAuthForm.tsx
- server.ts
- schema.ts
- devDependencies
- compilerOptions
- dependencies
- page.tsx
- PublicFormRenderer.tsx
- MembersTable.tsx
- proxy.ts
- layout.tsx
- README.md
- AGENTS.md
- CLAUDE.md
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- page.tsx
- route.ts

## God Nodes (most connected - your core abstractions)
1. `getSessionProfile` - 36 edges
2. `createClient()` - 35 edges
3. `compilerOptions` - 16 edges
4. `Field` - 15 edges
5. `createAdminClient()` - 15 edges
6. `quotaFor()` - 12 edges
7. `formatDate()` - 10 edges
8. `isInputField()` - 9 edges
9. `createMcpServer()` - 8 edges
10. `GET()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `EditFormPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(portal)/forms/[formId]/page.tsx → src/lib/supabase/server.ts
- `PortalLayout()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/layout.tsx → src/lib/auth/session.ts
- `MembersPage()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/settings/members/page.tsx → src/lib/auth/session.ts
- `Home()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/page.tsx → src/lib/auth/session.ts
- `FormStudio()` --indirect_call--> `field()`  [INFERRED]
  src/components/builder/FormStudio.tsx → src/lib/forms/validation.test.ts

## Import Cycles
- None detected.

## Communities (25 total, 6 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.15
Nodes (24): DELETE(), GET(), Params, PATCH(), GET(), Params, DELETE(), Params (+16 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.07
Nodes (25): FormSubmissionsPage(), Token, TokensTable(), asArray(), Cell(), FieldTypeIcon(), isChoice(), RespondentMeta (+17 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.09
Nodes (10): PortalLayout(), AuthShell(), FEATURES, EmailAuthForm(), Mode, GoogleButton(), PasswordField(), NavItem (+2 more)

### Community 3 - "server.ts"
Cohesion: 0.13
Nodes (21): handle(), createTokenSchema, POST(), GET(), GET(), PublicFormPage(), POST(), readParams() (+13 more)

### Community 4 - "schema.ts"
Cohesion: 0.08
Nodes (24): Device, DEVICE_WIDTHS, Doc, ExistingForm, FormStudio(), SaveState, Doc, Inspector() (+16 more)

### Community 5 - "devDependencies"
Cohesion: 0.07
Nodes (28): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "dependencies"
Cohesion: 0.07
Nodes (29): @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, exceljs, lucide-react, @modelcontextprotocol/sdk, nanoid, next (+21 more)

### Community 8 - "page.tsx"
Cohesion: 0.13
Nodes (17): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, FEATURES, Home(), metadata (+9 more)

### Community 9 - "PublicFormRenderer.tsx"
Cohesion: 0.21
Nodes (13): FormPreviewModal(), CheckboxGroup(), FieldControl(), PublicFormRenderer(), Value, Field, FieldValue, isEmpty() (+5 more)

### Community 10 - "MembersTable.tsx"
Cohesion: 0.15
Nodes (18): Format, FORMATS, GET(), Params, answer(), buildSubmissionsCsv(), buildSubmissionsJson(), cell() (+10 more)

### Community 11 - "proxy.ts"
Cohesion: 0.53
Nodes (5): config, isPublicPath(), proxy(), PUBLIC_PATHS, PUBLIC_PREFIXES

### Community 12 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, jakarta, metadata

### Community 13 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 21 - "page.tsx"
Cohesion: 0.08
Nodes (11): DashboardPage(), FormRow, responseCount(), STATUS_STYLES, EditFormPage(), MembersPage(), FAQS, metadata (+3 more)

## Knowledge Gaps
- **114 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+109 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `EmailAuthForm.tsx`, `server.ts`, `page.tsx`, `MembersTable.tsx`, `page.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `SubmissionsView.tsx`, `MembersTable.tsx`, `server.ts`, `page.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Field` connect `PublicFormRenderer.tsx` to `page.tsx`, `SubmissionsView.tsx`, `MembersTable.tsx`, `schema.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _114 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.146218487394958 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06636500754147813 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09047619047619047 - nodes in this community are weakly interconnected._