# Graph Report - deoochform  (2026-07-16)

## Corpus Check
- 81 files · ~21,136 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 353 nodes · 602 edges · 23 communities (17 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `131e8fb0`
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
1. `createClient()` - 33 edges
2. `getSessionProfile` - 32 edges
3. `compilerOptions` - 16 edges
4. `Field` - 11 edges
5. `createAdminClient()` - 11 edges
6. `formatDate()` - 8 edges
7. `isInputField()` - 7 edges
8. `createMcpServer()` - 7 edges
9. `include` - 7 edges
10. `scripts` - 6 edges

## Surprising Connections (you probably didn't know these)
- `PortalLayout()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/layout.tsx → src/lib/auth/session.ts
- `MembersPage()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/settings/members/page.tsx → src/lib/auth/session.ts
- `Home()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/page.tsx → src/lib/auth/session.ts
- `PublicFormRenderer()` --indirect_call--> `isInputField()`  [INFERRED]
  src/components/forms/PublicFormRenderer.tsx → src/lib/forms/schema.ts
- `SubmissionsView()` --indirect_call--> `isInputField()`  [INFERRED]
  src/components/submissions/SubmissionsView.tsx → src/lib/forms/schema.ts

## Import Cycles
- None detected.

## Communities (23 total, 6 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.13
Nodes (27): DELETE(), GET(), Params, PATCH(), GET(), Params, GET(), POST() (+19 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.08
Nodes (19): DashboardPage(), FormRow, responseCount(), STATUS_STYLES, FormSubmissionsPage(), Token, TokensTable(), asArray() (+11 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.09
Nodes (9): PortalLayout(), AuthShell(), FEATURES, EmailAuthForm(), GoogleButton(), PasswordField(), NavItem, TopBar() (+1 more)

### Community 3 - "server.ts"
Cohesion: 0.15
Nodes (16): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, handle(), GET(), PublicFormPage() (+8 more)

### Community 4 - "schema.ts"
Cohesion: 0.08
Nodes (27): Device, DEVICE_WIDTHS, Doc, ExistingForm, FormStudio(), SaveState, Doc, Inspector() (+19 more)

### Community 5 - "devDependencies"
Cohesion: 0.07
Nodes (28): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "dependencies"
Cohesion: 0.07
Nodes (27): @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, exceljs, lucide-react, @modelcontextprotocol/sdk, nanoid, next (+19 more)

### Community 8 - "page.tsx"
Cohesion: 0.20
Nodes (10): FEATURES, Home(), metadata, MarketingFooter(), MarketingNav(), PricingCards(), getPlan(), Plan (+2 more)

### Community 9 - "PublicFormRenderer.tsx"
Cohesion: 0.22
Nodes (11): Mode, CheckboxGroup(), FieldControl(), Value, Field, FieldValue, isEmpty(), validateField() (+3 more)

### Community 10 - "MembersTable.tsx"
Cohesion: 0.29
Nodes (3): MembersPage(), Item, MembersTable()

### Community 11 - "proxy.ts"
Cohesion: 0.53
Nodes (5): config, isPublicPath(), proxy(), PUBLIC_PATHS, PUBLIC_PREFIXES

### Community 12 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, jakarta, metadata

### Community 13 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 22 - "route.ts"
Cohesion: 0.24
Nodes (8): GET(), Params, buildSubmissionsWorkbook(), formatAnswer(), Submission, fields, submissions, isInputField()

## Knowledge Gaps
- **104 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+99 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `SubmissionsView.tsx`, `EmailAuthForm.tsx`, `page.tsx`, `MembersTable.tsx`, `route.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `SubmissionsView.tsx`, `server.ts`, `route.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Field` connect `PublicFormRenderer.tsx` to `SubmissionsView.tsx`, `server.ts`, `schema.ts`, `route.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _104 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.12564102564102564 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08232118758434548 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09475806451612903 - nodes in this community are weakly interconnected._