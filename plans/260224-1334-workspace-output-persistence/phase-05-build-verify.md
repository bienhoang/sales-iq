# Phase 5: Build & Verify

## Context
- Parent plan: [plan.md](./plan.md)
- Depends on: All previous phases

## Overview
- **Priority**: P1
- **Status**: Pending
- **Description**: Build all packages, verify no errors, spot-check output convention integration

## Requirements
- TypeScript builds clean (mcp-server, cli packages)
- All skill files valid markdown
- Output convention referenced correctly across all skills

## Implementation Steps

1. **Build TypeScript packages**:
   ```bash
   pnpm build
   ```
   Verify no TypeScript compile errors.

2. **Verify skill output sections**:
   ```bash
   grep -r "output-convention" packages/skills/ --include="*.md" | wc -l
   ```
   Should return 20 (one per SKILL.md that was updated).

3. **Verify convention file exists**:
   ```bash
   cat packages/skills/shared/output-convention.md | head -5
   ```

4. **Verify CLAUDE.md template**:
   - Run `sales-iq init` in a temp directory
   - Check generated CLAUDE.md contains `## Workspace` section

5. **Verify MCP calendar persistence** (manual):
   - Start MCP server
   - Create a calendar entry
   - Verify `workspace/social/calendar-entries.json` created
   - Restart server, list entries, verify they're still there

## Todo
- [ ] Run `pnpm build` — passes clean
- [ ] Verify 20 SKILL.md files reference output-convention.md
- [ ] Verify output-convention.md exists and is complete
- [ ] Verify generateClaudeMd() includes Workspace section
- [ ] Spot-check MCP calendar persistence (if testable)

## Success Criteria
- `pnpm build` exits 0 with no errors
- 20 skills reference output convention
- Generated CLAUDE.md has Workspace section
- Calendar persistence works (manual verification)

## Next Steps
- Create changeset for version bump
- Commit and push
