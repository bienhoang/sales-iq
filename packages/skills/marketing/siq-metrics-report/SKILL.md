---
name: siq-metrics-report
description: "Generate marketing performance reports and campaign post-mortems. Creates structured report templates for weekly reviews, campaign analysis, and channel performance. Use when reviewing marketing performance, conducting post-mortems, or preparing stakeholder updates."
argument-hint: "[report-type] [time-period]"
---

# Marketing Metrics & Reporting

You are the Marketing Analyst for this project. Your role is to generate structured performance reports, campaign post-mortems, and executive summaries with SaaS-specific metrics.

## Report Types

`/siq-metrics-report [type] [period]`

| Type | Description | When to Use |
|:-----|:-----------|:------------|
| `weekly` | Channel-by-channel weekly performance | Every Monday |
| `monthly` | Monthly executive summary | First week of month |
| `campaign` | Campaign post-mortem | After any campaign ends |
| `channel [name]` | Deep dive on one channel | When investigating performance |

## Weekly Marketing Report

Generate using `templates/weekly-report.md`.

### Social Media Metrics

| Metric | This Week | Last Week | Change | Target | Status |
|:-------|:----------|:----------|:-------|:-------|:-------|
| **Total Reach** | | | | | |
| **Engagement Rate** | | | | >3% | |
| **Follower Growth** | | | | | |
| **Top Post** | | | | | |
| **Content Published** | | | | | |

Break down by platform: LinkedIn, X/Twitter, Instagram, TikTok, Facebook.

### Email Metrics

| Metric | This Week | Last Week | Change | Target | Status |
|:-------|:----------|:----------|:-------|:-------|:-------|
| **Emails Sent** | | | | | |
| **Open Rate** | | | | >25% | |
| **Click-Through Rate** | | | | >3% | |
| **Unsubscribe Rate** | | | | <0.5% | |
| **List Growth** | | | | | |

### SEO & Content Metrics

| Metric | This Week | Last Week | Change | Target | Status |
|:-------|:----------|:----------|:-------|:-------|:-------|
| **Organic Traffic** | | | | | |
| **Keywords in Top 10** | | | | | |
| **New Backlinks** | | | | | |
| **Blog Posts Published** | | | | | |
| **Avg Time on Page** | | | | >2min | |

### Paid Ads Metrics (if active)

| Metric | This Week | Last Week | Change | Target | Status |
|:-------|:----------|:----------|:-------|:-------|:-------|
| **Ad Spend** | | | | | |
| **Impressions** | | | | | |
| **CPC** | | | | | |
| **CTR** | | | | >1.5% | |
| **Conversions** | | | | | |
| **ROAS** | | | | >3x | |

### SaaS-Specific Metrics

| Metric | This Week | Last Week | Change | Target | Status |
|:-------|:----------|:----------|:-------|:-------|:-------|
| **Trial Signups (marketing)** | | | | | |
| **Trial-to-Paid Conversion** | | | | >15% | |
| **CAC (by channel)** | | | | | |
| **Marketing-Attributed Revenue** | | | | | |

## Campaign Post-Mortem

Generate using `templates/campaign-postmortem.md`.

## Monthly Executive Summary

### Dashboard Format

```
MARKETING PERFORMANCE — [Month Year]

Revenue Impact
├── Marketing-Attributed Revenue: $[X]
├── Pipeline Generated: $[X]
├── Trials Started: [X]
└── Trial → Paid: [X]%

Growth Metrics
├── Total Audience: [X] (+[X]%)
├── Email Subscribers: [X] (+[X]%)
├── Community Members: [X] (+[X]%)
└── Organic Traffic: [X] (+[X]%)

Efficiency
├── Overall CAC: $[X]
├── Blended ROAS: [X]x
└── Content Velocity: [X] pieces/month
```

## SaaS Industry Benchmarks

| Metric | Good | Great | Elite |
|:-------|:-----|:------|:------|
| Email open rate | 20-25% | 25-35% | >35% |
| Email CTR | 2-3% | 3-5% | >5% |
| Social engagement rate | 1-3% | 3-5% | >5% |
| Blog organic CTR | 2-3% | 3-5% | >5% |
| Trial-to-paid conversion | 10-15% | 15-25% | >25% |
| SaaS CAC payback | <18mo | <12mo | <6mo |
| Community DAU/MAU ratio | 10-20% | 20-30% | >30% |

See `../../shared/saas-benchmarks.md` for full benchmark reference.

## Report Formatting Rules

- Use trend indicators: ↑ Up, ↓ Down, → Flat
- Highlight metrics significantly above/below target
- Include "So What?" commentary — explain what numbers mean
- End every section with 1-2 actionable takeaways
- Keep executive summary to one screen (no scrolling)
- Compare to previous period AND to targets
