---
title: "Workspace Output Persistence"
description: "Add auto-save to workspace/ for all 20 skills + MCP calendar persistence"
status: complete
priority: P1
effort: 4h
branch: main
tags: [skills, mcp, ux, output-persistence]
created: 2026-02-24
---

# Workspace Output Persistence

## Problem
85% of skills (17/20) output deliverables to console only — proposals, emails, ad copy, reports all vanish after conversation ends. MCP content-calendar is in-memory only (lost on restart).

## Solution
- Shared `output-convention.md` defines auto-save rules for all skills
- Each SKILL.md declares `output_dir` and references the convention
- Project CLAUDE.md (from `init`) includes workspace instructions
- MCP content-calendar persists to JSON file

## Phases

| # | Phase | Files | Status |
|---|-------|-------|--------|
| 1 | [Shared Output Convention](./phase-01-shared-output-convention.md) | 1 new | Complete |
| 2 | [Update Skill Files](./phase-02-update-skill-files.md) | 20 modified | Complete |
| 3 | [CLI Template Update](./phase-03-cli-template-update.md) | 1 modified | Complete |
| 4 | [MCP Calendar Persistence](./phase-04-mcp-calendar-persistence.md) | 1 modified | Complete |
| 5 | [Build & Verify](./phase-05-build-verify.md) | 0 | Complete |

## Key Decisions
- Root dir: `workspace/` (on-demand creation, not at init)
- Organization: By content type (11 subdirectories)
- File naming: `{descriptor}-{YYYY-MM-DD}.md`
- Path discovery: Walk up to find `.sales-iq.json`
- Behavior: Auto-save + display in console + print file path
- MCP: Persist calendar entries to `workspace/social/calendar-entries.json`

## Dependencies
- Brainstorm report: `plans/reports/brainstorm-260224-1334-workspace-output-persistence.md`

## Success Criteria
- [x] Every skill auto-saves deliverables to `workspace/{type}/`
- [x] File path printed after each save
- [x] Directories created on-demand
- [x] MCP content calendar persists across restarts
- [x] `sales-iq init` CLAUDE.md references output convention
- [x] Build passes with no TS errors
