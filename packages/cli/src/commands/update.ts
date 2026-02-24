import chalk from 'chalk';
import type { Command } from 'commander';
import { runInstall } from './install.js';

interface UpdateOptions {
  skills: string;
  global: boolean;
  local: boolean;
}

export function registerUpdate(program: Command): void {
  program
    .command('update')
    .description('Re-install skills from source, overwriting existing files')
    .option('--skills <clusters>', 'Comma-separated cluster names or "all"', 'all')
    .option('--global', 'Update global ~/.claude/skills (default)', false)
    .option('--local', 'Update local ./.claude/skills', false)
    .action(async (opts: UpdateOptions) => {
      console.log(chalk.cyan('\nUpdating sales-iq skills (--force enabled)...\n'));
      await runInstall({ ...opts, force: true });
    });
}
