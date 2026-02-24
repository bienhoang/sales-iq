import path from 'path';
import chalk from 'chalk';
import type { Command } from 'commander';
import {
  getSkillsSourceDir,
  getGlobalSkillsDir,
  getLocalSkillsDir,
  SKILL_CLUSTERS,
  type SkillCluster,
} from '../utils/paths.js';
import { copyDir, ensureDir, fileExists } from '../utils/file-ops.js';

interface InstallOptions {
  skills: string;
  global: boolean;
  local: boolean;
  force: boolean;
}

export function registerInstall(program: Command): void {
  program
    .command('install')
    .description('Copy sales-iq skills to ~/.claude/skills (or local .claude/skills)')
    .option(
      '--skills <clusters>',
      'Comma-separated cluster names or "all"',
      'all'
    )
    .option('--global', 'Install to ~/.claude/skills (default)', false)
    .option('--local', 'Install to ./.claude/skills', false)
    .option('--force', 'Overwrite existing skills', false)
    .action(async (opts: InstallOptions) => {
      await runInstall(opts);
    });
}

export async function runInstall(opts: InstallOptions): Promise<void> {
  const targetDir = opts.local ? getLocalSkillsDir() : getGlobalSkillsDir();
  const sourceDir = getSkillsSourceDir();

  const clusters = resolveClusters(opts.skills);
  if (clusters.length === 0) {
    console.error(chalk.red(`Unknown cluster(s): "${opts.skills}". Valid: ${SKILL_CLUSTERS.join(', ')}, all`));
    process.exit(1);
  }

  console.log(chalk.cyan(`\nInstalling sales-iq skills to: ${targetDir}\n`));

  await ensureDir(targetDir);

  let installed = 0;
  let skipped = 0;

  for (const cluster of clusters) {
    const src = path.join(sourceDir, cluster);
    const dest = path.join(targetDir, cluster);

    if (!(await fileExists(src))) {
      console.warn(chalk.yellow(`  Warning: cluster source not found: ${src}`));
      continue;
    }

    if (!opts.force && (await fileExists(dest))) {
      console.log(chalk.yellow(`  Skipped  ${cluster}/ (already exists — use --force to overwrite)`));
      skipped++;
      continue;
    }

    try {
      await copyDir(src, dest);
      console.log(chalk.green(`  Installed ${cluster}/`));
      installed++;
    } catch (err) {
      console.error(chalk.red(`  Failed   ${cluster}/: ${(err as Error).message}`));
    }
  }

  // Always copy shared/ context files
  const sharedSrc = path.join(sourceDir, 'shared');
  const sharedDest = path.join(targetDir, 'shared');

  if (await fileExists(sharedSrc)) {
    if (!opts.force && (await fileExists(sharedDest))) {
      console.log(chalk.yellow(`  Skipped  shared/ (already exists — use --force to overwrite)`));
      skipped++;
    } else {
      try {
        await copyDir(sharedSrc, sharedDest);
        console.log(chalk.green(`  Installed shared/`));
        installed++;
      } catch (err) {
        console.error(chalk.red(`  Failed   shared/: ${(err as Error).message}`));
      }
    }
  }

  console.log(
    `\n${chalk.bold('Done.')} ${chalk.green(`${installed} installed`)}, ${chalk.yellow(`${skipped} skipped`)}.`
  );
}

function resolveClusters(input: string): SkillCluster[] {
  if (input === 'all') return [...SKILL_CLUSTERS];
  return input
    .split(',')
    .map((s) => s.trim() as SkillCluster)
    .filter((s) => (SKILL_CLUSTERS as readonly string[]).includes(s));
}
