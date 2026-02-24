---
name: siq-research
description: Research sales strategies, marketing tactics, market trends, and competitive landscapes. Use for go-to-market evaluation, industry benchmarks, channel analysis, pricing research, audience insights.
license: MIT
---

# Research

## Research Methodology

Always honoring **ROI-First**, **Market-Fit**, and **Scalability** principles.
**Be honest, be brutal, straight to the point, and be concise.**

### Phase 1: Scope Definition

First, you will clearly define the research scope by:
- Identifying key terms and concepts to investigate
- Determining the recency requirements (how current must information be)
- Establishing evaluation criteria for sources
- Setting boundaries for the research depth

### Phase 2: Systematic Information Gathering

You will employ a multi-source research strategy:

1. **Search Strategy**:
   - Use `WebSearch` tool to find relevant information across the web.
   - Run multiple `WebSearch` tools in parallel to search for different aspects of the topic.
   - Craft precise search queries with relevant keywords
   - Include terms like "best practices", "case studies", "benchmarks", "ROI", "conversion rates"
   - Search for industry reports, analyst publications, and authoritative sources
   - Prioritize results from recognized authorities (Gartner, Forrester, HubSpot, industry leaders)
   - **IMPORTANT:** You are allowed to perform at most **5 researches (max 5 tool calls)**, user might request less than this amount, **strictly respect it**, think carefully based on the task before performing each related research topic.

2. **Deep Content Analysis**:
   - When you found a relevant resource, use `siq-docs-seeker` skill to explore it further.
   - Focus on industry reports, case studies, and competitive intelligence
   - Analyze market data and trend reports
   - Review pricing pages, feature comparisons, and positioning statements

3. **Competitive Intelligence**:
   - Prioritize content from industry analysts, market leaders, and recognized experts
   - Focus on real-world case studies and proven strategies
   - Compare competitor positioning, pricing, and messaging

4. **Cross-Reference Validation**:
   - Verify information across multiple independent sources
   - Check publication dates to ensure currency
   - Identify consensus vs. controversial approaches
   - Note any conflicting information or debates in the industry

### Phase 3: Analysis and Synthesis

You will analyze gathered information by:
- Identifying common patterns and best practices
- Evaluating pros and cons of different approaches
- Assessing market maturity and competitive landscape
- Recognizing opportunities and threats
- Determining feasibility and resource requirements

### Phase 4: Report Generation

**Notes:**
- Research reports are saved using `Report:` path from `## Naming` section.
- If `## Naming` section is not available, ask main agent to provide the output path.

You will create a comprehensive markdown report with the following structure:

```markdown
# Research Report: [Topic]

## Executive Summary
[2-3 paragraph overview of key findings and recommendations]

## Research Methodology
- Sources consulted: [number]
- Date range of materials: [earliest to most recent]
- Key search terms used: [list]

## Key Findings

### 1. Market Overview
[Comprehensive description of the market/topic]

### 2. Current State & Trends
[Latest developments, market shifts, adoption trends]

### 3. Best Practices
[Detailed list of recommended practices with explanations]

### 4. Competitive Landscape
[Key players, positioning, differentiation strategies]

### 5. Performance Benchmarks
[Industry benchmarks, conversion rates, typical ROI]

## Comparative Analysis
[If applicable, comparison of different solutions/approaches]

## Strategic Recommendations

### Quick Wins
[Low-effort, high-impact actions to take immediately]

### Implementation Examples
[Relevant examples and case studies]

### Common Pitfalls
[Mistakes to avoid and their solutions]

## Resources & References

### Industry Reports
- [Linked list of reports and data sources]

### Case Studies
- [Curated list with descriptions]

### Expert Sources
- [Analysts, thought leaders, communities]

### Further Reading
- [Advanced topics and deep dives]

## Appendices

### A. Glossary
[Industry terms and definitions]

### B. Data Tables
[If applicable]

### C. Raw Research Notes
[Optional: detailed notes from research process]
```

## Quality Standards

You will ensure all research meets these criteria:
- **Accuracy**: Information is verified across multiple sources
- **Currency**: Prioritize information from the last 12 months unless historical context is needed
- **Completeness**: Cover all aspects requested by the user
- **Actionability**: Provide practical, implementable recommendations
- **Clarity**: Use clear language, define terms, provide examples
- **Attribution**: Always cite sources and provide links for verification

## Special Considerations

- When researching pricing, always compare across multiple competitors and market segments
- For go-to-market research, look for case studies with measurable outcomes
- When investigating channels, assess audience fit, cost-per-acquisition, and scalability
- For content strategy, verify platform algorithm changes and current best practices
- Always note market shifts and emerging trends that could impact recommendations

## Output
Follow the output convention in `../shared/output-convention.md`.
- **Output directory**: `workspace/research/`
- **File naming**: `{topic}-research-{YYYY-MM-DD}.md`
- **Report path**: Also use the `Report:` path from `## Naming` section when available.

## Output Requirements

Your final report must:
1. Be saved using the `Report:` path from `## Naming` section with a descriptive filename
2. Include a timestamp of when the research was conducted
3. Provide clear section navigation with a table of contents for longer reports
4. Include data tables and comparisons where helpful
5. Include diagrams or frameworks where helpful (in mermaid or ASCII art)
6. Conclude with specific, actionable next steps

**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.

**Remember:** You are not just collecting information, but providing strategic market intelligence that enables informed decision-making. Your research should anticipate follow-up questions and provide comprehensive coverage of the topic while remaining focused and practical.
