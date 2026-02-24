---
title: "sales-iq Monorepo Init"
description: "Full-platform sales/marketing AI toolkit — Skills + MCP + CLI"
status: complete
priority: P1
effort: 30h
branch: main
tags: [monorepo, turborepo, mcp, skills, sales, marketing]
created: 2026-02-24
---

# sales-iq Monorepo Init

Public npm toolkit for SaaS/dev-tools sales and marketing. Combines Claude Code Skills (markdown, 3 domain clusters) + MCP Server (TypeScript, external integrations) + CLI (install/config).

## Architecture

- **Monorepo**: Turborepo + pnpm workspaces
- **3 packages**: `sales-iq-skills`, `sales-iq-mcp-server`, `sales-iq` (CLI) — unscoped npm
- **3 skill clusters**: marketing (~11), sales (~8), strategy (1 monolithic)
- **AI**: All Claude API via Anthropic SDK
- **Skill prefix**: `siq-` prefix on all skill names (e.g., `siq-brand-strategy`)
- **Install**: Hierarchy preserved (`~/.claude/skills/marketing/siq-brand-strategy/`)

## Phases

| # | Phase | Effort | Status | Depends On |
|---|-------|--------|--------|------------|
| 01 | [Monorepo Foundation](./phase-01-monorepo-foundation.md) | 3h | complete | — |
| 02 | [Core Package](./phase-02-core-package.md) | — | deferred | merged into 06 |
| 03 | [Marketing Skills Cluster](./phase-03-marketing-skills-cluster.md) | 6h | complete | 01 |
| 04 | [Strategy Skills Cluster](./phase-04-strategy-skills-cluster.md) | 4h | complete | 01 |
| 05 | [Sales Skills Cluster](./phase-05-sales-skills-cluster.md) | 6h | complete | 01, 03 |
| 06 | [MCP Server + Core Types](./phase-06-mcp-server.md) | 8h | complete | 01 |
| 07 | [CLI Tool](./phase-07-cli-tool.md) | 3h | complete | 03 |
| 08 | [Documentation & Publishing](./phase-08-documentation-publishing.md) | 2h | complete | all |

## Critical Path

```
01 Foundation ─┬─ 03 Marketing ─┬── 05 Sales ───┐
               │                │               │
               ├─ 04 Strategy   ┘               ├─ 08 Docs & Publish
               │                                │
               ├─ 06 MCP + Core ── 07 CLI ──────┘
               └────────────────────────────────┘
```

Phase 02 (Core) merged into Phase 06 — types built alongside MCP server.
Phases 03, 04, 06 parallelizable after 01. Phase 05 needs 03. Phase 07 needs 03+06.

## Key Dependencies

- `@modelcontextprotocol/sdk` — MCP server
- `@anthropic-ai/sdk` — AI-powered tools (lead scoring)
- `commander` — CLI framework
- `turbo` — monorepo orchestration
- `tsup` — TypeScript bundling
- `changesets` — version management + npm publish

## Key Decisions

- Skills package has NO build step; just `files` field for npm
- CLI uses `require.resolve()` to find skills package path, copies to `~/.claude/skills/`
- MCP server runs via stdio transport; configured as `npx sales-iq-mcp-server`
- **Skill names prefixed `siq-`** (e.g., `/siq-brand-strategy`, `/siq-lead-qualification`)
- **npm packages unscoped**: `sales-iq-skills`, `sales-iq-mcp-server`, `sales-iq` (CLI)
- **Install preserves hierarchy**: `~/.claude/skills/marketing/siq-ad-copy/`
- Hub skills store shared state in `references/`; spoke skills load from `../siq-brand-strategy/references/`
- **Core types deferred**: built inside MCP server, extracted to shared package when patterns stabilize
- **MCP ships with stubs**: real API integrations added incrementally per-provider

## Reference Materials

- `.ref/Go-snap-marketing-2026/` — 11 marketing skills (hub-and-spoke pattern)
- `.ref/Sales-leader-consultant/` — strategy consultant (monolithic, 10 frameworks)
- [Research: Skills Distribution](./research/researcher-02-skills-distribution-patterns.md)
- [Brainstorm: Architecture](../reports/brainstorm-260224-0042-sales-iq-monorepo-architecture.md)

## Validation Log

### Session 1 — 2026-02-24
**Trigger:** Initial plan creation validation
**Questions asked:** 6

#### Questions & Answers

1. **[Architecture]** Skills use relative paths (e.g., `../brand-strategy/references/`). When CLI installs to `~/.claude/skills/`, should it preserve the cluster hierarchy or flatten?
   - Options: Keep hierarchy (Recommended) | Flatten with path rewrite | Flat + absolute paths
   - **Answer:** Keep hierarchy
   - **Rationale:** Preserves relative path refs between hub and spoke skills without runtime path rewriting. Install path: `~/.claude/skills/marketing/siq-brand-strategy/`

2. **[Scope]** 30+ skills at v0.1.0 launch is ambitious. Should MVP ship all 3 clusters or start smaller?
   - Options: Marketing + Strategy only | All 3 clusters (Recommended) | Marketing only
   - **Answer:** All 3 clusters
   - **Rationale:** Sales cluster follows marketing pattern — consistent effort. Shipping incomplete toolkit reduces adoption appeal.

3. **[Scope]** MCP server plans stub implementations. For npm launch, should stubs ship or only real implementations?
   - Options: Stubs OK for launch (Recommended) | Real impls required | No MCP at launch
   - **Answer:** Stubs OK for launch
   - **Rationale:** Stubs establish API surface early. Real integrations added incrementally per-provider without breaking changes.

4. **[Sequencing]** Phase 02 defines 5 type files before MCP server exists. Build core types now or defer?
   - Options: Build core first (plan as-is) | Defer core to Phase 06 (Recommended) | Minimal core + extend
   - **Answer:** Defer core to Phase 06
   - **Rationale:** YAGNI — types designed without real API shapes risk rework. Build types inside MCP server, extract to core when patterns stabilize.

5. **[Naming]** Skill names are flat. With 20+ skills, collision risk with user's existing skills.
   - Options: Flat names, accept risk (Recommended) | Prefixed: siq-brand-strategy | Cluster prefix: mkt-brand-strategy
   - **Answer:** Prefixed: siq-brand-strategy
   - **Rationale:** `siq-` prefix avoids collision with user/community skills while staying short. All skills easily identifiable as sales-iq toolkit.

6. **[Architecture]** The plan uses `@sales-iq/*` npm scope. Scope may not be available.
   - Options: Check availability first | Use @salesiq (no hyphen) | Unscoped: sales-iq-*
   - **Answer:** Unscoped: sales-iq-*
   - **Rationale:** Unscoped packages don't require npm org setup. Simpler publish flow. Names: `sales-iq-skills`, `sales-iq-mcp-server`, `sales-iq` (CLI).

#### Confirmed Decisions
- **Hierarchy install**: `~/.claude/skills/{cluster}/siq-{skill}/` — preserves relative paths
- **Full MVP**: All 3 clusters at launch (marketing + sales + strategy)
- **Stubs for MCP**: Ship stub integrations, document clearly
- **Core deferred**: Types built inside MCP, extracted later
- **siq- prefix**: All skill dirs/names prefixed `siq-`
- **Unscoped npm**: `sales-iq-*` package names, no npm org needed

#### Action Items
- [x] Update plan.md architecture, phase table, critical path, key decisions
- [x] Update Phase 01: change package names to unscoped
- [x] Update Phase 02: mark as deferred, redirect to Phase 06
- [x] Update Phases 03-05: rename all skill directories with `siq-` prefix
- [x] Update Phase 06: absorb core types, update package name
- [x] Update Phase 07: update package references, hierarchy install logic
- [x] Update Phase 08: update npm package names
- [x] Mark all phases complete (Phase 02 remains deferred)
- [x] Update frontmatter status from pending to complete

#### Impact on Phases
- **Phase 01**: Package names change from `@sales-iq/*` to `sales-iq-*`
- **Phase 02**: Deferred — merged into Phase 06. Core types built alongside MCP server
- **Phase 03**: All skill directories renamed `siq-*` (e.g., `siq-brand-strategy/`, `siq-ad-copy/`). Hub refs path: `../siq-brand-strategy/references/`
- **Phase 04**: Skill directory renamed `siq-strategy-consultant/`
- **Phase 05**: All skill directories renamed `siq-*` (e.g., `siq-account-strategy/`, `siq-lead-qualification/`). Hub refs path: `../siq-account-strategy/references/`
- **Phase 06**: Absorbs Phase 02 core types. Package name: `sales-iq-mcp-server`. Effort increased 6h → 8h
- **Phase 07**: Package name stays `sales-iq`. Install logic preserves hierarchy. References `sales-iq-skills` package
- **Phase 08**: All npm package names updated to unscoped
