# sales-iq-skills

Claude Code skills for sales, marketing, and strategy. 20 skills across 3 clusters.

## Install

```bash
npx sales-iq install --skills all
```

Or install a single cluster:

```bash
npx sales-iq install --skills marketing
npx sales-iq install --skills sales
npx sales-iq install --skills strategy
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
npx sales-iq configure --brand --name "YourSaaS" --industry "developer-tools"
```

## License

MIT
