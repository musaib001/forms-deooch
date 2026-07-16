# Graph Report - deoochform  (2026-07-16)

## Corpus Check
- 80 files · ~16,913 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 321 nodes · 562 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cf710d54`
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
- `SubmissionsView()` --indirect_call--> `isInputField()`  [INFERRED]
  src/components/submissions/SubmissionsView.tsx → src/lib/forms/schema.ts

## Import Cycles
- None detected.

## Communities (21 total, 5 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.12
Nodes (28): GET(), Params, DELETE(), GET(), Params, PATCH(), GET(), Params (+20 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.09
Nodes (18): DashboardPage(), FormRow, responseCount(), STATUS_STYLES, Token, TokensTable(), asArray(), Cell() (+10 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.09
Nodes (10): PortalLayout(), AuthShell(), FEATURES, EmailAuthForm(), Mode, GoogleButton(), PasswordField(), NavItem (+2 more)

### Community 3 - "server.ts"
Cohesion: 0.11
Nodes (22): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, POST(), handle(), GET() (+14 more)

### Community 4 - "schema.ts"
Cohesion: 0.12
Nodes (21): FieldEditor(), FieldList(), ExistingForm, STATUSES, FormPreviewModal(), OptionsEditor(), buildSubmissionsWorkbook(), formatAnswer() (+13 more)

### Community 5 - "devDependencies"
Cohesion: 0.07
Nodes (28): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "dependencies"
Cohesion: 0.11
Nodes (19): exceljs, @modelcontextprotocol/sdk, nanoid, next, dependencies, exceljs, @modelcontextprotocol/sdk, nanoid (+11 more)

### Community 8 - "page.tsx"
Cohesion: 0.20
Nodes (10): FEATURES, Home(), metadata, MarketingFooter(), MarketingNav(), PricingCards(), getPlan(), Plan (+2 more)

### Community 9 - "PublicFormRenderer.tsx"
Cohesion: 0.29
Nodes (9): CheckboxGroup(), FieldControl(), Value, FieldValue, isEmpty(), validateField(), formatPhone(), isValidEmail() (+1 more)

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
- **91 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+86 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `SubmissionsView.tsx`, `EmailAuthForm.tsx`, `server.ts`, `page.tsx`, `MembersTable.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `SubmissionsView.tsx`, `server.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `Field` connect `schema.ts` to `PublicFormRenderer.tsx`, `server.ts`, `SubmissionsView.tsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.11614401858304298 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09411764705882353 - nodes in this community are weakly interconnected._