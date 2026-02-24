import chalk from 'chalk';
import prompts from 'prompts';
import path from 'path';
import type { Command } from 'commander';
import {
  getGlobalSkillsDir,
  getClaudeSettingsPath,
  SKILL_CLUSTERS,
} from '../utils/paths.js';
import { fileExists, readJson, writeJson, removeDir } from '../utils/file-ops.js';

export function registerUninstall(program: Command): void {
  program
    .command('uninstall')
    .description('Remove installed skills and optionally MCP config')
    .action(async () => {
      await runUninstall();
    });
}

export async function runUninstall(): Promise<void> {
  console.log(chalk.bold('\n  sales-iq uninstall\n'));

  const onCancel = () => process.exit(0);

  const { confirmed } = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message: 'Remove all sales-iq skills from ~/.claude/skills?',
    initial: false,
  }, { onCancel });

  if (!confirmed) {
    console.log(chalk.dim('  Cancelled.\n'));
    return;
  }

  const skillsDir = getGlobalSkillsDir();
  let removed = 0;

  for (const cluster of SKILL_CLUSTERS) {
    const clusterDir = path.join(skillsDir, cluster);
    if (await fileExists(clusterDir)) {
      await removeDir(clusterDir);
      console.log(chalk.green(`  Removed ${cluster}/`));
      removed++;
    }
  }

  // Remove shared/
  const sharedDir = path.join(skillsDir, 'shared');
  if (await fileExists(sharedDir)) {
    await removeDir(sharedDir);
    console.log(chalk.green('  Removed shared/'));
    removed++;
  }

  // MCP config removal (optional)
  const { removeMcp } = await prompts({
    type: 'confirm',
    name: 'removeMcp',
    message: 'Also remove MCP server config from Claude settings?',
    initial: false,
  }, { onCancel });

  if (removeMcp) {
    await removeMcpConfig();
  }

  console.log();
  if (removed > 0) {
    console.log(chalk.green(`  Done. Removed ${removed} director(ies).\n`));
  } else {
    console.log(chalk.yellow('  Nothing to remove — skills were not installed.\n'));
  }
}

async function removeMcpConfig(): Promise<void> {
  const settingsPath = getClaudeSettingsPath(true);
  const settings = await readJson<Record<string, unknown>>(settingsPath);

  if (!settings) return;

  const mcpServers = settings.mcpServers as Record<string, unknown> | undefined;
  if (!mcpServers?.['sales-iq']) {
    console.log(chalk.dim('  MCP config not found — skipped.'));
    return;
  }

  delete mcpServers['sales-iq'];
  await writeJson(settingsPath, settings);
  console.log(chalk.green('  Removed sales-iq from MCP config'));
}
