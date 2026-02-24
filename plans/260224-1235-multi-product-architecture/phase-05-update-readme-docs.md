# Phase 5: Update README + Docs

## Context
- Parent: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-refactor-setup-silent-install.md), [Phase 2](./phase-02-new-init-command.md)

## Overview
- **Priority**: P2
- **Effort**: 20m
- **Status**: Complete
- **Description**: Update README.md to reflect new 2-phase installation flow and init command.

## Key Insights
- README must show new flow: setup (silent) → init (per-project)
- Quick start section needs rewrite
- Command reference table needs `init` added
- Remove references to brand questions during setup

## Related Code Files

**Modify:**
- `README.md` — update quick start, command reference, architecture description

## Implementation Steps

### Step 1: Update Quick Start section

Replace current setup instructions with 2-phase flow:

```markdown
## Quick Start

### 1. Install (one-time)
```bash
curl -fsSL https://raw.githubusercontent.com/bienhoang/sales-iq/main/setup.sh | bash
```

This installs the CLI and all skills. No questions asked.

### 2. Create a project
```bash
cd ~/projects
sales-iq init
```

Answer a few questions about your product/company. A project folder is created with your brand context.

### 3. Start working
```bash
cd my-product
claude
```

Claude Code automatically loads your brand context and activates sales-iq skills.
```

### Step 2: Update command reference table

Add `init` command, update `setup` description:

| Command | Description |
|---------|-------------|
| `setup` | Silent install — skills + health check (no prompts) |
| `init` | Create a project for a product/company (interactive wizard) |
| `list` | Show installed skills |
| `update` | Force-reinstall all skills |
| `doctor` | Check installation health |
| `configure` | Configure MCP server |
| `uninstall` | Remove all skills and config |

### Step 3: Add multi-product section

```markdown
## Multi-Product Support

Create separate projects for each product or brand:

```bash
sales-iq init    # → my-saas-product/
sales-iq init    # → my-agency-brand/
sales-iq init    # → client-project/
```

Each project has its own brand context. Switch between them by `cd`-ing into the project folder.
```

### Step 4: Update project structure description

Show the per-project structure alongside global skills.

## Todo
- [ ] Update quick start to 2-phase flow
- [ ] Add `init` to command reference
- [ ] Add multi-product section
- [ ] Update project structure diagram
- [ ] Remove references to brand questions in setup

## Success Criteria
- README accurately reflects new 2-phase flow
- New users can follow quick start without confusion
- Multi-product use case clearly documented
- All command descriptions up to date
