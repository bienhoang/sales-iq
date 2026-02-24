# Phase 05 — Sales Skills Cluster

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-monorepo-foundation.md), [Phase 03](./phase-03-marketing-skills-cluster.md) (pattern reference)
- Pattern source: marketing cluster hub-and-spoke architecture

## Overview

- **Date**: 2026-02-24
- **Priority**: P1
- **Status**: pending
- **Effort**: 6h
- **Description**: Design and build ~8 new sales skills from scratch using marketing cluster's hub-and-spoke pattern. No reference project to port from — this is original design work.

## Key Insights

- Follows marketing cluster pattern: hub (`account-strategy`) + spoke skills + shared references.
- Sales cycle mapping: lead-qualification → outreach-sequence → demo-prep → proposal-generator → objection-handling → follow-up → pipeline-report.
- `account-strategy` hub stores account context (company profile, deal history, stakeholders, competitive landscape) in `references/`.
- Each spoke loads `../account-strategy/references/` before generating output.
- Templates should follow sales best practices: BANT/MEDDIC qualification, multi-touch outreach, structured proposals.
- Also loads from `../../shared/` for cross-cluster brand context and ICP profiles.

## Requirements

### Functional
- 8 skills: siq-account-strategy (hub), siq-lead-qualification, siq-outreach-sequence, siq-demo-prep, siq-proposal-generator, siq-objection-handling, siq-follow-up, siq-pipeline-report
- siq-account-strategy hub generates and stores account/deal context
- All spoke skills reference hub's `references/` via `../siq-account-strategy/references/`
- All skill directories and SKILL.md `name` fields use `siq-` prefix

<!-- Updated: Validation Session 1 - siq- prefix on all skill names -->
- Templates produce immediately usable sales documents
- SETUP.md documents cluster usage and sales workflow

### Non-Functional
- Each SKILL.md under 200 lines
- Generic for B2B SaaS sales (not industry-specific)
- Templates produce professional, client-facing output
- Skills work independently but chain naturally through the sales cycle

## Architecture

```
packages/skills/sales/
├── siq-account-strategy/              # HUB
│   ├── SKILL.md
│   ├── templates/
│   │   └── account-plan.md
│   └── references/
│       ├── sales-playbook.md      # placeholder — sales methodology, stages
│       ├── qualification-criteria.md  # BANT/MEDDIC criteria
│       └── pricing-tiers.md       # product pricing reference
├── lead-qualification/
│   ├── SKILL.md
│   └── templates/
│       └── qualification-scorecard.md
├── outreach-sequence/
│   ├── SKILL.md
│   ├── references/
│   │   └── outreach-best-practices.md
│   └── templates/
│       ├── cold-email-sequence.md
│       ├── linkedin-sequence.md
│       └── warm-intro-sequence.md
├── demo-prep/
│   ├── SKILL.md
│   └── templates/
│       ├── demo-script.md
│       └── discovery-questions.md
├── proposal-generator/
│   ├── SKILL.md
│   └── templates/
│       ├── saas-proposal.md
│       └── pricing-quote.md
├── objection-handling/
│   ├── SKILL.md
│   ├── references/
│   │   └── common-objections.md
│   └── templates/
│       └── objection-playbook.md
├── follow-up/
│   ├── SKILL.md
│   └── templates/
│       ├── post-demo-followup.md
│       ├── post-proposal-followup.md
│       └── re-engagement.md
├── pipeline-report/
│   ├── SKILL.md
│   └── templates/
│       ├── weekly-pipeline.md
│       └── deal-review.md
└── SETUP.md
```

## Related Code Files

### Create (all new — no ref to port from)

**Hub — account-strategy/**
- `SKILL.md` — account analysis, stakeholder mapping, competitive positioning, deal strategy
- `templates/account-plan.md` — structured account plan template
- `references/sales-playbook.md` — placeholder with generic SaaS sales methodology
- `references/qualification-criteria.md` — BANT + MEDDIC criteria template
- `references/pricing-tiers.md` — placeholder pricing structure

**Spoke skills (7 skills)**
- `lead-qualification/SKILL.md` + `templates/qualification-scorecard.md`
- `outreach-sequence/SKILL.md` + `references/outreach-best-practices.md` + `templates/cold-email-sequence.md`, `linkedin-sequence.md`, `warm-intro-sequence.md`
- `demo-prep/SKILL.md` + `templates/demo-script.md`, `discovery-questions.md`
- `proposal-generator/SKILL.md` + `templates/saas-proposal.md`, `pricing-quote.md`
- `objection-handling/SKILL.md` + `references/common-objections.md` + `templates/objection-playbook.md`
- `follow-up/SKILL.md` + `templates/post-demo-followup.md`, `post-proposal-followup.md`, `re-engagement.md`
- `pipeline-report/SKILL.md` + `templates/weekly-pipeline.md`, `deal-review.md`

**Cluster config**
- `sales/SETUP.md`

## Implementation Steps

1. **Design account-strategy hub SKILL.md**:
   - Frontmatter: `name: account-strategy`, description covers account planning triggers
   - When invoked without args: generate complete account plan
   - With args: `stakeholders`, `competitive`, `deal-strategy`, `all`
   - Loads `../../shared/brand-context.md` and `../../shared/icp-profiles.md`
   - Generates: company profile, stakeholder map, competitive positioning, deal strategy, success metrics
   - Saves context to `references/` for spoke skills

2. **Design lead-qualification SKILL.md**:
   - Loads account hub refs + qualification criteria
   - Applies BANT (Budget, Authority, Need, Timeline) scoring
   - Applies MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion)
   - Output: qualification scorecard with score, risk flags, next steps
   - Template: scorecard with weighted scoring matrix

3. **Design outreach-sequence SKILL.md**:
   - Args: `[channel] [persona] [context]` — e.g., `/outreach-sequence cold-email CTO free-trial`
   - Loads brand voice + ICP profiles + account context
   - Generates multi-touch sequences (5-7 touches over 2-3 weeks)
   - Templates: cold email (5-touch), LinkedIn (connection + messages), warm intro (mutual connection)
   - Each touch: subject/hook, body, CTA, timing, personalization notes

4. **Design demo-prep SKILL.md**:
   - Loads account context, stakeholder map, qualification data
   - Generates: discovery questions (by stakeholder role), demo script (problem→solution→value flow), potential objections to prepare for
   - Templates: demo-script (structured with talking points per feature), discovery-questions (categorized by SPIN: Situation, Problem, Implication, Need-Payoff)

5. **Design proposal-generator SKILL.md**:
   - Loads account context, qualification data, pricing tiers
   - Generates: executive summary, problem statement, proposed solution, pricing/packaging, implementation timeline, terms, success metrics
   - Templates: saas-proposal (full document), pricing-quote (one-page pricing breakdown)

6. **Design objection-handling SKILL.md**:
   - Loads common objections reference + account context
   - Args: specific objection text or category (price, timing, competitor, status-quo)
   - Generates: empathy statement, reframe, evidence/proof, close/next-step
   - Reference: common-objections.md with top 15 B2B SaaS objections and frameworks
   - Template: playbook format with objection → response matrix

7. **Design follow-up SKILL.md**:
   - Loads account context, deal stage
   - Args: `[trigger]` — post-demo, post-proposal, re-engage, check-in
   - Generates contextual follow-up emails with value reinforcement
   - Templates: post-demo (recap + next steps), post-proposal (urgency + value), re-engagement (new angle + trigger)

8. **Design pipeline-report SKILL.md**:
   - Generates pipeline health analysis
   - Args: `weekly` or `deal-review [deal-name]`
   - Weekly: pipeline value, stage distribution, velocity, at-risk deals, forecast
   - Deal review: single deal deep-dive with risk assessment
   - Templates: weekly-pipeline (dashboard-style), deal-review (single deal analysis)

9. **Write SETUP.md**:
   - Sales workflow overview (how skills chain through sales cycle)
   - Quick start: `/account-strategy` first, then individual skills
   - Skill table with commands
   - Sales cycle flow diagram
   - Customization: updating sales playbook, qualification criteria, pricing

10. **Create hub reference placeholders**:
    - `sales-playbook.md` — generic stages: Discovery → Qualification → Demo → Proposal → Negotiation → Close
    - `qualification-criteria.md` — BANT + MEDDIC scoring templates
    - `pricing-tiers.md` — generic 3-tier SaaS pricing (Starter/Pro/Enterprise)

## Todo List

- [ ] Design and write account-strategy hub
- [ ] Create hub reference placeholders (playbook, criteria, pricing)
- [ ] Design and write lead-qualification
- [ ] Design and write outreach-sequence
- [ ] Design and write demo-prep
- [ ] Design and write proposal-generator
- [ ] Design and write objection-handling
- [ ] Design and write follow-up
- [ ] Design and write pipeline-report
- [ ] Write SETUP.md with sales cycle flow
- [ ] Review all SKILL.md frontmatter consistency

## Success Criteria

- All 8 skills have valid SKILL.md with correct frontmatter
- Hub-and-spoke references work (spoke skills load hub refs)
- Templates produce professional, client-facing output
- SETUP.md clearly explains sales workflow
- Skills chain naturally: qualification → outreach → demo → proposal → follow-up
- Each SKILL.md under 200 lines

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Sales skills too generic to be useful | Include specific frameworks (BANT, MEDDIC, SPIN) and real templates |
| Overlap with marketing skills (email) | Clear scope: marketing = campaigns/content, sales = 1:1 prospect communication |
| Too many template files | Start with 1-2 templates per skill, expand based on feedback |
| No ref to port from — quality risk | Model closely on marketing cluster pattern; review against sales best practices |

## Security Considerations

- Proposal templates may contain pricing — user should treat as confidential
- Account references store prospect company details — not committed to git
- No API keys or external service calls in skills

## Next Steps

- Phase 07: CLI installs sales skills alongside marketing and strategy
- MCP server CRM tools complement these skills (real data vs. skill-generated analysis)
