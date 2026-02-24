# Sales Skills

## Skills Reference

| Skill | Command | Purpose |
|-------|---------|---------|
| Account Strategy | `/siq-account-strategy` | Hub: ICP, sales motion, objection map |
| Demo Prep | `/siq-demo-prep` | Demo script and discovery questions |
| Follow-Up | `/siq-follow-up` | Post-meeting follow-up emails |
| Lead Qualification | `/siq-lead-qualification` | BANT/MEDDIC qualification notes |
| Objection Handling | `/siq-objection-handling` | Objection response playbook |
| Outreach Sequence | `/siq-outreach-sequence` | Cold outreach email sequences (3–5 touch) |
| Pipeline Report | `/siq-pipeline-report` | Pipeline health narrative for managers |
| Proposal Generator | `/siq-proposal-generator` | Proposal and SOW drafts |

## Hub-and-Spoke Architecture

`/siq-account-strategy` is the hub. It produces an account strategy brief covering:

- Ideal Customer Profile with qualification criteria
- Sales motion (PLG, inbound, outbound, enterprise)
- Objection map with responses
- Competitive positioning for sales conversations
- Discovery question framework

All other sales skills load context from `~/.claude/skills/shared/brand.md` and the account strategy output. Run `/siq-account-strategy` before starting outreach or deal work on a new segment.

## Sales Cycle Flow

```
Prospecting          Qualification        Discovery
/siq-outreach-sequence → /siq-lead-qualification → /siq-demo-prep
                                                         ↓
Close                Proposal             Objections
/siq-pipeline-report ← /siq-proposal-generator ← /siq-objection-handling
        ↑
/siq-follow-up (after every meeting)
```

## Example Workflow

**Goal:** Open a new enterprise segment.

```
# Step 1: Define account strategy for the segment
/siq-account-strategy segment: "Series B SaaS companies", motion: outbound, ACV: 24k

# Step 2: Build cold outreach sequence
/siq-outreach-sequence persona: "VP of Sales", pain: "manual pipeline reviews", touches: 4

# Step 3: Qualify an inbound lead
/siq-lead-qualification company: "Acme Corp", contacts: [{title: "CRO", budget: "approved"}], framework: MEDDIC

# Step 4: Prep for discovery call
/siq-demo-prep account: "Acme Corp", stage: discovery, known-pain: "no pipeline visibility"

# Step 5: Handle objections in a deal
/siq-objection-handling objection: "we already use Salesforce dashboards", stage: negotiation

# Step 6: Draft proposal
/siq-proposal-generator account: "Acme Corp", deal-size: 28000, term: annual, seats: 15
```
