# Brainstorm: UX Improvements for Non-Tech Users

**Date:** 2026-02-24
**Status:** Agreed — ready for implementation plan

## Problem
sales-iq installation requires developer-level skills (GitHub PAT, ~/.npmrc, CLI flags, MCP concepts). Primary users are non-tech marketing/sales people who'll give up at step 1-2.

## Decisions
- **Target user:** Marketing/Sales non-tech people
- **Distribution:** GitHub Packages (auth required)
- **Auth flow:** Pre-built setup script (curl | bash) that handles everything
- **CLI style:** Wizard-style interactive prompts (like create-next-app)
- **Node.js handling:** Auto-install via nvm if missing
- **Script hosting:** Both shell script (zero-to-hero) AND npx (configured users)

## Current Journey (7 steps, ~15-20 min, high failure rate)
1. Read README
2. Create GitHub PAT
3. Edit ~/.npmrc manually
4. `npx install --skills all`
5. `npx configure --brand --name "..." --industry "..."`
6. `npx configure --mcp`
7. Restart Claude Code → run /siq-brand-strategy

## Proposed Journey

### Path A — Zero-to-hero
```bash
curl -fsSL https://raw.githubusercontent.com/bienhoang/sales-iq/main/setup.sh | bash
```
Handles: Node.js install → GitHub PAT guidance → ~/.npmrc → wizard

### Path B — Has Node.js
```bash
npx @bienhoang/sales-iq setup
```
Interactive wizard — no flags needed.

## Architecture Changes

### 1. `setup.sh` (repo root, public)
- Detect OS (macOS/Linux)
- Check/install Node.js via nvm
- Open browser to GitHub PAT page
- Prompt for token → auto-write ~/.npmrc
- Run `npx @bienhoang/sales-iq setup`

### 2. `setup` CLI command (wizard)
Interactive prompts:
- Brand name, industry, audience, tone
- Skill cluster selection
- Optional MCP configuration
- Post-install summary with "try these first" commands

### 3. `doctor` CLI command
Verify installation:
- Node.js version, npm registry, skills installed, brand context, MCP config

### 4. `uninstall` CLI command
Clean removal of all installed skills and config

### 5. Keep existing commands
`install`, `configure`, `list`, `update` unchanged for power users

### 6. New CLI dependencies
- `prompts` — interactive input
- `open` — browser opening
- `ora` — loading spinners

## Additional UX Improvements
- README: Lead with curl one-liner, push tech details to "Advanced"
- Error messages: Human-friendly with links
- Post-install: Print 3 contextual skill commands to try first
- Skill discovery: Enhanced `list` command with descriptions

## Risks
| Risk | Mitigation |
|------|------------|
| curl-pipe-bash security | Hosted on verified GitHub URL, open source |
| nvm conflicts | Detect existing Node.js first |
| GitHub auth friction | Setup script makes it painless |
| CI breakage | Keep flag-based commands for automation |
