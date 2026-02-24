import path from 'path';
import chalk from 'chalk';
import type { Command } from 'commander';
import { getClaudeSettingsPath, getGlobalSkillsDir } from '../utils/paths.js';
import { readJson, writeJson, ensureDir } from '../utils/file-ops.js';

interface ConfigureOptions {
  mcp: boolean;
  brand: boolean;
  global: boolean;
  name?: string;
  industry?: string;
  market?: string;
}

interface McpServerConfig {
  command: string;
  args: string[];
}

interface ClaudeSettings {
  mcpServers?: Record<string, McpServerConfig>;
  [key: string]: unknown;
}

export function registerConfigure(program: Command): void {
  program
    .command('configure')
    .description('Configure MCP server and/or generate brand context')
    .option('--mcp', 'Write MCP server config to Claude settings.json', false)
    .option('--brand', 'Generate brand-context.md in skills directory', false)
    .option('--global', 'Target global ~/.claude config (default)', false)
    .option('--name <name>', 'Company/product name (used with --brand)')
    .option('--industry <industry>', 'Industry vertical (used with --brand)')
    .option('--market <market>', 'Target market description (used with --brand)')
    .action(async (opts: ConfigureOptions) => {
      if (!opts.mcp && !opts.brand) {
        console.log(chalk.yellow('Specify --mcp and/or --brand. See --help for usage.'));
        return;
      }

      if (opts.mcp) await configureMcp(opts);
      if (opts.brand) await configureBrand(opts);
    });
}

/** Write MCP server entry to Claude settings.json (global). */
export async function setupMcpServer(): Promise<string> {
  const settingsPath = getClaudeSettingsPath(true);
  const existing = (await readJson<ClaudeSettings>(settingsPath)) ?? {};

  const updated: ClaudeSettings = {
    ...existing,
    mcpServers: {
      ...(existing.mcpServers ?? {}),
      'sales-iq': {
        command: 'npx',
        args: ['@bienhoang/sales-iq-mcp-server'],
      },
    },
  };

  await writeJson(settingsPath, updated);
  return settingsPath;
}

async function configureMcp(opts: ConfigureOptions): Promise<void> {
  const settingsPath = await setupMcpServer();
  console.log(chalk.green(`MCP server config written to: ${settingsPath}`));
}

async function configureBrand(opts: ConfigureOptions): Promise<void> {
  console.log(chalk.yellow('\n  Note: --brand writes to global ~/.claude/skills/shared/.'));
  console.log(chalk.yellow('  For per-project brand context, use: sales-iq init\n'));

  const skillsDir = getGlobalSkillsDir();
  const sharedDir = path.join(skillsDir, 'shared');
  const brandContextPath = path.join(sharedDir, 'brand-context.md');

  await ensureDir(sharedDir);

  const name = opts.name ?? 'Your Company';
  const industry = opts.industry ?? 'SaaS';
  const market = opts.market ?? 'B2B';

  const content = [
    '---',
    'generated-by: sales-iq configure --brand',
    `date: ${new Date().toISOString().split('T')[0]}`,
    '---',
    '',
    '# Brand Context',
    '',
    '## Company Overview',
    `- **Name**: ${name}`,
    `- **Industry**: ${industry}`,
    `- **Target Market**: ${market}`,
    '',
    '## Brand Voice',
    '- Tone: professional, clear, and helpful',
    '- Style: concise and direct',
    '',
    '## Key Messages',
    '- Add your core value proposition here',
    '- Add your key differentiators here',
    '',
    '## ICP (Ideal Customer Profile)',
    '- Add your primary ICP details here',
    '',
    '_Update this file with your actual brand details to improve skill outputs._',
  ].join('\n');

  await writeJson(brandContextPath.replace('.md', '.json'), {
    name,
    industry,
    market,
  });

  const fs = await import('fs/promises');
  await fs.writeFile(brandContextPath, content, 'utf-8');

  console.log(chalk.green(`Brand context written to: ${brandContextPath}`));
  console.log(chalk.cyan('Edit the file to add your actual brand details.'));
}
