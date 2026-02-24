# Industry-Specific Lenses — siq-strategy-consultant

Adapt consulting frameworks to the specific industry context. Apply the universal framework
first, then layer on the relevant industry lens: metrics, vocabulary, benchmarks, and
regulatory considerations.

---

## How to Apply an Industry Lens

1. **Start with the universal framework** (SKILL.md)
2. **Apply industry-specific metrics** — use the right KPIs, not generic ones
3. **Incorporate industry vocabulary** — speak the client's language
4. **Consider regulatory context** — what constraints are unique to this industry
5. **Benchmark appropriately** — compare to industry peers, not cross-industry averages
6. **Identify industry-specific risks** — what can go wrong in THIS sector
7. **Adapt deliverable format** — tech founders and healthcare executives expect different presentations

---

## L1: SaaS / B2B Software

### Key Metrics

| Metric | Definition | Best-in-Class Benchmark |
|---|---|---|
| ARR | Annual Recurring Revenue | Growing 40%+ YoY (early stage) |
| NRR / NDR | Net Revenue / Dollar Retention | >120% |
| GRR | Gross Revenue Retention | >90% |
| CAC Payback | Months to recover acquisition cost | <18 months |
| LTV:CAC | Lifetime value to acquisition cost | >3:1 |
| Churn | Monthly customer churn rate | <2% monthly |
| Rule of 40 | Revenue growth % + profit margin % | >40% |
| Magic Number | Net new ARR / S&M spend | >0.75 |
| Activation Rate | % users who reach "aha moment" | Benchmark vs. cohort |
| Time-to-Value | Days from signup to first value | <7 days (PLG) |

### Framework Adaptations
- **MECE**: Decompose churn into voluntary vs. involuntary, by segment, by lifecycle stage
- **Pricing**: Usage-based, per-seat, or tiered — test willingness to pay with Van Westendorp
- **GTM**: Choose PLG vs. SLG vs. hybrid based on ACV and product complexity
- **Personas**: Always map Champion (end user), Economic Buyer, and Technical Evaluator

### SaaS-Specific Considerations
- Land-and-expand motion: initial land ACV is not the unit economics story
- Free trial / freemium conversion is a critical funnel stage — optimize activation, not just signups
- Annual vs. monthly billing has major cash flow implications
- Security and compliance requirements (SOC 2, ISO 27001) vary by enterprise tier
- Product-led growth metrics: PQL definition, activation rate, feature adoption depth
- Multi-tenant architecture affects enterprise customization constraints

### Vocabulary
ARR, MRR, NRR, GRR, churn, logo retention, seat expansion, PQL, ACV, TCV, ICP, PLG, SLG, CSM, QBR, EBR, health score, time-to-value, onboarding completion rate

---

## L2: Developer Tools / Infrastructure

### Key Metrics

| Metric | Definition | Context |
|---|---|---|
| DAU / MAU | Daily / Monthly Active Users | Developer engagement signal |
| API Call Volume | Total calls per period | Usage growth proxy |
| P99 Latency | 99th percentile response time | Reliability SLA |
| Time-to-Hello-World | Minutes from signup to first working integration | Developer DX signal |
| Community Contributors | GitHub stars, forks, PRs | Ecosystem health |
| Docs NPS | Net Promoter Score for documentation | Activation lever |
| Paid Conversion | Free → paid rate | Monetization efficiency |

### Framework Adaptations
- **GTM**: Community-led growth often precedes sales-led; invest in developer advocacy early
- **Value Proposition**: Lead with developer experience (DX), not business outcomes — developers self-select, then pull economic buyers
- **Personas**: Developer Practitioner (builder), Tech Lead (decision influencer), CTO/VP Eng (economic buyer, later)
- **Competitive**: Open-source alternatives are a key substitute threat — moat is DX + ecosystem + support

### Dev-Tools-Specific Considerations
- Open-source as a distribution strategy: OSS drives awareness, commercial tier drives revenue
- Developer trust is fragile — pricing changes, API deprecations, and reliability incidents cause vocal community backlash
- Documentation quality is a first-class product feature, not marketing collateral
- GitHub presence (stars, activity, issue response time) is a public trust signal
- Self-hosted vs. cloud offering trade-offs affect enterprise sales cycles
- Compliance: SOC 2 Type II is table stakes for enterprise procurement

### Vocabulary
DX (developer experience), SDK, API, CLI, self-hosted, cloud-managed, open-core, OSS, PLG, PQL, time-to-hello-world, GitHub stars, community, contributor, documentation, integration, webhook, rate limiting, SLA, uptime

---

## L3: E-Commerce / Retail

### Key Metrics

| Metric | Definition | Good Benchmark |
|---|---|---|
| GMV | Gross Merchandise Value | Growing YoY |
| AOV | Average Order Value | Industry-dependent |
| Conversion Rate | Visitors → purchases | 2–4% (typical) |
| Cart Abandonment | % who add to cart but don't buy | <70% |
| ROAS | Return on Ad Spend | >4:1 |
| Repeat Purchase Rate | % who buy again within 12 months | >30% |
| Inventory Turnover | COGS / Average Inventory | Industry-specific |
| Customer LTV | Total revenue per customer over lifetime | Growing cohort over cohort |

### Framework Adaptations
- **MECE**: Revenue = Traffic × Conversion × AOV × Purchase Frequency
- **Personas**: Segment by shopping behavior and occasion, not just demographics
- **Pricing**: Dynamic pricing, bundling, and promotional cadence are core levers
- **Competitive**: Marketplace vs. direct-to-consumer positioning is a strategic choice

### Industry-Specific Considerations
- Seasonality: Q4 can be 30–50% of annual revenue — planning is critical
- Omnichannel: online and offline must feel seamless to customers
- Supply chain resilience and lead time management
- Returns and reverse logistics economics (high return rates erode margin)
- Social commerce and influencer-driven discovery channels
- First-party data strategy as third-party cookies deprecate

---

## L4: FinTech / Financial Services

### Key Metrics

| Metric | Definition | Good Benchmark |
|---|---|---|
| AUM | Assets Under Management | Growing steadily |
| NIM | Net Interest Margin | 2–4% (banking) |
| Take Rate | Revenue / Transaction Volume | Varies by business model |
| Default Rate | % of loans in default | Below industry average |
| Cost-to-Serve | Operating cost per customer per year | Declining over time |
| Regulatory Capital | Capital adequacy ratio | Above regulatory minimums |

### Framework Adaptations
- **Scenario Planning**: Regulatory changes, interest rate shifts, crypto adoption cycles
- **Partnerships**: Banking-as-a-service and embedded finance partnerships are structural
- **Digital Transformation**: Legacy core banking modernization is a decade-long initiative
- **MECE**: Revenue by product line, customer segment, and geography

### Industry-Specific Considerations
- Regulatory compliance is non-negotiable: KYC, AML, PCI-DSS, SOX, GDPR, CCPA
- Trust and security are primary competitive differentiators — breaches are existential
- Embedded finance: distribution through non-financial platforms is a major growth vector
- Open banking / API economy creates both threats and partnership opportunities
- Risk management frameworks must be integrated into product design, not bolted on
- Licensing requirements vary significantly by jurisdiction — plan international expansion carefully

---

## L5: Healthcare / Life Sciences

### Key Metrics

| Metric | Definition | Context |
|---|---|---|
| Patient Outcomes | Clinical quality measures | Above national benchmarks |
| PMPM | Per Member Per Month cost | Below benchmark |
| Readmission Rate | 30-day readmission % | <15% |
| R&D Pipeline | Drugs / devices in development | Stage-appropriate volume |
| Time-to-Market | Regulatory approval timeline | Meeting milestones |
| Reimbursement Rate | % of claims paid by payers | >95% |

### Framework Adaptations
- **Scenario Planning**: Regulatory changes, reimbursement model shifts, payer consolidation
- **Value Proposition**: Must demonstrate clinical outcomes AND patient experience AND cost reduction
- **Digital Transformation**: Telehealth, EHR optimization, AI diagnostics, remote monitoring
- **Post-Mortem**: Adverse event analysis and clinical trial failures require rigorous root cause

### Industry-Specific Considerations
- Regulatory pathway (FDA, EMA, CE Mark) determines timeline and investment — model these scenarios
- Clinical validation and evidence generation are required before commercial scaling
- Payer dynamics: who pays (insurance, government, self-pay) shapes pricing model
- Patient privacy: HIPAA in the US, GDPR in Europe — compliance is not optional
- Provider adoption requires clinical workflow integration and change management
- Health equity considerations are increasingly required by funders and regulators

---

## L6: Manufacturing / Industrial

### Key Metrics

| Metric | Definition | Good Benchmark |
|---|---|---|
| OEE | Overall Equipment Effectiveness | >85% |
| Yield | Good units / Total units produced | >95% |
| Lead Time | Order to delivery | Decreasing trend |
| Inventory Turns | COGS / Average Inventory | Industry-specific |
| OTIF | On Time In Full delivery rate | >95% |
| Capacity Utilization | Actual output / Maximum output | 75–85% |

### Framework Adaptations
- **MECE**: Cost breakdown — materials, direct labor, overhead, quality losses
- **Digital Transformation**: Industry 4.0, IoT sensors, predictive maintenance, digital twin
- **Scenario Planning**: Supply chain disruptions, trade policy shifts, automation waves
- **Competitive**: Make vs. buy, insource vs. outsource are recurring strategic choices

### Industry-Specific Considerations
- Supply chain resilience and geographic diversification post-pandemic
- Sustainability and ESG: Scope 1/2/3 emissions reporting increasingly required
- Automation and workforce transition planning are simultaneous challenges
- Quality management: ISO 9001, lean manufacturing, Six Sigma methodology alignment
- Trade tariffs and import/export regulations materially affect cost structures
- Capital expenditure cycles are long — investment decisions require 5–10 year horizons

---

## L7: Marketplace / Platform

### Key Metrics

| Metric | Definition | Good Benchmark |
|---|---|---|
| GMV | Gross Merchandise Value transacted | Growing |
| Take Rate | Platform revenue / GMV | 10–30% depending on category |
| Liquidity | % of listings that result in transactions | >15% |
| Supply / Demand Ratio | Balance between supply and demand sides | Market-dependent |
| Time to Match | How fast supply meets demand | Decreasing |
| Multi-homing Rate | % of users using competing platforms | Lower is better |

### Framework Adaptations
- **GTM**: Solve the chicken-and-egg problem — decide which side to subsidize and sequence carefully
- **Pricing**: Take rate optimization and payment processing margins are core levers
- **Competitive**: Network effects, multi-homing risk, and disintermediation are the primary threats
- **Scenario Planning**: Platform regulation (gig economy classification, antitrust) is a major uncertainty

### Industry-Specific Considerations
- Network effects: same-side (more sellers attract more sellers) vs. cross-side (more sellers attract more buyers)
- Multi-homing and lock-in: power users often use 2–3 platforms; features that create stickiness are high priority
- Trust and safety: fraud, fake reviews, and bad actors damage marketplace liquidity faster than almost anything
- Regulatory risk: employment classification, platform liability, and antitrust regulation are evolving globally
- Geographic expansion playbook must account for local supply bootstrapping in each new market
- Community management is a product function, not just marketing — platform norms are a competitive moat
