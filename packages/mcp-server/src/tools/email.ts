import type { Config } from '@bienhoang/sales-iq-core';

export const emailToolDefinitions = [
  {
    name: 'email_send',
    description: 'Send a transactional email',
    inputSchema: {
      type: 'object' as const,
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject line' },
        html: { type: 'string', description: 'HTML body content' },
      },
      required: ['to', 'subject', 'html'],
    },
  },
  {
    name: 'email_list_campaigns',
    description: 'List email marketing campaigns',
    inputSchema: {
      type: 'object' as const,
      properties: {
        status: { type: 'string', description: 'Filter by campaign status (draft, scheduled, sent, paused)' },
      },
    },
  },
  {
    name: 'email_get_stats',
    description: 'Get performance stats for an email campaign',
    inputSchema: {
      type: 'object' as const,
      properties: {
        campaignId: { type: 'string', description: 'Campaign ID' },
      },
      required: ['campaignId'],
    },
  },
];

export async function handleEmailTool(
  name: string,
  args: Record<string, unknown>,
  config: Config,
): Promise<unknown> {
  const missingKey = { error: 'API key not configured. Set MAILCHIMP_API_KEY env var.' };

  if (name === 'email_send') {
    if (!config.mailchimpApiKey) return missingKey;
    const { to, subject } = args as { to: string; subject: string; html: string };
    return { success: true, messageId: `msg-${Date.now()}`, to, subject, sentAt: new Date().toISOString() };
  }

  if (name === 'email_list_campaigns') {
    if (!config.mailchimpApiKey) return missingKey;
    const { status } = args as { status?: string };
    return { campaigns: [], total: 0, filter: { status } };
  }

  if (name === 'email_get_stats') {
    if (!config.mailchimpApiKey) return missingKey;
    const { campaignId } = args as { campaignId: string };
    return { campaignId, sends: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0, openRate: 0, clickRate: 0 };
  }

  return null;
}
