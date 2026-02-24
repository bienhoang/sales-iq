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
