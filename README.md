# sales-iq

[![GitHub Packages](https://img.shields.io/badge/registry-GitHub%20Packages-blue)](https://github.com/bienhoang/sales-iq/packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

AI-powered sales and marketing toolkit for Claude Code. 20 ready-to-use skills, a workspace dashboard, and live data via MCP server.

## Quick Start

### 1. Install (one-time)

```bash
curl -fsSL https://raw.githubusercontent.com/bienhoang/sales-iq/main/setup.sh | bash
```

Handles everything: Node.js, authentication, skills, dashboard, and MCP config. No questions asked.

Or if you already have Node.js 20+ with GitHub Packages configured:

```bash
npm install -g @bienhoang/sales-iq @bienhoang/sales-iq-dashboard
sales-iq setup
```

### 2. Create a project

```bash
cd ~/projects
sales-iq init          # or: npx @bienhoang/sales-iq init
```

Answer a few questions about your product/company. A project folder is created with your brand context.

### 3. Start working

```bash
cd my-product
claude
```

Claude Code automatically loads your brand context and activates sales-iq skills.

## Multi-Product Support

Create separate projects for each product or brand:

```bash
sales-iq init    # → my-saas-product/
sales-iq init    # → my-agency-brand/
sales-iq init    # → client-project/
```

Each project has its own brand context. Switch between them by `cd`-ing into the project folder.

## What's Included

### Marketing (11 skills)

Start with `/siq-brand-strategy` to set your positioning, then use any marketing skill:

| Skill | What it does |
|-------|-------------|
| `/siq-brand-strategy` | Brand voice, positioning, ICP (start here) |
| `/siq-email-campaign` | Email sequences and drip campaigns |
| `/siq-social-media-calendar` | Monthly social content calendar |
| `/siq-social-media-post` | Individual social posts |
| `/siq-ad-copy` | PPC and paid social ad copy |
| `/siq-seo-content` | SEO-optimized long-form content |
| `/siq-content-repurpose` | Repurpose content across formats |
| `/siq-product-launch` | Launch plans and messaging |
| `/siq-competitor-intel` | Competitor analysis and gaps |
| `/siq-metrics-report` | Marketing metrics narrative |
| `/siq-community-engagement` | Community post and response copy |

### Sales (8 skills)

Start with `/siq-account-strategy` to define your sales motion:

| Skill | What it does |
|-------|-------------|
| `/siq-account-strategy` | ICP, sales motion, objection map (start here) |
| `/siq-outreach-sequence` | Cold outreach email sequences |
| `/siq-demo-prep` | Demo scripts and discovery questions |
| `/siq-follow-up` | Post-meeting follow-up emails |
| `/siq-lead-qualification` | BANT/MEDDIC qualification |
| `/siq-objection-handling` | Objection response playbook |
| `/siq-proposal-generator` | Proposal and SOW drafts |
| `/siq-pipeline-report` | Pipeline health narrative |

### Strategy (1 skill)

| Skill | What it does |
|-------|-------------|
| `/siq-strategy-consultant` | 10 frameworks: SWOT, Porter's, Blue Ocean, JTBD, and more |

### Workspace Dashboard

Browse and edit workspace outputs in a local web UI:

```
/siq-dashboard
```

Opens `http://localhost:4983` with:
- Category sidebar (proposals, emails, reports, plans, etc.)
- Collapsible file tree with nested folder support
- Rich markdown editor (TipTap) with live preview
- Auto-discovery of workspace directories

The dashboard is installed globally during setup. Falls back to `npx @bienhoang/sales-iq-dashboard` if not found.

### Live Data via MCP Server

Connect CRM, email, social, and analytics for real-time data in your skills:

```bash
sales-iq configure --mcp
```

Supports: HubSpot, Mailchimp, Twitter/X, LinkedIn, Google Analytics 4, SEMrush.

## What Gets Installed

| Component | Location | Purpose |
|-----------|----------|---------|
| CLI (`sales-iq`) | Global npm | Setup, init, doctor, update commands |
| Dashboard (`siq-dashboard`) | Global npm | Local web UI for workspace files |
| Skills (20) | `~/.claude/skills/` | Claude Code slash commands |
| MCP Server | `~/.claude/settings.json` | Live data from CRM/analytics |
| Brand Context | `<project>/brand-context.md` | Per-project brand info |

## Commands

| Command | Description |
|---------|-------------|
| `setup` | Install skills + dashboard + MCP config + health check |
| `init` | Create a project for a product/company (interactive wizard) |
| `list` | Show installed skills |
| `update` | Force-reinstall all skills |
| `doctor` | Check installation health |
| `configure` | Configure MCP server |
| `uninstall` | Remove all skills and config |

## Maintenance

```bash
# Check installation health
sales-iq doctor

# Update skills to latest
sales-iq update

# Remove everything
sales-iq uninstall
```

## Architecture

```
sales-iq/                     # Monorepo (Turborepo + pnpm)
├── packages/
│   ├── cli/                  # CLI tool (@bienhoang/sales-iq)
│   │   └── src/commands/     # setup, init, install, doctor, etc.
│   ├── skills/               # 20 skills + dashboard skill
│   │   ├── marketing/        # 11 marketing skills
│   │   ├── sales/            # 8 sales skills
│   │   ├── strategy/         # 1 strategy skill
│   │   └── siq-dashboard/    # Dashboard skill (SKILL.md)
│   ├── dashboard/            # Web dashboard (@bienhoang/sales-iq-dashboard)
│   │   └── src/
│   │       ├── client/       # React 19 + TailwindCSS 4
│   │       └── server/       # Express.js API
│   └── mcp-server/           # MCP server for live data
├── setup.sh                  # One-command installer
└── docs/                     # Documentation
```

## Advanced

<details>
<summary>Manual installation (power users / CI)</summary>

### Prerequisites

- Node.js 20+
- GitHub PAT with `read:packages` scope

### npm registry setup

Add to `~/.npmrc`:

```
@bienhoang:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

### CLI commands

```bash
# Install CLI and dashboard
npm install -g @bienhoang/sales-iq @bienhoang/sales-iq-dashboard

# Run setup (skills + MCP)
sales-iq setup

# Install specific clusters
sales-iq install --skills marketing
sales-iq install --skills sales,strategy

# Install all with force overwrite
sales-iq install --skills all --force

# Configure brand via flags (global/legacy)
sales-iq configure --brand --name "YourSaaS" --industry "developer-tools"

# Configure MCP server
sales-iq configure --mcp

# List installed skills
sales-iq list

# Run dashboard standalone
siq-dashboard --dir ./my-project --port 5000
```

</details>

## Documentation

- [Getting Started](docs/getting-started.md)
- [Marketing Skills](docs/skills/marketing.md)
- [Sales Skills](docs/skills/sales.md)
- [Strategy Skills](docs/skills/strategy.md)
- [MCP Server Configuration](docs/mcp-server/configuration.md)

## License

MIT
