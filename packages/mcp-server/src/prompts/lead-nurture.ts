export const leadNurturePromptDefinition = {
  name: 'lead_nurture',
  description: 'Generate a lead nurture sequence for a prospect',
  arguments: [
    { name: 'firstName', description: 'Prospect first name', required: true },
    { name: 'company', description: 'Prospect company name', required: true },
    { name: 'painPoint', description: 'Primary pain point or challenge they face', required: true },
    { name: 'stage', description: 'Deal stage: awareness, consideration, or decision', required: false },
    { name: 'touchpoints', description: 'Number of touchpoints to generate (default 3)', required: false },
  ],
};

export function getLeadNurturePrompt(args: Record<string, string>): string {
  const { firstName, company, painPoint, stage = 'consideration', touchpoints = '3' } = args;

  return `You are a B2B sales expert specializing in lead nurturing. Create a personalized nurture sequence.

## Prospect Profile
- **Name:** ${firstName}
- **Company:** ${company}
- **Pain Point:** ${painPoint}
- **Buyer Stage:** ${stage}
- **Touchpoints:** ${touchpoints}

## Nurture Sequence Requirements

Create ${touchpoints} touchpoints spaced 3-5 days apart. For each touchpoint provide:

### Touchpoint Format
- **Type:** (email / LinkedIn message / call script)
- **Timing:** Day X
- **Subject/Opening:** (for email/message)
- **Body:** (2-4 sentences, personalized to ${firstName} at ${company})
- **CTA:** (one clear next step)
- **Value Add:** (insight, resource, or case study to include)

## Guiding Principles
- Address the pain point: "${painPoint}" in every touchpoint
- Buyer stage is "${stage}" — calibrate urgency and depth accordingly
- Keep emails under 150 words
- Each touchpoint must offer new value, not just follow up
- Avoid generic phrases like "just checking in" or "circling back"

Generate the full ${touchpoints}-touchpoint sequence now.`;
}
