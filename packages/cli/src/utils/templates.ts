/** Template generators for init command output files. */

export interface BrandInput {
  name: string;
  slug: string;
  industry: string;
  audience: string;
  tones: string[];
}

/** CLAUDE.md — auto-loaded by Claude Code when user cd's into project dir */
export function generateClaudeMd(input: BrandInput): string {
  const toneStr = input.tones.join(', ');
  return `# ${input.name} — Sales & Marketing Context

## Brand
- **Company**: ${input.name}
- **Industry**: ${input.industry}
- **Audience**: ${input.audience}
- **Tone**: ${toneStr}

See \`brand-context.md\` for detailed brand voice and messaging guidelines.

## Skills
This project uses sales-iq skills installed at \`~/.claude/skills/\`.

### Quick Start
- \`/siq-brand-strategy\` — Define positioning, voice, and messaging pillars
- \`/siq-email-campaign\` — Draft email sequences for any lifecycle stage
- \`/siq-ad-copy\` — Write ad copy for Meta, Google, LinkedIn
- \`/siq-content-repurpose\` — Transform content across formats and channels
- \`/siq-competitor-intel\` — Analyze competitors and create intelligence docs
- \`/siq-account-strategy\` — Build account plans and stakeholder maps
- \`/siq-strategy-consultant\` — Run SWOT, Porter's, or other strategic frameworks
- \`/siq-seo-content\` — Create SEO-optimized blog posts and pillar pages
- \`/siq-social-media-post\` — Generate social media posts across platforms
- \`/siq-outreach-sequence\` — Create multi-touch outreach sequences

## Files
- \`brand-context.md\` — Brand voice, ICP, messaging guidelines (edit this!)
- \`brand-context.json\` — Structured brand data for tools
- \`.sales-iq.json\` — Project config (auto-managed)

## Workspace
Skills auto-save deliverables to \`workspace/\` organized by content type.
Directories are created on-demand when skills generate output.

| Directory | Content |
|-----------|---------|
| \`workspace/proposals/\` | Business proposals, pricing quotes |
| \`workspace/emails/\` | Email campaigns, follow-up sequences |
| \`workspace/outreach/\` | Cold email and LinkedIn sequences |
| \`workspace/ad-copy/\` | Meta, Google, LinkedIn ad copy |
| \`workspace/content/\` | SEO content, repurposed content |
| \`workspace/social/\` | Social posts, calendars, community content |
| \`workspace/intel/\` | Competitor analysis, lead scorecards |
| \`workspace/reports/\` | Pipeline reports, marketing metrics |
| \`workspace/strategy/\` | Brand strategy, consulting frameworks |
| \`workspace/sales-prep/\` | Demo prep, objection playbooks, account plans |
| \`workspace/research/\` | Research reports, brainstorm summaries |

File naming: \`{descriptor}-{YYYY-MM-DD}.md\`
`;
}

/** brand-context.md — detailed brand context template */
export function generateBrandContextMd(input: BrandInput): string {
  const date = new Date().toISOString().split('T')[0];
  const toneStr = input.tones.join(', ');
  return `---
generated-by: sales-iq init
date: ${date}
---

# Brand Context

## Company Overview
- **Name**: ${input.name}
- **Industry**: ${input.industry}
- **Target Audience**: ${input.audience}

## Brand Voice
- Tone: ${toneStr}
- Style: (add your style guidelines)

## Key Messages
- Add your core value proposition here
- Add your key differentiators here

## ICP (Ideal Customer Profile)
- Add your primary ICP details here

## Competitive Positioning
- Add your main competitors here
- Add your unique advantages here

_Update this file with your actual brand details to improve skill outputs._
`;
}

/** brand-context.json — structured brand data */
export function generateBrandContextJson(input: BrandInput): Record<string, unknown> {
  return {
    name: input.name,
    industry: input.industry,
    audience: input.audience,
    tones: input.tones,
  };
}

/** .sales-iq.json — project config metadata */
export function generateProjectConfig(input: BrandInput): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    name: input.name,
    slug: input.slug,
    version: '1.0.0',
    created: now,
    updated: now,
  };
}
