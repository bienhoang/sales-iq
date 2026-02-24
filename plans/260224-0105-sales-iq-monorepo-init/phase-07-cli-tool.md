# Phase 07 — CLI Tool

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: [Phase 03](./phase-03-marketing-skills-cluster.md), [Phase 06](./phase-06-mcp-server.md)
<!-- Updated: Validation Session 1 - Removed Phase 02 dependency (deferred), added Phase 06 -->
- Research: [Skills Distribution](./research/researcher-02-skills-distribution-patterns.md)

## Overview

- **Date**: 2026-02-24
- **Priority**: P1
- **Status**: pending
- **Effort**: 3h
- **Description**: Build `sales-iq` CLI for installing skills, configuring MCP server, and managing brand context. Uses Commander.js, published as global CLI on npm.

## Key Insights

- CLI is the primary distribution mechanism — `npx sales-iq install` copies skills to `~/.claude/skills/`.
- Use `require.resolve()` to locate `sales-iq-skills` package path reliably (not hardcoded).
- Support both global (`~/.claude/skills/`) and local (`.claude/skills/`) install targets.
- `configure --mcp` writes to `.claude/settings.json` or `~/.claude/settings.json`.
- `configure --brand` runs interactive prompts, writes `shared/brand-context.md`.
- Keep CLI lean — it's a file-copier and config-writer, not an application server.

## Requirements

### Functional
- **Commands**:
  - `install` — copy skill clusters to Claude skills directory
  - `configure` — setup brand context and MCP server config
  - `update` — re-copy skills from latest npm package version
  - `list` — show installed skills
- `install` flags: `--skills marketing,sales,strategy` (comma-separated or `all`), `--global` (default) vs `--local`
- `configure --mcp` — writes MCP server config to Claude settings JSON
- `configure --brand` — interactive prompts → generates brand-context.md
- Published as `sales-iq` on npm with bin field

### Non-Functional
- Zero unnecessary dependencies (commander + prompts library + fs only)
- Works cross-platform (macOS, Linux, Windows)
- Helpful error messages when things go wrong
- Colorful terminal output with progress indicators

## Architecture

```
packages/cli/
├── src/
│   ├── index.ts               # Entry point + Commander setup
│   ├── commands/
│   │   ├── install.ts         # Copy skills to ~/.claude/skills/
│   │   ├── configure.ts       # Brand context + MCP config
│   │   ├── update.ts          # Re-install from npm
│   │   └── list.ts            # List installed skills
│   └── utils/
│       ├── file-ops.ts        # Copy, mkdir, path resolution
│       └── paths.ts           # Skill source/target path resolution
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Related Code Files

### Create
- `packages/cli/src/index.ts` — entry point, Commander program setup
- `packages/cli/src/commands/install.ts` — install command
- `packages/cli/src/commands/configure.ts` — configure command
- `packages/cli/src/commands/update.ts` — update command
- `packages/cli/src/commands/list.ts` — list command
- `packages/cli/src/utils/file-ops.ts` — file copy utilities
- `packages/cli/src/utils/paths.ts` — path resolution (skill source, target dirs)
- `packages/cli/tsup.config.ts`

### Modify
- `packages/cli/package.json` — deps, bin, scripts

## Implementation Steps

1. **Setup package.json**:
   ```json
   {
     "name": "sales-iq",
     "version": "0.1.0",
     "type": "module",
     "bin": { "sales-iq": "./dist/index.js" },
     "files": ["dist"],
     "dependencies": {
       "commander": "^12",
       "@inquirer/prompts": "^7",
       "sales-iq-core": "workspace:*"
     },
     "scripts": {
       "build": "tsup",
       "typecheck": "tsc --noEmit"
     }
   }
   ```

2. **Create entry point** (`index.ts`):
   ```typescript
   #!/usr/bin/env node
   import { Command } from 'commander';
   const program = new Command()
     .name('sales-iq')
     .description('Sales & marketing AI toolkit for Claude Code')
     .version('0.1.0');
   // Register commands
   program.parse();
   ```

3. **Create paths utility** (`utils/paths.ts`):
   - `getSkillsSourceDir()` — resolve `sales-iq-skills` package via `require.resolve()` or `import.meta.resolve()`
   - `getGlobalSkillsDir()` — `~/.claude/skills/`
   - `getLocalSkillsDir()` — `.claude/skills/` relative to cwd
   - `getClaudeSettingsPath(global)` — settings.json path
   - Cross-platform home dir via `os.homedir()`

4. **Implement install command** (`commands/install.ts`):
   ```
   sales-iq install [--skills marketing,sales,strategy|all] [--global|--local]
   ```
   - Resolve skills source package path
   - Validate requested clusters exist
   - Copy skill directories to target (global by default)
   - Copy `shared/` directory alongside clusters
   - Print installed skill count and target path
   - Handle conflicts: `--force` to overwrite, otherwise skip existing

5. **Implement configure command** (`commands/configure.ts`):
   ```
   sales-iq configure [--mcp] [--brand]
   ```
   **--mcp subcommand**:
   - Read existing Claude settings.json (or create new)
   - Add `mcpServers.sales-iq` entry with npx command
   - Prompt for API keys: HubSpot, Resend, etc. (optional, skip with Enter)
   - Write updated settings.json
   - Print config summary

   **--brand subcommand**:
   - Interactive prompts: brand name, industry, target market, tone, tagline
   - Generate `shared/brand-context.md` from answers
   - Write to skills directory (global or local)
   - Print next step: "Run /brand-strategy to generate full brand package"

6. **Implement update command** (`commands/update.ts`):
   ```
   sales-iq update [--skills marketing,sales,strategy|all]
   ```
   - Check installed skills (read current)
   - Re-run install logic with `--force` overwrite
   - Preserve user-modified reference files (compare timestamps or hash)
   - Print updated/skipped counts

7. **Implement list command** (`commands/list.ts`):
   ```
   sales-iq list [--global|--local]
   ```
   - Scan target directory for SKILL.md files
   - Parse frontmatter for name + description
   - Display as formatted table: cluster / skill name / description
   - Show total count

8. **Implement file-ops utility** (`utils/file-ops.ts`):
   - `copySkillCluster(src, dest, options)` — recursive directory copy
   - `ensureDir(path)` — mkdir -p equivalent
   - `fileExists(path)` — check existence
   - `readJson(path)` — parse JSON file
   - `writeJson(path, data)` — write JSON with formatting

9. **Configure tsup**:
   ```typescript
   export default defineConfig({
     entry: ['src/index.ts'],
     format: ['esm'],
     clean: true,
     banner: { js: '#!/usr/bin/env node' },
   });
   ```

10. **Test locally**:
    - `pnpm build --filter sales-iq`
    - `node packages/cli/dist/index.js install --skills marketing --local`
    - Verify skills copied to `.claude/skills/marketing/`
    - `node packages/cli/dist/index.js list --local`
    - Verify list output

## Todo List

- [ ] Setup package.json with commander + inquirer
- [ ] Create entry point with Commander program
- [ ] Implement paths utility
- [ ] Implement file-ops utility
- [ ] Implement install command
- [ ] Implement configure --mcp command
- [ ] Implement configure --brand command
- [ ] Implement update command
- [ ] Implement list command
- [ ] Configure tsup build
- [ ] Test install + list locally

## Success Criteria

- `npx sales-iq install --skills all` copies all clusters to `~/.claude/skills/`
- `npx sales-iq configure --mcp` writes valid MCP config to settings.json
- `npx sales-iq configure --brand` generates brand-context.md interactively
- `npx sales-iq list` shows all installed skills with descriptions
- Works on macOS and Linux (Windows: best effort)
- Helpful error messages for missing packages, permission errors

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| `require.resolve()` fails in ESM | Use `import.meta.resolve()` or `createRequire()` |
| File permission errors on ~/.claude/ | Catch EACCES, print helpful message |
| pnpm `node_modules` structure breaks path resolution | Test with pnpm, npm, yarn before publish |
| Overwriting user-customized skills | Default skip existing; `--force` flag for explicit overwrite |

## Security Considerations

- Never write API keys to files — only to Claude settings.json `env` block
- Validate all file paths to prevent path traversal
- Don't execute any code from skill directories — only copy files
- Warn user when overwriting existing skills

## Next Steps

- Phase 08: Document CLI usage in README and docs
- Post-launch: add `sales-iq doctor` command to validate installation
