# Marketing Skills

## Skills Reference

| Skill | Command | Purpose |
|-------|---------|---------|
| Brand Strategy | `/siq-brand-strategy` | Hub: brand voice, positioning, ICP definition |
| Ad Copy | `/siq-ad-copy` | PPC and paid social ad copy variants |
| Community Engagement | `/siq-community-engagement` | Community post and response copy |
| Competitor Intel | `/siq-competitor-intel` | Competitor analysis and positioning gaps |
| Content Repurpose | `/siq-content-repurpose` | Repurpose existing content across formats |
| Email Campaign | `/siq-email-campaign` | Email sequences and drip campaign copy |
| Metrics Report | `/siq-metrics-report` | Marketing metrics narrative for stakeholders |
| Product Launch | `/siq-product-launch` | Launch plan, messaging, and rollout checklist |
| SEO Content | `/siq-seo-content` | SEO-optimized long-form articles and landing pages |
| Social Media Calendar | `/siq-social-media-calendar` | Monthly social content calendar |
| Social Media Post | `/siq-social-media-post` | Individual social posts for any platform |

## Hub-and-Spoke Architecture

`/siq-brand-strategy` is the hub. It produces a structured brand brief covering:

- Company positioning and differentiation
- Ideal Customer Profile (ICP) with firmographics and pain points
- Brand voice and tone guidelines
- Key messaging pillars (3–5)
- Competitive landscape summary

All other marketing skills are spokes. They load the brand brief from `~/.claude/skills/shared/brand.md` automatically, so output stays consistent without re-entering brand context each time.

**Run order:** Always run `/siq-brand-strategy` first when starting a new project or after rebranding.

## Customization

Each skill reads `~/.claude/skills/shared/brand.md`. To customize output:

1. Edit the brand file directly: `~/.claude/skills/shared/brand.md`
2. Or re-run: `npx sales-iq configure --brand --name "..." --industry "..."`

Skills also accept inline context. Pass specifics in your prompt:

```
/siq-email-campaign target segment: enterprise CTOs, goal: webinar registration, send date: Tuesday
```

## Example Workflow

**Goal:** Launch a new feature to existing customers.

```
# Step 1: Establish brand context (once per project)
/siq-brand-strategy

# Step 2: Draft launch messaging
/siq-product-launch feature: "AI-powered pipeline scoring", audience: existing customers, tier: pro+

# Step 3: Write the announcement email
/siq-email-campaign type: feature-announcement, segments: [existing-customers], goal: feature adoption

# Step 4: Create social posts
/siq-social-media-post platform: linkedin, topic: pipeline scoring launch, tone: thought-leadership

# Step 5: Repurpose email into blog post
/siq-content-repurpose source: email-announcement, target: blog-post, length: 800-words
```
