# @bienhoang/sales-iq-core

Shared types and utilities for the sales-iq monorepo. Used internally by `@bienhoang/sales-iq-mcp-server`.

## Usage

```ts
import type { Config, Contact, Deal, LeadScore } from '@bienhoang/sales-iq-core';
```

> This is an internal package. Most users interact with it via `@bienhoang/sales-iq-mcp-server`.

## Types

### Config

```ts
interface Config {
  hubspotApiKey?: string;
  mailchimpApiKey?: string;
  mailchimpServerPrefix?: string;
  twitterApiKey?: string;
  linkedinApiKey?: string;
  ga4MeasurementId?: string;
  semrushApiKey?: string;
  anthropicApiKey?: string;
}
```

### Contact

```ts
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Deal

```ts
interface Deal {
  id: string;
  name: string;
  stage: string;
  amount?: number;
  contactId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### LeadScore

```ts
interface LeadScore {
  score: number;         // 0–100
  grade: string;         // A / B / C / D
  reasoning: string;
  nextAction: string;
}
```

## License

MIT
