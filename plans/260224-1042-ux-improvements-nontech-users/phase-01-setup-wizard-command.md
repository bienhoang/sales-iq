# Phase 1: Setup Wizard Command + Dependencies

## Context Links
- [CLI Entry Point](../../packages/cli/src/index.ts) -- register new command, switch to parseAsync()
- [Install Command](../../packages/cli/src/commands/install.ts) -- reuse `runInstall()`
- [Configure Command](../../packages/cli/src/commands/configure.ts) -- reuse brand/MCP logic
- [File Ops](../../packages/cli/src/utils/file-ops.ts) -- existing utilities
- [Paths](../../packages/cli/src/utils/paths.ts) -- SKILL_CLUSTERS, path helpers
- [NPM Packages Research](research/researcher-02-npm-packages.md)

## Overview
- **Priority:** P1 (blocks Phase 4)
- **Status:** complete
- **Effort:** 2h
- **Description:** Add prompts/open/ora deps, create wizard-prompts.ts utility, create setup.ts command with interactive wizard, update index.ts to register and use parseAsync().

## Key Insights
<!-- Updated: Validation Session 1 - Extract install core logic, remove MCP from wizard, auto-run doctor -->
- `prompts` (terkelg) confirmed as prompt library — lightweight, ESM-native
- Commander requires `parseAsync()` instead of `parse()` for async action handlers with prompts
- **Refactor install.ts**: Extract pure `installSkills()` function (no console.log) separate from `runInstall()` CLI wrapper — prevents ora spinner conflicts
- Brand configure logic writes both .md and .json -- wizard reuses same flow
- Keep wizard-prompts.ts separate so prompt definitions stay testable and setup.ts stays under 200 lines
- **No MCP in wizard**: Remove MCP prompt entirely — skills work without MCP, simplifies onboarding
- **Auto-run doctor** at end of wizard — import `runDoctor()` from doctor.ts for immediate verification

## Requirements

### Functional
- Interactive wizard asks: brand name, industry (select), audience (text), tone (multiselect), clusters (multiselect)
- **No MCP prompt** — removed per validation (non-tech users don't understand MCP; skills work without it)
- Spinner feedback during file copy operations
- Post-install summary showing installed clusters, brand path, and 3 "try these first" commands
- Graceful exit on Ctrl+C (prompts returns undefined on cancel)

### Non-Functional
- Each file under 200 lines
- ES modules only
- No breaking changes to existing install/configure commands

## Architecture

```
packages/cli/src/
  commands/
    setup.ts          -- NEW: registerSetup() + runSetup()
  utils/
    wizard-prompts.ts -- NEW: prompt definitions + helpers
  index.ts            -- MODIFIED: add registerSetup, parseAsync()
```

**Data flow:**
1. User runs `sales-iq setup`
2. `runSetup()` calls prompt definitions from wizard-prompts.ts
3. Builds InstallOptions from answers -> calls `runInstall()`
4. Builds brand config from answers -> writes brand-context.md/json
5. Optionally calls MCP configure
6. Shows summary

## Related Code Files

### New Files
- `packages/cli/src/commands/setup.ts` (~150 lines)
- `packages/cli/src/utils/wizard-prompts.ts` (~120 lines)

### Modified Files
- `packages/cli/src/index.ts` -- add import + register + parseAsync
- `packages/cli/package.json` -- add prompts, open, ora
- `packages/cli/src/commands/install.ts` -- **refactor**: extract pure `installSkills()` (no console I/O) from `runInstall()` wrapper

### Unchanged
- `packages/cli/src/commands/configure.ts`
- `packages/cli/src/utils/file-ops.ts`
- `packages/cli/src/utils/paths.ts`

## Implementation Steps

### Step 1: Add dependencies to package.json

In `packages/cli/package.json`, add to `dependencies`:
```json
{
  "dependencies": {
    "chalk": "^5",
    "commander": "^12",
    "open": "^10",
    "ora": "^8",
    "prompts": "^2"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/prompts": "^2"
  }
}
```

Then run `pnpm install` from repo root.

### Step 2: Create wizard-prompts.ts

File: `packages/cli/src/utils/wizard-prompts.ts`

```typescript
import type { PromptObject } from 'prompts';
import { SKILL_CLUSTERS } from './paths.js';

// Industry options for select prompt
const INDUSTRIES = [
  { title: 'SaaS / Software', value: 'saas' },
  { title: 'E-commerce / Retail', value: 'ecommerce' },
  { title: 'FinTech / Finance', value: 'fintech' },
  { title: 'HealthTech / Healthcare', value: 'healthtech' },
  { title: 'EdTech / Education', value: 'edtech' },
  { title: 'Agency / Consulting', value: 'agency' },
  { title: 'Developer Tools', value: 'developer-tools' },
  { title: 'Other (type below)', value: 'other' },
];

// Tone options for multiselect
const TONES = [
  { title: 'Professional', value: 'professional', selected: true },
  { title: 'Conversational', value: 'conversational' },
  { title: 'Technical', value: 'technical' },
  { title: 'Bold / Edgy', value: 'bold' },
  { title: 'Warm / Friendly', value: 'warm' },
  { title: 'Authoritative', value: 'authoritative' },
];

// Cluster options for multiselect
const CLUSTER_CHOICES = SKILL_CLUSTERS.map((c) => ({
  title: c.charAt(0).toUpperCase() + c.slice(1),
  value: c,
  selected: true,
}));

export function getBrandPrompts(): PromptObject[] {
  return [
    {
      type: 'text',
      name: 'brandName',
      message: 'What is your company or product name?',
      validate: (v: string) => v.trim().length > 0 || 'Name is required',
    },
    {
      type: 'select',
      name: 'industry',
      message: 'What industry are you in?',
      choices: INDUSTRIES,
    },
    {
      type: (prev: string) => (prev === 'other' ? 'text' : null),
      name: 'industryCustom',
      message: 'Type your industry:',
    },
    {
      type: 'text',
      name: 'audience',
      message: 'Who is your target audience? (e.g., "startup founders", "HR managers")',
    },
    {
      type: 'multiselect',
      name: 'tones',
      message: 'Pick your brand tone (space to select, enter to confirm):',
      choices: TONES,
      min: 1,
      hint: '- Space to select. Enter to submit',
    },
  ];
}

export function getClusterPrompts(): PromptObject[] {
  return [
    {
      type: 'multiselect',
      name: 'clusters',
      message: 'Which skill clusters do you want?',
      choices: CLUSTER_CHOICES,
      min: 1,
      hint: '- Space to select. Enter to submit',
    },
  ];
}

export function getMcpPrompt(): PromptObject[] {
  return [
    {
      type: 'confirm',
      name: 'setupMcp',
      message: 'Connect live data (CRM, email, social)? You can do this later.',
      initial: false,
    },
  ];
}

/** Resolve industry value -- use custom input if "other" was selected */
export function resolveIndustry(answers: Record<string, unknown>): string {
  return answers.industry === 'other'
    ? (answers.industryCustom as string) ?? 'Other'
    : (answers.industry as string);
}
```

### Step 3: Create setup.ts command

File: `packages/cli/src/commands/setup.ts`

```typescript
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import type { Command } from 'commander';
import { runInstall } from './install.js';
import {
  getBrandPrompts,
  getClusterPrompts,
  getMcpPrompt,
  resolveIndustry,
} from '../utils/wizard-prompts.js';
import { getGlobalSkillsDir, getClaudeSettingsPath } from '../utils/paths.js';
import { ensureDir, writeJson } from '../utils/file-ops.js';
import path from 'path';
import fs from 'fs/promises';

export function registerSetup(program: Command): void {
  program
    .command('setup')
    .description('Interactive setup wizard — no flags needed')
    .action(async () => {
      await runSetup();
    });
}

export async function runSetup(): Promise<void> {
  console.log(chalk.bold('\n  Welcome to sales-iq!\n'));
  console.log(chalk.dim('  AI-powered sales & marketing toolkit for Claude Code.\n'));

  // --- Brand questions ---
  const brandAnswers = await prompts(getBrandPrompts(), { onCancel: () => process.exit(0) });
  const industry = resolveIndustry(brandAnswers);

  // --- Cluster selection ---
  const clusterAnswers = await prompts(getClusterPrompts(), { onCancel: () => process.exit(0) });
  const clusters: string[] = clusterAnswers.clusters;

  // --- MCP ---
  const mcpAnswers = await prompts(getMcpPrompt(), { onCancel: () => process.exit(0) });

  // --- Install skills ---
  const spinner = ora('Installing skills...').start();
  try {
    await runInstall({
      skills: clusters.join(','),
      global: true,
      local: false,
      force: false,
    });
    spinner.succeed('Skills installed');
  } catch (err) {
    spinner.fail(`Install failed: ${(err as Error).message}`);
    process.exit(1);
  }

  // --- Write brand context ---
  const brandSpinner = ora('Writing brand context...').start();
  try {
    await writeBrandContext({
      name: brandAnswers.brandName,
      industry,
      audience: brandAnswers.audience ?? '',
      tones: brandAnswers.tones ?? ['professional'],
    });
    brandSpinner.succeed('Brand context saved');
  } catch (err) {
    brandSpinner.fail(`Brand context failed: ${(err as Error).message}`);
  }

  // --- MCP config ---
  if (mcpAnswers.setupMcp) {
    const mcpSpinner = ora('Configuring MCP server...').start();
    try {
      await configureMcpFromWizard();
      mcpSpinner.succeed('MCP server configured');
    } catch (err) {
      mcpSpinner.fail(`MCP config failed: ${(err as Error).message}`);
    }
  }

  // --- Summary ---
  printSummary(clusters, mcpAnswers.setupMcp);
}

interface BrandInput {
  name: string;
  industry: string;
  audience: string;
  tones: string[];
}

async function writeBrandContext(input: BrandInput): Promise<void> {
  const sharedDir = path.join(getGlobalSkillsDir(), 'shared');
  await ensureDir(sharedDir);

  const mdPath = path.join(sharedDir, 'brand-context.md');
  const jsonPath = path.join(sharedDir, 'brand-context.json');

  const content = [
    '---',
    'generated-by: sales-iq setup',
    `date: ${new Date().toISOString().split('T')[0]}`,
    '---',
    '',
    '# Brand Context',
    '',
    '## Company Overview',
    `- **Name**: ${input.name}`,
    `- **Industry**: ${input.industry}`,
    `- **Target Audience**: ${input.audience}`,
    '',
    '## Brand Voice',
    `- Tone: ${input.tones.join(', ')}`,
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

  await fs.writeFile(mdPath, content, 'utf-8');
  await writeJson(jsonPath, {
    name: input.name,
    industry: input.industry,
    audience: input.audience,
    tones: input.tones,
  });
}

async function configureMcpFromWizard(): Promise<void> {
  const settingsPath = getClaudeSettingsPath(true);
  const { readJson } = await import('../utils/file-ops.js');
  const existing = (await readJson<Record<string, unknown>>(settingsPath)) ?? {};

  const updated = {
    ...existing,
    mcpServers: {
      ...((existing.mcpServers as Record<string, unknown>) ?? {}),
      'sales-iq': { command: 'npx', args: ['sales-iq-mcp-server'] },
    },
  };

  await writeJson(settingsPath, updated);
}

function printSummary(clusters: string[], mcpEnabled: boolean): void {
  console.log(chalk.bold('\n  Setup complete!\n'));
  console.log(chalk.dim('  Installed clusters: ') + clusters.join(', '));
  console.log(chalk.dim('  Brand context: ') + '~/.claude/skills/shared/brand-context.md');
  if (mcpEnabled) {
    console.log(chalk.dim('  MCP server: ') + 'configured in ~/.claude/settings.json');
  }

  console.log(chalk.bold('\n  Try these first in Claude Code:\n'));
  console.log(chalk.cyan('    /siq-brand-strategy') + chalk.dim('     — set your positioning and voice'));
  console.log(chalk.cyan('    /siq-email-campaign') + chalk.dim('     — draft an email sequence'));
  console.log(chalk.cyan('    /siq-strategy-consultant') + chalk.dim(' — run a SWOT or Porter\'s analysis'));
  console.log();
}
```

### Step 4: Update index.ts

Replace `parse()` with `parseAsync()` and register setup:

```typescript
import { Command } from 'commander';
import { registerInstall } from './commands/install.js';
import { registerConfigure } from './commands/configure.js';
import { registerUpdate } from './commands/update.js';
import { registerList } from './commands/list.js';
import { registerSetup } from './commands/setup.js';

const program = new Command();

program
  .name('sales-iq')
  .description('CLI for installing sales-iq skills and configuring the MCP server')
  .version('0.1.0');

registerInstall(program);
registerConfigure(program);
registerUpdate(program);
registerList(program);
registerSetup(program);

await program.parseAsync(process.argv);
```

### Step 5: Build and verify

```bash
cd packages/cli && pnpm build && node dist/index.js setup --help
```

## Todo List

- [ ] Add prompts, open, ora, @types/prompts to package.json
- [ ] Run `pnpm install` from repo root
- [ ] Create `packages/cli/src/utils/wizard-prompts.ts`
- [ ] Create `packages/cli/src/commands/setup.ts`
- [ ] Update `packages/cli/src/index.ts` (registerSetup + parseAsync)
- [ ] Build: `pnpm --filter @bienhoang/sales-iq build`
- [ ] Manual test: `node dist/index.js setup`
- [ ] Verify existing commands still work: `node dist/index.js install --help`

## Success Criteria
- `sales-iq setup` launches interactive wizard with no flags
- Brand context written to `~/.claude/skills/shared/brand-context.md`
- Skills installed via reused `runInstall()`
- MCP optionally configured
- Post-install summary prints 3 contextual commands
- Ctrl+C exits gracefully (no stack trace)
- Existing `install`, `configure`, `update`, `list` commands unchanged

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| ora spinner conflicts with prompts stdout | Low | ora stops before prompts start; prompts finish before spinners |
| runInstall() console.log pollutes spinner | Medium | Suppress console during spinner or accept interleaved output (v1) |
| prompts undefined on Ctrl+C | Low | onCancel handler calls process.exit(0) |

## Security Considerations
- No secrets handled in wizard (PAT is setup.sh territory)
- Brand context contains non-sensitive business info only
- writeJson creates parent dirs -- verify no path traversal from user input (brandName is used in content, not paths)

## Next Steps
- Phase 2: Doctor command verifies the installation this wizard creates
- Phase 4: setup.sh calls `npx @bienhoang/sales-iq setup` after environment prep
