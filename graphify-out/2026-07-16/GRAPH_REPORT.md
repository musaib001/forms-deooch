# Graph Report - deoochform  (2026-07-16)

## Corpus Check
- 81 files · ~17,750 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 329 nodes · 572 edges · 22 communities (16 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `55f6463c`
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

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 33 edges
2. `getSessionProfile` - 32 edges
3. `compilerOptions` - 16 edges
4. `Field` - 12 edges
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
- `SubmissionDrawer()` --indirect_call--> `field()`  [INFERRED]
  src/components/submissions/SubmissionsView.tsx → src/lib/forms/validation.test.ts

## Import Cycles
- None detected.

## Communities (22 total, 6 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.09
Nodes (31): DELETE(), GET(), Params, PATCH(), GET(), Params, GET(), POST() (+23 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.12
Nodes (16): FormSubmissionsPage(), Token, TokensTable(), asArray(), Cell(), isChoice(), RespondentMeta, Submission (+8 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.09
Nodes (10): PortalLayout(), AuthShell(), FEATURES, EmailAuthForm(), Mode, GoogleButton(), PasswordField(), NavItem (+2 more)

### Community 3 - "server.ts"
Cohesion: 0.13
Nodes (19): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, handle(), GET(), PublicFormPage() (+11 more)

### Community 4 - "schema.ts"
Cohesion: 0.11
Nodes (21): GET(), Params, FieldEditor(), FieldList(), ExistingForm, STATUSES, FormPreviewModal(), OptionsEditor() (+13 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+11 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "dependencies"
Cohesion: 0.07
Nodes (28): exceljs, @modelcontextprotocol/sdk, nanoid, next, dependencies, exceljs, @modelcontextprotocol/sdk, nanoid (+20 more)

### Community 8 - "page.tsx"
Cohesion: 0.20
Nodes (10): FEATURES, Home(), metadata, MarketingFooter(), MarketingNav(), PricingCards(), getPlan(), Plan (+2 more)

### Community 9 - "PublicFormRenderer.tsx"
Cohesion: 0.24
Nodes (11): CheckboxGroup(), FieldControl(), PublicFormRenderer(), Value, FieldValue, isEmpty(), field(), validateField() (+3 more)

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
- **93 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `page.tsx`, `EmailAuthForm.tsx`, `MembersTable.tsx`, `schema.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `SubmissionsView.tsx`, `server.ts`, `schema.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `Field` connect `schema.ts` to `PublicFormRenderer.tsx`, `server.ts`, `SubmissionsView.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.08941176470588236 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09411764705882353 - nodes in this community are weakly interconnected._