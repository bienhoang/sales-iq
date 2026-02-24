import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import type { Command } from 'commander';
import {
  getSkillsSourceDir,
  getGlobalSkillsDir,
  getLocalSkillsDir,
  SKILL_CLUSTERS,
  type SkillCluster,
} from '../utils/paths.js';
import { copyDir, ensureDir, fileExists, listDirs } from '../utils/file-ops.js';

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

  // Flatten: copy each siq-* subdirectory directly into ~/.claude/skills/
  // Cluster skills are nested (e.g. marketing/siq-brand-strategy/) but installed flat (siq-brand-strategy/).
  // Relative paths like ../../shared/ must be rewritten to ../shared/ after flattening.
  for (const cluster of clusters) {
    const clusterSrc = path.join(sourceDir, cluster);

    if (!(await fileExists(clusterSrc))) {
      errors.push(`Cluster source not found: ${clusterSrc}`);
      continue;
    }

    const skillDirs = await listDirs(clusterSrc);
    for (const skillDir of skillDirs) {
      if (!skillDir.startsWith('siq-')) continue;

      const src = path.join(clusterSrc, skillDir);
      const dest = path.join(targetDir, skillDir);

      if (!opts.force && (await fileExists(dest))) {
        skipped++;
        continue;
      }

      try {
        await copyDir(src, dest);
        await fixFlattenedPaths(dest, cluster);
        installed++;
      } catch (err) {
        errors.push(`${skillDir}/: ${(err as Error).message}`);
      }
    }
  }

  // Copy root-level siq-* standalone skills (brainstorm, scout, etc.)
  const rootDirs = await listDirs(sourceDir);
  for (const dir of rootDirs) {
    if (!dir.startsWith('siq-')) continue;

    const src = path.join(sourceDir, dir);
    const dest = path.join(targetDir, dir);

    if (!opts.force && (await fileExists(dest))) {
      skipped++;
      continue;
    }

    try {
      await copyDir(src, dest);
      installed++;
    } catch (err) {
      errors.push(`${dir}/: ${(err as Error).message}`);
    }
  }

  // Copy shared/ context files (references used by skills)
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

/**
 * Fix relative paths and inject cluster metadata after flattening.
 * Cluster skills use ../../ to reach the skills root (e.g. ../../shared/),
 * but after flattening one level of nesting, it should be ../ instead.
 * Also injects `cluster` into SKILL.md frontmatter for `list` command grouping.
 */
async function fixFlattenedPaths(skillDir: string, cluster: string): Promise<void> {
  const entries = await fs.readdir(skillDir, { withFileTypes: true, recursive: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const filePath = path.join(entry.parentPath ?? entry.path, entry.name);
    let content = await fs.readFile(filePath, 'utf-8');

    // ../../shared/ → ../shared/ (skills root reference)
    content = content.replace(/\.\.\/\.\.\/shared\//g, '../shared/');

    // Inject cluster into SKILL.md frontmatter
    if (entry.name === 'SKILL.md' && content.startsWith('---\n')) {
      content = content.replace(/^---\n/, `---\ncluster: ${cluster}\n`);
    }

    await fs.writeFile(filePath, content, 'utf-8');
  }
}
