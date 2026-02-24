# Launch Playbook

## Launch Tiers

Not every release deserves the same effort. Use this framework to calibrate scope.

| Tier | Criteria | Channels | Lead Time | Owner |
|:-----|:---------|:---------|:----------|:------|
| **Tier 1 — Major** | New product, major feature, pricing change, rebrand | All channels + PR + Product Hunt | 4-6 weeks | Marketing Lead + CEO |
| **Tier 2 — Medium** | Significant feature, integration, platform expansion | Email + Social + Community + Blog | 2-3 weeks | Marketing |
| **Tier 3 — Minor** | Bug fixes, small improvements, UX changes | Changelog + Community (optional) | 1 week | Product |

---

## Pre-Launch Preparation

### T-14: Strategy Lock
- Launch brief finalized and approved
- Tier determined
- Success metrics defined
- Channel owners assigned
- Launch date confirmed (no moving it after this point without executive approval)

### T-10: Content Creation Starts
- Blog post brief sent to writer
- Email copy drafted
- Social post briefs created
- Community teasers planned
- Ad copy drafted (if Tier 1/2)

### T-7: Asset Production
- Blog post in review
- Email built in ESP (send test to full team)
- Social graphics/videos in production
- All copy reviewed for brand voice consistency

### T-5: Final Review
- All assets approved
- Landing page / feature page live (or staged)
- Support team briefed — they need to know before customers
- Analytics tracking verified (UTM builder, event tracking)
- Rollback plan documented (for technical changes)

### T-3: Scheduling & Staging
- Social posts scheduled in tool
- Email campaigns scheduled (or ready to send manually)
- Community announcements drafted and ready to post
- Ads configured but paused (activate on launch day)
- All team members notified of launch day plan

### T-1: Final Checks
- Re-test all links, CTAs, and landing pages
- Confirm tracking is firing correctly
- Slack/Discord announcement with team: "We launch tomorrow at [time]"
- Confirm everyone knows their launch day responsibilities

---

## Launch Day Protocol

### The First Hour
Everything happens in the first hour. Sequence matters — email and blog go first because they drive everything else.

1. **8:00 AM**: Blog post goes live
2. **8:15 AM**: Email sends (immediately after blog, so email links are live)
3. **8:30 AM**: LinkedIn post published
4. **9:00 AM**: X/Twitter thread published
5. **9:30 AM**: Instagram carousel + stories
6. **10:00 AM**: Community announcements (Discord + Slack)
7. **12:00 PM**: Ads activate (after organic reaches critical mass)

### All-Day Responsibilities
- **Community**: Monitor Discord/Slack for questions, bugs, feedback — respond within 1 hour
- **Social**: Reply to comments and mentions within 2 hours
- **Support**: Triage any influx of support tickets related to the launch
- **Product**: Available for escalations if something breaks

### Launch Day Metrics Check (end of day)
- Email open rate / CTR (vs benchmark)
- Social reach and engagement (vs average post)
- Trial signups or feature activations
- Community sentiment (positive / neutral / negative)
- Any bugs or support tickets to address

---

## Post-Launch

### T+1 to T+3: Amplification
- Share early reactions and social highlights
- Re-engage email non-openers with different subject line
- Collect structured feedback from community (pin a feedback thread)
- Reply to all social comments

### T+5 to T+7: Follow-Through
- Publish customer story or use case if available
- Share usage metrics milestone ("1,000 teams activated this feature in 48 hours")
- Send onboarding tips email for new feature adopters
- Update comparison pages and competitor battlecards

### T+14: Post-Mortem
- Run `/siq-metrics-report campaign` to generate the post-mortem
- Document what worked, what didn't, key learnings
- Update this playbook with anything that should change for next time

---

## Product Hunt Launch (Tier 1 Only)

Product Hunt launches require a separate 2-week runup:

### Ship Page Requirements
- Tagline: [Under 60 chars, benefit-focused]
- Description: [2-3 paragraphs, tell the story]
- Images: [5 screenshots or feature graphics, 1270x760px]
- Maker comment: [Long, authentic, tells the founding story — write the night before]

### Hunter & Support Plan
- Identify and brief hunter 2 weeks before
- Build a support list of customers/friends who'll upvote (genuine supporters only)
- Post the Ship page "coming soon" to collect early subscribers
- Draft social + email rallying content for launch day

### PH Day Schedule (12:01 AM PST is ideal)
- Maker comment posted within first 5 minutes
- Team upvotes immediately
- Social posts go out at 8 AM PST (when more people are active)
- Community rallying message in Discord/Slack

---

## Changelog Entry Template

```markdown
## [Feature/Update Name] — [Date]

[One-liner: what this is in plain English]

### What's new
- [Bullet 1 — specific change]
- [Bullet 2]
- [Bullet 3]

### Why we built this
[1-2 sentences on the problem this solves — from the user's perspective]

### How to use it
[2-3 steps, or link to docs]

[Optional: screenshot or GIF]
```

---

## In-App Announcement Template

| Element | Content | Limit |
|:--------|:--------|:------|
| Headline | [Benefit-focused, action-oriented] | 50 chars |
| Body | [What it does + how to try it] | 150 chars |
| CTA button | [Try it / See what's new / Learn more] | 20 chars |
| Target | [All users / Plan-specific / Feature-specific] | — |
| Display rule | [Show once / Until dismissed / X days] | — |
