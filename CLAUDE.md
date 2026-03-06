# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered sales and marketing toolkit for Claude Code. Monorepo with 20 domain skills + 7 standalone utilities (27 total, markdown-based Claude Code slash commands), a web dashboard, MCP server for live CRM/analytics data, and a CLI installer.

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Build all packages (Turborepo)
pnpm build

# Build a single package
pnpm --filter @bienhoang/sales-iq build        # CLI
pnpm --filter @bienhoang/sales-iq-dashboard build  # Dashboard
pnpm --filter @bienhoang/sales-iq-mcp-server build  # MCP server
pnpm --filter @bienhoang/sales-iq-core build    # Core
# Note: @bienhoang/sales-iq-skills has no build step (pure markdown)

# Lint / typecheck
pnpm lint
pnpm typecheck

# Format
pnpm format

# Dashboard dev (client + server separately)
pnpm --filter @bienhoang/sales-iq-dashboard dev:client  # Vite dev server
pnpm --filter @bienhoang/sales-iq-dashboard dev:server  # tsup --watch

# MCP server dev
pnpm --filter @bienhoang/sales-iq-mcp-server dev  # tsup --watch
```

## Release Process

Uses Changesets for versioning. Packages publish to GitHub Packages (`@bienhoang` scope).

```bash
pnpm changeset          # Create a changeset
pnpm version            # Bump versions from changesets
pnpm release            # Build + publish
```

## Architecture

Turborepo + pnpm workspaces monorepo with 5 packages:

### `packages/cli` — `@bienhoang/sales-iq`
Global CLI tool (Commander.js, ESM). Commands: `setup`, `init`, `install`, `configure`, `list`, `update`, `doctor`, `uninstall`. Entry: `src/index.ts` → registers commands from `src/commands/*.ts`. Built with tsup (ESM, node shebang). The `init` command creates per-product project directories with brand context via an interactive wizard (`src/utils/wizard-prompts.ts`). Skills are resolved from the bundled `@bienhoang/sales-iq-skills` dependency and copied to `~/.claude/skills/siq-{skill}/`.

### `packages/skills` — `@bienhoang/sales-iq-skills`
Pure markdown package (no build step). 3 clusters: `marketing/` (11 skills), `sales/` (8 skills), `strategy/` (1 skill). Plus shared utilities (`shared/`) and standalone skills (`siq-brainstorm`, `siq-dashboard`, `siq-plan`, etc.). Each skill is a directory with a `SKILL.md` file. All skill names use `siq-` prefix.

### `packages/dashboard` — `@bienhoang/sales-iq-dashboard`
Local web UI for browsing/editing workspace outputs. Split build: Vite (React 19 + TailwindCSS 4 client) + tsup (Express.js server). Client components in `src/client/`, server routes in `src/server/`. Uses TipTap for rich markdown editing. Runs on port 4983 by default.

### `packages/mcp-server` — `@bienhoang/sales-iq-mcp-server`
MCP server using `@modelcontextprotocol/sdk`. Organized into `tools/` (crm, email, social, analytics, lead-scoring, content-calendar), `resources/` (pipeline, campaigns, contacts), and `prompts/` (campaign-launch, lead-nurture). Config via `src/config.ts`. Currently ships stubs — real API integrations added incrementally.

### `packages/core` — `@bienhoang/sales-iq-core`
Shared types and utilities. Used by mcp-server via `workspace:*` dependency. Single entry point `src/index.ts`.

## Key Conventions

- **ESM throughout** — all TypeScript packages use `"type": "module"` with `.js` extensions in imports
- **tsup for bundling** — all TS packages use tsup with ESM output format
- **No test suite yet** — no automated tests exist in any package
- **Skill install path**: `~/.claude/skills/siq-{skill}/SKILL.md`
- **Brand context**: per-project `brand-context.md` file created by `sales-iq init`
- **Slug generation**: `src/utils/slug-utils.ts` wraps `slugify` with Vietnamese locale support
