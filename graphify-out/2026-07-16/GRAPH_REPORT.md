# Graph Report - deoochform  (2026-07-16)

## Corpus Check
- 88 files · ~21,861 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 370 nodes · 634 edges · 25 communities (18 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.7)
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
- page.tsx
- route.ts

## God Nodes (most connected - your core abstractions)
1. `getSessionProfile` - 34 edges
2. `createClient()` - 33 edges
3. `compilerOptions` - 16 edges
4. `createAdminClient()` - 15 edges
5. `Field` - 11 edges
6. `formatDate()` - 8 edges
7. `isInputField()` - 7 edges
8. `createMcpServer()` - 7 edges
9. `include` - 7 edges
10. `scripts` - 6 edges

## Surprising Connections (you probably didn't know these)
- `MembersPage()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/settings/members/page.tsx → src/lib/auth/session.ts
- `Home()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/page.tsx → src/lib/auth/session.ts
- `FormStudio()` --indirect_call--> `field()`  [INFERRED]
  src/components/builder/FormStudio.tsx → src/lib/forms/validation.test.ts
- `SubmissionsView()` --indirect_call--> `isInputField()`  [INFERRED]
  src/components/submissions/SubmissionsView.tsx → src/lib/forms/schema.ts
- `SubmissionDrawer()` --indirect_call--> `field()`  [INFERRED]
  src/components/submissions/SubmissionsView.tsx → src/lib/forms/validation.test.ts

## Import Cycles
- None detected.

## Communities (25 total, 7 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.15
Nodes (22): DELETE(), GET(), Params, PATCH(), GET(), Params, GET(), POST() (+14 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.08
Nodes (19): DashboardPage(), FormRow, responseCount(), STATUS_STYLES, FormSubmissionsPage(), Token, TokensTable(), asArray() (+11 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.10
Nodes (8): AuthShell(), FEATURES, EmailAuthForm(), Mode, GoogleButton(), PasswordField(), NavItem, createClient()

### Community 3 - "server.ts"
Cohesion: 0.10
Nodes (28): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, handle(), createTokenSchema, POST() (+20 more)

### Community 4 - "schema.ts"
Cohesion: 0.08
Nodes (25): Device, DEVICE_WIDTHS, Doc, ExistingForm, FormStudio(), SaveState, Doc, Inspector() (+17 more)

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
Cohesion: 0.12
Nodes (21): GET(), Params, FormPreviewModal(), CheckboxGroup(), FieldControl(), PublicFormRenderer(), Value, buildSubmissionsWorkbook() (+13 more)

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

## Knowledge Gaps
- **105 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+100 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `SubmissionsView.tsx`, `server.ts`, `page.tsx`, `PublicFormRenderer.tsx`, `MembersTable.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `PublicFormRenderer.tsx`, `server.ts`, `SubmissionsView.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `Field` connect `PublicFormRenderer.tsx` to `SubmissionsView.tsx`, `server.ts`, `schema.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.14795008912655971 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08232118758434548 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10037878787878787 - nodes in this community are weakly interconnected._