# Marketing Skills Cluster — Setup & Usage Guide

A suite of **11 AI marketing agent skills** for Sales IQ. Gives you a full marketing team at your fingertips — brand strategy, content creation, campaign planning, competitive intelligence, and reporting.

---

## Quick Start (3 Steps)

### Step 1: Set up your brand (do this first!)

```
/siq-brand-strategy
```

This generates your brand voice, ideal customer profiles, positioning, and messaging framework. **Every other skill references these files**, so run this first.

You'll be asked for:
- Your brand name and description
- Your industry and target audience
- Your tone and personality preferences

### Step 2: Start creating content

```
/siq-social-media-post linkedin thought-leadership "AI trends in SaaS"
/siq-email-campaign welcome new-trial-users
/siq-seo-content blog "how to reduce SaaS churn"
```

### Step 3: Plan and measure

```
/siq-social-media-calendar weekly
/siq-product-launch "Feature Name" 2026-03-15
/siq-metrics-report weekly
```

---

## All 11 Skills

### Foundation
| Skill | Command | What It Does |
|:------|:--------|:-------------|
| **Brand Strategy** | `/siq-brand-strategy` | Brand voice, ICPs, positioning, messaging pillars |

### Content Creation
| Skill | Command | What It Does |
|:------|:--------|:-------------|
| **Social Media Post** | `/siq-social-media-post [platform] [type] [topic]` | Posts for LinkedIn, X, Instagram, TikTok, Facebook |
| **Email Campaign** | `/siq-email-campaign [type] [audience]` | Welcome sequences, drips, feature announcements |
| **SEO Content** | `/siq-seo-content [type] [keyword]` | Blog posts, pillar pages, comparison pages |
| **Ad Copy** | `/siq-ad-copy [platform] [objective] [audience]` | Meta, Google, and LinkedIn ad copy |
| **Community Engagement** | `/siq-community-engagement [platform] [type] [topic]` | Discord & Slack content |

### Planning & Workflow
| Skill | Command | What It Does |
|:------|:--------|:-------------|
| **Content Calendar** | `/siq-social-media-calendar [weekly/monthly] [theme]` | Multi-platform content scheduling |
| **Product Launch** | `/siq-product-launch [name] [date]` | Multi-channel launch orchestration |
| **Content Repurpose** | `/siq-content-repurpose [source] [targets]` | Transform one piece into many formats |

### Intelligence
| Skill | Command | What It Does |
|:------|:--------|:-------------|
| **Competitor Intel** | `/siq-competitor-intel [competitor]` | Profiles, battlecards, positioning gaps |
| **Metrics Report** | `/siq-metrics-report [type] [period]` | Weekly reports, campaign post-mortems |

---

## How the Skills Connect

```
                ┌─────────────────────┐
                │  siq-brand-strategy │  ← Start here. All skills read from this.
                └──────────┬──────────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
  Channel Skills      Workflow Skills     Intel Skills
  ─────────────      ───────────────     ────────────
  siq-social-media   siq-product-launch  siq-competitor-intel
  siq-email-campaign siq-content-repurpose siq-metrics-report
  siq-seo-content    siq-social-media-calendar
  siq-community-engagement
  siq-ad-copy
```

- **siq-brand-strategy** is the hub — defines voice, ICPs, and positioning
- **Channel skills** create content for specific platforms using hub context
- **siq-product-launch** orchestrates all channel skills for coordinated launches
- **siq-content-repurpose** transforms output from one channel into others
- **siq-metrics-report** measures performance across everything

---

## Hub & Spoke Architecture

`siq-brand-strategy` stores shared context in `siq-brand-strategy/references/`:
- `brand-voice-guide.md` — voice and tone rules
- `icp-profiles.md` — customer personas
- `messaging-matrix.md` — ICP-to-message mapping

All spoke skills reference hub via `../siq-brand-strategy/references/` — so updating your brand strategy automatically updates what every other skill knows about your brand.

---

## Shared Resources

Cross-cluster files in `../shared/`:
- `brand-context.md` — top-level brand identity summary
- `icp-profiles.md` — ICP quick-reference for non-marketing clusters
- `saas-benchmarks.md` — industry benchmarks for SaaS metrics

---

## File Structure

```
packages/skills/marketing/
├── SETUP.md                              ← You are here
├── siq-brand-strategy/                   ← HUB — run this first
│   ├── SKILL.md
│   ├── references/
│   │   ├── brand-voice-guide.md
│   │   ├── icp-profiles.md
│   │   └── messaging-matrix.md
│   └── templates/
│       └── positioning-canvas.md
├── siq-ad-copy/
│   ├── SKILL.md
│   └── templates/
│       ├── google-ad.md
│       ├── linkedin-ad.md
│       └── meta-ad.md
├── siq-email-campaign/
│   ├── SKILL.md
│   ├── references/
│   │   ├── email-sequences.md
│   │   └── subject-line-formulas.md
│   └── templates/
│       ├── welcome-sequence.md
│       ├── feature-announcement.md
│       ├── onboarding-drip.md
│       └── re-engagement.md
├── siq-seo-content/
│   ├── SKILL.md
│   ├── references/
│   │   ├── keyword-research-guide.md
│   │   └── seo-checklist.md
│   └── templates/
│       ├── blog-post-outline.md
│       ├── pillar-page.md
│       └── comparison-page.md
├── siq-social-media-post/
│   ├── SKILL.md
│   ├── references/
│   │   ├── platform-specs.md
│   │   └── hashtag-strategy.md
│   └── templates/
│       ├── linkedin-thought-leadership.md
│       └── twitter-thread.md
├── siq-social-media-calendar/
│   ├── SKILL.md
│   ├── references/
│   │   └── content-pillars.md
│   └── templates/
│       └── weekly-calendar.md
├── siq-content-repurpose/
│   ├── SKILL.md
│   └── references/
│       └── repurpose-matrix.md
├── siq-community-engagement/
│   ├── SKILL.md
│   ├── references/
│   │   ├── community-guidelines.md
│   │   └── escalation-playbook.md
│   └── templates/
│       ├── discord-announcement.md
│       └── slack-update.md
├── siq-competitor-intel/
│   ├── SKILL.md
│   └── templates/
│       ├── competitor-profile.md
│       └── battlecard.md
├── siq-metrics-report/
│   ├── SKILL.md
│   └── templates/
│       ├── weekly-report.md
│       └── campaign-postmortem.md
└── siq-product-launch/                   ← ORCHESTRATOR
    ├── SKILL.md
    ├── references/
    │   └── launch-playbook.md
    └── templates/
        ├── launch-brief.md
        └── launch-timeline.md
```

---

## Tips

- Run `/siq-brand-strategy` first on every project — takes 5 minutes, makes everything else 10x better
- Use `/siq-content-repurpose` after creating any piece of content to maximize reach
- Use `/siq-social-media-calendar monthly` at the start of each month to plan ahead
- Use `/siq-product-launch` for any release bigger than a bug fix
- Use `/siq-metrics-report weekly` every Monday to stay on track
- `/siq-competitor-intel` without arguments gives a full competitive landscape overview
