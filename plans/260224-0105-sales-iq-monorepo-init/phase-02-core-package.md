# Phase 02 — Core Package

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-monorepo-foundation.md)
- Used by: Phase 06 (MCP Server), Phase 07 (CLI)

## Overview

- **Date**: 2026-02-24
- **Priority**: P3
- **Status**: deferred
- **Effort**: —
- **Description**: ~~Build `@sales-iq/core` with shared TypeScript types.~~ **DEFERRED — merged into Phase 06.** Core types will be built inside MCP server first, extracted to shared package when patterns stabilize.

<!-- Updated: Validation Session 1 - Core types deferred to Phase 06 per YAGNI principle -->

## Key Insights

- Core types model the sales/marketing domain: leads, contacts, deals, campaigns, pipelines, brands, ICPs.
- Keep types minimal — only what MCP server and CLI actually need. YAGNI.
- Utility functions: formatters (currency, dates, percentages), validators (email, URL, phone).
- Export everything from a single `index.ts` barrel file.
- Use `tsup` for dual ESM/CJS output.

## Requirements

### Functional
- TypeScript interfaces for all domain entities
- Utility functions for common formatting and validation
- Barrel export from `src/index.ts`
- Built with tsup, published as `@sales-iq/core`

### Non-Functional
- Zero runtime dependencies (pure TypeScript)
- Tree-shakeable ESM output
- Types exported via `exports` field in package.json

## Architecture

```
packages/core/
├── src/
│   ├── index.ts              # barrel export
│   ├── types/
│   │   ├── lead.ts           # Lead, LeadStatus, LeadScore
│   │   ├── contact.ts        # Contact, ContactSource
│   │   ├── deal.ts           # Deal, DealStage, Pipeline
│   │   ├── campaign.ts       # Campaign, CampaignType, CampaignStatus
│   │   └── brand.ts          # Brand, ICP, MessagingPillar
│   └── utils/
│       ├── formatters.ts     # currency, date, percentage, compact number
│       └── validators.ts     # email, URL, phone validation
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Related Code Files

### Create
- `packages/core/src/index.ts`
- `packages/core/src/types/lead.ts`
- `packages/core/src/types/contact.ts`
- `packages/core/src/types/deal.ts`
- `packages/core/src/types/campaign.ts`
- `packages/core/src/types/brand.ts`
- `packages/core/src/utils/formatters.ts`
- `packages/core/src/utils/validators.ts`
- `packages/core/tsup.config.ts`

### Modify
- `packages/core/package.json` — add exports, main, types, build script
- `packages/core/tsconfig.json` — ensure proper config

## Implementation Steps

1. **Define Lead types** (`types/lead.ts`):
   ```typescript
   export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
   export interface LeadScore { total: number; fit: number; intent: number; engagement: number; }
   export interface Lead {
     id: string; name: string; email: string; company: string;
     title?: string; status: LeadStatus; score?: LeadScore;
     source?: string; tags?: string[]; createdAt: string; updatedAt: string;
   }
   ```

2. **Define Contact types** (`types/contact.ts`):
   ```typescript
   export type ContactSource = 'inbound' | 'outbound' | 'referral' | 'event' | 'organic';
   export interface Contact {
     id: string; firstName: string; lastName: string; email: string;
     company?: string; title?: string; phone?: string;
     source: ContactSource; tags?: string[]; notes?: string;
   }
   ```

3. **Define Deal types** (`types/deal.ts`):
   ```typescript
   export type DealStage = 'discovery' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
   export interface Deal {
     id: string; name: string; contactId: string; value: number;
     stage: DealStage; probability: number; expectedCloseDate: string;
     notes?: string;
   }
   export interface Pipeline { id: string; name: string; stages: DealStage[]; deals: Deal[]; }
   ```

4. **Define Campaign types** (`types/campaign.ts`):
   ```typescript
   export type CampaignType = 'email' | 'social' | 'ads' | 'content' | 'event';
   export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
   export interface Campaign {
     id: string; name: string; type: CampaignType; status: CampaignStatus;
     startDate: string; endDate?: string; budget?: number;
     targetAudience?: string; metrics?: CampaignMetrics;
   }
   export interface CampaignMetrics {
     impressions?: number; clicks?: number; conversions?: number;
     spend?: number; revenue?: number;
   }
   ```

5. **Define Brand types** (`types/brand.ts`):
   ```typescript
   export interface ICP {
     name: string; role: string; companySize: string;
     painPoints: string[]; goals: string[]; channels: string[];
   }
   export interface MessagingPillar { theme: string; description: string; proofPoints: string[]; }
   export interface Brand {
     name: string; tagline: string; positioning: string;
     voiceTone: string[]; icps: ICP[]; pillars: MessagingPillar[];
   }
   ```

6. **Implement formatters** (`utils/formatters.ts`):
   - `formatCurrency(value, currency?)` — "$1,234.56"
   - `formatDate(isoString, format?)` — "Jan 15, 2026"
   - `formatPercentage(value, decimals?)` — "45.2%"
   - `formatCompactNumber(value)` — "1.2K", "3.5M"

7. **Implement validators** (`utils/validators.ts`):
   - `isValidEmail(email)` — regex check
   - `isValidUrl(url)` — URL constructor try/catch
   - `isValidPhone(phone)` — basic format check

8. **Create barrel export** (`index.ts`): re-export all types and utils

9. **Configure tsup** (`tsup.config.ts`):
   ```typescript
   import { defineConfig } from 'tsup';
   export default defineConfig({
     entry: ['src/index.ts'],
     format: ['esm', 'cjs'],
     dts: true,
     clean: true,
   });
   ```

10. **Update package.json**:
    ```json
    {
      "name": "@sales-iq/core",
      "version": "0.1.0",
      "type": "module",
      "main": "./dist/index.cjs",
      "module": "./dist/index.js",
      "types": "./dist/index.d.ts",
      "exports": {
        ".": { "import": "./dist/index.js", "require": "./dist/index.cjs", "types": "./dist/index.d.ts" }
      },
      "files": ["dist"],
      "scripts": { "build": "tsup", "typecheck": "tsc --noEmit" }
    }
    ```

11. Run `pnpm build --filter @sales-iq/core` and verify output

## Todo List

- [ ] Define Lead, Contact, Deal types
- [ ] Define Campaign, Brand, ICP types
- [ ] Implement formatters
- [ ] Implement validators
- [ ] Create barrel export
- [ ] Configure tsup + package.json exports
- [ ] Verify build output

## Success Criteria

- `pnpm build` produces `dist/` with ESM + CJS + `.d.ts`
- All types importable: `import { Lead, Deal } from '@sales-iq/core'`
- Zero runtime dependencies
- `tsc --noEmit` passes
- Formatter/validator functions work correctly

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Over-engineering types before real usage | Start minimal, add fields as MCP/CLI needs emerge |
| ESM/CJS dual export issues | Use tsup with tested config, verify both import styles |

## Security Considerations

- No API keys or secrets in core package
- Validators must not throw on malformed input (return boolean)

## Next Steps

- Phase 06: MCP server imports core types for tool I/O schemas
- Phase 07: CLI imports core types for config validation
