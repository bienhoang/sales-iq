# Strategy Skills

## Skills Reference

| Skill | Command | Purpose |
|-------|---------|---------|
| Strategy Consultant | `/siq-strategy-consultant` | Multi-framework strategic analysis |

## Overview

`/siq-strategy-consultant` is a single monolithic skill that dispatches across 10 strategic frameworks. Specify the framework in your prompt, or let it choose based on context.

## Frameworks

| Framework | Trigger | Best For |
|-----------|---------|---------|
| SWOT | `framework: swot` | Internal capability assessment |
| Porter's Five Forces | `framework: porters` | Industry competitive dynamics |
| Blue Ocean | `framework: blue-ocean` | New market space identification |
| Jobs-to-be-Done | `framework: jtbd` | Customer motivation analysis |
| Ansoff Matrix | `framework: ansoff` | Growth strategy (market vs. product) |
| BCG Matrix | `framework: bcg` | Portfolio prioritization |
| Value Chain | `framework: value-chain` | Operational advantage analysis |
| OKR Design | `framework: okr` | Quarterly goal alignment |
| North Star Metric | `framework: north-star` | Single metric focus for growth |
| Competitive Moat | `framework: moat` | Durable advantage identification |

## Multi-Framework Chains

For deep strategic work, chain frameworks in a single session:

```
# Market entry analysis
/siq-strategy-consultant framework: porters, market: "developer security tools"
→ then: framework: blue-ocean, input: [porters output]
→ then: framework: ansoff, input: [blue-ocean output]
```

```
# Company positioning reset
/siq-strategy-consultant framework: swot, company: "YourSaaS"
→ then: framework: jtbd, segment: [swot's key customers]
→ then: framework: moat, strengths: [swot + jtbd outputs]
```

## Example Usage

**Single framework:**

```
/siq-strategy-consultant framework: jtbd, product: "pipeline analytics tool", segment: "sales managers at 50-200 person SaaS companies"
```

**Auto-select framework:**

```
/siq-strategy-consultant we are entering the HR-tech market with an AI performance review tool, help us think through our strategic positioning
```

**OKR design:**

```
/siq-strategy-consultant framework: okr, goal: "reach $2M ARR by Q4", team: "growth", current-mrr: 120000
```

**North Star:**

```
/siq-strategy-consultant framework: north-star, business-model: "usage-based API", growth-loop: "developers → teams → enterprise"
```
