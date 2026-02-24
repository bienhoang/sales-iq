# Phase 5: Skill + Monorepo Integration

## Context Links
- [Plan overview](./plan.md)
- [Brainstorm — skill definition](../reports/brainstorm-260224-1536-siq-dashboard.md)
- [Existing skill pattern](../../packages/skills/siq-brainstorm/SKILL.md)
- [Output convention](../../packages/skills/shared/output-convention.md)

## Overview
- **Priority**: P2
- **Status**: complete
- **Effort**: 3h
- **Depends on**: Phase 4

Create the `/siq-dashboard` skill definition (SKILL.md), wire dashboard package into monorepo build/publish pipeline, create changeset, and end-to-end test with `test/gosnap/`.

## Key Insights
- Skill SKILL.md files use YAML frontmatter: name, description, license, version
- Skills instruct Claude to run commands — skill itself is just a prompt
- Skill runs `npx @bienhoang/sales-iq-dashboard --dir <project-root>`
- Skills package publishes as `@bienhoang/sales-iq-skills` — dashboard skill lives alongside existing skills
- Dashboard package publishes separately as `@bienhoang/sales-iq-dashboard`
- Changeset needed for both packages (skills + dashboard)
- Turbo already discovers `packages/*` — dashboard auto-included

## Requirements

### Functional
- `/siq-dashboard` skill available in skills package
- Running the skill opens dashboard in browser for current project
- Dashboard works via `npx @bienhoang/sales-iq-dashboard --dir <path>`
- Changeset created for release

### Non-functional
- Skill follows existing SKILL.md format conventions
- Dashboard package passes turbo build/typecheck/lint
- Skills package includes new skill in its catalog

## Architecture

### Skill file location
```
packages/skills/siq-dashboard/SKILL.md
```

### Package publish flow
```
changeset → version → turbo build → changeset publish
  → @bienhoang/sales-iq-dashboard (new package, v0.1.0)
  → @bienhoang/sales-iq-skills (patch bump, includes siq-dashboard)
```

## Related Code Files

### Files to create
- `packages/skills/siq-dashboard/SKILL.md`
- `.changeset/siq-dashboard-init.md` (changeset for dashboard package)
- `.changeset/skills-add-dashboard.md` (changeset for skills package)

### Files to verify (no changes needed)
- `pnpm-workspace.yaml` — already has `packages/*` glob
- `turbo.json` — already builds all packages
- `packages/skills/package.json` — verify `files` includes `siq-dashboard/`

## Implementation Steps

### 1. Create SKILL.md
```yaml
---
name: siq-dashboard
description: "Open workspace dashboard to browse and edit your sales-iq outputs in a local web UI"
license: MIT
version: 1.0.0
---
```

Skill prompt body instructs Claude to:
<!-- Updated: Validation Session 1 - Skill detects local bin vs npx -->
1. Detect project root by walking up to find `.sales-iq.json`
2. Check if `siq-dashboard` binary is available locally (pnpm-linked during dev): `which siq-dashboard`
3. If local binary found: run `siq-dashboard --dir <project-root>` in background
4. If not found: run `npx @bienhoang/sales-iq-dashboard --dir <project-root>` in background
5. Wait ~2 seconds for server to start
6. Report the dashboard URL to the user
7. Mention Ctrl+C in the terminal to stop the server

Key instructions in SKILL.md:
- If `.sales-iq.json` not found, tell user to run `sales-iq init` first
- Use `--no-open` if user requests it
- Pass `--port <N>` if user specifies a custom port
- Do NOT attempt to modify workspace files directly — direct user to the dashboard UI

### 2. Verify skills package includes new skill
Check `packages/skills/package.json` `files` field:
- If it lists specific directories, add `siq-dashboard/`
- If it uses a glob like `**/SKILL.md`, no change needed
- Run `pnpm pack --dry-run` in skills package to verify inclusion

### 3. Create changesets

**Dashboard package** (`.changeset/siq-dashboard-init.md`):
```md
---
"@bienhoang/sales-iq-dashboard": minor
---

feat: add siq-dashboard package — local web UI for browsing and editing workspace outputs
```

**Skills package** (`.changeset/skills-add-dashboard.md`):
```md
---
"@bienhoang/sales-iq-skills": patch
---

feat: add /siq-dashboard skill for opening workspace dashboard
```

### 4. Verify turbo build pipeline
```bash
# From monorepo root
pnpm build
# Verify:
# - packages/dashboard/ builds (dist/server.js + dist/client/)
# - packages/skills/ builds (if it has a build step)
# - No errors from turbo
```

### 5. Verify typecheck
```bash
pnpm typecheck
# All packages pass including dashboard
```

### 6. End-to-end test with test/gosnap/

**Test 1: Server starts and serves dashboard**
```bash
node packages/dashboard/dist/server.js --dir test/gosnap --no-open
# Verify: "Sales-IQ Dashboard: http://localhost:4983"
curl -s http://localhost:4983/api/workspace | jq .
# Expect: strategy (4 files) + intel (2 files)
```

**Test 2: File read/write cycle**
```bash
# Read a file
curl -s "http://localhost:4983/api/files?path=strategy/brand-voice-guide-2026-02-24.md" | jq .content | head -5
# Save with modified content (add a line)
curl -X PUT "http://localhost:4983/api/files?path=strategy/brand-voice-guide-2026-02-24.md" \
  -H "Content-Type: application/json" \
  -d '{"content":"# Modified\nTest save"}'
# Read back and verify
curl -s "http://localhost:4983/api/files?path=strategy/brand-voice-guide-2026-02-24.md" | jq .content
# Restore original (git checkout)
```

**Test 3: Security — path traversal blocked**
```bash
curl -s "http://localhost:4983/api/files?path=../package.json"
# Expect: 403 Forbidden
curl -s "http://localhost:4983/api/files?path=../../.env"
# Expect: 403 Forbidden
```

**Test 4: System + config endpoints**
```bash
curl -s http://localhost:4983/api/system | jq .
curl -s http://localhost:4983/api/config | jq .
```

**Test 5: Browser UI**
- Open `http://localhost:4983` in browser
- Verify sidebar shows strategy + intel categories
- Click a file → content loads in editor
- Edit text → save → reload page → verify changes persisted
- Check system bar shows correct info

**Test 6: Empty workspace**
```bash
mkdir -p /tmp/empty-project && echo '{"name":"empty","slug":"empty","version":"1.0.0"}' > /tmp/empty-project/.sales-iq.json
node packages/dashboard/dist/server.js --dir /tmp/empty-project --no-open
# Open http://localhost:4983 → verify empty state with getting-started guide
```

### 7. Verify npx execution
```bash
# Simulate npx by running the bin entry directly
node packages/dashboard/dist/server.js --dir test/gosnap --no-open
# This matches what `npx @bienhoang/sales-iq-dashboard --dir ... ` would do
```

## Todo List
- [ ] Create `packages/skills/siq-dashboard/SKILL.md`
- [ ] Verify skills package includes `siq-dashboard/` in published files
- [ ] Create changeset for dashboard package
- [ ] Create changeset for skills package
- [ ] Run `pnpm build` from root — verify all packages build
- [ ] Run `pnpm typecheck` — verify all packages pass
- [ ] Test: server starts with `test/gosnap/`
- [ ] Test: API endpoints return correct data
- [ ] Test: path traversal blocked (403)
- [ ] Test: browser UI loads, sidebar shows categories, file viewer works
- [ ] Test: Tiptap editor edit + save cycle
- [ ] Test: empty workspace shows getting-started guide
- [ ] Test: `--no-open` flag works
- [ ] Test: `--port` flag works
- [ ] Git checkout test files to restore originals after write tests

## Success Criteria
- `/siq-dashboard` skill file exists and follows SKILL.md convention
- `pnpm build` from monorepo root succeeds including dashboard
- All 6 test scenarios pass
- Changesets exist for both packages
- Dashboard works end-to-end: skill prompt → npx → server → browser → edit → save

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| npx cold start slow (downloads pkg) | Medium | Document in skill that first run downloads package |
| Skills package files field excludes new skill | Low | Verify with `pnpm pack --dry-run` |
| Changeset version conflicts | Low | Use separate changesets per package |
| Test file modifications not reverted | Medium | Use `git checkout test/` after write tests |

## Security Considerations
- SKILL.md instructs Claude to use `--dir` pointing to detected project root only
- No secrets or credentials in skill prompt
- npx downloads from GitHub Packages registry (restricted access)

## Next Steps
- Commit all changes
- Create PR for review
- After merge: `changeset version && changeset publish`
