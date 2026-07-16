# Graph Report - deoochform  (2026-07-16)

## Corpus Check
- 98 files · ~25,412 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 415 nodes · 734 edges · 24 communities (18 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7749c9f`
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
- route.ts

## God Nodes (most connected - your core abstractions)
1. `getSessionProfile` - 36 edges
2. `createClient()` - 35 edges
3. `compilerOptions` - 16 edges
4. `Field` - 15 edges
5. `createAdminClient()` - 15 edges
6. `formatDate()` - 10 edges
7. `isInputField()` - 9 edges
8. `GET()` - 7 edges
9. `Container()` - 7 edges
10. `buildSubmissionsCsv()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `PortalLayout()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/layout.tsx → src/lib/auth/session.ts
- `Home()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/page.tsx → src/lib/auth/session.ts
- `PublicFormRenderer()` --indirect_call--> `isInputField()`  [INFERRED]
  src/components/forms/PublicFormRenderer.tsx → src/lib/forms/schema.ts
- `SubmissionsView()` --indirect_call--> `isInputField()`  [INFERRED]
  src/components/submissions/SubmissionsView.tsx → src/lib/forms/schema.ts
- `DashboardPage()` --calls--> `formatDate()`  [EXTRACTED]
  src/app/(portal)/dashboard/page.tsx → src/lib/date.ts

## Import Cycles
- None detected.

## Communities (24 total, 6 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.07
Nodes (33): DELETE(), GET(), Params, PATCH(), GET(), Params, DELETE(), Params (+25 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.07
Nodes (25): FormSubmissionsPage(), Token, TokensTable(), asArray(), Cell(), FieldTypeIcon(), isChoice(), RespondentMeta (+17 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.09
Nodes (10): PortalLayout(), AuthShell(), FEATURES, EmailAuthForm(), Mode, GoogleButton(), PasswordField(), NavItem (+2 more)

### Community 3 - "server.ts"
Cohesion: 0.10
Nodes (27): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, handle(), createTokenSchema, GET() (+19 more)

### Community 4 - "schema.ts"
Cohesion: 0.08
Nodes (26): Device, DEVICE_WIDTHS, Doc, ExistingForm, FormStudio(), SaveState, Doc, Inspector() (+18 more)

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
Cohesion: 0.20
Nodes (10): FEATURES, Home(), metadata, MarketingFooter(), MarketingNav(), PricingCards(), getPlan(), Plan (+2 more)

### Community 9 - "PublicFormRenderer.tsx"
Cohesion: 0.17
Nodes (12): CheckboxGroup(), FieldControl(), Value, Item, MembersTable(), Field, FieldValue, isEmpty() (+4 more)

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

## Knowledge Gaps
- **113 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+108 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `page.tsx`, `EmailAuthForm.tsx`, `MembersTable.tsx`, `server.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `SubmissionsView.tsx`, `MembersTable.tsx`, `server.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Field` connect `PublicFormRenderer.tsx` to `SubmissionsView.tsx`, `MembersTable.tsx`, `server.ts`, `schema.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _113 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.07086197778952935 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06636500754147813 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09047619047619047 - nodes in this community are weakly interconnected._