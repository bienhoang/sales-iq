# Phase 5: README + Docs Update

## Context Links
- [Current README](../../README.md) -- developer-focused, leads with PAT instructions
- [Getting Started](../../docs/getting-started.md) -- mirrors README, flag-heavy
- [Brainstorm](../reports/brainstorm-260224-1042-ux-improvements-nontech-users.md) -- README rewrite decisions

## Overview
- **Priority:** P2
- **Status:** complete
- **Effort:** 1h
- **Description:** Rewrite README to lead with one-liner install. Push technical details to Advanced section. Update getting-started.md with new commands.

## Key Insights
- First 5 lines of README determine if a non-tech user continues or bounces
- Current README starts with PAT instructions -- alienating for target users
- Two paths: curl one-liner (zero-to-hero) and npx (has Node.js) -- both above the fold
- Skills table and MCP details move below the fold
- Doctor and uninstall commands documented for maintenance

## Requirements

### Functional
- README: Lead with project tagline + curl one-liner
- README: Quick Start section with 2 paths (shell script / npx)
- README: "What's Included" section (skills + MCP overview)
- README: Advanced section (manual install, configure flags, power-user commands)
- getting-started.md: Updated with setup, doctor, uninstall commands

### Non-Functional
- README renders well on GitHub (badges, code blocks, tables)
- No developer jargon in first 3 sections
- Under 150 lines total for README

## Architecture

No code changes. Documentation only.

## Related Code Files

### Modified Files
- `README.md` (repo root) -- full rewrite
- `docs/getting-started.md` -- update with new commands

### Unchanged
- All source code files
- Other docs (skills/, mcp-server/)

## Implementation Steps

### Step 1: Rewrite README.md

Replace entire `README.md` with:

```markdown
# sales-iq

[![GitHub Packages](https://img.shields.io/badge/registry-GitHub%20Packages-blue)](https://github.com/bienhoang/sales-iq/packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

AI-powered sales and marketing toolkit for Claude Code. 20 ready-to-use skills for content, campaigns, strategy, and pipeline management.

## Quick Start

### Option A: One-command setup (recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/bienhoang/sales-iq/main/setup.sh | bash
```

Handles everything: Node.js, authentication, skill installation, and brand setup.

### Option B: Already have Node.js 20+

```bash
npx @bienhoang/sales-iq setup
```

Interactive wizard — no flags needed.

### Then open Claude Code and run:

```
/siq-brand-strategy
```

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

### Live Data via MCP Server

Connect CRM, email, social, and analytics for real-time data in your skills:

```bash
sales-iq configure --mcp
```

Supports: HubSpot, Mailchimp, Twitter/X, LinkedIn, Google Analytics 4, SEMrush.

## Maintenance

```bash
# Check installation health
sales-iq doctor

# Update skills to latest
sales-iq update

# Remove everything
sales-iq uninstall
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
# Install specific clusters
sales-iq install --skills marketing
sales-iq install --skills sales,strategy

# Install all with force overwrite
sales-iq install --skills all --force

# Configure brand via flags
sales-iq configure --brand --name "YourSaaS" --industry "developer-tools"

# Configure MCP server
sales-iq configure --mcp

# List installed skills
sales-iq list
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
```

### Step 2: Update docs/getting-started.md

Replace `docs/getting-started.md` with updated content incorporating new commands:

```markdown
# Getting Started

## Quick Start

### Option A: One-command setup

```bash
curl -fsSL https://raw.githubusercontent.com/bienhoang/sales-iq/main/setup.sh | bash
```

The script will:
1. Install Node.js if needed (via nvm)
2. Open GitHub to create an access token
3. Configure npm authentication
4. Launch the interactive setup wizard

### Option B: Interactive wizard (Node.js 20+ required)

```bash
npx @bienhoang/sales-iq setup
```

The wizard asks for your brand info and installs skills interactively.

### Option C: Manual setup (power users)

See the [Advanced section in README](../README.md#advanced).

## First Use

Open Claude Code and run your first skill:

```
/siq-brand-strategy
```

This is the hub skill for all marketing skills. It establishes your positioning, ICP, and voice. Other marketing skills use this output as context.

For sales:
```
/siq-account-strategy
```

For strategy:
```
/siq-strategy-consultant
```

## Check Installation

Run the doctor command to verify everything is set up correctly:

```bash
npx @bienhoang/sales-iq doctor
```

This checks: Node.js version, npm registry, installed skills, brand context, and MCP config.

## Update Skills

```bash
npx @bienhoang/sales-iq update
```

Re-downloads all skills from the latest version.

## Uninstall

```bash
npx @bienhoang/sales-iq uninstall
```

Removes all installed skills and optionally removes MCP configuration.

## Configure MCP Server (Optional)

The MCP server provides live data from CRM, email, social, and analytics platforms.

```bash
npx @bienhoang/sales-iq configure --mcp
```

Set API keys as environment variables before starting Claude Code:

```bash
export HUBSPOT_API_KEY=your_key
export MAILCHIMP_API_KEY=your_key
```

See [MCP Server Configuration](mcp-server/configuration.md) for all available integrations and environment variables.

## Troubleshooting

Run `sales-iq doctor` first — it checks the most common issues.

**Skills not appearing in Claude Code?**
- Run `sales-iq doctor` to verify installation
- Try `sales-iq update` to re-install
- Restart Claude Code after installation

**MCP tools not available?**
- Run `sales-iq configure --mcp` and restart Claude Code
- Check MCP panel in Claude Code for the sales-iq entry
- Verify API keys are set in your shell environment

**Authentication errors?**
- Run `sales-iq doctor` to check ~/.npmrc
- Re-run `setup.sh` to reconfigure your GitHub token
```

### Step 3: Review and verify

```bash
# Verify README renders correctly (GitHub preview):
# Push to branch, open PR, check rendering
# Verify all links resolve:
# docs/getting-started.md, docs/skills/*, docs/mcp-server/*
```

## Todo List

- [ ] Rewrite `README.md`
- [ ] Update `docs/getting-started.md`
- [ ] Verify all internal links resolve
- [ ] Check README renders on GitHub (code blocks, tables, details tag)
- [ ] Verify badges still display correctly
- [ ] Proofread for developer jargon in first 3 sections

## Success Criteria
- Non-tech user can understand setup path within 10 seconds of opening README
- curl one-liner is the first code block visible
- No developer jargon before the Advanced section
- All links resolve to existing files
- Doctor, update, uninstall documented in Maintenance section
- Power-user commands preserved in collapsible Advanced section

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| setup.sh URL wrong | Low | Test curl after push to main |
| Details tag not rendering | Low | GitHub supports HTML details/summary |
| Broken links after rename | Low | All linked docs already exist |

## Security Considerations
- README no longer shows raw npmrc token placeholder (setup.sh handles it)
- PAT creation link in README uses HTTPS
- No secrets in documentation

## Next Steps
- After all phases complete: create PR, test full flow end-to-end
- Consider: video walkthrough for non-tech users (future)
