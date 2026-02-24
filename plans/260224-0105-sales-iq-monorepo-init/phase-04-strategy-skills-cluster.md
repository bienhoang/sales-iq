# Phase 04 — Strategy Skills Cluster

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-monorepo-foundation.md)
- Reference: `.ref/Sales-leader-consultant/strategy-consultant/`

## Overview

- **Date**: 2026-02-24
- **Priority**: P2
- **Status**: pending
- **Effort**: 4h
- **Description**: Port strategy-consultant monolithic skill from Sales-leader reference. Adapt 10 frameworks for generic SaaS use. Create 3 reference satellite files.

## Key Insights

- **Monolithic pattern** — single skill with internal framework routing, not hub-and-spoke. Different from marketing cluster.
- 10 frameworks (F1-F10): MECE, Scenario Planning, GTM, Personas, Pricing, Value Prop, Post-Mortem, Partnership, Competitive, Digital Transformation.
- CLAUDE.md from ref acts as dispatch table routing problems to frameworks. In our context, SKILL.md handles this.
- Reference satellites (FRAMEWORKS, DELIVERABLE-TEMPLATES, INDUSTRY-LENSES) are loaded on-demand, not pre-loaded.
- Output is multi-document corpus (00-07 series), executive-ready.
- Ref skill is already fairly generic — less adaptation needed than marketing.

## Requirements

### Functional
- Single `siq-strategy-consultant` skill with 10 frameworks in SKILL.md
- 3 reference satellite files: FRAMEWORKS.md, DELIVERABLE-TEMPLATES.md, INDUSTRY-LENSES.md
- Framework dispatch: problem type → best framework(s) → structured output
- Multi-framework chaining support (e.g., Market Entry: F9→F4→F6→F5→F3)
- SETUP.md for the cluster

### Non-Functional
- SKILL.md under 200 lines — move detailed methodology to FRAMEWORKS.md
- Executive-ready output format (Pyramid Principle, SCQA)
- Generic across industries (SaaS, e-commerce, fintech, etc.)
- Works standalone without marketing or sales clusters

## Architecture

```
packages/skills/strategy/
├── siq-strategy-consultant/
│   ├── SKILL.md                        # Framework dispatch + 10 framework summaries
│   └── references/
│       ├── FRAMEWORKS.md               # Deep methodology per framework
│       ├── DELIVERABLE-TEMPLATES.md    # 9 structured output templates
│       └── INDUSTRY-LENSES.md          # 7 industry-specific adaptations
└── SETUP.md
```

## Related Code Files

### Create (adapt from .ref/)
- `packages/skills/strategy/siq-strategy-consultant/SKILL.md`
- `packages/skills/strategy/siq-strategy-consultant/references/FRAMEWORKS.md`
- `packages/skills/strategy/siq-strategy-consultant/references/DELIVERABLE-TEMPLATES.md`
- `packages/skills/strategy/siq-strategy-consultant/references/INDUSTRY-LENSES.md`
- `packages/skills/strategy/SETUP.md`

## Implementation Steps

1. **Read ref SKILL.md** (313 lines) — needs splitting to stay under 200 lines

2. **Restructure SKILL.md** (<200 lines):
   - Frontmatter: `name: siq-strategy-consultant`, description covering all 10 framework triggers
   - Core Principles section (6 principles, keep concise)
   - Framework dispatch table: problem type → framework number → one-line summary
   - Multi-framework chains: 4 common chain patterns
   - Output guidelines: format standards, quality checklist
   - Reference to satellite files for deep methodology
   - Remove individual framework details (move to FRAMEWORKS.md)

3. **Create FRAMEWORKS.md** — move detailed framework specs here:
   - For each of F1-F10: When to use, Role, Process steps, Deliverables, Example prompt
   - This is the "deep dive" reference loaded on-demand
   - Keep each framework section under 30 lines

4. **Create DELIVERABLE-TEMPLATES.md** — adapt from ref:
   - 9 templates: Executive Summary (SCQA), Strategy Recommendation, Market Sizing (TAM/SAM/SOM), Business Case, Stakeholder Map, OKR Framework, Competitive Battlecard, Workshop Agenda, Change Management Plan
   - Each template: structured markdown format with placeholder fields

5. **Create INDUSTRY-LENSES.md** — adapt from ref:
   - 7 industries: SaaS, E-Commerce, FinTech, Healthcare, Manufacturing, Professional Services, Marketplace/Platform
   - Per industry: KPIs, benchmarks, regulatory notes, vocabulary, peer comparisons
   - Focus on SaaS and dev-tools (primary target), keep others lighter

6. **Adapt for generic SaaS**:
   - Remove "Sales-leader-consultant" branding
   - Remove GoSnap-specific biz-model references
   - Ensure framework examples reference generic SaaS scenarios
   - Update industry lenses with current (2025-2026) benchmarks where known

7. **Write SETUP.md**:
   - What the strategy consultant does
   - How to invoke: `/siq-strategy-consultant [problem description]`
   - Framework auto-selection vs. explicit: `/siq-strategy-consultant F5 pricing for usage-based SaaS`
   - Example prompts per framework
   - Output format expectations

8. **Verify frontmatter** — name matches directory, description covers trigger contexts

## Todo List

- [ ] Restructure SKILL.md to under 200 lines (dispatch + summary)
- [ ] Create FRAMEWORKS.md with 10 detailed framework specs
- [ ] Create DELIVERABLE-TEMPLATES.md with 9 templates
- [ ] Create INDUSTRY-LENSES.md with 7 industry adaptations
- [ ] Remove Sales-leader branding, genericize
- [ ] Write SETUP.md
- [ ] Verify all references consistent

## Success Criteria

- SKILL.md under 200 lines with clear dispatch table
- All 10 frameworks accessible via references/FRAMEWORKS.md
- Strategy skill works standalone (no dependency on marketing/sales clusters)
- Industry lenses cover primary SaaS target well
- No ref-specific branding remains
- Deliverable templates are immediately usable

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| SKILL.md too long after restructure | Aggressively move details to FRAMEWORKS.md; SKILL.md = dispatch only |
| Framework quality loss in adaptation | Keep ref framework content mostly intact, only remove brand-specific refs |
| FRAMEWORKS.md too large to load | On-demand loading; skill loads only needed framework section |

## Security Considerations

- No API keys or external service calls
- Output may contain sensitive business strategy — user responsibility
- Templates should not contain real company data

## Next Steps

- Can be used standalone immediately after install
- Integrates with sales cluster for account strategy analysis
