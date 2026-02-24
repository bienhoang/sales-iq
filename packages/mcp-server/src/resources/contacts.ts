import type { Config } from 'sales-iq-core';

export const contactsResourceDefinitions = [
  {
    uri: 'sales-iq://contacts/recent',
    name: 'Recent Contacts',
    description: 'Most recently created or updated CRM contacts',
    mimeType: 'application/json',
  },
];

export async function handleContactsResource(
  uri: string,
  config: Config,
): Promise<unknown> {
  if (uri !== 'sales-iq://contacts/recent') return null;

  if (!config.hubspotApiKey) {
    return { error: 'API key not configured. Set HUBSPOT_API_KEY env var.' };
  }

  // Stub: real impl would fetch recent contacts from HubSpot
  return {
    contacts: [],
    total: 0,
    limit: 20,
  };
}
