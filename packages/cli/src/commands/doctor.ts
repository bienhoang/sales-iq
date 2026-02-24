import chalk from 'chalk';
import path from 'path';
import os from 'os';
import type { Command } from 'commander';
import {
  getGlobalSkillsDir,
  getClaudeSettingsPath,
  SKILL_CLUSTERS,
} from '../utils/paths.js';
import { fileExists, readJson, listDirs, readText } from '../utils/file-ops.js';

const PASS = chalk.green('  [ok]');
const FAIL = chalk.red('  [!!]');
const WARN = chalk.yellow('  [--]');

export interface DoctorResult {
  issues: number;
  warnings: number;
  checks: { label: string; status: 'pass' | 'fail' | 'warn' }[];
}

export function registerDoctor(program: Command): void {
  program
    .command('doctor')
    .description('Check installation health')
    .action(async () => {
      const result = await runDoctor();
      process.exitCode = result.issues > 0 ? 1 : 0;
    });
}

/** Returns structured result so setup wizard can call programmatically. */
export async function runDoctor(): Promise<DoctorResult> {
  console.log(chalk.bold('\n  sales-iq doctor\n'));

  const result: DoctorResult = { issues: 0, warnings: 0, checks: [] };

  // 1. Node.js version
  const nodeVersion = process.versions.node;
  const major = parseInt(nodeVersion.split('.')[0], 10);
  if (major >= 20) {
    console.log(`${PASS} Node.js v${nodeVersion}`);
    result.checks.push({ label: `Node.js v${nodeVersion}`, status: 'pass' });
  } else {
    console.log(`${FAIL} Node.js v${nodeVersion} — requires v20+`);
    result.issues++;
    result.checks.push({ label: `Node.js v${nodeVersion}`, status: 'fail' });
  }

  // 2. npmrc registry
  const npmrcPath = path.join(os.homedir(), '.npmrc');
  const npmrcContent = await readText(npmrcPath);
  if (npmrcContent?.includes('@bienhoang:registry=')) {
    console.log(`${PASS} ~/.npmrc has @bienhoang registry`);
    result.checks.push({ label: '~/.npmrc registry', status: 'pass' });
  } else {
    console.log(`${FAIL} ~/.npmrc missing @bienhoang registry`);
    console.log(chalk.dim('       Run setup.sh or add manually: @bienhoang:registry=https://npm.pkg.github.com'));
    result.issues++;
    result.checks.push({ label: '~/.npmrc registry', status: 'fail' });
  }

  // 3. Skills per cluster
  const skillsDir = getGlobalSkillsDir();
  for (const cluster of SKILL_CLUSTERS) {
    const clusterDir = path.join(skillsDir, cluster);
    if (await fileExists(clusterDir)) {
      const skills = await listDirs(clusterDir);
      console.log(`${PASS} ${cluster}/ — ${skills.length} skill(s)`);
      result.checks.push({ label: `${cluster}/`, status: 'pass' });
    } else {
      console.log(`${FAIL} ${cluster}/ — not installed`);
      result.issues++;
      result.checks.push({ label: `${cluster}/`, status: 'fail' });
    }
  }

  // 4. Brand context
  const brandPath = path.join(skillsDir, 'shared', 'brand-context.md');
  if (await fileExists(brandPath)) {
    console.log(`${PASS} brand-context.md exists`);
    result.checks.push({ label: 'brand-context.md', status: 'pass' });
  } else {
    console.log(`${FAIL} brand-context.md missing`);
    console.log(chalk.dim('       Run: sales-iq setup'));
    result.issues++;
    result.checks.push({ label: 'brand-context.md', status: 'fail' });
  }

  // 5. MCP config (optional)
  const settingsPath = getClaudeSettingsPath(true);
  const settings = await readJson<Record<string, unknown>>(settingsPath);
  const mcpServers = settings?.mcpServers as Record<string, unknown> | undefined;
  if (mcpServers?.['sales-iq']) {
    console.log(`${PASS} MCP server configured`);
    result.checks.push({ label: 'MCP server', status: 'pass' });
  } else {
    console.log(`${WARN} MCP server not configured (optional)`);
    console.log(chalk.dim('       Run: sales-iq configure --mcp'));
    result.warnings++;
    result.checks.push({ label: 'MCP server', status: 'warn' });
  }

  // Summary
  console.log();
  if (result.issues === 0) {
    console.log(chalk.green('  All checks passed. You\'re good to go!\n'));
  } else {
    console.log(chalk.yellow(`  ${result.issues} issue(s) found. See above for fixes.\n`));
  }

  return result;
}
