# sales-iq

[![npm](https://img.shields.io/npm/v/sales-iq)](https://www.npmjs.com/package/sales-iq)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Sales and marketing AI toolkit for Claude Code. Install skills, configure your brand, connect live data via MCP.

## Quick Start

```bash
# 1. Install all skills into Claude Code
npx sales-iq install --skills all

# 2. Set your brand context
npx sales-iq configure --brand --name "YourSaaS" --industry "developer-tools"

# 3. Connect live data (CRM, email, social, analytics)
npx sales-iq configure --mcp
```

Then open Claude Code and run `/siq-brand-strategy` to begin.

## Packages

| Package | npm | Description |
|---------|-----|-------------|
| `sales-iq` | [![npm](https://img.shields.io/npm/v/sales-iq)](https://www.npmjs.com/package/sales-iq) | CLI — install skills, configure brand and MCP |
| `sales-iq-skills` | [![npm](https://img.shields.io/npm/v/sales-iq-skills)](https://www.npmjs.com/package/sales-iq-skills) | 20 Claude Code skills across 3 clusters |
| `sales-iq-mcp-server` | [![npm](https://img.shields.io/npm/v/sales-iq-mcp-server)](https://www.npmjs.com/package/sales-iq-mcp-server) | MCP server with 14 tools for live integrations |
| `sales-iq-core` | [![npm](https://img.shields.io/npm/v/sales-iq-core)](https://www.npmjs.com/package/sales-iq-core) | Shared types and utilities |

## Skills

### Marketing (11 skills)

Hub skill: `/siq-brand-strategy` — sets brand voice, positioning, and ICP. All other marketing skills inherit this context.

| Skill | Purpose |
|-------|---------|
| `/siq-brand-strategy` | Hub: brand voice, positioning, ICP |
| `/siq-ad-copy` | PPC and paid social ad copy |
| `/siq-community-engagement` | Community post and response copy |
| `/siq-competitor-intel` | Competitor analysis and positioning gaps |
| `/siq-content-repurpose` | Repurpose content across formats |
| `/siq-email-campaign` | Email sequence and drip copy |
| `/siq-metrics-report` | Marketing metrics narrative |
| `/siq-product-launch` | Launch plan and messaging |
| `/siq-seo-content` | SEO-optimized long-form content |
| `/siq-social-media-calendar` | Monthly social calendar |
| `/siq-social-media-post` | Individual social posts |

### Sales (8 skills)

Hub skill: `/siq-account-strategy` — defines ICP, sales motion, and objection map for all sales skills.

| Skill | Purpose |
|-------|---------|
| `/siq-account-strategy` | Hub: ICP, sales motion, objection map |
| `/siq-demo-prep` | Demo script and discovery questions |
| `/siq-follow-up` | Post-meeting follow-up emails |
| `/siq-lead-qualification` | BANT/MEDDIC qualification notes |
| `/siq-objection-handling` | Objection response playbook |
| `/siq-outreach-sequence` | Cold outreach email sequences |
| `/siq-pipeline-report` | Pipeline health narrative |
| `/siq-proposal-generator` | Proposal and SOW drafts |

### Strategy (1 skill)

| Skill | Purpose |
|-------|---------|
| `/siq-strategy-consultant` | 10 frameworks: SWOT, Porter's Five Forces, Blue Ocean, Jobs-to-be-Done, and more |

## MCP Server

Provides live data to Claude Code via 14 tools across 6 categories:

| Category | Tools |
|----------|-------|
| CRM | `crm_get_contact`, `crm_list_deals`, `crm_update_deal`, `crm_create_contact` |
| Email | `email_send`, `email_list_campaigns`, `email_get_stats` |
| Social | `social_post`, `social_get_analytics` |
| Analytics | `analytics_get_traffic`, `analytics_get_seo_rankings` |
| Lead Scoring | `lead_score` |
| Calendar | `calendar_list_entries`, `calendar_create_entry` |

Integrations: HubSpot, Mailchimp, Twitter/X, LinkedIn, Google Analytics 4, SEMrush.

## Documentation

- [Getting Started](docs/getting-started.md)
- [Marketing Skills](docs/skills/marketing.md)
- [Sales Skills](docs/skills/sales.md)
- [Strategy Skills](docs/skills/strategy.md)
- [MCP Server Configuration](docs/mcp-server/configuration.md)

## License

MIT
