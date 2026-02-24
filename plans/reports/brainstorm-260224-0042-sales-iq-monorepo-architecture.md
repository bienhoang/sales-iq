# Brainstorm: sales-iq Monorepo Architecture

**Date**: 2026-02-24
**Status**: Agreed
**Scope**: Full platform — Claude Code Skills + MCP Server + CLI + Docs
**Target**: Public npm package, generic toolkit focused on SaaS/dev tools

---

## Problem Statement

Build a monorepo for sales/marketing AI toolkit that combines:
- Claude Code skills (markdown-based, no build) organized by domain clusters
- MCP server (TypeScript) for external integrations (CRM, email, social, analytics)
- CLI tool for installation/management
- Documentation site

**Key constraint**: Must be publishable to npm for community use while remaining practical for personal/client use.

---

## Reference Analysis

### Ref 1: Go-snap-marketing-2026 — Marketing Skills Suite
- **Pattern**: 11 small specialized skills, hub-and-spoke with `brand-strategy` as hub
- **Structure per skill**: `SKILL.md` (behavior) + `templates/` (output scaffolding) + `references/` (domain knowledge)
- **Orchestrator**: `product-launch` chains other skills via slash commands
- **Output quality**: Immediately publishable, platform-native formatting
- **Key insight**: Separates behavior (SKILL.md) from content (templates) from knowledge (references)

### Ref 2: Sales-leader-consultant — Strategy Consultant
- **Pattern**: 1 large monolithic skill + 3 reference satellites
- **10 frameworks** (F1-F10) with role-process-output triples
- **CLAUDE.md as dispatch table**: Routes problems → frameworks → framework chains
- **Multi-document corpus output**: 00-07, cross-referenced
- **Key insight**: Domain-generalized skill works better for strategy/analysis vs. many small skills for content creation

### Architectural Takeaway
- **Content creation domains** (marketing, sales) → many small specialized skills + hub
- **Analysis/strategy domains** → monolithic skill with internal routing
- Both patterns coexist well in a domain-cluster architecture

---

## Agreed Architecture

### Monorepo Structure

```
sales-iq/
├── packages/
│   ├── skills/                         # Claude Code skills (markdown, no build)
│   │   ├── marketing/                  # Marketing domain cluster (~11 skills)
│   │   │   ├── brand-strategy/         # HUB — shared brand context
│   │   │   │   ├── SKILL.md
│   │   │   │   ├── templates/
│   │   │   │   │   └── positioning-canvas.md
│   │   │   │   └── references/
│   │   │   │       ├── brand-voice-guide.md
│   │   │   │       ├── icp-profiles.md
│   │   │   │       └── messaging-matrix.md
│   │   │   ├── ad-copy/
│   │   │   │   ├── SKILL.md
│   │   │   │   └── templates/
│   │   │   │       ├── google-ad.md
│   │   │   │       ├── linkedin-ad.md
│   │   │   │       └── meta-ad.md
│   │   │   ├── email-campaign/
│   │   │   │   ├── SKILL.md
│   │   │   │   ├── templates/
│   │   │   │   └── references/
│   │   │   ├── seo-content/
│   │   │   ├── social-media-post/
│   │   │   ├── social-media-calendar/
│   │   │   ├── content-repurpose/
│   │   │   ├── community-engagement/
│   │   │   ├── metrics-report/
│   │   │   ├── product-launch/         # ORCHESTRATOR — chains other skills
│   │   │   └── SETUP.md
│   │   │
│   │   ├── sales/                      # Sales domain cluster (~8 skills)
│   │   │   ├── account-strategy/       # HUB — account/deal context
│   │   │   │   ├── SKILL.md
│   │   │   │   ├── templates/
│   │   │   │   └── references/
│   │   │   │       ├── sales-playbook.md
│   │   │   │       ├── qualification-criteria.md
│   │   │   │       └── pricing-tiers.md
│   │   │   ├── lead-qualification/
│   │   │   ├── outreach-sequence/
│   │   │   ├── demo-prep/
│   │   │   ├── proposal-generator/
│   │   │   ├── objection-handling/
│   │   │   ├── follow-up/
│   │   │   ├── pipeline-report/
│   │   │   └── SETUP.md
│   │   │
│   │   ├── strategy/                   # Strategy domain cluster (monolithic)
│   │   │   ├── strategy-consultant/    # 10 frameworks, routes internally
│   │   │   │   ├── SKILL.md
│   │   │   │   └── references/
│   │   │   │       ├── FRAMEWORKS.md
│   │   │   │       ├── DELIVERABLE-TEMPLATES.md
│   │   │   │       └── INDUSTRY-LENSES.md
│   │   │   └── SETUP.md
│   │   │
│   │   └── shared/                     # Cross-domain shared context
│   │       ├── brand-context.md        # Current brand/product (loaded by all hubs)
│   │       ├── icp-profiles.md         # Ideal Customer Profiles
│   │       └── saas-benchmarks.md      # SaaS industry defaults
│   │
│   ├── mcp-server/                     # MCP server (TypeScript, buildable)
│   │   ├── src/
│   │   │   ├── index.ts                # Server entry + registration
│   │   │   ├── config.ts               # API keys, connection config
│   │   │   ├── tools/                  # MCP Tools (actions)
│   │   │   │   ├── crm/
│   │   │   │   │   ├── hubspot.ts
│   │   │   │   │   └── pipedrive.ts
│   │   │   │   ├── email/
│   │   │   │   │   ├── resend.ts
│   │   │   │   │   └── mailchimp.ts
│   │   │   │   ├── social/
│   │   │   │   │   ├── linkedin.ts
│   │   │   │   │   └── twitter.ts
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── google-analytics.ts
│   │   │   │   │   └── seo-tools.ts
│   │   │   │   ├── lead-scoring/
│   │   │   │   │   └── scorer.ts
│   │   │   │   └── content-calendar/
│   │   │   │       └── calendar.ts
│   │   │   ├── resources/              # MCP Resources (read-only context)
│   │   │   │   ├── pipeline.ts
│   │   │   │   ├── campaigns.ts
│   │   │   │   └── contacts.ts
│   │   │   └── prompts/                # MCP Prompts (orchestration templates)
│   │   │       ├── campaign-launch.ts
│   │   │       └── lead-nurture.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── core/                           # Shared types & data models
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── lead.ts
│   │   │   │   ├── campaign.ts
│   │   │   │   ├── contact.ts
│   │   │   │   └── deal.ts
│   │   │   └── utils/
│   │   │       └── formatters.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── cli/                            # CLI for skill management
│       ├── src/
│       │   ├── index.ts                # Entry point
│       │   ├── commands/
│       │   │   ├── install.ts          # Install skills to .claude/skills/
│       │   │   ├── configure.ts        # Setup brand context, API keys
│       │   │   ├── update.ts           # Update skills from npm
│       │   │   └── list.ts             # List installed skills
│       │   └── utils/
│       │       └── file-ops.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                               # Documentation (Mintlify or similar)
│   ├── getting-started.md
│   ├── skills/
│   │   ├── marketing.md
│   │   ├── sales.md
│   │   └── strategy.md
│   ├── mcp-server/
│   │   └── configuration.md
│   └── api-reference/
│
├── .ref/                               # Reference materials (gitignored)
│   ├── Go-snap-marketing-2026/
│   └── Sales-leader-consultant/
│
├── turbo.json                          # Turborepo config
├── pnpm-workspace.yaml                 # Workspace config
├── package.json                        # Root package.json
├── .gitignore
├── LICENSE
└── README.md
```

### Package Details

| Package | Name | Build | Publish |
|---|---|---|---|
| `packages/skills` | `@sales-iq/skills` | None (markdown copy) | npm (files only) |
| `packages/mcp-server` | `@sales-iq/mcp-server` | TypeScript → JS | npm + binary |
| `packages/core` | `@sales-iq/core` | TypeScript → JS | npm |
| `packages/cli` | `sales-iq` | TypeScript → JS | npm (global CLI) |

### Skills ↔ MCP Interaction Model

```
┌─────────────────────────────────────────────────────┐
│                  Claude Code Session                 │
│                                                      │
│  User: "/lead-qualification Acme Corp"               │
│         │                                            │
│         ▼                                            │
│  ┌─────────────────┐     ┌────────────────────┐     │
│  │  lead-qual skill │     │ MCP: crm/hubspot   │     │
│  │  (SKILL.md)      │────>│ get_contact("Acme")│     │
│  │                  │     │ get_deals("Acme")  │     │
│  │  Loads:          │     └────────┬───────────┘     │
│  │  - account hub   │              │ CRM data        │
│  │  - shared ICP    │              ▼                  │
│  │  - qual criteria │     ┌────────────────────┐     │
│  └────────┬─────────┘     │ Qualification      │     │
│           │               │ Analysis Output    │     │
│           │ generates     │ (BANT score, next  │     │
│           ▼               │  steps, risk flags)│     │
│  ┌─────────────────┐     └────────┬───────────┘     │
│  │ Output: qual     │              │                  │
│  │ report.md        │              │ update           │
│  └──────────────────┘     ┌────────▼───────────┐     │
│                           │ MCP: crm/hubspot   │     │
│                           │ update_deal_stage() │     │
│                           └────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

### Domain Cluster Design Pattern

Each cluster follows consistent patterns learned from refs:

**Marketing cluster** (from Go-snap ref):
- Hub: `brand-strategy` — generates and stores brand context in `references/`
- All skills load `../brand-strategy/references/` first
- Orchestrator: `product-launch` chains skills via slash commands
- Each skill: SKILL.md (behavior) + templates/ (scaffolding) + references/ (knowledge)

**Sales cluster** (new, modeled on marketing pattern):
- Hub: `account-strategy` — stores account/deal context
- All skills load `../account-strategy/references/` first
- Orchestrator: `deal-cycle` chains skills through sales funnel stages
- Same structure pattern as marketing skills

**Strategy cluster** (from Sales-leader ref):
- Monolithic: single `strategy-consultant` skill with 10 internal frameworks
- CLAUDE.md-level dispatch table routes problems → framework chains
- On-demand reference loading (FRAMEWORKS.md, DELIVERABLE-TEMPLATES.md, INDUSTRY-LENSES.md)
- Multi-document corpus output (00-NN series)

**Shared context** (`shared/`):
- `brand-context.md` — loaded by all hub skills as base context
- `icp-profiles.md` — customer profiles shared across marketing + sales
- `saas-benchmarks.md` — industry defaults for metrics, pricing, etc.

### CLI Install Flow

```bash
# Install skills to current project
npx sales-iq install --skills marketing sales strategy
# → copies skill folders to .claude/skills/

# Configure MCP server
npx sales-iq configure --mcp
# → adds to .claude/settings.json: mcpServers.sales-iq

# Setup brand context
npx sales-iq configure --brand
# → interactive prompts → writes shared/brand-context.md

# Update skills
npx sales-iq update
# → pulls latest from npm, overwrites skill files
```

### MCP Server Configuration

Users add to Claude Code or Claude Desktop:
```json
{
  "mcpServers": {
    "sales-iq": {
      "command": "npx",
      "args": ["@sales-iq/mcp-server"],
      "env": {
        "HUBSPOT_API_KEY": "...",
        "RESEND_API_KEY": "...",
        "LINKEDIN_ACCESS_TOKEN": "..."
      }
    }
  }
}
```

### AI Model Choice

All AI-powered features use **Claude API** (Anthropic SDK) — no Gemini or other providers.
- MCP server internal AI calls → Claude via Anthropic SDK
- Lead scoring engine → Claude-based analysis
- Content generation → Claude Code skills (native)

---

## Implementation Considerations

### Phase 1 — Foundation (MVP)
1. Init Turborepo + pnpm workspaces
2. Port marketing skills from Go-snap ref (adapt for generic SaaS)
3. Port strategy-consultant skill from Sales-leader ref
4. Build CLI with `install` command
5. Basic README + docs

### Phase 2 — Sales Skills
1. Design sales cluster skills (lead-qual, outreach, demo-prep, etc.)
2. Build account-strategy hub
3. Create sales-specific templates and references

### Phase 3 — MCP Server
1. MCP server scaffolding with MCP SDK
2. CRM integration (HubSpot first)
3. Email integration (Resend first)
4. Resource providers (pipeline, contacts)

### Phase 4 — Full Suite
1. Social media integrations
2. Analytics integrations
3. Lead scoring engine
4. Content calendar management
5. MCP Prompts for orchestration

### Phase 5 — Polish & Publish
1. Documentation site
2. npm publish pipeline
3. CI/CD (GitHub Actions)
4. Community examples

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Skills bloat (too many) | Hard to maintain | Start with 5-6 per cluster, add based on demand |
| MCP API key management | Security | env vars only, never committed, CLI guides setup |
| Cross-cluster dependencies | Complexity | Shared context in `shared/`, no direct skill-to-skill imports |
| Turborepo overhead for markdown | Unnecessary complexity | Skills package has no build step, just copy task |
| npm publish of markdown | Unusual pattern | Use `files` field in package.json, test install flow early |

---

## Success Metrics

- [ ] Skills installable via single `npx` command
- [ ] MCP server configurable in <2 minutes
- [ ] Each skill produces usable output without manual editing
- [ ] Brand context shared correctly across all clusters
- [ ] npm package under 5MB total
- [ ] 10+ GitHub stars in first month post-launch

---

## Unresolved Questions

1. **Skill naming convention**: Should skills register as `/sales-iq:marketing:ad-copy` (namespaced) or just `/ad-copy` (flat)? Namespaced avoids collision but is verbose.
2. **MCP tool granularity**: One tool per API endpoint (fine-grained) or composite tools like `crm-sync` (coarse)?
3. **Versioning strategy**: Skill content versioning vs. MCP server semver — independent or lockstep?
4. **Shared context persistence**: Should `shared/brand-context.md` live in user's project or in `~/.claude/`?
5. **Template customization**: Allow user overrides of templates without losing upstream updates?
