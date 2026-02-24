# Brainstorm: Multi-Product Architecture

## Problem Statement

Current setup wizard does everything in 1 step — install CLI, skills, create brand context — all into `~/.claude/skills/`. Only supports 1 product/brand. User needs multi-product support with different marketing strategies per product.

## Agreed Solution: Two-Phase Architecture

### Phase 1: `setup` → Silent Install (Zero Interaction)

**Current** → asks brand questions + installs skills + creates brand context
**New** → only installs CLI + skills + runs health check. No prompts.

Changes to `setup` command:
- Remove all brand questions (company, industry, audience, tones)
- Remove brand-context.md/json generation from `~/.claude/skills/shared/`
- Keep: install all skills to `~/.claude/skills/`, run doctor
- Make completely non-interactive (silent)

Changes to `setup.sh`:
- Remove brand question delegation
- After CLI install, print: `Run 'sales-iq init' to create your first project`

### Phase 2: New `init` Command → Create Project

Interactive wizard creates per-product project directory.

**Flow:**
```
$ cd ~/projects
$ sales-iq init

? Product/Company name: Cafe Sài Gòn
? Industry: Food & Beverage
? Target audience: Young professionals 25-35
? Brand tones: Friendly, Professional

✓ Created project: cafe-sai-gon/

Next steps:
  cd cafe-sai-gon
  claude
```

**Name → Slug conversion:**
- Vietnamese diacritics removed: "Cafe Sài Gòn" → "cafe-sai-gon"
- Lowercase, spaces → hyphens, strip special chars
- Use `slugify` npm package or simple diacritics map

**Generated project structure:**
```
cafe-sai-gon/
├── CLAUDE.md            # Claude Code auto-loads this
├── brand-context.md     # Brand voice, ICP, messaging
├── brand-context.json   # Structured data for MCP/tools
└── .sales-iq.json       # Project config metadata
```

### File Details

#### CLAUDE.md
Auto-generated, tells Claude Code about this project:
- Brand identity summary (from brand-context.md)
- Instructions to use siq-* skills (global at ~/.claude/skills/)
- Reference brand-context.json for structured queries
- Skill activation guidance per use case
- Optional: MCP server config hint

#### brand-context.md
Same template as current, but lives in project dir:
- Company/product overview
- Brand voice & tone guidelines
- ICP (Ideal Customer Profile)
- Messaging pillars
- Competitive positioning

#### brand-context.json
Structured version for programmatic access:
- company, industry, audience, tones, etc.

#### .sales-iq.json
Project metadata:
```json
{
  "name": "Cafe Sài Gòn",
  "slug": "cafe-sai-gon",
  "version": "1.0.0",
  "created": "2026-02-24T12:35:00Z",
  "updated": "2026-02-24T12:35:00Z",
  "skills_version": "1.0.0"
}
```

### Re-init Flow (Project Already Exists)

When `.sales-iq.json` detected in target dir:
1. Show current config
2. Ask which fields to update
3. Merge changes into existing files
4. Preserve user customizations in CLAUDE.md (only update auto-generated sections)
5. Update `.sales-iq.json` timestamp

### Skills: Global + Project Override

- Global skills at `~/.claude/skills/siq-*` (installed by setup)
- Project can add local skill overrides by creating `skills/siq-*/SKILL.md` in project dir
- CLAUDE.md references both: global skills + local overrides if present

### Context Loading: CLAUDE.md + MCP

- **CLAUDE.md**: Claude Code auto-loads when user `cd cafe-sai-gon && claude`
- **MCP**: Optional `.claude/settings.json` in project dir for MCP server config
  - This is a hidden Claude Code convention, not part of flat structure user sees
  - Can be generated during `init` if MCP server is configured globally

## Command Summary (After Changes)

| Command | Purpose | Interactive? |
|---------|---------|-------------|
| `setup` | Install CLI + skills + health check | No (silent) |
| `init` | Create project for product/company | Yes (wizard) |
| `list` | Show installed skills | No |
| `update` | Force-reinstall skills | No |
| `doctor` | Health check | No |
| `uninstall` | Remove everything | Yes (confirm) |
| `configure` | MCP + brand setup (legacy?) | Yes |

**Note**: `configure` may become redundant — MCP setup moves to `init`, brand setup IS `init`. Consider deprecating or repurposing.

## Implementation Considerations

### Vietnamese Slug Generation
Options:
1. **`slugify` npm package** — battle-tested, handles Unicode
2. **Custom diacritics map** — lightweight, no deps, ~50 lines
3. **`transliteration` package** — handles CJK, Vietnamese, Thai, etc.

Recommend: `slugify` (most popular, well-maintained, handles edge cases)

### Migration Path for Existing Users
- Users with current setup have brand-context in `~/.claude/skills/shared/`
- New `init` could detect this and offer to migrate: create project from existing context
- Or just let both coexist — global context = fallback, project context = override

### CLAUDE.md Template Design
Critical to get right — this is what makes Claude Code "aware" of the product:
- Must be concise (Claude Code loads it every session)
- Must reference skills by name so Claude activates them
- Should include brand voice summary inline (not just "see brand-context.md")

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Breaking change for existing users | Medium | Detect existing setup, offer migration |
| CLAUDE.md too verbose | Low | Keep under 100 lines, link to details |
| Slug collision (2 products same name) | Low | Check dir exists, append number or ask |
| MCP config per project complexity | Medium | Make MCP optional in init, keep global fallback |

## Success Metrics
- `setup` completes in <30s with zero prompts
- `init` creates working project in <60s
- User can `cd project && claude` and get brand-aware responses immediately
- Re-init preserves user customizations

## Next Steps
1. Create detailed implementation plan
2. Refactor `setup` command (strip brand questions)
3. Build `init` command with wizard
4. Update `setup.sh` to reflect new flow
5. Test migration path from existing setup
6. Update README + docs
