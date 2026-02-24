import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import type { Command } from 'commander';
import { getBrandPrompts, resolveIndustry } from '../utils/wizard-prompts.js';
import { toSlug } from '../utils/slug-utils.js';
import { ensureDir, fileExists, readJson, writeJson } from '../utils/file-ops.js';
import {
  generateClaudeMd,
  generateBrandContextMd,
  generateBrandContextJson,
  generateProjectConfig,
  type BrandInput,
} from '../utils/templates.js';

export function registerInit(program: Command): void {
  program
    .command('init')
    .description('Create a new project for a product or company')
    .action(async () => {
      await runInit();
    });
}

async function runInit(): Promise<void> {
  console.log(chalk.bold('\n  sales-iq — New Project\n'));
  console.log(chalk.dim('  Answer a few questions to set up your brand context.\n'));

  // 1. Brand questions (reuse from wizard-prompts)
  const answers = await prompts(getBrandPrompts(), {
    onCancel: () => process.exit(0),
  });

  const industry = resolveIndustry(answers);
  const slug = toSlug(answers.brandName ?? '');

  if (!slug) {
    console.log(chalk.red('\n  Could not generate a valid directory name. Try a different name.\n'));
    process.exit(1);
  }

  const projectDir = path.resolve(process.cwd(), slug);
  const configPath = path.join(projectDir, '.sales-iq.json');

  // 2. Check if project already exists
  const existingConfig = await readJson<Record<string, unknown>>(configPath);

  if (existingConfig) {
    console.log(chalk.yellow(`\n  Project "${slug}" already exists. Updating config...\n`));
  } else if (await fileExists(projectDir)) {
    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: `Directory "${slug}" exists but is not a sales-iq project. Continue?`,
      initial: false,
    });
    if (!proceed) return;
  }

  // 3. Build input
  const input: BrandInput = {
    name: answers.brandName,
    slug,
    industry,
    audience: answers.audience ?? '',
    tones: answers.tones ?? ['professional'],
  };

  // 4. Write files
  const spinner = ora('Creating project...').start();
  try {
    await ensureDir(projectDir);

    // CLAUDE.md — regenerate (auto-managed, not user-edited)
    const claudeMdPath = path.join(projectDir, 'CLAUDE.md');
    if (existingConfig && await fileExists(claudeMdPath)) {
      console.log(chalk.dim('  Updating CLAUDE.md with new brand info...'));
    }
    await fs.writeFile(claudeMdPath, generateClaudeMd(input), 'utf-8');

    // brand-context.md — only create if new, preserve user edits on re-init
    const brandMdPath = path.join(projectDir, 'brand-context.md');
    if (existingConfig) {
      // Re-init: don't overwrite user-edited brand-context.md
      spinner.text = 'Updating project config...';
    } else {
      await fs.writeFile(brandMdPath, generateBrandContextMd(input), 'utf-8');
    }

    // brand-context.json — always update (structured data)
    await writeJson(path.join(projectDir, 'brand-context.json'), generateBrandContextJson(input));

    // .sales-iq.json — create or update
    if (existingConfig) {
      const updated = {
        ...existingConfig,
        name: input.name,
        slug: input.slug,
        industry: input.industry,
        audience: input.audience,
        tones: input.tones,
        updated: new Date().toISOString(),
      };
      await writeJson(configPath, updated);
    } else {
      await writeJson(configPath, generateProjectConfig(input));
    }

    spinner.succeed(existingConfig ? `Project updated: ${slug}/` : `Project created: ${slug}/`);
  } catch (err) {
    spinner.fail(`Failed: ${(err as Error).message}`);
    process.exit(1);
  }

  // 5. Next steps
  console.log(chalk.bold('\n  Next steps:\n'));
  console.log(`    ${chalk.cyan(`cd ${slug}`)}`);
  console.log(`    ${chalk.cyan('claude')}\n`);
  console.log(chalk.dim('  Claude Code will auto-load your brand context from CLAUDE.md.\n'));
}
