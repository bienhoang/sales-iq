---
name: siq-docs-seeker
description: Find and retrieve documentation for sales/marketing tools and platforms. Use for CRM APIs, marketing automation docs, analytics platform references, integration guides.
version: 1.0.0
---

# Documentation Discovery for Sales/Marketing Platforms

Find official documentation for any sales or marketing tool using WebSearch and WebFetch.

## When to Use

- Looking up HubSpot, Salesforce, Stripe, Mailchimp, or other platform APIs
- Need endpoint references, authentication guides, or webhook docs
- Researching integration capabilities between platforms
- Verifying API rate limits, payload formats, or SDK usage

## Workflow

### Step 1 — Identify the Platform and Topic

Parse the user query for:
- **Platform**: HubSpot, Salesforce, Stripe, Mailchimp, etc.
- **Topic**: specific endpoint, feature, or concept (optional)

### Step 2 — Check Known Platform Docs (Fast Path)

If the platform is in the registry below, go directly to its official docs URL.

**Known platforms → jump to Step 4.**

### Step 3 — WebSearch Fallback (Unknown Platform)

```
WebSearch: "[platform] developer documentation API reference"
WebSearch: "[platform] [topic] API docs site:developers.[platform].com"
```

Pick the official developer portal from results (avoid community/tutorial sites first).

### Step 4 — Fetch Documentation with WebFetch

```
WebFetch: [official docs URL]
prompt: "Find [topic] — summarize endpoints, parameters, auth, and code examples"
```

For broad platform queries, fetch the docs index first to identify key sections, then fetch 2-3 most relevant pages.

For topic-specific queries, go directly to the relevant section URL.

### Step 5 — Summarize Findings

Return results in markdown with:
- **Authentication**: method (API key, OAuth, JWT), where to obtain credentials
- **Base URL + versioning**: e.g., `https://api.hubspot.com/crm/v3/`
- **Key endpoints**: relevant to the query with parameters
- **Code examples**: when available in the docs
- **Rate limits**: if documented
- **Source URLs**: link to the exact pages fetched

## Known Platform Docs

| Platform | Docs URL |
|---|---|
| HubSpot | https://developers.hubspot.com |
| Salesforce | https://developer.salesforce.com |
| Stripe | https://docs.stripe.com |
| Mailchimp | https://mailchimp.com/developer |
| Google Analytics | https://developers.google.com/analytics |
| Intercom | https://developers.intercom.com |
| Zapier | https://platform.zapier.com/docs |
| Segment | https://segment.com/docs |
| Pipedrive | https://developers.pipedrive.com |
| ActiveCampaign | https://developers.activecampaign.com |
| Klaviyo | https://developers.klaviyo.com |
| Twilio | https://www.twilio.com/docs |
| SendGrid | https://docs.sendgrid.com |
| Marketo | https://developers.marketo.com |

Full registry: [references/platform-docs-registry.md](./references/platform-docs-registry.md)

## Search Strategy Tips

- Always prefer official developer portals over third-party tutorials
- Append the API version to the search if known (e.g., "HubSpot CRM API v3")
- For large platforms (Salesforce), clarify the product: Sales Cloud, Marketing Cloud, Service Cloud
- For versioned APIs (Stripe), check if the user needs a specific API version — default to latest
- If docs are sparse, also check the platform's official changelog and SDK README

## Edge Cases

**Multi-product platforms (Salesforce, Adobe):** Ask the user which product before searching to avoid irrelevant results.

**Docs under construction:** Note the status, combine available docs with official changelog, mark inferred content clearly.

**Conflicting versions:** Present both with context; recommend official/latest. Priority: official latest > official versioned > SDK README > blog/release notes > community.

**Localized docs:** HubSpot and Salesforce offer language-specific subdomains (e.g., `developers.hubspot.com/es/`) — use if user specifies a language.
