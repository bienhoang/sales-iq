import type { Config } from '@bienhoang/sales-iq-core';

export function loadConfig(): Config {
  const config: Config = {
    hubspotApiKey: process.env.HUBSPOT_API_KEY,
    mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
    mailchimpServerPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
    twitterApiKey: process.env.TWITTER_API_KEY,
    linkedinApiKey: process.env.LINKEDIN_API_KEY,
    ga4MeasurementId: process.env.GA4_MEASUREMENT_ID,
    semrushApiKey: process.env.SEMRUSH_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  };

  // Warn about suspiciously short API keys (likely placeholder values)
  for (const [key, value] of Object.entries(config)) {
    if (value && value.length < 8 && key !== 'mailchimpServerPrefix') {
      process.stderr.write(`[sales-iq] Warning: ${key} looks invalid (too short)\n`);
    }
  }

  return config;
}
