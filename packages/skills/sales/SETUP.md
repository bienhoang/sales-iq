# Sales Skills Cluster — Setup

## Overview

8 skills covering the full B2B SaaS sales cycle. Hub-and-spoke architecture with `siq-account-strategy` as the central hub.

## Quick Start

1. Run `/siq-account-strategy` first to generate account context
2. Use spoke skills as needed throughout the sales cycle
3. Hub references auto-load in spoke skills via `../siq-account-strategy/references/`

## Skills

| Skill | Command | Description |
|-------|---------|-------------|
| Account Strategy | `/siq-account-strategy` | **HUB** — Account planning, stakeholder mapping, competitive positioning |
| Lead Qualification | `/siq-lead-qualification` | BANT + MEDDIC scoring frameworks |
| Outreach Sequence | `/siq-outreach-sequence` | Multi-touch cold/warm outreach generation |
| Demo Prep | `/siq-demo-prep` | Discovery questions (SPIN) + demo scripts |
| Proposal Generator | `/siq-proposal-generator` | Executive proposals + pricing quotes |
| Objection Handling | `/siq-objection-handling` | Empathy→Reframe→Evidence→Close pattern |
| Follow-Up | `/siq-follow-up` | Stage-appropriate follow-up emails |
| Pipeline Report | `/siq-pipeline-report` | Pipeline health analysis + deal reviews |

## Sales Cycle Flow

```
Lead Qualification → Outreach Sequence → Demo Prep → Proposal Generator
       ↓                    ↓                ↓              ↓
  Score leads        Multi-touch        Discovery +    Executive summary
  BANT/MEDDIC        sequences         demo script     + pricing quote
                                             ↓              ↓
                                    Objection Handling → Follow-Up
                                         ↓                  ↓
                                    Handle pushback    Stage-based
                                                       follow-ups
                                             ↓
                                      Pipeline Report
                                    (weekly + deal review)
```

## Hub Architecture

`siq-account-strategy` stores shared context in `references/`:
- `sales-playbook.md` — Sales methodology and stages
- `qualification-criteria.md` — BANT + MEDDIC scoring criteria
- `pricing-tiers.md` — Product pricing reference

All spoke skills load these via `../siq-account-strategy/references/`.

Cross-cluster context from `../../shared/`:
- `brand-context.md` — Brand voice and positioning
- `icp-profiles.md` — Ideal Customer Profiles

## Customization

1. **Update hub references** — Edit files in `siq-account-strategy/references/` with your sales methodology, qualification criteria, and pricing
2. **Brand context** — Run `/siq-brand-strategy` (marketing cluster) to generate brand context shared across clusters
3. **Templates** — Modify templates in each skill's `templates/` directory to match your document style
