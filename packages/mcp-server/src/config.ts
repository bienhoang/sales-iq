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
    leadScoringModel: process.env.LEAD_SCORING_MODEL || 'claude-3-5-haiku-20241022',
  };

  // Warn about suspiciously short API keys (likely placeholder values)
  for (const [key, value] of Object.entries(config)) {
    if (value && value.length < 8 && key !== 'mailchimpServerPrefix') {
      process.stderr.write(`[sales-iq] Warning: ${key} looks invalid (too short)\n`);
    }
  }

  // Validate paired keys
  if (config.mailchimpApiKey && !config.mailchimpServerPrefix) {
    process.stderr.write('[sales-iq] Warning: MAILCHIMP_API_KEY set but MAILCHIMP_SERVER_PREFIX missing\n');
  }
  if (config.mailchimpServerPrefix && !config.mailchimpApiKey) {
    process.stderr.write('[sales-iq] Warning: MAILCHIMP_SERVER_PREFIX set but MAILCHIMP_API_KEY missing\n');
  }

  return config;
}
