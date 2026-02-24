import chalk from 'chalk';
import ora from 'ora';
import type { Command } from 'commander';
import { installSkills } from './install.js';
import { runDoctor } from './doctor.js';

export function registerSetup(program: Command): void {
  program
    .command('setup')
    .description('Install skills and run health check (silent, no prompts)')
    .action(async () => {
      await runSetup();
    });
}

export async function runSetup(): Promise<void> {
  console.log(chalk.bold('\n  sales-iq — Installing...\n'));
  console.log(chalk.dim('  AI-powered sales & marketing toolkit for Claude Code.\n'));

  // Install all skills (silent — no prompts)
  const spinner = ora('Installing skills...').start();
  try {
    const result = await installSkills({
      skills: 'all',
      global: true,
      local: false,
      force: false,
    });

    if (result.errors.length > 0) {
      spinner.fail(`Install had errors: ${result.errors.join(', ')}`);
    } else {
      spinner.succeed(`Skills installed (${result.installed} skills)`);
    }
  } catch (err) {
    spinner.fail(`Install failed: ${(err as Error).message}`);
    process.exit(1);
  }

  // Health check
  console.log(chalk.dim('\n  Running health check...\n'));
  await runDoctor();

  // Next steps
  console.log(chalk.bold('\n  Next step:\n'));
  console.log(chalk.cyan('    sales-iq init') + chalk.dim('  — create a project for your product\n'));
}
