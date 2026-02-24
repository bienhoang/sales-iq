# Plan Creation & Organization

## Directory Structure

### Plan Location

Plans are saved inside the user's workspace directory.

**Path**: `workspace/plans/{date}-{slug}/`

**Example**: `workspace/plans/260224-q2-product-launch/` or `workspace/plans/260224-outbound-pipeline-strategy/`

### File Organization

```
workspace/plans/{date}-{slug}/
├── research/
│   ├── market-research-report.md
│   ├── competitor-analysis.md
│   └── ...
├── reports/
│   ├── scout-report.md
│   └── ...
├── plan.md                                    # Overview access point
├── phase-01-research-and-discovery.md         # Market research & ICP validation
├── phase-02-strategy-and-positioning.md       # Messaging, positioning, differentiation
├── phase-03-campaign-architecture.md          # Channel mix, funnel design
├── phase-04-content-and-assets.md             # Content creation, collateral
├── phase-05-launch-campaign.md                # Execution timeline, launch steps
├── phase-06-measure-and-optimize.md           # KPIs, attribution, iteration
└── phase-07-scale-and-expand.md               # Scale winning tactics, new segments
```

## File Structure

### Overview Plan (plan.md)

**IMPORTANT:** All plan.md files MUST include YAML frontmatter. See `output-standards.md` for schema.

**Example plan.md structure:**
```markdown
---
title: "Q2 Product Launch GTM Plan"
description: "Go-to-market strategy for Q2 SaaS product launch targeting mid-market"
status: pending
priority: P1
effort: 40h
tags: [gtm, campaign, launch]
created: 2026-02-24
---

# Q2 Product Launch GTM Plan

## Overview

Brief description of what this plan accomplishes.

## Phases

| # | Phase | Status | Effort | Link |
|---|-------|--------|--------|------|
| 1 | Research & Discovery | Pending | 8h | [phase-01](./phase-01-research-and-discovery.md) |
| 2 | Strategy & Positioning | Pending | 8h | [phase-02](./phase-02-strategy-and-positioning.md) |
| 3 | Campaign Architecture | Pending | 8h | [phase-03](./phase-03-campaign-architecture.md) |
| 4 | Content & Assets | Pending | 8h | [phase-04](./phase-04-content-and-assets.md) |
| 5 | Launch | Pending | 4h | [phase-05](./phase-05-launch-campaign.md) |
| 6 | Measure & Optimize | Pending | 4h | [phase-06](./phase-06-measure-and-optimize.md) |

## Dependencies

- List key dependencies here
```

**Guidelines:**
- Keep generic and under 80 lines
- List each phase with status/progress
- Link to detailed phase files
- Key dependencies

### Phase Files (phase-XX-name.md)

**IMPORTANT:** Each phase MUST include a **Recommended Skills** section that maps relevant `siq-*` skills for execution. Use this mapping as a guide:

| Phase Type | Recommended Skills |
|---|---|
| Research & Discovery | `siq-research`, `siq-competitor-intel`, `siq-scout` |
| Strategy & Positioning | `siq-strategy-consultant`, `siq-brand-strategy` |
| Campaign Architecture | `siq-email-campaign`, `siq-outreach-sequence`, `siq-ad-copy` |
| Content & Assets | `siq-seo-content`, `siq-content-repurpose`, `siq-social-media-post` |
| Social & Community | `siq-social-media-calendar`, `siq-community-engagement` |
| Sales Enablement | `siq-account-strategy`, `siq-demo-prep`, `siq-objection-handling` |
| Pipeline & Outreach | `siq-pipeline-report`, `siq-lead-qualification`, `siq-outreach-sequence` |
| Proposals & Follow-up | `siq-proposal-generator`, `siq-follow-up` |
| Measurement & Reporting | `siq-metrics-report`, `siq-pipeline-report` |
| Launch Orchestration | `siq-product-launch` |

Only include skills relevant to the specific phase. Not every phase needs all skills.

Each phase file should contain:

**Context Links**
- Links to related reports, workspace docs, research

**Overview**
- Priority
- Current status
- Brief description

**Key Insights**
- Important findings from research
- Market data and competitive intelligence

**Requirements**
- Business requirements
- Budget and resource requirements

**Strategy**
- Approach and rationale
- Channel/tactic selection
- Audience targeting

**Related Documents**
- List of workspace docs to reference
- List of deliverables to create
- List of assets needed

**Recommended Skills**
- List `siq-*` skills the user can invoke to execute this phase
- Include brief note on what each skill does for this phase

**Implementation Steps**
- Detailed, numbered steps
- Specific instructions with owners

**Todo List**
- Checkbox list for tracking

**Success Criteria**
- KPIs and target metrics
- Definition of done

**Risk Assessment**
- Market risks and mitigation
- Budget and timeline risks

**Next Steps**
- Dependencies on other phases
- Follow-up tasks
