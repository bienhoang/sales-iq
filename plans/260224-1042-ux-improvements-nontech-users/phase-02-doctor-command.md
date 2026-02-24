# Phase 2: Doctor Command

## Context Links
- [CLI Entry Point](../../packages/cli/src/index.ts) -- register new command
- [Paths Utility](../../packages/cli/src/utils/paths.ts) -- getGlobalSkillsDir, getClaudeSettingsPath, SKILL_CLUSTERS
- [File Ops](../../packages/cli/src/utils/file-ops.ts) -- fileExists, readJson, listDirs

## Overview
- **Priority:** P2
- **Status:** complete
- **Effort:** 45m
- **Description:** Verify installation health: Node version, npm registry, installed skills, brand context, MCP config. Color-coded pass/fail output.

## Key Insights
<!-- Updated: Validation Session 1 - runDoctor() must return result object for programmatic use -->
- Non-tech users need a single command to diagnose "it's not working"
- Checks should be ordered: prerequisites first (Node, npmrc), then install artifacts, then optional config
- Each check independent -- run all even if early ones fail (show full picture)
- `listDirs()` already exists for counting installed skills per cluster
- **runDoctor() must return a result object** (issue count + details) so setup wizard can call it programmatically after install completes — not just console.log

## Requirements

### Functional
- Check Node.js version (20+ required)
- Check ~/.npmrc has @bienhoang registry entry
- Check each skill cluster installed (count skills per cluster)
- Check brand-context.md exists
- Check MCP config in settings.json (optional, warn if missing)
- Green checkmark for pass, red X for fail, yellow warning for optional missing

### Non-Functional
- File under 200 lines
- Pure read-only -- never modifies anything
- Zero additional dependencies (chalk already available)

## Architecture

```
packages/cli/src/
  commands/
    doctor.ts  -- NEW: registerDoctor() + runDoctor()
  index.ts     -- MODIFIED: add registerDoctor
```

## Related Code Files

### New Files
- `packages/cli/src/commands/doctor.ts` (~130 lines)

### Modified Files
- `packages/cli/src/index.ts` -- add import + registerDoctor()

## Implementation Steps

### Step 1: Create doctor.ts

File: `packages/cli/src/commands/doctor.ts`

```typescript
import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import type { Command } from 'commander';
import {
  getGlobalSkillsDir,
  getClaudeSettingsPath,
  SKILL_CLUSTERS,
} from '../utils/paths.js';
import { fileExists, readJson, listDirs, readText } from '../utils/file-ops.js';
import os from 'os';

const PASS = chalk.green('  [ok]');
const FAIL = chalk.red('  [!!]');
const WARN = chalk.yellow('  [--]');

export function registerDoctor(program: Command): void {
  program
    .command('doctor')
    .description('Check installation health')
    .action(async () => {
      await runDoctor();
    });
}

export async function runDoctor(): Promise<void> {
  console.log(chalk.bold('\n  sales-iq doctor\n'));

  let issues = 0;

  // 1. Node.js version
  const nodeVersion = process.versions.node;
  const major = parseInt(nodeVersion.split('.')[0], 10);
  if (major >= 20) {
    console.log(`${PASS} Node.js v${nodeVersion}`);
  } else {
    console.log(`${FAIL} Node.js v${nodeVersion} — requires v20+`);
    issues++;
  }

  // 2. npmrc registry
  const npmrcPath = path.join(os.homedir(), '.npmrc');
  const npmrcContent = await readText(npmrcPath);
  if (npmrcContent?.includes('@bienhoang:registry=')) {
    console.log(`${PASS} ~/.npmrc has @bienhoang registry`);
  } else {
    console.log(`${FAIL} ~/.npmrc missing @bienhoang registry`);
    console.log(chalk.dim('       Run setup.sh or add manually: @bienhoang:registry=https://npm.pkg.github.com'));
    issues++;
  }

  // 3. Skills per cluster
  const skillsDir = getGlobalSkillsDir();
  for (const cluster of SKILL_CLUSTERS) {
    const clusterDir = path.join(skillsDir, cluster);
    if (await fileExists(clusterDir)) {
      const skills = await listDirs(clusterDir);
      console.log(`${PASS} ${cluster}/ — ${skills.length} skill(s)`);
    } else {
      console.log(`${FAIL} ${cluster}/ — not installed`);
      issues++;
    }
  }

  // 4. Brand context
  const brandPath = path.join(skillsDir, 'shared', 'brand-context.md');
  if (await fileExists(brandPath)) {
    console.log(`${PASS} brand-context.md exists`);
  } else {
    console.log(`${FAIL} brand-context.md missing`);
    console.log(chalk.dim('       Run: sales-iq setup'));
    issues++;
  }

  // 5. MCP config (optional)
  const settingsPath = getClaudeSettingsPath(true);
  const settings = await readJson<Record<string, unknown>>(settingsPath);
  const mcpServers = settings?.mcpServers as Record<string, unknown> | undefined;
  if (mcpServers?.['sales-iq']) {
    console.log(`${PASS} MCP server configured`);
  } else {
    console.log(`${WARN} MCP server not configured (optional)`);
    console.log(chalk.dim('       Run: sales-iq configure --mcp'));
  }

  // Summary
  console.log();
  if (issues === 0) {
    console.log(chalk.green('  All checks passed. You\'re good to go!\n'));
  } else {
    console.log(chalk.yellow(`  ${issues} issue(s) found. See above for fixes.\n`));
  }
}
```

### Step 2: Register in index.ts

Add to `packages/cli/src/index.ts`:
```typescript
import { registerDoctor } from './commands/doctor.js';
// ... after other registers:
registerDoctor(program);
```

### Step 3: Build and test

```bash
pnpm --filter @bienhoang/sales-iq build
node packages/cli/dist/index.js doctor
```

## Todo List

- [ ] Create `packages/cli/src/commands/doctor.ts`
- [ ] Register in `packages/cli/src/index.ts`
- [ ] Build and verify output
- [ ] Test with skills installed (all green)
- [ ] Test with skills missing (red + helpful messages)

## Success Criteria
- `sales-iq doctor` runs without errors
- Displays pass/fail for each check with color coding
- Missing items show actionable fix instructions
- Zero-issue summary when everything installed correctly
- Read-only: never modifies files

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| readText returns null for npmrc (no file) | Low | Already handled -- null check shows FAIL |
| settings.json has unexpected shape | Low | readJson returns null on parse error; optional chaining on mcpServers |

## Security Considerations
- Read-only command, no writes
- Reads ~/.npmrc but only checks for registry line, never prints token
- Does not expose settings.json contents

## Next Steps
- Phase 3: Uninstall command for clean removal
- Doctor can be recommended in setup.sh after install completes
