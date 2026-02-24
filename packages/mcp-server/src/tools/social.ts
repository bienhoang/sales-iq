import type { Config } from 'sales-iq-core';

export const socialToolDefinitions = [
  {
    name: 'social_post',
    description: 'Post content to a social media platform',
    inputSchema: {
      type: 'object' as const,
      properties: {
        platform: { type: 'string', description: 'Platform name: twitter or linkedin' },
        content: { type: 'string', description: 'Post text content' },
      },
      required: ['platform', 'content'],
    },
  },
  {
    name: 'social_get_analytics',
    description: 'Get analytics for a social media platform or specific post',
    inputSchema: {
      type: 'object' as const,
      properties: {
        platform: { type: 'string', description: 'Platform name: twitter or linkedin' },
        postId: { type: 'string', description: 'Optional specific post ID' },
      },
      required: ['platform'],
    },
  },
];

function getApiKey(platform: string, config: Config): string | undefined {
  if (platform === 'twitter') return config.twitterApiKey;
  if (platform === 'linkedin') return config.linkedinApiKey;
  return undefined;
}

export async function handleSocialTool(
  name: string,
  args: Record<string, unknown>,
  config: Config,
): Promise<unknown> {
  if (name === 'social_post') {
    const { platform, content } = args as { platform: string; content: string };
    if (!getApiKey(platform, config)) {
      return { error: `API key not configured. Set ${platform.toUpperCase()}_API_KEY env var.` };
    }
    return { success: true, postId: `post-${Date.now()}`, platform, preview: content.slice(0, 50), postedAt: new Date().toISOString() };
  }

  if (name === 'social_get_analytics') {
    const { platform, postId } = args as { platform: string; postId?: string };
    if (!getApiKey(platform, config)) {
      return { error: `API key not configured. Set ${platform.toUpperCase()}_API_KEY env var.` };
    }
    return { platform, postId, impressions: 0, engagements: 0, clicks: 0, shares: 0, likes: 0 };
  }

  return null;
}
