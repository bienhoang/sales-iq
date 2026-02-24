# sales-iq-mcp-server

MCP server for sales and marketing integrations. 14 tools across 6 categories.

## Setup

```bash
# Via CLI (recommended)
npx sales-iq configure --mcp

# Or run directly
npx sales-iq-mcp
```

## Tools

| Tool | Category | Description |
|------|----------|-------------|
| `crm_get_contact` | CRM | Look up contact by email |
| `crm_list_deals` | CRM | List pipeline deals with optional stage filter |
| `crm_update_deal` | CRM | Update deal stage |
| `crm_create_contact` | CRM | Create new CRM contact |
| `email_send` | Email | Send transactional email |
| `email_list_campaigns` | Email | List email campaigns |
| `email_get_stats` | Email | Get campaign performance stats |
| `social_post` | Social | Post to Twitter or LinkedIn |
| `social_get_analytics` | Social | Get post/account analytics |
| `analytics_get_traffic` | Analytics | Website traffic for date range |
| `analytics_get_seo_rankings` | Analytics | SEO keyword rankings |
| `lead_score` | Lead Scoring | AI-powered lead scoring via Claude |
| `calendar_list_entries` | Calendar | List content calendar entries |
| `calendar_create_entry` | Calendar | Add entry to content calendar |

## Environment Variables

```bash
HUBSPOT_API_KEY=        # CRM tools
MAILCHIMP_API_KEY=      # Email tools
MAILCHIMP_SERVER_PREFIX= # e.g. us6
TWITTER_API_KEY=        # Social (Twitter)
LINKEDIN_API_KEY=       # Social (LinkedIn)
GA4_MEASUREMENT_ID=     # Analytics traffic
SEMRUSH_API_KEY=        # SEO rankings
ANTHROPIC_API_KEY=      # lead_score tool
```

All keys are optional. Missing keys return a descriptive error, not a crash.

## Manual MCP Config

```json
{
  "mcpServers": {
    "sales-iq": {
      "command": "npx",
      "args": ["sales-iq-mcp"]
    }
  }
}
```

## License

MIT
