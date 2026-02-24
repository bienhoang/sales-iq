export const campaignLaunchPromptDefinition = {
  name: 'campaign_launch',
  description: 'Generate a structured brief for launching a new marketing campaign',
  arguments: [
    { name: 'product', description: 'Product or service being promoted', required: true },
    { name: 'audience', description: 'Target audience description', required: true },
    { name: 'goal', description: 'Campaign goal (e.g. awareness, leads, conversions)', required: true },
    { name: 'channels', description: 'Comma-separated list of channels (email, twitter, linkedin)', required: false },
    { name: 'budget', description: 'Approximate campaign budget', required: false },
  ],
};

export function getCampaignLaunchPrompt(args: Record<string, string>): string {
  const { product, audience, goal, channels = 'email, social', budget = 'unspecified' } = args;

  return `You are an expert marketing strategist. Create a comprehensive campaign launch plan.

## Campaign Brief
- **Product/Service:** ${product}
- **Target Audience:** ${audience}
- **Primary Goal:** ${goal}
- **Channels:** ${channels}
- **Budget:** ${budget}

## Deliverables Requested

1. **Campaign Theme & Messaging**
   - Core value proposition (1 sentence)
   - Key messages for each audience segment
   - Tone and voice guidelines

2. **Channel Strategy**
   For each channel in [${channels}]:
   - Content format recommendations
   - Posting frequency
   - Key CTAs

3. **Launch Timeline**
   - Pre-launch (1-2 weeks before)
   - Launch week activities
   - Post-launch follow-up

4. **Success Metrics**
   - Primary KPIs aligned with goal: ${goal}
   - Measurement methods
   - 30-day targets

5. **Quick Wins**
   - 3 immediate actions to start today

Provide actionable, specific recommendations.`;
}
