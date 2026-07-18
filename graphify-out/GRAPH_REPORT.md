# Graph Report - deoochform  (2026-07-18)

## Corpus Check
- 111 files · ~168,413 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 465 nodes · 849 edges · 25 communities (18 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d0dfa383`
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
- README.md
- AGENTS.md
- CLAUDE.md
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- page.tsx
- route.ts
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `getSessionProfile` - 39 edges
2. `createClient()` - 36 edges
3. `compilerOptions` - 16 edges
4. `Field` - 15 edges
5. `createAdminClient()` - 15 edges
6. `quotaFor()` - 12 edges
7. `formatDate()` - 10 edges
8. `Cell()` - 9 edges
9. `isInputField()` - 9 edges
10. `Container()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `EditFormPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(portal)/forms/[formId]/page.tsx → src/lib/supabase/server.ts
- `PortalLayout()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/layout.tsx → src/lib/auth/session.ts
- `MembersPage()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/settings/members/page.tsx → src/lib/auth/session.ts
- `ConnectPage()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/connect/page.tsx → src/lib/auth/session.ts
- `Home()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/page.tsx → src/lib/auth/session.ts

## Import Cycles
- None detected.

## Communities (25 total, 7 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.12
Nodes (31): Format, FORMATS, GET(), Params, actionSchema, Params, POST(), DELETE() (+23 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.07
Nodes (18): FormSubmissionsPage(), Token, TokensTable(), asArray(), Submission, Menu(), MenuItem(), SubmissionDrawer() (+10 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.09
Nodes (11): PortalLayout(), AuthShell(), FEATURES, EmailAuthForm(), Mode, GoogleButton(), PasswordField(), BrandMark() (+3 more)

### Community 3 - "server.ts"
Cohesion: 0.11
Nodes (26): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, handle(), GET(), GET() (+18 more)

### Community 4 - "schema.ts"
Cohesion: 0.07
Nodes (29): Device, DEVICE_WIDTHS, Doc, ExistingForm, FormStudio(), SaveState, Doc, Inspector() (+21 more)

### Community 5 - "devDependencies"
Cohesion: 0.07
Nodes (28): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "dependencies"
Cohesion: 0.06
Nodes (31): @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, exceljs, lucide-react, @modelcontextprotocol/sdk, nanoid, next (+23 more)

### Community 8 - "page.tsx"
Cohesion: 0.06
Nodes (22): ConnectPage(), ERRORS, FAQS, metadata, TOOLS, geistMono, jakarta, JSON_LD (+14 more)

### Community 9 - "PublicFormRenderer.tsx"
Cohesion: 0.09
Nodes (37): AddressGroup(), CheckboxGroup(), FieldControl(), Value, Cell(), FieldTypeIcon(), RespondentMeta, Tag() (+29 more)

### Community 11 - "proxy.ts"
Cohesion: 0.53
Nodes (5): config, isPublicPath(), proxy(), PUBLIC_PATHS, PUBLIC_PREFIXES

### Community 13 - "README.md"
Cohesion: 0.40
Nodes (4): Architecture, Deploy on Vercel, Getting Started, Learn More

### Community 21 - "page.tsx"
Cohesion: 0.12
Nodes (7): EditFormPage(), MembersPage(), FAQS, metadata, Container(), Item, MembersTable()

### Community 25 - "page.tsx"
Cohesion: 0.18
Nodes (9): EMPTY_COPY, FormRecord, FormListItem, FormRow(), STATUS_STYLES, isViewId(), ViewId, VIEWS (+1 more)

## Knowledge Gaps
- **128 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `EmailAuthForm.tsx`, `server.ts`, `page.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `page.tsx`, `server.ts`, `page.tsx`, `SubmissionsView.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Field` connect `PublicFormRenderer.tsx` to `SubmissionsView.tsx`, `server.ts`, `schema.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.11945031712473574 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08819345661450925 - nodes in this community are weakly interconnected._