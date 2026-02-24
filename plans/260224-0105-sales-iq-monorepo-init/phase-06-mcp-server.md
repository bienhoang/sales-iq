# Phase 06 — MCP Server

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: [Phase 02](./phase-02-core-package.md) (core types)
- MCP SDK: `@modelcontextprotocol/sdk`
- Anthropic SDK: `@anthropic-ai/sdk`

## Overview

- **Date**: 2026-02-24
- **Priority**: P1
- **Status**: pending
- **Effort**: 8h
- **Description**: Build `sales-iq-mcp-server` with tools for CRM, email, social, analytics, lead-scoring, and content-calendar. Resources for pipeline/campaigns/contacts. Prompts for campaign-launch and lead-nurture. **Also includes core types (absorbed from Phase 02)** — types built inline, extracted to shared package later.

<!-- Updated: Validation Session 1 - Absorbed Phase 02 core types, unscoped npm name, effort 6h→8h -->

## Key Insights

- MCP SDK pattern: `Server` class, register tools/resources/prompts with handlers, run via stdio transport.
- Tools = actions (read/write external services), Resources = read-only context, Prompts = orchestration templates.
- Start with stub implementations — actual API integrations added incrementally.
- Each integration should be a separate module; lazy-load based on configured API keys.
- Lead scoring uses Claude API via Anthropic SDK for AI-powered analysis.
- Server configured via env vars; no hardcoded credentials.
- Published with `bin` field for `npx sales-iq-mcp-server` usage.

## Requirements

### Functional
- **Tools** (actions):
  - CRM: `crm_get_contact`, `crm_list_deals`, `crm_update_deal`, `crm_create_contact`
  - Email: `email_send`, `email_list_campaigns`, `email_get_stats`
  - Social: `social_post`, `social_get_analytics`
  - Analytics: `analytics_get_traffic`, `analytics_get_seo_rankings`
  - Lead Scoring: `lead_score` (AI-powered via Claude API)
  - Content Calendar: `calendar_list_entries`, `calendar_create_entry`
- **Resources** (read-only):
  - `sales-iq://pipeline` — current deal pipeline
  - `sales-iq://campaigns` — active campaigns
  - `sales-iq://contacts/{id}` — contact details
- **Prompts** (templates):
  - `campaign-launch` — structured prompt for launching campaigns
  - `lead-nurture` — structured prompt for lead nurture sequences
- stdio transport for Claude Code/Desktop integration
- `bin` field in package.json for npx usage

### Non-Functional
- Graceful degradation when API keys missing (tool returns helpful error, not crash)
- Each integration module under 200 lines
- Type-safe with `sales-iq-core` types
- Zero startup cost for unused integrations (lazy load)

## Architecture

```
packages/mcp-server/
├── src/
│   ├── index.ts                 # Server entry, registration, stdio transport
│   ├── config.ts                # Env var config loader
│   ├── tools/
│   │   ├── crm/
│   │   │   ├── index.ts         # CRM tool registrations
│   │   │   ├── hubspot.ts       # HubSpot API client
│   │   │   └── pipedrive.ts     # Pipedrive API client
│   │   ├── email/
│   │   │   ├── index.ts
│   │   │   ├── resend.ts
│   │   │   └── mailchimp.ts
│   │   ├── social/
│   │   │   ├── index.ts
│   │   │   ├── linkedin.ts
│   │   │   └── twitter.ts
│   │   ├── analytics/
│   │   │   ├── index.ts
│   │   │   ├── google-analytics.ts
│   │   │   └── seo-tools.ts
│   │   ├── lead-scoring/
│   │   │   └── index.ts         # Claude API-powered scoring
│   │   └── content-calendar/
│   │       └── index.ts
│   ├── resources/
│   │   ├── pipeline.ts
│   │   ├── campaigns.ts
│   │   └── contacts.ts
│   └── prompts/
│       ├── campaign-launch.ts
│       └── lead-nurture.ts
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Related Code Files

### Create
- `packages/mcp-server/src/index.ts` — server entry
- `packages/mcp-server/src/config.ts` — env config
- `packages/mcp-server/src/tools/crm/index.ts` — CRM tool registration
- `packages/mcp-server/src/tools/crm/hubspot.ts` — HubSpot client
- `packages/mcp-server/src/tools/crm/pipedrive.ts` — Pipedrive client
- `packages/mcp-server/src/tools/email/index.ts` — email tool registration
- `packages/mcp-server/src/tools/email/resend.ts` — Resend client
- `packages/mcp-server/src/tools/email/mailchimp.ts` — Mailchimp client
- `packages/mcp-server/src/tools/social/index.ts` — social tool registration
- `packages/mcp-server/src/tools/social/linkedin.ts`
- `packages/mcp-server/src/tools/social/twitter.ts`
- `packages/mcp-server/src/tools/analytics/index.ts`
- `packages/mcp-server/src/tools/analytics/google-analytics.ts`
- `packages/mcp-server/src/tools/analytics/seo-tools.ts`
- `packages/mcp-server/src/tools/lead-scoring/index.ts`
- `packages/mcp-server/src/tools/content-calendar/index.ts`
- `packages/mcp-server/src/resources/pipeline.ts`
- `packages/mcp-server/src/resources/campaigns.ts`
- `packages/mcp-server/src/resources/contacts.ts`
- `packages/mcp-server/src/prompts/campaign-launch.ts`
- `packages/mcp-server/src/prompts/lead-nurture.ts`
- `packages/mcp-server/tsup.config.ts`

### Modify
- `packages/mcp-server/package.json` — deps, bin, exports
- `packages/mcp-server/tsconfig.json`

## Implementation Steps

1. **Setup package.json**:
   ```json
   {
     "name": "sales-iq-mcp-server",
     "version": "0.1.0",
     "type": "module",
     "bin": { "sales-iq-mcp": "./dist/index.js" },
     "files": ["dist"],
     "dependencies": {
       "@modelcontextprotocol/sdk": "^1",
       "@anthropic-ai/sdk": "^0.30",
       "sales-iq-core": "workspace:*"
     },
     "scripts": {
       "build": "tsup",
       "dev": "tsup --watch",
       "typecheck": "tsc --noEmit"
     }
   }
   ```

2. **Create config.ts** — env var loader:
   ```typescript
   export interface Config {
     hubspotApiKey?: string;
     pipedriveApiKey?: string;
     resendApiKey?: string;
     mailchimpApiKey?: string;
     linkedinAccessToken?: string;
     twitterBearerToken?: string;
     googleAnalyticsId?: string;
     anthropicApiKey?: string;
   }
   export function loadConfig(): Config { /* read from process.env */ }
   ```

3. **Create server entry (index.ts)**:
   ```typescript
   import { Server } from '@modelcontextprotocol/sdk/server/index.js';
   import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
   // Register tools, resources, prompts
   // Start with stdio transport
   ```
   - Shebang: `#!/usr/bin/env node`
   - Load config, conditionally register tools based on available keys
   - Server name: `sales-iq`, version from package.json

4. **Implement CRM tools** (`tools/crm/index.ts`):
   - `crm_get_contact`: input `{ email: string }`, returns Contact
   - `crm_list_deals`: input `{ status?: string, limit?: number }`, returns Deal[]
   - `crm_update_deal`: input `{ id: string, stage: DealStage }`, returns Deal
   - `crm_create_contact`: input `{ firstName, lastName, email, company }`, returns Contact
   - Provider dispatch: check config for hubspot vs pipedrive key

5. **Implement email tools** (`tools/email/index.ts`):
   - `email_send`: input `{ to, subject, html, from? }`, returns send result
   - `email_list_campaigns`: input `{ status? }`, returns Campaign[]
   - `email_get_stats`: input `{ campaignId }`, returns CampaignMetrics

6. **Implement social tools** (`tools/social/index.ts`):
   - `social_post`: input `{ platform, content, mediaUrl? }`, returns post result
   - `social_get_analytics`: input `{ platform, postId? }`, returns metrics

7. **Implement analytics tools** (`tools/analytics/index.ts`):
   - `analytics_get_traffic`: input `{ startDate, endDate, property? }`, returns traffic data
   - `analytics_get_seo_rankings`: input `{ domain, keywords? }`, returns ranking data

8. **Implement lead scoring** (`tools/lead-scoring/index.ts`):
   - `lead_score`: input `{ lead: Lead, context?: string }`
   - Uses Anthropic SDK to call Claude for AI-powered scoring
   - Returns LeadScore (fit, intent, engagement, total) + reasoning
   - Prompt engineering: structured analysis of lead data against ICP criteria

9. **Implement content calendar** (`tools/content-calendar/index.ts`):
   - `calendar_list_entries`: input `{ startDate, endDate }`, returns entries
   - `calendar_create_entry`: input `{ date, channel, content, status }`, returns entry
   - MVP: in-memory or JSON file storage; external calendar integration later

10. **Implement resources** (`resources/`):
    - `pipeline.ts`: `sales-iq://pipeline` → fetches deals from CRM, returns pipeline summary
    - `campaigns.ts`: `sales-iq://campaigns` → fetches active campaigns from email provider
    - `contacts.ts`: `sales-iq://contacts/{id}` → URI template, fetches single contact

11. **Implement prompts** (`prompts/`):
    - `campaign-launch.ts`: arguments `{ name, date, audience, channels }` → structured prompt for campaign execution
    - `lead-nurture.ts`: arguments `{ leadId, stage, context }` → structured prompt for nurture sequence

12. **Configure tsup**:
    ```typescript
    export default defineConfig({
      entry: ['src/index.ts'],
      format: ['esm'],
      dts: false,          // not needed for binary
      clean: true,
      banner: { js: '#!/usr/bin/env node' },
    });
    ```

13. **Test** — verify server starts without errors, responds to initialize request

## Todo List

- [ ] Setup package.json with deps and bin
- [ ] Create config.ts env loader
- [ ] Create server entry with MCP SDK
- [ ] Implement CRM tools (hubspot + pipedrive stubs)
- [ ] Implement email tools (resend + mailchimp stubs)
- [ ] Implement social tools (linkedin + twitter stubs)
- [ ] Implement analytics tools (GA4 + SEO stubs)
- [ ] Implement lead-scoring tool (Claude API)
- [ ] Implement content-calendar tool
- [ ] Implement resources (pipeline, campaigns, contacts)
- [ ] Implement prompts (campaign-launch, lead-nurture)
- [ ] Configure tsup build
- [ ] Test server startup and tool listing

## Success Criteria

- Server starts cleanly via `node dist/index.js`
- All tools listed in response to `tools/list` MCP request
- Tools with missing API keys return helpful error (not crash)
- Lead scoring tool calls Claude API successfully
- Resources return structured data
- `npx sales-iq-mcp-server` works after npm publish
- Imports from `sales-iq-core` resolve correctly

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| MCP SDK breaking changes | Pin to stable version, wrap SDK calls in abstractions |
| Too many API integrations at once | Start with stubs returning mock data; implement real APIs incrementally |
| Anthropic API rate limits for lead scoring | Cache results, add rate limit handling |
| Large number of files | Each integration module is small and independent |

## Security Considerations

- **API keys via env vars only** — never in code, config files, or git
- Input validation on all tool inputs (use JSON Schema in tool definitions)
- Sanitize user-provided content before passing to external APIs
- Rate limiting awareness for all external API calls
- Claude API key required only for lead-scoring tool
- Log no sensitive data (API keys, contact PII) to stdout/stderr

## Next Steps

- Phase 07: CLI configures MCP server in user's Claude settings
- Phase 08: Documentation for MCP configuration
