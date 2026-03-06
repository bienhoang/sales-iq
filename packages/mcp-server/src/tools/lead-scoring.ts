import Anthropic from '@anthropic-ai/sdk';
import type { Config } from '@bienhoang/sales-iq-core';

export const leadScoringToolDefinitions = [
  {
    name: 'lead_score',
    description: 'AI-powered lead scoring using Claude to evaluate a prospect',
    inputSchema: {
      type: 'object' as const,
      properties: {
        company: { type: 'string', description: 'Prospect company name' },
        title: { type: 'string', description: 'Prospect job title' },
        email: { type: 'string', description: 'Prospect email address' },
        context: { type: 'string', description: 'Additional context about the lead' },
      },
      required: ['company', 'title', 'email'],
    },
  },
];

export async function handleLeadScoringTool(
  name: string,
  args: Record<string, unknown>,
  config: Config,
): Promise<unknown> {
  if (name !== 'lead_score') return null;

  if (!config.anthropicApiKey) {
    return { error: 'API key not configured. Set ANTHROPIC_API_KEY env var.' };
  }

  const { company, title, email, context } = args as { company: string; title: string; email: string; context?: string };

  // Validate inputs
  if (!company || company.length > 500) {
    return { error: 'company is required (max 500 chars)' };
  }
  if (!title || title.length > 200) {
    return { error: 'title is required (max 200 chars)' };
  }
  if (!email || !email.includes('@')) {
    return { error: 'valid email is required' };
  }
  if (context && context.length > 5000) {
    return { error: 'context exceeds 5000 char limit' };
  }

  const client = new Anthropic({ apiKey: config.anthropicApiKey });

  const prompt = `You are a B2B sales qualification expert. Score this lead from 0-100 and provide a grade (A/B/C/D/F).

Lead details:
- Company: ${company}
- Title: ${title}
- Email: ${email}
${context ? `- Context: ${context}` : ''}

Respond with JSON only:
{
  "score": <0-100>,
  "grade": "<A|B|C|D|F>",
  "rationale": "<2-3 sentence explanation>",
  "suggestedActions": ["<action1>", "<action2>"]
}`;

  try {
    const message = await client.messages.create({
      model: config.leadScoringModel ?? 'claude-3-5-haiku-20241022',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    // Try direct parse first (Claude often returns pure JSON)
    let parsed: unknown;
    try {
      parsed = JSON.parse(text.trim());
    } catch {
      // Fallback: extract first complete JSON object (non-greedy)
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) throw new Error('No JSON found in Claude response');
      parsed = JSON.parse(jsonMatch[0]);
    }

    // Validate required fields
    const result = parsed as Record<string, unknown>;
    if (typeof result.score !== 'number' || typeof result.grade !== 'string') {
      throw new Error('Invalid lead score response: missing score or grade');
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: `Lead scoring failed: ${message}` };
  }
}
