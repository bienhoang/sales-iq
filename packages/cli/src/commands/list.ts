import path from 'path';
import chalk from 'chalk';
import type { Command } from 'commander';
import { getGlobalSkillsDir, getLocalSkillsDir } from '../utils/paths.js';
import { listDirs, readText, fileExists } from '../utils/file-ops.js';

interface ListOptions {
  local: boolean;
}

interface SkillInfo {
  name: string;
  description: string;
  cluster: string;
}

export function registerList(program: Command): void {
  program
    .command('list')
    .description('List installed sales-iq skills')
    .option('--local', 'List from local ./.claude/skills instead of global', false)
    .action(async (opts: ListOptions) => {
      const targetDir = opts.local ? getLocalSkillsDir() : getGlobalSkillsDir();

      if (!(await fileExists(targetDir))) {
        console.log(chalk.yellow(`No skills installed at: ${targetDir}`));
        console.log(chalk.cyan('Run: sales-iq install'));
        return;
      }

      const skills = await collectSkills(targetDir);

      if (skills.length === 0) {
        console.log(chalk.yellow(`No SKILL.md files found in: ${targetDir}`));
        return;
      }

      console.log(chalk.bold(`\nInstalled skills (${targetDir}):\n`));

      // Group by cluster
      const byCluster = groupByCluster(skills);
      for (const [cluster, clusterSkills] of Object.entries(byCluster)) {
        console.log(chalk.cyan(`  ${cluster}/`));
        for (const skill of clusterSkills) {
          console.log(chalk.green(`    ${skill.name.padEnd(32)}`) + chalk.dim(skill.description));
        }
        console.log();
      }

      console.log(chalk.dim(`Total: ${skills.length} skill(s)`));
    });
}

async function collectSkills(targetDir: string): Promise<SkillInfo[]> {
  const clusters = await listDirs(targetDir);
  const skills: SkillInfo[] = [];

  for (const cluster of clusters) {
    if (cluster === 'shared') continue;
    const clusterDir = path.join(targetDir, cluster);
    const skillDirs = await listDirs(clusterDir);

    for (const skillDir of skillDirs) {
      const skillMdPath = path.join(clusterDir, skillDir, 'SKILL.md');
      const content = await readText(skillMdPath);
      if (!content) continue;

      const info = parseFrontmatter(content);
      skills.push({
        name: info.name ?? skillDir,
        description: info.description ?? '',
        cluster,
      });
    }
  }

  return skills;
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const result: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    result[key] = value;
  }
  return result;
}

function groupByCluster(skills: SkillInfo[]): Record<string, SkillInfo[]> {
  return skills.reduce<Record<string, SkillInfo[]>>((acc, skill) => {
    (acc[skill.cluster] ??= []).push(skill);
    return acc;
  }, {});
}
