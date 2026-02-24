# MCP Server Configuration

## CLI Setup (Recommended)

```bash
npx sales-iq configure --mcp
```

Appends the MCP server block to your Claude Code settings file automatically.

## Manual Setup

Add to your Claude Code settings (`~/.claude/settings.json` or project `.claude/settings.json`):

```json
{
  "mcpServers": {
    "sales-iq": {
      "command": "npx",
      "args": ["sales-iq-mcp"],
      "env": {
        "HUBSPOT_API_KEY": "",
        "MAILCHIMP_API_KEY": "",
        "MAILCHIMP_SERVER_PREFIX": "",
        "TWITTER_API_KEY": "",
        "LINKEDIN_API_KEY": "",
        "GA4_MEASUREMENT_ID": "",
        "SEMRUSH_API_KEY": "",
        "ANTHROPIC_API_KEY": ""
      }
    }
  }
}
```

Leave unused keys empty or remove them — tools return a clear error message when their key is missing.

## Environment Variables

| Variable | Required For | Where to Get It |
|----------|-------------|-----------------|
| `HUBSPOT_API_KEY` | CRM tools | HubSpot → Settings → Integrations → API Key |
| `MAILCHIMP_API_KEY` | Email tools | Mailchimp → Account → Extras → API Keys |
| `MAILCHIMP_SERVER_PREFIX` | Email tools | Server prefix from your Mailchimp API key (e.g. `us6`) |
| `TWITTER_API_KEY` | Social tools (Twitter) | developer.twitter.com → Projects → Keys |
| `LINKEDIN_API_KEY` | Social tools (LinkedIn) | linkedin.com/developers → Apps → Auth |
| `GA4_MEASUREMENT_ID` | Analytics traffic | GA4 → Admin → Data Streams → Measurement ID |
| `SEMRUSH_API_KEY` | SEO rankings | semrush.com → Subscription → API |
| `ANTHROPIC_API_KEY` | Lead scoring (`lead_score`) | console.anthropic.com → API Keys |

All variables are optional. Tools that need a missing key return:
```json
{ "error": "API key not configured. Set <VAR_NAME> env var." }
```

## Available Tools

| Tool | Category | Key Required |
|------|----------|-------------|
| `crm_get_contact` | CRM | `HUBSPOT_API_KEY` |
| `crm_list_deals` | CRM | `HUBSPOT_API_KEY` |
| `crm_update_deal` | CRM | `HUBSPOT_API_KEY` |
| `crm_create_contact` | CRM | `HUBSPOT_API_KEY` |
| `email_send` | Email | `MAILCHIMP_API_KEY` |
| `email_list_campaigns` | Email | `MAILCHIMP_API_KEY` |
| `email_get_stats` | Email | `MAILCHIMP_API_KEY` |
| `social_post` | Social | `TWITTER_API_KEY` or `LINKEDIN_API_KEY` |
| `social_get_analytics` | Social | `TWITTER_API_KEY` or `LINKEDIN_API_KEY` |
| `analytics_get_traffic` | Analytics | `GA4_MEASUREMENT_ID` |
| `analytics_get_seo_rankings` | Analytics | `SEMRUSH_API_KEY` |
| `lead_score` | Lead Scoring | `ANTHROPIC_API_KEY` |
| `calendar_list_entries` | Calendar | none |
| `calendar_create_entry` | Calendar | none |

## Testing the Connection

After configuration, restart Claude Code and verify tools are available:

```
list available MCP tools from sales-iq
```

To test a specific tool without real credentials:

```
use crm_list_deals with limit 5
```

Calendar tools require no API key and work immediately for smoke-testing.
