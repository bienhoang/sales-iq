# Framework Deep Reference — siq-strategy-consultant

Detailed methodology guides for each of the 10 consulting frameworks.

---

## F1: MECE Problem Decomposition

### What is MECE?
**Mutually Exclusive, Collectively Exhaustive** — the foundational thinking tool at McKinsey.
- **Mutually Exclusive**: each category is distinct; no item belongs to two categories
- **Collectively Exhaustive**: all categories together cover the entire problem space

### Common Decomposition Patterns

| Pattern | When to Use | Example |
|---|---|---|
| Internal vs. External | Broad org problems | "Why is revenue declining?" |
| Revenue vs. Cost | Profitability problems | "How to improve margins?" |
| Acquisition vs. Retention | Growth problems | "How to grow the customer base?" |
| People / Process / Technology | Operational problems | "Why is delivery slow?" |
| Product / Price / Place / Promotion | Marketing problems | "How to increase market share?" |
| Short-term vs. Long-term | Prioritization problems | "Where to invest?" |

### Building an Issue Tree

```
Problem Statement
├── Branch 1 (Category A)
│   ├── Sub-issue 1.1
│   │   ├── Root cause 1.1.1
│   │   └── Root cause 1.1.2
│   └── Sub-issue 1.2
├── Branch 2 (Category B)
│   ├── Sub-issue 2.1
│   └── Sub-issue 2.2
└── Branch 3 (Category C)
    ├── Sub-issue 3.1
    └── Sub-issue 3.2
```

### MECE Validation Checklist
- [ ] Can any item fit in more than one category? (Must be NO)
- [ ] Is there any aspect of the problem not covered? (Must be NO)
- [ ] Are categories at the same level of abstraction?
- [ ] Is each branch actionable and researchable?
- [ ] Are there 3–5 top-level branches? (more becomes unwieldy)

---

## F2: Scenario Planning & Analysis

### The 2x2 Scenario Matrix
Select two **critical uncertainties** that are: (1) high impact, (2) highly uncertain, (3) independent.

```
                 Uncertainty Y: HIGH
                        │
   ┌────────────────────┼────────────────────┐
   │  Scenario C        │  Scenario D        │
   │  (Low X, High Y)   │  (High X, High Y)  │
   │                    │                    │
X: LOW ─────────────────┼───────────────── X: HIGH
   │                    │                    │
   │  Scenario A        │  Scenario B        │
   │  (Low X, Low Y)    │  (High X, Low Y)   │
   └────────────────────┼────────────────────┘
                        │
                 Uncertainty Y: LOW
```

### Scenario Narrative Template
For each of the 4 scenarios:
1. **Name** — memorable, evocative title (e.g., "Digital Darwinism", "Slow Burn")
2. **Narrative** — 2-3 paragraph story of how this future unfolds
3. **Key characteristics** — 5–7 defining features of this world
4. **Winners and losers** — who thrives, who struggles
5. **Implications** — what this means for our strategy
6. **Early warning signals** — 3–5 observable leading indicators
7. **Strategic response** — what we do if this scenario materializes

### "No Regrets" Moves
Actions valid regardless of which scenario materializes:
- Building organizational agility and optionality
- Investing in data and analytics capabilities
- Strengthening core customer relationships
- Developing talent and culture
- Creating platform/ecosystem leverage

---

## F3: Go-To-Market Strategy

### GTM Readiness Checklist

| Dimension | Validation Question |
|---|---|
| Market | TAM/SAM/SOM validated? |
| Customer | Buyer personas validated with real interviews? |
| Product | Product-market fit evidence exists? |
| Pricing | Pricing tested with real customers? |
| Channels | Distribution channels identified and tested? |
| Team | Right GTM roles hired or committed? |
| Messaging | Positioning tested and refined? |
| Metrics | KPIs defined with baselines and targets? |

### Phased Rollout Template

**Phase 1 — Foundation (Days 1–30)**
- Finalize positioning and messaging
- Set up analytics and conversion tracking
- Launch to design partners / beta customers
- Gather structured feedback

**Phase 2 — Validation (Days 31–60)**
- Refine based on early feedback
- Begin outbound sales motions
- Launch initial marketing campaigns
- Track early conversion metrics vs. targets

**Phase 3 — Scale (Days 61–90)**
- Scale marketing spend on proven channels
- Expand sales team or channel partners
- Optimize conversion funnels
- Report on KPIs and iterate

### SaaS GTM Motion Selector

| Motion | When to Use | Key Metric |
|---|---|---|
| PLG (product-led) | Viral, self-serve product | Activation rate, time-to-value |
| SLG (sales-led) | Complex, high-ACV deals | Pipeline velocity, win rate |
| CLG (community-led) | Developer / open-source | Community DAU, contributor growth |
| Hybrid PLG+SLG | Mid-market expansion | PQL-to-SQL conversion rate |

---

## F4: Personas & Jobs-to-be-Done

### Jobs-to-be-Done Framework
For each persona, identify all job types:
- **Functional jobs** — tasks they need to accomplish (e.g., "close quarter on target")
- **Emotional jobs** — how they want to feel (e.g., "confident in front of the board")
- **Social jobs** — how they want to be perceived (e.g., "strategic leader, not just executor")
- **Related jobs** — adjacent tasks connected to the main job

### Persona Discovery Interview Questions
1. Walk me through a typical day in your role.
2. What are your top 3 goals this quarter?
3. What are the biggest obstacles to achieving those goals?
4. How do you currently solve [problem]?
5. What frustrates you most about current solutions?
6. How do you research new products/services?
7. Who else is involved in purchasing decisions?
8. What would make you switch from your current solution?
9. What does success look like for you in 6 months?
10. What keeps you up at night professionally?

### SaaS Buying Committee Roles

| Role | Primary Concern | Key Message |
|---|---|---|
| Champion (end user) | Workflow efficiency, ease of use | "Makes your job easier / faster" |
| Economic Buyer | ROI, budget, risk | "Payback in X months, NRR impact" |
| Technical Evaluator | Security, integration, scalability | "SOC 2, APIs, SLA guarantees" |
| Procurement | Contract terms, vendor risk | "Standard MSA, volume discounts" |

---

## F5: Pricing Strategy & Optimization

### Pricing Model Comparison

| Model | Best For | Pros | Cons |
|---|---|---|---|
| Flat-rate | Simple products | Easy to understand | No price discrimination |
| Per-seat | Collaboration tools | Predictable scaling | Penalizes adoption |
| Usage-based | Infrastructure/API | Aligns with value | Revenue unpredictability |
| Tiered | SaaS products | Captures different segments | Complexity |
| Freemium | PLG / consumer | Low acquisition cost | Low conversion rates |
| Value-based | Enterprise | Captures maximum value | Harder to implement |

### Good / Better / Best Packaging Framework

| Dimension | Good (Starter) | Better (Pro) | Best (Enterprise) |
|---|---|---|---|
| Target | SMB / individual | Mid-market / teams | Enterprise / org-wide |
| Features | Core only | Core + advanced | Full suite + custom |
| Support | Self-serve docs | Email + chat | Dedicated CSM |
| Price anchor | Low (drives adoption) | Mid (drives revenue) | High (drives profit) |
| Goal | Land customers | Expand usage | Maximize value |

### Van Westendorp Price Sensitivity
Ask target customers four questions:
1. At what price is this **too expensive** to consider?
2. At what price is this **expensive but still worth it**?
3. At what price is this a **bargain / great deal**?
4. At what price is this **too cheap** (quality concerns)?

Plot the four curves — intersection reveals the acceptable price range and optimal price point.

---

## F6: Value Proposition Design

### Value Proposition Canvas (Strategyzer)

**Customer Profile:**
- Customer Jobs (functional, social, emotional)
- Pains (obstacles, risks, undesired outcomes)
- Gains (desired outcomes, benefits, aspirations)

**Value Map:**
- Products & Services (what you offer)
- Pain Relievers (how you eliminate pains)
- Gain Creators (how you create gains)

**Fit** = your Value Map addresses the most critical Customer Jobs, Pains, and Gains.

### Messaging Hierarchy
1. **Positioning statement** (internal): For [target], [product] is the [category] that [key benefit] because [reason to believe].
2. **Tagline** (external, 3–7 words): captures essence emotionally
3. **Elevator pitch** (30 seconds): Problem → Solution → Differentiation → Proof
4. **Segment-level messaging**: tailored benefits and proof points per persona

### Differentiation Matrix
Rate yourself vs. top 3 competitors on the 5–7 dimensions customers care most about.
Focus your messaging on dimensions where you win AND customers value most.

---

## F7: Post-Mortem & Retrospective

### 5 Whys Analysis Template

```
Problem: [State the specific problem or failure]

Why 1: Why did this happen?
→ [First-level cause]

Why 2: Why did [first-level cause] happen?
→ [Second-level cause]

Why 3: Why did [second-level cause] happen?
→ [Third-level cause]

Why 4: Why did [third-level cause] happen?
→ [Fourth-level cause]

Why 5: Why did [fourth-level cause] happen?
→ [ROOT CAUSE identified]

Action: [Specific action to address root cause]
Owner: [Who is responsible]
Deadline: [When it should be completed]
```

### Pre-Mortem (Preventive Variant)
Before starting a project, ask: "Imagine this project has failed spectacularly. What went wrong?"
- List all plausible failure modes
- Rank by likelihood × impact
- Build preventive measures into the project plan upfront

### Retrospective Health Signals
Green: what to replicate | Amber: watch closely | Red: must fix before next sprint

---

## F8: Partnership & Alliance Strategy

### Partnership Evaluation Scorecard

| Criteria | Weight | Score (1–5) | Weighted Score |
|---|---|---|---|
| Strategic alignment | 25% | | |
| Complementary capabilities | 20% | | |
| Cultural fit | 15% | | |
| Financial impact | 15% | | |
| Market access | 10% | | |
| Technology fit | 10% | | |
| Risk profile | 5% | | |
| **Total** | **100%** | | |

Score ≥ 3.5 weighted: proceed. Score 2.5–3.4: conditional. Score < 2.5: pass.

### Deal Structure Options

| Structure | Control | Risk | Complexity | Best For |
|---|---|---|---|---|
| Referral agreement | Low | Low | Low | Testing the waters |
| Co-marketing | Low | Low | Low | Brand awareness |
| Revenue share | Medium | Medium | Medium | Channel partnerships |
| Licensing | Medium | Low | Medium | Technology partnerships |
| Joint venture | High | High | High | Market entry |
| Equity investment | High | High | High | Deep strategic alignment |
| Acquisition | Full | Highest | Highest | Full integration |

### Governance Checklist
- Decision rights: who owns what decisions?
- Financial reporting and true-up cadence
- IP ownership and licensing terms
- Termination clauses and exit rights
- Escalation path for disputes

---

## F9: Competitive Strategy & Positioning

### Porter's Five Forces Template

| Force | Assessment | Rating (1–5) | Key Factors |
|---|---|---|---|
| Threat of new entrants | | | Barriers to entry, capital, regulation |
| Bargaining power of suppliers | | | Concentration, switching costs |
| Bargaining power of buyers | | | Concentration, price sensitivity, alternatives |
| Threat of substitutes | | | Availability, switching costs, price-performance |
| Competitive rivalry | | | Number of players, growth rate, differentiation |

**Overall industry attractiveness**: Low / Medium / High

### Competitive Response Matrix

| Competitor Move | Our Response | Timeline | Resources Needed |
|---|---|---|---|
| Price cut | | | |
| New feature launch | | | |
| Market expansion | | | |
| Partnership or acquisition | | | |
| Marketing push | | | |

### Moat Assessment Framework
Rate each moat type on a 1–5 scale for your company:
- **Network effects** — value grows as more users join
- **Switching costs** — cost/pain of leaving for a competitor
- **Proprietary data** — unique data that improves the product
- **Brand** — trust and recognition advantage
- **Scale economics** — cost advantages at volume
- **Regulatory/IP** — licenses, patents, compliance barriers

---

## F10: Digital Transformation

### Digital Maturity Assessment (1–5 Scale)

| Dimension | 1: Initial | 3: Defined | 5: Optimizing |
|---|---|---|---|
| Strategy | No digital strategy | Defined digital roadmap | Digital-first culture |
| Customer | Basic web presence | Personalized experiences | Autonomous / predictive CX |
| Operations | Manual processes | Process digitization | AI-optimized operations |
| Technology | Legacy systems | Modern architecture | Composable / AI-native |
| Data | Siloed data | Data warehouse | AI/ML at scale |
| Culture | Resistance to change | Digital skills training | Continuous transformation |

### Initiative Prioritization (Impact vs. Effort)

```
        HIGH IMPACT
             │
   Quick     │    Strategic
   Wins      │    Bets
   (DO NOW)  │    (PLAN)
             │
LOW EFFORT ──┼────────── HIGH EFFORT
             │
   Fill-ins  │    Money
   (NICE)    │    Pits
             │    (AVOID)
        LOW IMPACT
```

### Transformation Pillars (SaaS / Dev-Tools Focus)
1. **Customer Experience** — self-serve onboarding, in-app guidance, AI support
2. **Product Intelligence** — usage analytics, feature flags, experimentation platform
3. **Revenue Operations** — unified data, predictive forecasting, automated workflows
4. **Developer Productivity** — CI/CD maturity, observability, platform engineering
5. **Data & AI** — data warehouse, ML pipelines, AI-powered features
6. **Culture & Talent** — digital fluency, product thinking, continuous learning
