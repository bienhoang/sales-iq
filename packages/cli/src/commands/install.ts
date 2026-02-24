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

export interface InstallResult {
  installed: number;
  skipped: number;
  errors: string[];
}

/** Pure install logic — no console I/O. Safe to call from wizard with spinner. */
export async function installSkills(opts: InstallOptions): Promise<InstallResult> {
  const targetDir = opts.local ? getLocalSkillsDir() : getGlobalSkillsDir();
  const sourceDir = getSkillsSourceDir();

  const clusters = resolveClusters(opts.skills);
  if (clusters.length === 0) {
    return { installed: 0, skipped: 0, errors: [`Unknown cluster(s): "${opts.skills}"`] };
  }

  await ensureDir(targetDir);

  let installed = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const cluster of clusters) {
    const src = path.join(sourceDir, cluster);
    const dest = path.join(targetDir, cluster);

    if (!(await fileExists(src))) {
      errors.push(`Cluster source not found: ${src}`);
      continue;
    }

    if (!opts.force && (await fileExists(dest))) {
      skipped++;
      continue;
    }

    try {
      await copyDir(src, dest);
      installed++;
    } catch (err) {
      errors.push(`${cluster}/: ${(err as Error).message}`);
    }
  }

  // Always copy shared/ context files
  const sharedSrc = path.join(sourceDir, 'shared');
  const sharedDest = path.join(targetDir, 'shared');

  if (await fileExists(sharedSrc)) {
    if (!opts.force && (await fileExists(sharedDest))) {
      skipped++;
    } else {
      try {
        await copyDir(sharedSrc, sharedDest);
        installed++;
      } catch (err) {
        errors.push(`shared/: ${(err as Error).message}`);
      }
    }
  }

  return { installed, skipped, errors };
}

/** CLI wrapper — logs output to console. */
export async function runInstall(opts: InstallOptions): Promise<void> {
  const targetDir = opts.local ? getLocalSkillsDir() : getGlobalSkillsDir();
  console.log(chalk.cyan(`\nInstalling sales-iq skills to: ${targetDir}\n`));

  const result = await installSkills(opts);

  if (result.errors.length > 0) {
    for (const err of result.errors) {
      console.error(chalk.red(`  Failed   ${err}`));
    }
  }

  console.log(
    `\n${chalk.bold('Done.')} ${chalk.green(`${result.installed} installed`)}, ${chalk.yellow(`${result.skipped} skipped`)}.`
  );
}

function resolveClusters(input: string): SkillCluster[] {
  if (input === 'all') return [...SKILL_CLUSTERS];
  return input
    .split(',')
    .map((s) => s.trim() as SkillCluster)
    .filter((s) => (SKILL_CLUSTERS as readonly string[]).includes(s));
}
