import type { Config } from '@bienhoang/sales-iq-core';

export const pipelineResourceDefinitions = [
  {
    uri: 'sales-iq://pipeline/summary',
    name: 'Pipeline Summary',
    description: 'Current CRM pipeline summary grouped by deal stage',
    mimeType: 'application/json',
  },
];

export async function handlePipelineResource(
  uri: string,
  config: Config,
): Promise<unknown> {
  if (uri !== 'sales-iq://pipeline/summary') return null;

  if (!config.hubspotApiKey) {
    return { error: 'API key not configured. Set HUBSPOT_API_KEY env var.' };
  }

  // Stub: real impl would aggregate HubSpot deals by stage
  return {
    totalDeals: 0,
    totalValue: 0,
    currency: 'USD',
    byStage: {
      prospecting: { count: 0, value: 0 },
      qualification: { count: 0, value: 0 },
      proposal: { count: 0, value: 0 },
      negotiation: { count: 0, value: 0 },
      closed_won: { count: 0, value: 0 },
      closed_lost: { count: 0, value: 0 },
    },
  };
}
