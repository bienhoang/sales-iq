import type { Config } from 'sales-iq-core';

export const crmToolDefinitions = [
  {
    name: 'crm_get_contact',
    description: 'Look up a CRM contact by email address',
    inputSchema: {
      type: 'object' as const,
      properties: { email: { type: 'string', description: 'Contact email address' } },
      required: ['email'],
    },
  },
  {
    name: 'crm_list_deals',
    description: 'List deals in the CRM pipeline',
    inputSchema: {
      type: 'object' as const,
      properties: {
        status: { type: 'string', description: 'Filter by deal stage' },
        limit: { type: 'number', description: 'Max results (default 10)' },
      },
    },
  },
  {
    name: 'crm_update_deal',
    description: 'Update the stage of an existing deal',
    inputSchema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string', description: 'Deal ID' },
        stage: { type: 'string', description: 'New deal stage' },
      },
      required: ['id', 'stage'],
    },
  },
  {
    name: 'crm_create_contact',
    description: 'Create a new contact in the CRM',
    inputSchema: {
      type: 'object' as const,
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        company: { type: 'string' },
      },
      required: ['firstName', 'lastName', 'email'],
    },
  },
];

export async function handleCrmTool(
  name: string,
  args: Record<string, unknown>,
  config: Config,
): Promise<unknown> {
  const missingKey = { error: 'API key not configured. Set HUBSPOT_API_KEY env var.' };

  if (name === 'crm_get_contact') {
    if (!config.hubspotApiKey) return missingKey;
    const { email } = args as { email: string };
    return { id: 'stub-001', firstName: 'Jane', lastName: 'Doe', email, company: 'Acme Corp', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  }

  if (name === 'crm_list_deals') {
    if (!config.hubspotApiKey) return missingKey;
    const { status, limit = 10 } = args as { status?: string; limit?: number };
    return { deals: [], total: 0, filter: { status, limit } };
  }

  if (name === 'crm_update_deal') {
    if (!config.hubspotApiKey) return missingKey;
    const { id, stage } = args as { id: string; stage: string };
    return { success: true, id, stage, updatedAt: new Date().toISOString() };
  }

  if (name === 'crm_create_contact') {
    if (!config.hubspotApiKey) return missingKey;
    const { firstName, lastName, email, company } = args as { firstName: string; lastName: string; email: string; company?: string };
    return { id: `contact-${Date.now()}`, firstName, lastName, email, company, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  }

  return null;
}
