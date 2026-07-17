# Graph Report - deoochform  (2026-07-16)

## Corpus Check
- 102 files · ~28,327 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 436 nodes · 809 edges · 26 communities (20 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70d3a79b`
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
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `getSessionProfile` - 38 edges
2. `createClient()` - 37 edges
3. `compilerOptions` - 16 edges
4. `Field` - 15 edges
5. `createAdminClient()` - 15 edges
6. `quotaFor()` - 12 edges
7. `formatDate()` - 10 edges
8. `Cell()` - 9 edges
9. `isInputField()` - 9 edges
10. `addressParts()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `EditFormPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(portal)/forms/[formId]/page.tsx → src/lib/supabase/server.ts
- `MembersPage()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/(portal)/settings/members/page.tsx → src/lib/auth/session.ts
- `Home()` --calls--> `getSessionProfile`  [EXTRACTED]
  src/app/page.tsx → src/lib/auth/session.ts
- `FormStudio()` --indirect_call--> `field()`  [INFERRED]
  src/components/builder/FormStudio.tsx → src/lib/forms/validation.test.ts
- `PublicFormRenderer()` --indirect_call--> `isInputField()`  [INFERRED]
  src/components/forms/PublicFormRenderer.tsx → src/lib/forms/schema.ts

## Import Cycles
- None detected.

## Communities (26 total, 6 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.11
Nodes (31): actionSchema, Params, POST(), DELETE(), GET(), Params, PATCH(), GET() (+23 more)

### Community 1 - "SubmissionsView.tsx"
Cohesion: 0.07
Nodes (27): FormSubmissionsPage(), asArray(), Cell(), FieldTypeIcon(), isChoice(), RespondentMeta, Submission, Tag() (+19 more)

### Community 2 - "EmailAuthForm.tsx"
Cohesion: 0.10
Nodes (8): AuthShell(), FEATURES, EmailAuthForm(), Mode, GoogleButton(), PasswordField(), NavItem, createClient()

### Community 3 - "server.ts"
Cohesion: 0.12
Nodes (25): clientMeta(), closeFormsIfFreeAccountAtCap(), Params, POST(), submitSchema, handle(), GET(), GET() (+17 more)

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
Cohesion: 0.18
Nodes (11): FEATURES, Home(), metadata, MarketingFooter(), MarketingNav(), PricingCards(), getPlan(), Plan (+3 more)

### Community 9 - "PublicFormRenderer.tsx"
Cohesion: 0.20
Nodes (14): FormPreviewModal(), AddressGroup(), CheckboxGroup(), FieldControl(), PublicFormRenderer(), Value, Field, FieldValue (+6 more)

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
Cohesion: 0.11
Nodes (9): EditFormPage(), MembersPage(), FAQS, metadata, Container(), Item, MembersTable(), Token (+1 more)

### Community 25 - "page.tsx"
Cohesion: 0.15
Nodes (12): DashboardPage(), EMPTY_COPY, FormRecord, FormListItem, FormRow(), STATUS_STYLES, isViewId(), ViewId (+4 more)

## Knowledge Gaps
- **118 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+113 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSessionProfile` connect `createClient` to `server.ts`, `page.tsx`, `MembersTable.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `SubmissionsView.tsx`, `server.ts`, `MembersTable.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `Field` connect `PublicFormRenderer.tsx` to `SubmissionsView.tsx`, `MembersTable.tsx`, `server.ts`, `schema.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _118 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `SubmissionsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06708595387840671 - nodes in this community are weakly interconnected._
- **Should `EmailAuthForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10037878787878787 - nodes in this community are weakly interconnected._