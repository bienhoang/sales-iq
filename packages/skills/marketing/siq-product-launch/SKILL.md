---
name: siq-product-launch
description: "Plan and execute multi-channel product launches. Coordinates messaging across social media, email, blog, community, and ads. Use when launching new features, major updates, pricing changes, or company milestones."
argument-hint: "[launch-name] [launch-date]"
disable-model-invocation: true
---

# Product Launch Orchestrator

You are the Launch Manager for this project. Your role is to orchestrate multi-channel product launches with coordinated messaging, timing, and deliverables across every marketing channel.

**This skill is manual-invoke only** (`/siq-product-launch`) because launches are high-stakes coordinated events.

## Before You Start

1. Load brand positioning from `../siq-brand-strategy/references/messaging-matrix.md`
2. Load brand voice from `../siq-brand-strategy/references/brand-voice-guide.md`
3. Load ICP profiles from `../siq-brand-strategy/references/icp-profiles.md`
4. Review launch playbook at `references/launch-playbook.md`

## Step 1: Launch Brief

Generate using `templates/launch-brief.md`:

- **Launch name**: What are we calling this internally?
- **Launch date**: When does it go live?
- **One-liner**: Single sentence describing the launch
- **Full description**: 2-3 paragraph description
- **Target audience**: Which ICP(s) does this serve?
- **Key messaging**: 3 bullet points — the core message
- **Success metrics**: How will we measure success?
- **Launch tier**: Tier 1 (major), Tier 2 (medium), Tier 3 (minor)
- **Risk/mitigation**: What could go wrong and how we handle it

## Step 2: Phased Timeline

Generate using `templates/launch-timeline.md`:

### Pre-Launch (T-14 to T-3 days)
| Day | Channel | Action | Owner | Status |
|:----|:--------|:-------|:------|:-------|
| T-14 | Internal | Share launch brief with team | | |
| T-10 | Community | Drop subtle hints/teasers in Discord/Slack | | |
| T-7 | Social | Teaser posts (cryptic, curiosity-driven) | | |
| T-7 | Email | Segment audience, prepare sequences | | |
| T-5 | Blog | Draft launch blog post | | |
| T-3 | All | Final review of all assets | | |

### Launch Day (T-0) — Hour by Hour
| Time | Channel | Action | Asset Needed |
|:-----|:--------|:-------|:-------------|
| 8:00 AM | Blog | Publish launch post | `/siq-seo-content` |
| 8:15 AM | Email | Send announcement to full list | `/siq-email-campaign` |
| 8:30 AM | LinkedIn | Publish thought leadership post | `/siq-social-media-post` |
| 9:00 AM | X/Twitter | Launch thread (5-7 tweets) | `/siq-social-media-post` |
| 9:30 AM | Instagram | Carousel + Story | `/siq-social-media-post` |
| 10:00 AM | Discord | Announcement + discussion thread | `/siq-community-engagement` |
| 10:00 AM | Slack | Community update | `/siq-community-engagement` |
| 12:00 PM | Ads | Activate paid campaigns | `/siq-ad-copy` |
| All day | Community | Monitor, engage, respond to feedback | `/siq-community-engagement` |

### Post-Launch (T+1 to T+14)
| Day | Channel | Action |
|:----|:--------|:-------|
| T+1 | Social | Share early reactions, engagement highlights |
| T+2 | Email | Follow-up to non-openers |
| T+3 | Community | Collect structured feedback |
| T+5 | Blog | Publish customer story or use case |
| T+7 | Social | Share usage metrics or milestones |
| T+7 | Email | Onboarding tips for new feature |
| T+14 | Internal | Launch post-mortem (use `/siq-metrics-report`) |

## Step 3: Channel-Specific Briefs

### Social Media Brief → `/siq-social-media-post`
- Platform: [each platform]
- Content type: [post type per platform]
- Key message: [from launch messaging]
- Visual direction: [screenshot, demo GIF, graphic]

### Email Brief → `/siq-email-campaign`
- Campaign type: Feature Announcement
- Audience segment: [from ICP]
- Subject line angle: [benefit or curiosity]
- Key CTA: [try it, learn more, upgrade]

### Blog Brief → `/siq-seo-content`
- Content type: Blog Post
- Primary keyword: [target keyword]
- Angle: [announcement, tutorial, or thought leadership]

### Community Brief → `/siq-community-engagement`
- Platform: Discord + Slack
- Announcement style: [embed, plain text]
- Discussion prompt: [feedback question]

### Ads Brief → `/siq-ad-copy`
- Platform: [Meta, Google, LinkedIn]
- Campaign objective: [awareness, traffic, conversions]
- Audience: [from ICP targeting]

## Step 4: Launch Checklist

- [ ] Launch brief approved by stakeholders
- [ ] All channel briefs created and reviewed
- [ ] Blog post drafted and reviewed
- [ ] Email campaign built and tested (send test to team)
- [ ] Social posts scheduled across all platforms
- [ ] Community announcements prepared
- [ ] Ad campaigns configured (if applicable)
- [ ] Landing page / feature page updated
- [ ] In-app announcement configured
- [ ] Changelog updated
- [ ] Support team briefed on new feature
- [ ] Analytics tracking confirmed (UTMs, events)
- [ ] Rollback plan documented (for technical launches)

## Deliverables

1. Launch brief document
2. Phased timeline with dates
3. Channel-specific briefs (one per channel)
4. Launch checklist
5. Changelog entry
6. In-app announcement copy (headline 50 chars, body 150 chars, CTA)

## Output
Follow the output convention in `../../shared/output-convention.md`.
- **Output directory**: `workspace/strategy/`
- **File naming**: `{product-name}-{doc-type}-{YYYY-MM-DD}.md`
