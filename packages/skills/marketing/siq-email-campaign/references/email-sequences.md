# Email Sequence Blueprints

## Sequence Architecture Principles

1. **Every email must stand alone** — some subscribers will miss earlier emails
2. **One CTA per email** — don't split attention
3. **Respect the relationship stage** — don't pitch hard to day-1 subscribers
4. **Behaviorally triggered > time-based** — act on what users do, not just when they signed up
5. **Plain text performs** — conversational emails often outperform designed ones

---

## Blueprint 1: Welcome Sequence (7 emails, 14 days)

**Trigger**: User signs up / creates account

```
Day 0  → Email 1: Welcome + orientation (immediate)
Day 1  → Email 2: Your first quick win
Day 3  → Email 3: Feature spotlight
Day 5  → Email 4: Customer success story
Day 7  → Email 5: Tips + tricks roundup
Day 10 → Email 6: Soft upgrade nudge
Day 14 → Email 7: Check-in + next steps
```

**Branch**: If user upgrades at any point → exit welcome sequence, enter paid onboarding

---

## Blueprint 2: Trial Onboarding Drip (10 emails, 15 days)

**Trigger**: Trial account created

```
Day 0  → Email 1: Welcome + setup guide
Day 1  → Email 2: Complete your profile (milestone: profile 100%)
Day 2  → Email 3: Do your first [core action] (milestone: first value)
Day 4  → Email 4: Explore [key feature] (milestone: feature discovery)
Day 6  → Email 5: Connect [key integration] (milestone: integration)
Day 8  → Email 6: Power tip: [advanced feature]
Day 10 → Email 7: See what [similar customers] achieved
Day 12 → Email 8: Need help? Here's how to reach us
Day 14 → Email 9: Your trial ends in 1 day
Day 15 → Email 10: Trial ended — here's how to continue
```

**Skip logic**: User completes milestone → skip that milestone email, advance to next

---

## Blueprint 3: Feature Announcement (1-2 emails)

**Trigger**: New feature shipped

```
Day 0  → Email 1: Feature announcement (benefit-led, not feature-led)
Day 3  → Email 2 (optional): Tutorial / "how to use it" follow-up
```

**Segment**: Send to active users first, then dormant users with re-engagement angle

---

## Blueprint 4: Re-engagement (4 emails, 14 days)

**Trigger**: User inactive for 30+ days

```
Day 0  → Email 1: "We miss you" — warm, personal, low-pressure
Day 3  → Email 2: "Here's what's new" — value catch-up
Day 7  → Email 3: Special offer or extended trial
Day 14 → Email 4: "Is this goodbye?" — last chance, honest
```

**Exit**: User opens + clicks → move to re-activated flow
**Sunset**: No engagement after Email 4 → remove from active list

---

## Blueprint 5: Churn Recovery (3 emails, 7 days)

**Trigger**: Subscription cancelled

```
Day 0  → Email 1: Acknowledge cancellation + ask why (survey link)
Day 3  → Email 2: Address top cancellation reason (if known from survey)
Day 7  → Email 3: Win-back offer (discount, extended trial, feature unlock)
```

**Note**: Keep this sequence short — churned users have a reason. Respect their decision.

---

## Deliverability Checklist

Before launching any sequence:
- [ ] SPF, DKIM, DMARC configured for sending domain
- [ ] Warm up new sending domain (start with small segments)
- [ ] Suppression list loaded (hard bounces, unsubscribes, complaints)
- [ ] Unsubscribe link in every email
- [ ] CAN-SPAM / GDPR compliant (physical address, consent documented)
- [ ] Preview text set (not auto-pulled from first line)
- [ ] Tested across email clients (Gmail, Outlook, Apple Mail, mobile)
- [ ] Plain text version included
- [ ] All links tracked with UTM parameters
- [ ] Send from a real person's email address (not noreply@)
