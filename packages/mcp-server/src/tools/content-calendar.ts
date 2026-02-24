import type { Config } from '@bienhoang/sales-iq-core';

// In-memory store for stub implementation
const calendarEntries: Array<{ id: string; date: string; channel: string; content: string; status: string; createdAt: string }> = [];

export const contentCalendarToolDefinitions = [
  {
    name: 'calendar_list_entries',
    description: 'List content calendar entries within a date range',
    inputSchema: {
      type: 'object' as const,
      properties: {
        startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
      },
      required: ['startDate', 'endDate'],
    },
  },
  {
    name: 'calendar_create_entry',
    description: 'Create a new content calendar entry',
    inputSchema: {
      type: 'object' as const,
      properties: {
        date: { type: 'string', description: 'Publish date (YYYY-MM-DD)' },
        channel: { type: 'string', description: 'Distribution channel (e.g. twitter, blog, email)' },
        content: { type: 'string', description: 'Content description or copy' },
        status: { type: 'string', description: 'Entry status (draft, scheduled, published)' },
      },
      required: ['date', 'channel', 'content'],
    },
  },
];

export async function handleContentCalendarTool(
  name: string,
  args: Record<string, unknown>,
  _config: Config,
): Promise<unknown> {
  if (name === 'calendar_list_entries') {
    const { startDate, endDate } = args as { startDate: string; endDate: string };
    const filtered = calendarEntries.filter(
      (e) => e.date >= startDate && e.date <= endDate,
    );
    return { entries: filtered, total: filtered.length, range: { startDate, endDate } };
  }

  if (name === 'calendar_create_entry') {
    const { date, channel, content, status = 'draft' } = args as { date: string; channel: string; content: string; status?: string };
    const entry = { id: `cal-${Date.now()}`, date, channel, content, status, createdAt: new Date().toISOString() };
    calendarEntries.push(entry);
    return { success: true, entry };
  }

  return null;
}
