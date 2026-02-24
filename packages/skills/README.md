# @bienhoang/sales-iq-skills

Claude Code skills for sales, marketing, and strategy. 20 skills across 3 clusters.

## Install

First, set up GitHub Packages authentication (one-time setup):

1. Create a GitHub Personal Access Token with `read:packages` scope: https://github.com/settings/tokens/new
2. Add to `~/.npmrc`:
```
@bienhoang:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:

```bash
npx @bienhoang/sales-iq install --skills all
```

Or install a single cluster:

```bash
npx @bienhoang/sales-iq install --skills marketing
npx @bienhoang/sales-iq install --skills sales
npx @bienhoang/sales-iq install --skills strategy
```

## What's Included

### Marketing (11 skills)

| Skill | Command |
|-------|---------|
| Brand Strategy (hub) | `/siq-brand-strategy` |
| Ad Copy | `/siq-ad-copy` |
| Community Engagement | `/siq-community-engagement` |
| Competitor Intel | `/siq-competitor-intel` |
| Content Repurpose | `/siq-content-repurpose` |
| Email Campaign | `/siq-email-campaign` |
| Metrics Report | `/siq-metrics-report` |
| Product Launch | `/siq-product-launch` |
| SEO Content | `/siq-seo-content` |
| Social Media Calendar | `/siq-social-media-calendar` |
| Social Media Post | `/siq-social-media-post` |

### Sales (8 skills)

| Skill | Command |
|-------|---------|
| Account Strategy (hub) | `/siq-account-strategy` |
| Demo Prep | `/siq-demo-prep` |
| Follow-Up | `/siq-follow-up` |
| Lead Qualification | `/siq-lead-qualification` |
| Objection Handling | `/siq-objection-handling` |
| Outreach Sequence | `/siq-outreach-sequence` |
| Pipeline Report | `/siq-pipeline-report` |
| Proposal Generator | `/siq-proposal-generator` |

### Strategy (1 skill)

| Skill | Command |
|-------|---------|
| Strategy Consultant | `/siq-strategy-consultant` |

## Brand Context

Skills share brand context via `~/.claude/skills/shared/brand.md`. Set it once:

```bash
npx @bienhoang/sales-iq configure --brand --name "YourSaaS" --industry "developer-tools"
```

## License

MIT
