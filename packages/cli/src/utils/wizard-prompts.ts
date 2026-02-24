import type { PromptObject } from 'prompts';
import { SKILL_CLUSTERS } from './paths.js';

const INDUSTRIES = [
  { title: 'SaaS / Software', value: 'saas' },
  { title: 'E-commerce / Retail', value: 'ecommerce' },
  { title: 'FinTech / Finance', value: 'fintech' },
  { title: 'HealthTech / Healthcare', value: 'healthtech' },
  { title: 'EdTech / Education', value: 'edtech' },
  { title: 'Agency / Consulting', value: 'agency' },
  { title: 'Developer Tools', value: 'developer-tools' },
  { title: 'Other (type below)', value: 'other' },
];

const TONES = [
  { title: 'Professional', value: 'professional', selected: true },
  { title: 'Conversational', value: 'conversational' },
  { title: 'Technical', value: 'technical' },
  { title: 'Bold / Edgy', value: 'bold' },
  { title: 'Warm / Friendly', value: 'warm' },
  { title: 'Authoritative', value: 'authoritative' },
];

const CLUSTER_CHOICES = SKILL_CLUSTERS.map((c) => ({
  title: c.charAt(0).toUpperCase() + c.slice(1),
  value: c,
  selected: true,
}));

export function getBrandPrompts(): PromptObject[] {
  return [
    {
      type: 'text',
      name: 'brandName',
      message: 'What is your company or product name?',
      validate: (v: string) => v.trim().length > 0 || 'Name is required',
    },
    {
      type: 'select',
      name: 'industry',
      message: 'What industry are you in?',
      choices: INDUSTRIES,
    },
    {
      type: (prev: string) => (prev === 'other' ? 'text' : null),
      name: 'industryCustom',
      message: 'Type your industry:',
    },
    {
      type: 'text',
      name: 'audience',
      message: 'Who is your target audience? (e.g., "startup founders", "HR managers")',
    },
    {
      type: 'multiselect',
      name: 'tones',
      message: 'Pick your brand tone (space to select, enter to confirm):',
      choices: TONES,
      min: 1,
      hint: '- Space to select. Enter to submit',
    },
  ];
}

export function getClusterPrompts(): PromptObject[] {
  return [
    {
      type: 'multiselect',
      name: 'clusters',
      message: 'Which skill clusters do you want?',
      choices: CLUSTER_CHOICES,
      min: 1,
      hint: '- Space to select. Enter to submit',
    },
  ];
}

/** Resolve industry value -- use custom input if "other" was selected */
export function resolveIndustry(answers: Record<string, unknown>): string {
  return answers.industry === 'other'
    ? (answers.industryCustom as string) ?? 'Other'
    : (answers.industry as string);
}
