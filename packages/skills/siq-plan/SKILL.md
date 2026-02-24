---
name: siq-plan
description: Plan sales & marketing strategies, design campaign architectures, create go-to-market roadmaps with detailed phases. Use for campaign planning, GTM strategy, pipeline design, content strategy, funnel architecture.
license: MIT
version: 1.0.0
---

# Sales & Marketing Planning

Create detailed sales & marketing strategy plans through research, project analysis, strategy design, and comprehensive documentation.

## When to Use

Use this skill when:
- Planning new campaign launches or go-to-market strategies
- Designing sales pipeline or funnel architectures
- Evaluating marketing approaches and channel strategies
- Creating implementation roadmaps for growth initiatives
- Breaking down complex sales/marketing requirements into phases
- Assessing business trade-offs (CAC, LTV, ROI, budget allocation)

## Core Responsibilities & Rules

Always honoring **YAGNI**, **KISS**, and **DRY** principles.
**Be honest, be brutal, straight to the point, and be concise.**

### 1. Research & Analysis
Load: `references/research-phase.md`
**Skip if:** Provided with researcher reports

### 2. Project Understanding
Load: `references/project-understanding.md`
**Skip if:** Provided with scout reports

### 3. Strategy Design
Load: `references/strategy-design.md`

### 4. Plan Creation & Organization
Load: `references/plan-organization.md`

### 5. Task Breakdown & Output Standards
Load: `references/output-standards.md`

## Workflow Process

1. **Initial Analysis** → Read workspace docs (brand, ICP, strategy), understand context
2. **Research Phase** → Use `siq-research` to investigate approaches, gather market data
3. **Synthesis** → Analyze findings, identify optimal strategy
4. **Design Phase** → Create campaign/funnel architecture, implementation design
5. **Plan Documentation** → Write comprehensive plan
6. **Review & Refine** → Ensure completeness, clarity, actionability

## Output

Follow the output convention in `../shared/output-convention.md`.
- **Output directory**: `workspace/plans/`
- **Plan structure**: `workspace/plans/{date}-{slug}/plan.md` with phase files
- **Report path**: Also use the naming pattern from the `## Naming` section in the injected context when available.

## Output Requirements

- DO NOT implement strategies - only create plans
- Respond with plan file path and summary
- Ensure self-contained plans with necessary context
- Include examples/templates when clarifying
- Provide multiple options with trade-offs when appropriate
- **IMPORTANT:** Sacrifice grammar for the sake of concision when writing outputs.

## Quality Standards

- Be thorough and specific
- Consider long-term sustainability and scalability
- Research thoroughly when uncertain
- Address brand consistency and compliance concerns
- Make plans detailed enough for any team member to execute
- Validate against existing brand strategy and ICP docs

**Remember:** Plan quality determines execution success. Be comprehensive and consider all strategy aspects.
