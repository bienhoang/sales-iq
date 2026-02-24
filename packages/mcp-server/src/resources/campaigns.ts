import type { Config } from '@bienhoang/sales-iq-core';

export const campaignsResourceDefinitions = [
  {
    uri: 'sales-iq://campaigns/active',
    name: 'Active Campaigns',
    description: 'List of currently active email marketing campaigns',
    mimeType: 'application/json',
  },
];

export async function handleCampaignsResource(
  uri: string,
  config: Config,
): Promise<unknown> {
  if (uri !== 'sales-iq://campaigns/active') return null;

  if (!config.mailchimpApiKey) {
    return { error: 'API key not configured. Set MAILCHIMP_API_KEY env var.' };
  }

  // Stub: real impl would fetch active campaigns from Mailchimp
  return {
    campaigns: [],
    total: 0,
    filter: { status: 'sending' },
  };
}
