# Output Standards & Quality

## Plan File Format

### YAML Frontmatter (Required for plan.md)

All `plan.md` files MUST include YAML frontmatter at the top:

```yaml
---
title: "{Brief plan title}"
description: "{One-sentence summary for card preview}"
status: pending  # pending | in-progress | completed | cancelled
priority: P2     # P1 (High) | P2 (Medium) | P3 (Low)
effort: 20h      # Estimated total effort
tags: [gtm, campaign]  # Category tags
created: 2026-02-24
---
```

### Auto-Population Rules

When creating plans, auto-populate these fields:
- **title**: Extract from task description
- **description**: First sentence of Overview section
- **status**: Always `pending` for new plans
- **priority**: From user request or default `P2`
- **effort**: Sum of phase estimates
- **tags**: Infer from task keywords
- **created**: Today's date in YYYY-MM-DD format

### Tag Vocabulary (Recommended)

Use these predefined tags for consistency:
- **Type**: `campaign`, `gtm`, `pipeline`, `content`, `brand`, `competitive`
- **Domain**: `marketing`, `sales`, `strategy`, `growth`, `retention`
- **Scope**: `critical`, `quick-win`, `experimental`, `evergreen`

## Task Breakdown

- Transform complex requirements into manageable, actionable tasks
- Each task independently executable with clear dependencies
- Prioritize by dependencies, risk, business value
- Eliminate ambiguity in instructions
- Include specific deliverables for all phases
- Provide clear success criteria per task

### Deliverable Management

List deliverables per phase with:
- Output type (report, campaign, sequence, asset)
- Target workspace directory
- Brief description
- Dependencies on other deliverables

## Workflow Process

1. **Initial Analysis** → Read workspace docs, understand brand context
2. **Research Phase** → Use `siq-research` for market data, investigate approaches
3. **Synthesis** → Analyze findings, identify optimal strategy
4. **Design Phase** → Create campaign architecture, funnel design
5. **Plan Documentation** → Write comprehensive plan in Markdown
6. **Review & Refine** → Ensure completeness, clarity, actionability

## Output Requirements

### What Planners Do
- Create plans ONLY (no implementation)
- Provide plan file path and summary
- Self-contained plans with necessary context
- Examples and templates when clarifying
- Multiple options with trade-offs when appropriate

### Writing Style
**IMPORTANT:** Sacrifice grammar for concision
- Focus clarity over eloquence
- Use bullets and lists
- Short sentences
- Remove unnecessary words
- Prioritize actionable info

### Unresolved Questions
**IMPORTANT:** Use `AskUserQuestion` to ask users for unresolved questions at the end
- Questions needing clarification
- Budget or resource decisions
- Unknowns impacting strategy
- Trade-offs requiring business decisions
Revise the plan and phases based on the answers.

## Quality Standards

### Thoroughness
- Thorough and specific in research/planning
- Consider market risks and competitive responses
- Think through the entire customer journey
- Document all assumptions

### Sustainability
- Consider long-term brand impact
- Design for iteration and optimization
- Document decision rationale
- Avoid over-engineering

### Research Depth
- When uncertain, research more
- Multiple options with clear trade-offs
- Validate against market data and benchmarks
- Consider industry best practices

### Budget & ROI
- Address budget allocation and efficiency
- Project ROI and payback period
- Plan for measurement and attribution
- Consider resource constraints (team, tools, time)

### Executability
- Detailed enough for any team member to execute
- Validate against existing brand strategy
- Ensure consistency with ICP and positioning
- Provide clear examples and templates

**Remember:** Plan quality determines execution success. Be comprehensive, consider all strategy aspects.
