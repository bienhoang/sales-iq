---
title: "Multi-Product Architecture Refactor"
description: "Split setup into silent install + per-project init command for multi-product support"
status: complete
priority: P1
effort: 3h
branch: main
tags: [cli, refactor, multi-product, init]
created: 2026-02-24
---

# Multi-Product Architecture Refactor

## Problem
Current setup does everything in 1 step (install + brand config) into `~/.claude/skills/`. Only supports 1 product/brand. Need multi-product support.

## Solution
Two-phase architecture: `setup` (silent install) + `init` (per-project wizard).

## Phases

| # | Phase | Status | Effort | Files |
|---|-------|--------|--------|-------|
| 1 | [Refactor setup → silent install](./phase-01-refactor-setup-silent-install.md) | Complete | 30m | setup.ts, wizard-prompts.ts |
| 2 | [New init command](./phase-02-new-init-command.md) | Complete | 1h30m | init.ts, slug-utils.ts, templates.ts, index.ts, package.json |
| 3 | [Update setup.sh](./phase-03-update-setup-shell.md) | Complete | 20m | setup.sh |
| 4 | [Update doctor + configure](./phase-04-update-doctor-configure.md) | Complete | 20m | doctor.ts, configure.ts |
| 5 | [Update README + docs](./phase-05-update-readme-docs.md) | Complete | 20m | README.md |

## Dependencies
- Phase 2 depends on Phase 1 (setup must be refactored before init can reference it)
- Phase 3-5 independent of each other, depend on Phase 1-2

## Architecture
```
# Before (single flow)
curl | bash → setup.sh → npx sales-iq setup → [brand questions + install + context]

# After (two phases)
curl | bash → setup.sh → npx sales-iq setup → [silent: install skills + doctor]
                                              → "Run: sales-iq init"
cd ~/projects → sales-iq init → [wizard: name, industry, audience, tone]
                              → cafe-sai-gon/
                                 ├── CLAUDE.md
                                 ├── brand-context.md
                                 ├── brand-context.json
                                 └── .sales-iq.json
cd cafe-sai-gon → claude       → Claude loads CLAUDE.md → brand-aware
```

## Key Decisions
- Skills remain global (`~/.claude/skills/`) with project override support
- Project dir created in CWD
- Brand context in project dir (flat structure)
- CLAUDE.md + MCP for context loading
- `slugify` package for Vietnamese → ASCII slug
- Re-init merges/updates, doesn't overwrite
