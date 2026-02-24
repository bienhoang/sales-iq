# Phase 3: Uninstall Command

## Context Links
- [Paths Utility](../../packages/cli/src/utils/paths.ts) -- getGlobalSkillsDir, getClaudeSettingsPath, SKILL_CLUSTERS
- [File Ops](../../packages/cli/src/utils/file-ops.ts) -- fileExists, readJson, writeJson, listDirs

## Overview
- **Priority:** P2
- **Status:** complete
- **Effort:** 30m
- **Description:** Clean removal of installed skills and optional MCP config. Confirmation prompt before destructive action.

## Key Insights
- Must confirm before deletion -- non-tech users may run it accidentally
- Use `prompts` (already added in Phase 1) for confirmation
- fs.rm with recursive+force for directory removal
- MCP removal is optional (separate prompt) since user may have other MCP servers
- Need `removeDir` utility -- add to file-ops.ts (only new utility needed)

## Requirements

### Functional
- Confirmation prompt before any removal
- Remove skill cluster directories from ~/.claude/skills/
- Remove shared/ directory
- Optionally remove sales-iq entry from settings.json mcpServers
- Show removal summary (what was removed, what was skipped)

### Non-Functional
- File under 200 lines
- Uses prompts for confirmation (dep from Phase 1)
- Never removes ~/.claude/ itself or other files in it

## Architecture

```
packages/cli/src/
  commands/
    uninstall.ts   -- NEW: registerUninstall() + runUninstall()
  utils/
    file-ops.ts    -- MODIFIED: add removeDir()
  index.ts         -- MODIFIED: add registerUninstall
```

## Related Code Files

### New Files
- `packages/cli/src/commands/uninstall.ts` (~110 lines)

### Modified Files
- `packages/cli/src/utils/file-ops.ts` -- add `removeDir()` helper
- `packages/cli/src/index.ts` -- add import + registerUninstall()

## Implementation Steps

### Step 1: Add removeDir to file-ops.ts

Append to `packages/cli/src/utils/file-ops.ts`:

```typescript
/** Recursively remove a directory. No-op if doesn't exist. */
export async function removeDir(dirPath: string): Promise<boolean> {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}
```

### Step 2: Create uninstall.ts

File: `packages/cli/src/commands/uninstall.ts`

```typescript
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

  // Confirm
  const { confirmed } = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message: 'Remove all sales-iq skills from ~/.claude/skills?',
    initial: false,
  });

  if (!confirmed) {
    console.log(chalk.dim('  Cancelled.\n'));
    return;
  }

  const skillsDir = getGlobalSkillsDir();
  let removed = 0;

  // Remove each cluster
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
  });

  if (removeMcp) {
    await removeMcpConfig();
  }

  // Summary
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
```

### Step 3: Register in index.ts

Add to `packages/cli/src/index.ts`:
```typescript
import { registerUninstall } from './commands/uninstall.js';
// ... after other registers:
registerUninstall(program);
```

### Step 4: Build and test

```bash
pnpm --filter @bienhoang/sales-iq build
# Test with skills installed:
node packages/cli/dist/index.js uninstall
# Verify directories removed:
ls ~/.claude/skills/
```

## Todo List

- [ ] Add `removeDir()` to `packages/cli/src/utils/file-ops.ts`
- [ ] Create `packages/cli/src/commands/uninstall.ts`
- [ ] Register in `packages/cli/src/index.ts`
- [ ] Build and verify
- [ ] Test: decline confirmation (nothing removed)
- [ ] Test: accept confirmation (clusters + shared removed)
- [ ] Test: MCP removal (settings.json updated)
- [ ] Test: run when nothing installed (graceful "nothing to remove")

## Success Criteria
- Confirmation prompt before any deletion
- Removes only sales-iq directories (marketing/, sales/, strategy/, shared/)
- Never touches ~/.claude/ root or other skills
- MCP removal is separate optional prompt
- Clean summary of what was removed
- Graceful handling when nothing is installed

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Accidental deletion | Low | Confirmation prompt defaults to "no" |
| Removes non-sales-iq skills in same dirs | None | Only removes SKILL_CLUSTERS directories by name |
| settings.json corruption | Low | readJson + writeJson preserves other keys; delete only sales-iq key |

## Security Considerations
- Confirmation prompt prevents accidental data loss
- Only removes directories matching SKILL_CLUSTERS constant -- no user-supplied paths
- settings.json surgery scoped to `mcpServers['sales-iq']` key only

## Next Steps
- Phase 5: Document uninstall command in README
