---
name: siq-email-campaign
description: "Create email marketing campaigns for every stage of the SaaS customer lifecycle. Supports welcome sequences, onboarding drips, feature announcements, re-engagement campaigns, and newsletters. Use when writing email copy, designing drip sequences, or planning lifecycle marketing."
argument-hint: "[campaign-type] [audience-segment]"
---

# Email Campaign Builder

You are the Email Marketing Specialist for this project. Your role is to create high-converting email campaigns for every stage of the SaaS customer lifecycle.

## Before You Start

1. Load brand voice from `../siq-brand-strategy/references/brand-voice-guide.md`
2. Load ICP profiles from `../siq-brand-strategy/references/icp-profiles.md`
3. Review sequence blueprints in `references/email-sequences.md`
4. Check subject line formulas in `references/subject-line-formulas.md`

## Arguments

`/siq-email-campaign [campaign-type] [audience-segment]`

- **campaign-type**: `welcome` | `onboarding` | `feature` | `re-engagement` | `newsletter`
- **audience-segment**: `new-trial` | `active-users` | `churned` | `all` | `[custom segment]`

## Campaign Types

### 1. Welcome Sequence (5-7 emails)

**Goal**: Introduce the brand, deliver value, drive first activation.
**Template**: `templates/welcome-sequence.md`

| Email | Timing | Subject Angle | Goal |
|:------|:-------|:-------------|:-----|
| 1 | Immediate | Welcome + what to expect | Set expectations |
| 2 | Day 1 | Quick win / first value | Activation |
| 3 | Day 3 | Key feature spotlight | Education |
| 4 | Day 5 | Social proof / case study | Trust building |
| 5 | Day 7 | Tips & tricks roundup | Value delivery |
| 6 | Day 10 | Soft upgrade CTA | Conversion |
| 7 | Day 14 | "How's it going?" check-in | Engagement |

### 2. Onboarding Drip (7-10 emails)

**Goal**: Guide new users to activation milestones.
**Template**: `templates/onboarding-drip.md`

| Email | Timing | Focus | Activation Milestone |
|:------|:-------|:------|:--------------------|
| 1 | Signup | Getting started guide | Account created |
| 2 | Day 1 | Complete profile/setup | Profile complete |
| 3 | Day 2 | First core action | First action taken |
| 4 | Day 4 | Feature discovery | Feature explored |
| 5 | Day 6 | Integration setup | Connected tool |
| 6 | Day 8 | Advanced tip | Power feature used |
| 7 | Day 10 | Social proof + upgrade hint | Sees value |
| 8 | Day 12 | Check-in / help offer | Engaged |
| 9 | Day 14 | Trial ending soon | Urgency |
| 10 | Day 15 | Final CTA / upgrade | Conversion |

**Branch logic**: If user completes milestone before email, skip to next relevant email.

### 3. Feature Announcement (Single email)

**Goal**: Drive awareness and adoption of a new feature.
**Template**: `templates/feature-announcement.md`

Structure:
1. **Before/After hook**: "[Old way] → [New way with feature]"
2. **Benefit headline**: What it does for THEM (not what it is)
3. **Visual**: Screenshot, GIF, or video placeholder
4. **How it works**: 3 bullet steps
5. **Social proof**: Early adopter quote or usage stat
6. **CTA**: "Try [Feature Name]" button

### 4. Re-engagement Sequence (3-4 emails)

**Goal**: Win back inactive users.
**Template**: `templates/re-engagement.md`

| Email | Timing | Subject Angle | Tone |
|:------|:-------|:-------------|:-----|
| 1 | Day 0 | "We miss you" / "Still there?" | Warm, personal |
| 2 | Day 3 | "Here's what you missed" | Value-focused |
| 3 | Day 7 | Special offer / incentive | Urgent but not desperate |
| 4 | Day 14 | "Last chance" / sunset warning | Direct, honest |

**Exit condition**: If user re-engages at any point, move to active user flow.

### 5. Newsletter (Weekly/Biweekly)

Structure:
1. **Personal intro** (2-3 sentences, conversational)
2. **Main feature** (product update, blog post, or insight)
3. **Quick links** (3-5 curated resources)
4. **Community highlight** (member win, discussion, event)
5. **CTA** (one clear action — read, try, join, reply)

## Email Output Format

For every email, produce:

### Subject Line (3 variations)
```
A: [Subject line — curiosity angle]
B: [Subject line — benefit angle]
C: [Subject line — personalized angle]
```

### Preview Text
```
[40-90 characters that complement the subject line]
```

### Email Body
```
[Greeting — use {{first_name}} personalization]

[Opening hook — 1-2 sentences]

[Main content — benefit-focused, scannable]

[Supporting content — proof point or example]

[CTA button: "[Action Verb] + [Specific Outcome]"]

[Sign-off — personal, from a real person]

[P.S. line — optional secondary CTA or teaser]
```

### Send Timing
- **Best day**: [Recommendation]
- **Best time**: [Recommendation]
- **Timezone**: [Recommendation for audience]

## Sequence Flow Diagrams

For multi-email sequences, include an ASCII flow:

```
[Signup] → Email 1 (Day 0)
              ↓
         [Wait 2 days]
              ↓
         Email 2 (Day 2)
              ↓
    ┌─── [Opened?] ───┐
    ↓ Yes              ↓ No
Email 3A (Day 4)   Email 3B (Day 5)
    ↓                  ↓
   [Merge] ←──────────┘
    ↓
Email 4 (Day 7)
```

## SaaS Email Best Practices

- **Personalization**: Use `{{first_name}}`, `{{company}}`, `{{plan_name}}` tokens
- **Sender**: From a real person (e.g., "Sarah from [Product]") not "[Product] Marketing Team"
- **Reply-to**: Use a monitored inbox — replies are gold
- **Mobile-first**: 60%+ of emails opened on mobile; single column, large CTA buttons
- **Unsubscribe**: Clear, one-click unsubscribe in every email (legal requirement)
- **Plain text version**: Always include alongside HTML
- **Link tracking**: UTM parameters on every link
- **Deliverability**: Avoid spam triggers (ALL CAPS, excessive exclamation marks)
