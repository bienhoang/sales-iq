# Phase 08 — Documentation & Publishing

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: all previous phases
- Changesets: [changesets docs](https://github.com/changesets/changesets)

## Overview

- **Date**: 2026-02-24
- **Priority**: P2
- **Status**: pending
- **Effort**: 2h
- **Description**: Write documentation (README + docs/), setup npm publish pipeline with changesets, finalize GitHub Actions CI/CD, create community examples.

## Key Insights

- README.md is the #1 discovery surface — must be excellent.
- Per-package README needed for npm listing pages.
- Changesets handles versioning + changelogs + npm publish in monorepo.
- GitHub Actions: CI (every PR) + CD (npm publish on release).
- Docs should be markdown in `docs/` — no static site generator needed for MVP.
- Community examples show real-world usage patterns.

## Requirements

### Functional
- Root README.md with project overview, quick start, package descriptions
- Per-package README.md (4 packages)
- `docs/` directory with getting-started, skills guides, MCP config
- Changesets configured for independent package versioning
- GitHub Actions: CI (lint + build + typecheck) + CD (npm publish)
- Community examples directory

### Non-Functional
- README quick start: usable in under 2 minutes
- Docs written for Claude Code users (technical, concise)
- CI runs in under 3 minutes
- npm publish automated on changeset merge

## Architecture

```
sales-iq/
├── README.md                          # Root: overview + quick start
├── docs/
│   ├── getting-started.md             # Installation + first use
│   ├── skills/
│   │   ├── marketing.md               # Marketing cluster guide
│   │   ├── sales.md                   # Sales cluster guide
│   │   └── strategy.md                # Strategy cluster guide
│   ├── mcp-server/
│   │   └── configuration.md           # MCP setup + API keys
│   └── api-reference/
│       └── core-types.md              # sales-iq-core types
├── examples/
│   ├── basic-setup/                   # Minimal project setup
│   └── full-stack-saas/               # All clusters + MCP
├── .changeset/
│   └── config.json                    # Changesets config
├── .github/
│   └── workflows/
│       ├── ci.yml                     # PR: lint + build + typecheck
│       └── release.yml                # Main: changeset publish
├── packages/
│   ├── skills/README.md
│   ├── mcp-server/README.md
│   ├── core/README.md
│   └── cli/README.md
```

## Related Code Files

### Create
- `README.md` — root readme (replace placeholder from phase 01)
- `docs/getting-started.md`
- `docs/skills/marketing.md`
- `docs/skills/sales.md`
- `docs/skills/strategy.md`
- `docs/mcp-server/configuration.md`
- `docs/api-reference/core-types.md` (deferred until core extracted from MCP server)
- `examples/basic-setup/README.md`
- `examples/full-stack-saas/README.md`
- `.changeset/config.json`
- `.github/workflows/release.yml`
- `packages/skills/README.md`
- `packages/mcp-server/README.md`
- `packages/core/README.md`
- `packages/cli/README.md`

### Modify
- `.github/workflows/ci.yml` — finalize from phase 01 skeleton
- Root `package.json` — add changeset scripts

## Implementation Steps

1. **Write root README.md**:
   - Project name + tagline + badges (npm, CI, license)
   - One-paragraph description
   - Quick start (3 commands: install CLI, install skills, configure brand)
   - Package overview table (4 packages with links)
   - Skills overview (3 clusters with skill counts)
   - MCP server overview (tool categories)
   - Contributing section
   - License (MIT)
   - Keep under 150 lines

2. **Write getting-started.md**:
   - Prerequisites: Node 20+, Claude Code
   - Install via npx: `npx sales-iq install --skills all`
   - Configure brand: `npx sales-iq configure --brand`
   - Configure MCP: `npx sales-iq configure --mcp`
   - First skill usage: `/brand-strategy`
   - Troubleshooting common issues

3. **Write skill guide docs** (marketing.md, sales.md, strategy.md):
   - Cluster overview and architecture
   - Skill table with commands and descriptions
   - Hub-and-spoke explanation (marketing/sales) or framework dispatch (strategy)
   - Customization guide
   - Example workflows

4. **Write MCP configuration.md**:
   - Manual config (copy JSON to settings)
   - CLI config: `npx sales-iq configure --mcp`
   - Environment variables reference table
   - Per-integration setup guides (HubSpot, Resend, etc.)
   - Testing the server connection

5. **Write core types reference** (api-reference/core-types.md):
   - All exported types with descriptions
   - Utility function signatures
   - Usage examples from MCP server

6. **Write per-package README.md**:
   - `sales-iq-skills` — what's included, manual install, customization
   - `sales-iq-mcp-server` — what tools/resources, config, npx usage
   - `sales-iq-core` — types overview, install, usage
   - `sales-iq` (CLI) — command reference, examples

7. **Setup changesets**:
   ```bash
   pnpm add -Dw @changesets/cli @changesets/changelog-github
   pnpm changeset init
   ```
   Config (`.changeset/config.json`):
   ```json
   {
     "$schema": "https://unpkg.com/@changesets/config@3/schema.json",
     "changelog": "@changesets/changelog-github",
     "commit": false,
     "fixed": [],
     "linked": [],
     "access": "public",
     "baseBranch": "main",
     "updateInternalDependencies": "patch"
   }
   ```
   Root package.json scripts: `"changeset": "changeset"`, `"version": "changeset version"`, `"release": "turbo build && changeset publish"`

8. **Create GitHub Actions release workflow** (`.github/workflows/release.yml`):
   - Trigger: push to main
   - Uses changesets/action for automated PR creation + npm publish
   - Steps: checkout, setup pnpm, install, build, changesets publish
   - Requires `NPM_TOKEN` secret

9. **Finalize CI workflow** — ensure lint, build, typecheck all pass

10. **Create example projects**:
    - `examples/basic-setup/` — minimal README showing install + first skill
    - `examples/full-stack-saas/` — README showing all clusters + MCP config

## Todo List

- [ ] Write root README.md
- [ ] Write docs/getting-started.md
- [ ] Write skill guide docs (3 files)
- [ ] Write MCP configuration.md
- [ ] Write core types reference
- [ ] Write per-package READMEs (4 files)
- [ ] Setup changesets
- [ ] Create release GitHub Actions workflow
- [ ] Finalize CI workflow
- [ ] Create example projects
- [ ] Verify full build + lint + typecheck passes

## Success Criteria

- Root README provides clear quick start in <2 minutes reading
- `pnpm changeset` workflow produces versioned packages
- GitHub Actions CI passes on clean clone
- Release workflow publishes to npm when changesets merged
- All 4 npm package pages have useful README content
- Docs cover installation, configuration, and customization

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Package name collision on npm | Check availability early; names are unscoped `sales-iq-*` |
| Changeset publish fails on first release | Test with `--dry-run` first |
| README gets stale as features evolve | Keep README high-level; link to docs for details |

## Security Considerations

- `NPM_TOKEN` stored as GitHub secret, never in code
- No `.env` files committed
- Example projects must not contain real API keys
- README should warn about API key handling

## Next Steps

- Post-launch: consider docs site (Mintlify, Nextra) if community grows
- Track npm downloads and GitHub stars
- Gather feedback for v0.2.0 roadmap
