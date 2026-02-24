import type { Config } from 'sales-iq-core';

export const analyticsToolDefinitions = [
  {
    name: 'analytics_get_traffic',
    description: 'Get website traffic data for a date range',
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
    name: 'analytics_get_seo_rankings',
    description: 'Get SEO keyword rankings for a domain',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domain: { type: 'string', description: 'Domain to check rankings for' },
        keywords: { type: 'array', items: { type: 'string' }, description: 'Optional keywords to filter by' },
      },
      required: ['domain'],
    },
  },
];

export async function handleAnalyticsTool(
  name: string,
  args: Record<string, unknown>,
  config: Config,
): Promise<unknown> {
  if (name === 'analytics_get_traffic') {
    if (!config.ga4MeasurementId) {
      return { error: 'API key not configured. Set GA4_MEASUREMENT_ID env var.' };
    }
    const { startDate, endDate } = args as { startDate: string; endDate: string };
    return { startDate, endDate, sessions: 0, pageViews: 0, uniqueVisitors: 0, bounceRate: 0, avgSessionDuration: 0, topPages: [] };
  }

  if (name === 'analytics_get_seo_rankings') {
    if (!config.semrushApiKey) {
      return { error: 'API key not configured. Set SEMRUSH_API_KEY env var.' };
    }
    const { domain, keywords = [] } = args as { domain: string; keywords?: string[] };
    return { domain, keywords, rankings: [] };
  }

  return null;
}
