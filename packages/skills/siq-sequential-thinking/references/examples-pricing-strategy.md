# Example: Pricing Strategy Design with Sequential Thinking

**Problem**: Design pricing strategy for SaaS product launch targeting B2B mid-market.

## Without Sequential Thinking
"Use tiered pricing. Three plans: Starter, Pro, Enterprise. Charge per seat."
(Misses ICP fit, unit economics, competitive positioning)

## With Sequential Thinking

```
Thought 1/5: Market and competitive analysis

Market context:
- Competitors: 4 direct, pricing $49-$299/month
- Most use seat-based tiered pricing
- One outlier uses usage-based (API calls)

ICP signals: Mid-market ops teams (10-200 seats), budget-conscious, value predictability.
Uncertainty: What pricing model fits ICP decision-making process?
Next: Evaluate pricing model options

Thought 2/6: Pricing model evaluation (adjusted)

Comparing models:
- Freemium: High acquisition, low conversion for B2B mid-market
- Flat-rate: Simple, but undercharges large teams
- Seat-based tiered: Predictable, maps to org growth
- Usage-based: Aligns value, but unpredictable bills scare ops buyers

Mid-market buyers need predictable budgets for annual approvals.
Usage-based creates friction in procurement.
Next: Model unit economics

Thought 3/6: Unit economics

CAC (blended): ~$1,200
Target LTV:CAC ratio: 3:1 minimum, 5:1 ideal
Required LTV: $3,600–$6,000
Avg contract length: 18 months (industry benchmark)

Required MRR per customer: $200–$333/month
Seat target: 15–30 seats per account
Per-seat price: $12–$20 to hit LTV targets at expected seat counts.

Next: Validate model fit with ICP

Thought 4/6 [REVISION of Thought 2]: Usage-based eliminated

Original candidate: Usage-based as differentiation play.
Issue discovered: ICP (ops buyers, 50–200 person companies) goes through annual
budget cycles. Finance teams reject tools with variable cost unpredictability.
Sales calls confirm: "we can't get budget approval without a fixed number."

Corrected approach:
- Eliminate usage-based from consideration
- Stick to seat-based tiered (maps to budget approval process)
- Add annual commitment discount to lock in LTV

Impact: Simplifies pricing page, accelerates procurement cycle

Thought 5/7: Tier structure design (adjusted)

Three tiers targeting distinct buyer segments:

Starter ($15/seat/mo, min 5 seats):
- Core workflow features
- Email support
- Up to 10 seats (natural ceiling before upgrade)

Growth ($22/seat/mo, min 10 seats):
- Advanced analytics, integrations, priority support
- 10–50 seats (sweet spot for target ICP)

Enterprise (custom, 50+ seats):
- SSO, SLA, dedicated CSM, custom contracts
- Removes ceiling, enables expansion revenue

Anchoring: Growth is hero tier — positioned center with "Most Popular" badge.
Next: Pricing page strategy

Thought 6/7: Pricing page messaging and anchoring

Anchoring strategy:
- Lead with annual pricing (shows lower monthly equivalent)
- Monthly toggle available but de-emphasized
- Enterprise column creates upward anchor for Growth perception

Value messaging per tier:
- Starter: "Get your team running" (activation)
- Growth: "Scale without complexity" (efficiency ROI)
- Enterprise: "Built for your security and compliance needs" (risk reduction)

Discount levers:
- Annual: 20% off (drives committed ARR)
- Launch: 30% first 3 months (lowers trial barrier without permanent discount)
- Not-for-profit: 40% (goodwill + case studies)

Thought 7/7 [FINAL]: Recommended pricing with launch strategy

Pricing structure:
- Starter: $15/seat/mo (billed monthly) / $12/seat/mo (billed annually)
- Growth: $22/seat/mo (billed monthly) / $18/seat/mo (billed annually)
- Enterprise: Custom (floor $2,000/mo for 50+ seats)

Launch offer: 30% off first 3 months on Growth annual — creates urgency
without permanently devaluing the tier. Auto-expires at 90 days post-launch.

Confidence: High
Assumptions: ICP confirmed through 12 sales discovery calls; annual deal cycle validated
Trade-offs: Leaves money on table for high-usage small teams vs pricing simplicity
```

## Key Outcomes

1. **Revision caught ICP mismatch**: Usage-based model eliminated after validating buyer psychology
2. **Dynamic adjustment**: 5→7 thoughts as unit economics added complexity
3. **Comprehensive**: Model selection, unit economics, tier design, messaging, launch tactics
