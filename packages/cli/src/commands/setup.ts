import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import path from 'path';
import fs from 'fs/promises';
import type { Command } from 'commander';
import { installSkills } from './install.js';
import { runDoctor } from './doctor.js';
import {
  getBrandPrompts,
  resolveIndustry,
} from '../utils/wizard-prompts.js';
import { getGlobalSkillsDir, SKILL_CLUSTERS } from '../utils/paths.js';
import { ensureDir, writeJson } from '../utils/file-ops.js';

export function registerSetup(program: Command): void {
  program
    .command('setup')
    .description('Interactive setup wizard — no flags needed')
    .action(async () => {
      await runSetup();
    });
}

export async function runSetup(): Promise<void> {
  console.log(chalk.bold('\n  Welcome to sales-iq!\n'));
  console.log(chalk.dim('  AI-powered sales & marketing toolkit for Claude Code.\n'));

  // --- Brand questions ---
  const brandAnswers = await prompts(getBrandPrompts(), { onCancel: () => process.exit(0) });
  const industry = resolveIndustry(brandAnswers);

  // Install all skill clusters
  const clusters: string[] = [...SKILL_CLUSTERS];

  // --- Install skills ---
  const spinner = ora('Installing skills...').start();
  try {
    const result = await installSkills({
      skills: clusters.join(','),
      global: true,
      local: false,
      force: false,
    });

    if (result.errors.length > 0) {
      spinner.fail(`Install had errors: ${result.errors.join(', ')}`);
    } else {
      spinner.succeed(`Skills installed (${result.installed} clusters)`);
    }
  } catch (err) {
    spinner.fail(`Install failed: ${(err as Error).message}`);
    process.exit(1);
  }

  // --- Write brand context ---
  const brandSpinner = ora('Writing brand context...').start();
  try {
    await writeBrandContext({
      name: brandAnswers.brandName,
      industry,
      audience: brandAnswers.audience ?? '',
      tones: brandAnswers.tones ?? ['professional'],
    });
    brandSpinner.succeed('Brand context saved');
  } catch (err) {
    brandSpinner.fail(`Brand context failed: ${(err as Error).message}`);
  }

  // --- Summary ---
  printSummary(clusters);

  // --- Auto-run doctor ---
  console.log(chalk.dim('  Running health check...\n'));
  await runDoctor();
}

interface BrandInput {
  name: string;
  industry: string;
  audience: string;
  tones: string[];
}

async function writeBrandContext(input: BrandInput): Promise<void> {
  const sharedDir = path.join(getGlobalSkillsDir(), 'shared');
  await ensureDir(sharedDir);

  const mdPath = path.join(sharedDir, 'brand-context.md');
  const jsonPath = path.join(sharedDir, 'brand-context.json');

  const content = [
    '---',
    'generated-by: sales-iq setup',
    `date: ${new Date().toISOString().split('T')[0]}`,
    '---',
    '',
    '# Brand Context',
    '',
    '## Company Overview',
    `- **Name**: ${input.name}`,
    `- **Industry**: ${input.industry}`,
    `- **Target Audience**: ${input.audience}`,
    '',
    '## Brand Voice',
    `- Tone: ${input.tones.join(', ')}`,
    '',
    '## Key Messages',
    '- Add your core value proposition here',
    '- Add your key differentiators here',
    '',
    '## ICP (Ideal Customer Profile)',
    '- Add your primary ICP details here',
    '',
    '_Update this file with your actual brand details to improve skill outputs._',
  ].join('\n');

  await fs.writeFile(mdPath, content, 'utf-8');
  await writeJson(jsonPath, {
    name: input.name,
    industry: input.industry,
    audience: input.audience,
    tones: input.tones,
  });
}

function printSummary(clusters: string[]): void {
  console.log(chalk.bold('\n  Setup complete!\n'));
  console.log(chalk.dim('  Installed clusters: ') + clusters.join(', '));
  console.log(chalk.dim('  Brand context: ') + '~/.claude/skills/shared/brand-context.md');

  const suggestions: { cmd: string; desc: string; cluster: string }[] = [
    { cmd: '/siq-brand-strategy', desc: 'set your positioning and voice', cluster: 'marketing' },
    { cmd: '/siq-email-campaign', desc: 'draft an email sequence', cluster: 'marketing' },
    { cmd: '/siq-account-strategy', desc: 'define your sales motion', cluster: 'sales' },
    { cmd: '/siq-strategy-consultant', desc: "run a SWOT or Porter's analysis", cluster: 'strategy' },
  ];

  const relevant = suggestions.filter((s) => clusters.includes(s.cluster)).slice(0, 3);

  if (relevant.length > 0) {
    console.log(chalk.bold('\n  Try these first in Claude Code:\n'));
    for (const s of relevant) {
      console.log(chalk.cyan(`    ${s.cmd.padEnd(28)}`) + chalk.dim(` — ${s.desc}`));
    }
    console.log();
  }
}
