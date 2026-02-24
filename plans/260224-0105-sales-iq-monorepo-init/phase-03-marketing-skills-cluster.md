# Phase 03 — Marketing Skills Cluster

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-monorepo-foundation.md)
- Reference: `.ref/Go-snap-marketing-2026/.claude/skills/`
- Research: [Skills Distribution](./research/researcher-02-skills-distribution-patterns.md)

## Overview

- **Date**: 2026-02-24
- **Priority**: P1
- **Status**: pending
- **Effort**: 6h
- **Description**: Port 11 marketing skills from Go-snap reference, adapting from GoSnap-specific branding to generic SaaS toolkit. Maintain hub-and-spoke architecture with brand-strategy as hub.

## Key Insights

- Reference skills are GoSnap-branded — need to replace all GoSnap refs with placeholder/generic SaaS language.
- Hub-and-spoke pattern: `brand-strategy` hub stores shared context in `references/`, all spoke skills load from `../brand-strategy/references/`.
- `product-launch` is an orchestrator — chains other skills via slash commands (`/social-media-post`, `/email-campaign`, etc.).
- Each skill follows: `SKILL.md` (behavior) + `templates/` (output scaffolding) + `references/` (domain knowledge).
- SKILL.md frontmatter requires `name` (matching dir name) + `description`.
- 11 skills total: siq-brand-strategy, siq-ad-copy, siq-email-campaign, siq-seo-content, siq-social-media-post, siq-social-media-calendar, siq-content-repurpose, siq-community-engagement, siq-competitor-intel, siq-metrics-report, siq-product-launch.
- All skill directories and SKILL.md `name` fields use `siq-` prefix to avoid collision with user skills.

<!-- Updated: Validation Session 1 - siq- prefix on all skill names -->

## Requirements

### Functional
- All 11 skills ported with GoSnap references removed
- Brand-strategy hub generates and stores brand context files
- All spoke skills reference hub's `references/` via `../siq-brand-strategy/references/`
- product-launch orchestrator chains all channel skills
- SETUP.md documents cluster usage
- Shared context files in `packages/skills/shared/`

### Non-Functional
- Each SKILL.md under 200 lines
- Generic SaaS language — works for any dev tool, SaaS, or startup
- Templates produce immediately usable output
- Skills self-contained (no external dependencies)

## Architecture

```
packages/skills/
├── marketing/
│   ├── siq-brand-strategy/          # HUB
│   │   ├── SKILL.md
│   │   ├── templates/
│   │   │   └── positioning-canvas.md
│   │   └── references/
│   │       ├── brand-voice-guide.md    # placeholder, user fills via /siq-brand-strategy
│   │       ├── icp-profiles.md         # placeholder
│   │       └── messaging-matrix.md     # placeholder
│   ├── siq-ad-copy/
│   ├── siq-email-campaign/
│   ├── siq-seo-content/
│   ├── siq-social-media-post/
│   ├── siq-social-media-calendar/
│   ├── siq-content-repurpose/
│   ├── siq-community-engagement/
│   ├── siq-competitor-intel/
│   ├── siq-metrics-report/
│   ├── siq-product-launch/          # ORCHESTRATOR
│   └── SETUP.md
└── shared/
    ├── brand-context.md         # cross-cluster shared brand
    ├── icp-profiles.md          # cross-cluster shared ICPs
    └── saas-benchmarks.md       # industry defaults
```

## Related Code Files

### Create (adapt from .ref/)

**Hub — brand-strategy/**
- `SKILL.md` — adapt from ref, remove GoSnap branding
- `templates/positioning-canvas.md` — generic template
- `references/brand-voice-guide.md` — placeholder with instructions
- `references/icp-profiles.md` — placeholder template
- `references/messaging-matrix.md` — placeholder template

**Channel skills (6 skills)**
- `ad-copy/SKILL.md` + `templates/google-ad.md`, `linkedin-ad.md`, `meta-ad.md`
- `email-campaign/SKILL.md` + `references/email-sequences.md`, `subject-line-formulas.md` + `templates/welcome-sequence.md`, `feature-announcement.md`, `onboarding-drip.md`, `re-engagement.md`, `sms-campaign.md`
- `seo-content/SKILL.md` + `references/keyword-research-guide.md`, `seo-checklist.md` + `templates/blog-post-outline.md`, `pillar-page.md`, `comparison-page.md`
- `social-media-post/SKILL.md` + `references/platform-specs.md`, `hashtag-strategy.md` + `templates/instagram-carousel.md`, `linkedin-thought-leadership.md`, `twitter-thread.md`, `facebook-post.md`, `tiktok-hook-script.md`
- `community-engagement/SKILL.md` + `references/community-guidelines.md`, `escalation-playbook.md` + `templates/discord-announcement.md`, `slack-update.md`, `community-event.md`
- `social-media-calendar/SKILL.md` + `references/content-pillars.md` + `templates/weekly-calendar.md`

**Workflow skills (2 skills)**
- `content-repurpose/SKILL.md` + `references/repurpose-matrix.md`
- `product-launch/SKILL.md` + `references/launch-playbook.md` + `templates/launch-brief.md`, `launch-timeline.md`

**Intel skills (2 skills)**
- `competitor-intel/SKILL.md` + `templates/competitor-profile.md`, `battlecard.md`
- `metrics-report/SKILL.md` + `templates/weekly-report.md`, `campaign-postmortem.md`

**Cluster config**
- `marketing/SETUP.md` — adapted from ref SETUP.md
- `shared/brand-context.md` — placeholder
- `shared/icp-profiles.md` — placeholder
- `shared/saas-benchmarks.md` — SaaS industry defaults

## Implementation Steps

1. **Create directory structure** — all skill folders under `packages/skills/marketing/`

2. **Port brand-strategy hub** (highest priority):
   - Copy SKILL.md from ref, remove all GoSnap mentions
   - Replace company-specific voice rules with generic SaaS guidelines
   - Keep the structure: voice rules, ICP generation, messaging matrix, positioning canvas
   - Create placeholder reference files with clear instructions for user customization
   - Frontmatter: `name: siq-brand-strategy`, description updated for generic SaaS
   - Directory renamed from `brand-strategy/` to `siq-brand-strategy/`

3. **Port channel skills** (ad-copy, email-campaign, seo-content, social-media-post, community-engagement, social-media-calendar):
   - For each: copy from ref, remove GoSnap branding
   - Update cross-references to use `../brand-strategy/references/` (relative)
   - Ensure templates are generic (not GoSnap product-specific)
   - Keep platform-specific formatting (LinkedIn char limits, Twitter thread structure, etc.)

4. **Port workflow skills** (content-repurpose, product-launch):
   - product-launch: keep orchestration pattern, update slash command references
   - content-repurpose: keep repurpose matrix, genericize source types

5. **Port intel skills** (competitor-intel, metrics-report):
   - competitor-intel: generic competitor profiling, remove GoSnap competitor refs
   - metrics-report: generic SaaS metrics (MRR, CAC, LTV, churn, etc.)

6. **Create shared context files**:
   - `shared/brand-context.md` — template with placeholders: `{{BRAND_NAME}}`, `{{INDUSTRY}}`, `{{TARGET_MARKET}}`
   - `shared/icp-profiles.md` — template for 2-3 ICP profiles
   - `shared/saas-benchmarks.md` — real SaaS industry benchmarks (CAC ratios, churn rates, conversion benchmarks)

7. **Write SETUP.md** — adapt from ref, update for sales-iq context:
   - Quick start (3 steps)
   - Skill table with commands
   - Hub-and-spoke diagram
   - Customization guide

8. **Review all SKILL.md frontmatter** — ensure `name` matches directory name, descriptions are generic

9. **Verify** — check no GoSnap/company-specific references remain (grep for "GoSnap", "gosnap", "Go Snap")

## Todo List

- [ ] Create directory structure
- [ ] Port brand-strategy hub (SKILL.md + refs + templates)
- [ ] Port ad-copy skill
- [ ] Port email-campaign skill
- [ ] Port seo-content skill
- [ ] Port social-media-post skill
- [ ] Port community-engagement skill
- [ ] Port social-media-calendar skill
- [ ] Port content-repurpose skill
- [ ] Port product-launch orchestrator
- [ ] Port competitor-intel skill
- [ ] Port metrics-report skill
- [ ] Create shared context files
- [ ] Write SETUP.md
- [ ] Grep verify: no GoSnap references remain

## Success Criteria

- All 11 skills have valid SKILL.md with correct frontmatter
- No GoSnap-specific branding anywhere
- Hub references are placeholder files with clear customization instructions
- product-launch orchestrator correctly references all channel skills
- SETUP.md provides clear quick-start for new users
- Skill names match directory names

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| GoSnap branding leaks through | Full grep scan after porting, automated check |
| Templates too specific for generic use | Focus on structure/format, not content |
| Relative paths break when installed to ~/.claude/skills/ | CLI installer flattens structure; document in SETUP.md |

## Security Considerations

- Reference files may contain user's brand strategy — never committed to git by default
- Placeholder files should contain example data, not real client data
- SKILL.md should not request or store API keys

## Next Steps

- Phase 05: Sales cluster uses same hub-and-spoke pattern
- Phase 07: CLI installs these skills to user's system
