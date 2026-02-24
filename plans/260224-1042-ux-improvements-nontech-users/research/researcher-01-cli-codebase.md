# Sales-IQ CLI Codebase Research Report

## Commander.js Command Structure

The CLI uses Commander.js v11+ with functional command registration pattern:
- **Entry point** (`index.ts`): Creates single `Command` instance, registers commands via functions, calls `parse()`
- **Pattern**: Each command gets dedicated `registerXyz(program)` function that adds command + action handler
- **Options**: Flags for global/local, boolean toggles (--force, --mcp), string args (--skills, --name)
- **Action handlers**: Accept parsed options object, async closure around pure function
- **Error handling**: Manual validation + process.exit(1) for invalid inputs

## Install Command Architecture

**Flow**: Validate clusters → resolve source dir → copy to target → report status

**Key behaviors**:
- Resolves clusters via `resolveClusters()` helper: accepts "all" or comma-separated names
- Sources from monorepo `packages/skills/` or installed `sales-iq-skills` package (via createRequire fallback)
- Copies entire cluster directories to `~/.claude/skills/{cluster}/` or `./.claude/skills/{cluster}/`
- Treats "shared/" directory as special — always copied if present
- Skips existing targets unless `--force` flag set
- Counts/reports installed vs skipped (chalk colors: green=success, yellow=warning, red=error)

**Limitations**: No dry-run preview, no selective skill installation within clusters, no progress UI for large copies

## Configure Command Architecture

**Two independent operations**:

1. **MCP Config** (`--mcp`):
   - Merges `sales-iq` server entry into Claude's `settings.json` mcpServers map
   - Hardcoded command: `npx sales-iq-mcp-server` (assumes published to npm)
   - Appends to existing config (non-destructive)

2. **Brand Config** (`--brand`):
   - Generates skeleton `brand-context.md` in `~/.claude/skills/shared/`
   - Also writes JSON sidecar with parsed fields (name, industry, market)
   - Template-based content with placeholder sections for tone, messages, ICP
   - Uses CLI flags to pre-fill template (--name, --industry, --market)

**Gap**: No validation of brand context fields; brand-context.json written alongside .md (unusual pattern)

## Path Utilities Patterns

**Resolution strategy**:
- Global (default): `~/.claude/` = `os.homedir()/.claude/`
- Local: `./.claude/` = `process.cwd()/.claude/`
- Skills source: Try require.resolve('sales-iq-skills'), fallback to monorepo relative path

**Exports**:
- `getSkillsSourceDir()` — smart fallback (prod vs dev)
- `getGlobalSkillsDir()` — ~/.claude/skills
- `getLocalSkillsDir()` — ./.claude/skills
- `getClaudeSettingsPath(global)` — ~/.claude/settings.json or ./.claude/settings.json
- `SKILL_CLUSTERS` — const array ['marketing', 'sales', 'strategy']

**Note**: All functions pure (no side effects), returning absolute paths only

## File Operations Utilities

Thin async wrappers around fs/promises:
- `copyDir(src, dest)` — recursive, force overwrite
- `ensureDir(dirPath)` — mkdir -p style
- `fileExists(filePath)` — safe check (catches ENOENT)
- `readJson<T>(filePath)` — safe parse, returns null on error
- `writeJson(path, data)` — auto-formats, creates parent dirs
- `readText(filePath)` — safe read, returns null on error
- `listDirs(dirPath)` — filters for directories only

**No utility for**: Single file copy, conditional overwrite, file deletion, atomic writes

## Adding New Commands: Pattern

```typescript
// commands/new-command.ts
import type { Command } from 'commander';

interface NewOptions { /* parsed flags */ }

export function registerNew(program: Command): void {
  program
    .command('new-name')
    .description('...')
    .option('--flag', 'description', defaultValue)
    .action(async (opts: NewOptions) => {
      await runNew(opts);
    });
}

export async function runNew(opts: NewOptions): Promise<void> {
  // Implementation
}
```

Then in `index.ts`: `registerNew(program)` before `parse()`

**Patterns to follow**:
- Separate pure function `runXyz()` from command registration
- Type interfaces for options
- Async action handlers
- Chalk for colored output
- Early validation + process.exit(1) for errors
- Graceful null returns on user cancellation

## Interactive Prompts: Current Gaps

No interactive CLI library detected (no inquirer.js, prompts, etc.). Current commands are non-interactive:
- All input via flags (not stdin)
- Brand context requires pre-set flags OR manual file edit after generation
- No confirmation prompts before destructive actions (e.g., --force overwrite)
- No skill picker UI (must specify cluster names)

**To build wizard-style CLI**:
- Add `inquirer` or `prompts` npm package
- Create helper module `src/utils/prompts.ts` for reusable Q&A flows
- Modify configure command to prompt for brand fields if flags absent
- Create new `wizard` command orchestrating multi-step install + configure flow

## Key Reusable Patterns

1. **Option validation**: Check required flags early, exit cleanly if missing
2. **Path abstraction**: All file ops use utility functions (testable, portable)
3. **Error messages**: Structured chalk output (red=error, yellow=warning, green=success)
4. **Safe file ops**: readJson/writeJson return null instead of throwing
5. **Directory scanning**: listDirs filters for directories (reuse for dynamic skill discovery)

## Unresolved Questions

1. Why is brand-context.json written alongside .md? Should they be consolidated?
2. Does `getClaudeSettingsPath(global)` parameter always default to true (line 48)? Logic seems broken.
3. No --help text for install --skills format (expects user to discover valid clusters via error message).
4. Should `listDirs()` be used in install to auto-discover clusters instead of hardcoded SKILL_CLUSTERS array?
5. How should wizard handle existing configs? Merge, prompt to overwrite, or skip?
