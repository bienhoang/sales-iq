import chalk from 'chalk';
import ora from 'ora';
import type { Command } from 'commander';
import { installSkills } from './install.js';
import { setupMcpServer } from './configure.js';
import { runDoctor } from './doctor.js';

export function registerSetup(program: Command): void {
  program
    .command('setup')
    .description('Install skills, configure MCP, and run health check')
    .action(async () => {
      await runSetup();
    });
}

export async function runSetup(): Promise<void> {
  console.log(chalk.bold('\n  sales-iq — Installing...\n'));
  console.log(chalk.dim('  AI-powered sales & marketing toolkit for Claude Code.\n'));

  // 1. Install all skills (silent — no prompts)
  const skillSpinner = ora('Installing skills...').start();
  try {
    const result = await installSkills({
      skills: 'all',
      global: true,
      local: false,
      force: false,
    });

    if (result.errors.length > 0) {
      skillSpinner.fail(`Install had errors: ${result.errors.join(', ')}`);
    } else {
      skillSpinner.succeed(`Skills installed (${result.installed} skills)`);
    }
  } catch (err) {
    skillSpinner.fail(`Install failed: ${(err as Error).message}`);
    process.exit(1);
  }

  // 2. Configure MCP server
  const mcpSpinner = ora('Configuring MCP server...').start();
  try {
    const settingsPath = await setupMcpServer();
    mcpSpinner.succeed(`MCP server configured (${settingsPath})`);
  } catch (err) {
    mcpSpinner.fail(`MCP config failed: ${(err as Error).message}`);
  }

  // 3. Health check
  console.log(chalk.dim('\n  Running health check...\n'));
  await runDoctor();

  // Next steps
  console.log(chalk.bold('\n  Next step:\n'));
  console.log(chalk.cyan('    sales-iq init') + chalk.dim('  — create a project for your product'));
  console.log(chalk.dim('    (or: npx @bienhoang/sales-iq init)\n'));
}
