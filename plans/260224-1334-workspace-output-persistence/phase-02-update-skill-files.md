# Phase 2: Update Skill Files

## Context
- Parent plan: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-shared-output-convention.md)
- Reference: [brainstorm report](../reports/brainstorm-260224-1334-workspace-output-persistence.md)

## Overview
- **Priority**: P1
- **Status**: Pending
- **Description**: Add output section to all 20 SKILL.md files referencing shared output-convention.md

## Key Insights
- SKILL.md files use YAML frontmatter (`name`, `description`, `argument-hint`)
- Some skills already have output/deliverables sections (siq-brand-strategy, siq-proposal-generator) — integrate, don't duplicate
- Skills that already save to `references/` (brand-strategy, account-strategy) should continue doing so AND also save deliverables to workspace

## Requirements
- Every SKILL.md gets an `## Output` section (or updated if exists)
- Section references `shared/output-convention.md` and declares the output_dir
- Existing save behavior preserved (brand-strategy references/, account-strategy references/)
- Utility skills (siq-scout, siq-docs-seeker, siq-sequential-thinking) do NOT produce user deliverables — skip them

## Architecture
Each SKILL.md gets appended (or section updated):
```md
## Output
Follow the output convention in `../shared/output-convention.md`.
- **Output directory**: `workspace/{output_dir}/`
- **File naming**: `{descriptor}-{YYYY-MM-DD}.md`
```

## Related Code Files (20 files to modify)

### Marketing cluster (11 skills)
- `packages/skills/marketing/siq-ad-copy/SKILL.md` → ad-copy
- `packages/skills/marketing/siq-brand-strategy/SKILL.md` → strategy
- `packages/skills/marketing/siq-community-engagement/SKILL.md` → social
- `packages/skills/marketing/siq-competitor-intel/SKILL.md` → intel
- `packages/skills/marketing/siq-content-repurpose/SKILL.md` → content
- `packages/skills/marketing/siq-email-campaign/SKILL.md` → emails
- `packages/skills/marketing/siq-metrics-report/SKILL.md` → reports
- `packages/skills/marketing/siq-product-launch/SKILL.md` → strategy
- `packages/skills/marketing/siq-seo-content/SKILL.md` → content
- `packages/skills/marketing/siq-social-media-calendar/SKILL.md` → social
- `packages/skills/marketing/siq-social-media-post/SKILL.md` → social

### Sales cluster (8 skills)
- `packages/skills/sales/siq-account-strategy/SKILL.md` → sales-prep
- `packages/skills/sales/siq-demo-prep/SKILL.md` → sales-prep
- `packages/skills/sales/siq-follow-up/SKILL.md` → emails
- `packages/skills/sales/siq-lead-qualification/SKILL.md` → intel
- `packages/skills/sales/siq-objection-handling/SKILL.md` → sales-prep
- `packages/skills/sales/siq-outreach-sequence/SKILL.md` → outreach
- `packages/skills/sales/siq-pipeline-report/SKILL.md` → reports
- `packages/skills/sales/siq-proposal-generator/SKILL.md` → proposals

### Strategy cluster (1 skill)
- `packages/skills/strategy/siq-strategy-consultant/SKILL.md` → strategy

### Utility skills (SKIP — no user deliverables)
- `packages/skills/siq-brainstorm/SKILL.md` — already saves via Report: path
- `packages/skills/siq-research/SKILL.md` — already saves via Report: path
- `packages/skills/siq-scout/SKILL.md` — internal scouting, no deliverable
- `packages/skills/siq-docs-seeker/SKILL.md` — returns inline docs
- `packages/skills/siq-sequential-thinking/SKILL.md` — internal methodology

## Implementation Steps

### For each skill (20 files):

1. Read the current SKILL.md
2. Check if it already has an output/deliverables section
3. **If no output section**: Append `## Output` section at the end
4. **If existing output section** (brand-strategy, proposal-generator): Add workspace save instruction alongside existing behavior
5. The output section should be concise (3-5 lines):

**Standard template** (for skills without existing output instructions):
```md
## Output
Follow the output convention in `../shared/output-convention.md`.
- **Output directory**: `workspace/{output_dir}/`
- **File naming**: `{context-specific-descriptor}-{YYYY-MM-DD}.md`
```

**Extended template** (for skills that already save to references/):
```md
## Output
Follow the output convention in `../shared/output-convention.md`.
- **Output directory**: `workspace/{output_dir}/`
- **File naming**: `{context-specific-descriptor}-{YYYY-MM-DD}.md`
- Continue saving internal reference data to `references/` as before.
```

### Descriptor hints per skill:
| Skill | Descriptor hint |
|-------|----------------|
| siq-proposal-generator | account-name-proposal |
| siq-email-campaign | campaign-type-segment |
| siq-follow-up | account-name-followup-type |
| siq-outreach-sequence | account-name-sequence-type |
| siq-ad-copy | campaign-name-platform |
| siq-seo-content | topic-slug-content-type |
| siq-content-repurpose | source-title-format |
| siq-social-media-post | topic-platform |
| siq-social-media-calendar | week-start-date-calendar |
| siq-community-engagement | topic-platform |
| siq-competitor-intel | competitor-name-doc-type |
| siq-lead-qualification | lead-name-scorecard |
| siq-metrics-report | period-report-type |
| siq-pipeline-report | period-report-type |
| siq-strategy-consultant | topic-framework |
| siq-brand-strategy | element-refined |
| siq-demo-prep | account-name-prep-type |
| siq-objection-handling | objection-topic |
| siq-account-strategy | account-name-plan-type |
| siq-product-launch | product-name-doc-type |

## Todo
- [ ] Update siq-ad-copy/SKILL.md
- [ ] Update siq-brand-strategy/SKILL.md (preserve existing Deliverables section)
- [ ] Update siq-community-engagement/SKILL.md
- [ ] Update siq-competitor-intel/SKILL.md
- [ ] Update siq-content-repurpose/SKILL.md
- [ ] Update siq-email-campaign/SKILL.md
- [ ] Update siq-metrics-report/SKILL.md
- [ ] Update siq-product-launch/SKILL.md
- [ ] Update siq-seo-content/SKILL.md
- [ ] Update siq-social-media-calendar/SKILL.md
- [ ] Update siq-social-media-post/SKILL.md
- [ ] Update siq-account-strategy/SKILL.md (preserve existing references/ saves)
- [ ] Update siq-demo-prep/SKILL.md
- [ ] Update siq-follow-up/SKILL.md
- [ ] Update siq-lead-qualification/SKILL.md
- [ ] Update siq-objection-handling/SKILL.md
- [ ] Update siq-outreach-sequence/SKILL.md
- [ ] Update siq-pipeline-report/SKILL.md
- [ ] Update siq-proposal-generator/SKILL.md
- [ ] Update siq-strategy-consultant/SKILL.md

## Success Criteria
- All 20 SKILL.md files have `## Output` section
- Each references `shared/output-convention.md`
- Each declares correct `output_dir`
- Existing save behavior (references/) preserved where applicable
- No duplicate or contradictory output instructions

## Risk Assessment
- **Risk**: Repetitive edits → might miss a file
  - **Mitigation**: Checklist above, verify with `grep -r "output-convention" packages/skills/` after

## Next Steps
→ Phase 3: Update CLI template to include workspace reference in generated CLAUDE.md
