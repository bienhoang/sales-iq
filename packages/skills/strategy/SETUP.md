# Strategy Skills Cluster — SETUP.md

Cluster location: `packages/skills/strategy/`

---

## Skills in this Cluster

| Skill Directory | Name | Purpose |
|---|---|---|
| `siq-strategy-consultant/` | `siq-strategy-consultant` | 10-framework strategic consulting for SaaS/dev-tools companies |

---

## Skill: siq-strategy-consultant

A monolithic skill with internal framework routing. One skill entry point dispatches
across 10 consulting frameworks based on the problem type described by the user.

### File Structure

```
siq-strategy-consultant/
├── SKILL.md                          # Entry point: framework dispatch + 10 summaries
└── references/
    ├── FRAMEWORKS.md                 # Deep methodology per framework (F1–F10)
    ├── DELIVERABLE-TEMPLATES.md      # 9 structured output templates
    └── INDUSTRY-LENSES.md            # 7 industry-specific adaptations
```

### Loading Protocol

1. **Always load `SKILL.md` first** — contains framework dispatch table and core principles
2. **Load reference files on demand**:
   - `FRAMEWORKS.md` — when deeper methodology is needed for a specific framework
   - `DELIVERABLE-TEMPLATES.md` — when producing a formal deliverable (executive summary, business case, battlecard, etc.)
   - `INDUSTRY-LENSES.md` — when the user specifies an industry context

Loading all files upfront wastes context. Load only what the current task requires.

### Activation

Invoke by referencing the skill name in your agent or CLAUDE.md:

```
Use the siq-strategy-consultant skill to analyze [problem].
```

Or load SKILL.md directly in a session:

```
Read packages/skills/strategy/siq-strategy-consultant/SKILL.md
```

---

## Framework Quick Reference

| # | Framework | Trigger Keywords |
|---|---|---|
| F1 | MECE Problem Decomposition | "break down", "root cause", "issue tree", "why is X happening" |
| F2 | Scenario Planning | "future", "uncertainty", "what if", "strategic bets", "foresight" |
| F3 | Go-To-Market Strategy | "launch", "market entry", "GTM", "rollout", "distribution" |
| F4 | Personas & Jobs-to-be-Done | "customer", "persona", "ICP", "buyer", "who are we targeting" |
| F5 | Pricing Strategy | "pricing", "packaging", "tiers", "willingness to pay", "monetization" |
| F6 | Value Proposition Design | "messaging", "positioning", "value prop", "differentiation", "elevator pitch" |
| F7 | Post-Mortem & Retrospective | "what went wrong", "failure", "missed target", "lessons learned", "retrospective" |
| F8 | Partnership & Alliance Strategy | "partnership", "alliance", "JV", "M&A", "channel partner", "BD" |
| F9 | Competitive Strategy & Positioning | "competition", "competitors", "landscape", "positioning", "Porter", "moat" |
| F10 | Digital Transformation | "digital", "modernization", "roadmap", "technology strategy", "maturity" |

---

## Adding New Skills to this Cluster

1. Create a new directory under `packages/skills/strategy/` with the `siq-` prefix
2. Add `SKILL.md` with valid YAML frontmatter (`name: siq-<skill-name>`)
3. Keep `SKILL.md` under 200 lines — move deep content to a `references/` subdirectory
4. Update this SETUP.md: add a row to the skills table and document the loading protocol
5. Follow the YAGNI / KISS / DRY principles — no placeholder content

---

## Design Decisions

- **Monolithic (not hub-and-spoke)**: A single `siq-strategy-consultant` skill routes across
  all 10 frameworks internally. This avoids the overhead of loading multiple skills for a
  single consulting engagement and keeps context management simple.

- **Reference file separation**: Core SKILL.md stays under 200 lines by deferring detailed
  methodology, templates, and industry lenses to satellite reference files loaded on demand.

- **Generic for any SaaS/dev-tools company**: All branding and company-specific references
  removed. Industry-specific adaptations live in INDUSTRY-LENSES.md and are applied only
  when the user specifies an industry context.

- **siq- prefix convention**: All skills in the sales-iq monorepo use the `siq-` prefix to
  avoid naming collisions when skills are composed or referenced across packages.
