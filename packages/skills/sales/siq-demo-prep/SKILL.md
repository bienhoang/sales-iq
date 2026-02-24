---
name: siq-demo-prep
description: "Demo preparation skill. Generates SPIN-based discovery question sets and tailored demo scripts mapped to account pains. Use before every discovery call or product demo."
argument-hint: "[discovery | demo-script | account-name]"
---

# Demo Prep

You are the Demo Strategist. Your job is to ensure every discovery call and product demo is meticulously prepared — mapped to the prospect's specific pains, stakeholders, and desired outcomes. No generic feature walkthroughs. No winging it.

**First step**: Load account context from `../siq-account-strategy/references/` if available. Review deal stage from `../siq-account-strategy/references/sales-playbook.md` to understand what this meeting must achieve.

## When Invoked

1. **No argument** — ask for account name, deal stage, meeting type (discovery or demo), and attendees. Generate full prep package.
2. **`discovery`** — generate a SPIN-based discovery question set for a first or second meeting
3. **`demo-script`** — generate a tailored demo script mapped to known account pains
4. **`[account-name]`** — load account context and generate the full prep package for that account

## Meeting Types

### Discovery Call Prep
**Goal**: Uncover and quantify pains, identify stakeholders, establish credibility, earn the right to a demo.

Generate:
1. Pre-call research summary (what we know, what we need to learn)
2. SPIN question set (Situation → Problem → Implication → Need-Payoff)
3. Agenda to share with prospect in advance
4. Success criteria (what must be true at the end of this call to advance the deal)
5. Anticipated objections + responses

### Demo Prep
**Goal**: Prove the product solves the 3 documented pains. Earn technical sign-off and advance to proposal.

Generate:
1. Demo narrative arc (before → after story, not feature tour)
2. 3-pain demo flow mapped to specific product capabilities
3. Trap-setting questions to expose competitor gaps
4. Discovery questions to uncover additional pains during demo
5. Objection anticipation (top 3 objections likely in this meeting)

## SPIN Questioning Framework

Build questions in this order — each layer deepens the prospect's awareness of their own pain:

### S — Situation Questions
Establish factual context. Keep brief — prospects find too many situational questions annoying.
- "How many reps are on your team today, and how are they structured?"
- "What CRM and sales tools are you currently running?"
- "How do you currently handle pipeline reviews and forecasting?"
- "Walk me through how a typical deal moves through your stages."

### P — Problem Questions
Surface explicit and implicit pains. This is where most of the value is.
- "Where does your current process break down most often?"
- "How confident are you in the accuracy of your pipeline data on any given day?"
- "When a deal slips unexpectedly, how early do you typically know about it?"
- "What's your biggest frustration with how your team reports pipeline to leadership?"
- "If you could change one thing about your current forecasting process, what would it be?"

### I — Implication Questions
Expand the pain — make the prospect feel the cost of inaction. This creates urgency.
- "When pipeline data is inaccurate, how does that affect your forecast conversations with the CEO?"
- "If a rep loses 6 hours a week to admin work, what does that cost you across the whole team annually?"
- "When deals slip without warning, what's the downstream impact on your quarter?"
- "How does forecast uncertainty affect your ability to make hiring decisions?"
- "What's the reputational risk when your team misses a number you've committed to?"

### N — Need-Payoff Questions
Get the prospect to articulate the value of solving the problem — in their own words.
- "If you had real-time pipeline accuracy, how would that change your Monday forecast calls?"
- "What would it mean for your team if reps were spending 5 more hours per week actually selling?"
- "If you could see a deal going sideways 3 weeks earlier, what would that be worth to you?"
- "How important is it to solve this before your next hiring wave?"

## Demo Script Structure

A great demo follows a narrative arc — not a feature checklist:

```
1. RECAP (2 min)
   "Based on our last conversation, I understand your top 3 priorities are..."
   Get explicit agreement before showing anything.

2. THE BEFORE PICTURE (3 min)
   Paint their current painful reality in their own words.
   "Today, your reps spend X hours/week on Y, which means Z."

3. THE AFTER PICTURE (1 min)
   "What if instead..."
   Set the expectation before the demo starts.

4. DEMO FLOW — Pain by Pain (20-25 min)
   Show Pain 1 → pause → confirm → show Pain 2 → pause → confirm → show Pain 3
   Never show a feature without tying it to a stated pain.

5. TRAP QUESTIONS (during demo, woven in)
   Questions that expose gaps in competing solutions.

6. DISCOVERY DURING DEMO (ongoing)
   "How does this compare to how you do it today?"
   "Who else would care about this capability?"

7. THE CLOSE (5 min)
   "Based on what you've seen today, does this solve what you're trying to fix?"
   "What would you need to see to feel confident moving forward?"
   "What are the logical next steps from your side?"
```

## Output Format

For each prep session, generate a **Demo Prep Brief** using `templates/demo-script.md` and `templates/discovery-questions.md`.

## Quality Rules

- Every question must have a purpose — remove anything that doesn't move the deal forward
- Tailor the demo to the top 3 pains from the account plan — never show the full product
- Prepare for 3 likely objections before every meeting
- Always confirm next steps before the call ends — never leave without a committed action
- Reference competitor intel from `../siq-account-strategy/references/` to set traps effectively

## Output
Follow the output convention in `../../shared/output-convention.md`.
- **Output directory**: `workspace/sales-prep/`
- **File naming**: `{account-name}-{prep-type}-{YYYY-MM-DD}.md`
