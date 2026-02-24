# Phase 2: Express Server + API

## Context Links
- [Plan overview](./plan.md)
- [Server build strategy](./research/researcher-02-server-build-strategy.md)
- [Phase 1: Package setup](./phase-01-package-setup.md)

## Overview
- **Priority**: P1
- **Status**: complete
- **Effort**: 4h
- **Depends on**: Phase 1

Express server that serves pre-built React SPA + REST API for workspace file operations, system info, and project config. CLI arg parsing for `--dir`, `--port`, `--no-open`.

## Key Insights
- `express.static` with `dotfiles: 'deny'` handles SPA serving safely
- Path traversal prevention: `path.resolve()` + `startsWith()` guard on all file operations
- ESM: use `fileURLToPath(import.meta.url)` for `__dirname` equivalent
- `get-port@7` is ESM-native, tries preferred port then falls back
- `open@10` is ESM-native, cross-platform browser launcher
- File operations restricted to `{dir}/workspace/` only

## Requirements

### Functional
- `GET /api/workspace` — scan `workspace/` and return files grouped by category
- `GET /api/files?path=...` — read markdown file content (relative to workspace/)
- `PUT /api/files?path=...` — write markdown content back to file
- `GET /api/system` — package version, installed skills count, MCP status
- `GET /api/config` — contents of `.sales-iq.json`
- `GET /api/brand-context` — read brand-context.md content
- `PUT /api/brand-context` — write brand-context.md content
- Serve `dist/client/` as static files with SPA fallback
- CLI: `--dir <path>` (required), `--port <number>` (default 4983), `--no-open`
- Auto-open browser on server start (unless `--no-open`)

### Non-functional
- Bind to `127.0.0.1` only
- All file paths validated against traversal attacks
- Graceful error responses (JSON `{ error: string }`)
- Clean shutdown on SIGINT/SIGTERM

## Architecture

```
src/server/
├── index.ts              # Entry: CLI arg parse, start server
├── app.ts                # Express app setup (API + static)
├── routes/
│   ├── workspace.ts      # GET /api/workspace, GET/PUT /api/files
│   ├── system.ts         # GET /api/system
│   └── config.ts         # GET /api/config
└── utils/
    ├── safe-path.ts      # Path traversal prevention utility
    └── workspace-scanner.ts  # Scan workspace/ directories
```

### API Response Shapes

```ts
// GET /api/workspace
interface WorkspaceResponse {
  categories: {
    name: string;        // "strategy", "emails", etc.
    files: {
      name: string;      // "brand-voice-guide-2026-02-24.md"
      path: string;      // "strategy/brand-voice-guide-2026-02-24.md"
      modified: string;  // ISO date
      size: number;      // bytes
    }[];
  }[];
}

// GET /api/files?path=strategy/brand-voice-guide-2026-02-24.md
interface FileResponse {
  path: string;
  content: string;      // raw markdown
  modified: string;
}

// PUT /api/files?path=... (body: { content: string })
interface SaveResponse {
  path: string;
  saved: boolean;
}

// GET /api/system
interface SystemResponse {
  version: string;
  skillsCount: number;
  mcpConfigured: boolean;
}

// GET /api/config
// Returns raw .sales-iq.json contents or { error: "not found" }
```

## Related Code Files

### Files to create
- `packages/dashboard/src/server/index.ts`
- `packages/dashboard/src/server/app.ts`
- `packages/dashboard/src/server/routes/workspace.ts`
- `packages/dashboard/src/server/routes/system.ts`
- `packages/dashboard/src/server/routes/config.ts`
- `packages/dashboard/src/server/utils/safe-path.ts`
- `packages/dashboard/src/server/utils/workspace-scanner.ts`

### Files to modify
- `packages/dashboard/src/server/index.ts` (replace placeholder from Phase 1)

## Implementation Steps

### 1. Create `safe-path.ts` utility
```ts
import path from 'node:path';

export function safePath(base: string, userInput: string): string | null {
  // Reject obvious traversal attempts early
  if (userInput.includes('..')) return null;
  const resolved = path.resolve(base, userInput);
  if (!resolved.startsWith(path.resolve(base) + path.sep) && resolved !== path.resolve(base)) {
    return null;
  }
  return resolved;
}
```

### 2. Create `workspace-scanner.ts`
- Accept `workspaceDir` path
- Read subdirectories (only the 11 known categories)
- For each category dir that exists, list `.md` files with `fs.readdir` + `fs.stat`
- Return structured `WorkspaceResponse`
- Known categories constant: `['proposals', 'emails', 'outreach', 'ad-copy', 'content', 'social', 'intel', 'reports', 'strategy', 'sales-prep', 'research']`

### 3. Create workspace routes (`routes/workspace.ts`)
- `GET /api/workspace` — calls scanner, returns JSON
- `GET /api/files` — validates `?path` param with `safePath()`, reads file, returns content
- `PUT /api/files` — validates path, writes `req.body.content` to file
- All paths relative to `{dir}/workspace/`
- Return 400 for missing path param, 403 for traversal, 404 for missing file

### 4. Create system route (`routes/system.ts`)
- `GET /api/system`
- Version: read from own `package.json` (import with `createRequire` or embed at build time)
- Skills count: count directories in `~/.claude/skills/marketing/siq-*` + `~/.claude/skills/sales/siq-*` + `~/.claude/skills/strategy/siq-*` + `~/.claude/skills/siq-*`
- MCP configured: check if `~/.claude/settings.json` or `~/.claude/claude_desktop_config.json` references `sales-iq-mcp`

### 5. Create config route (`routes/config.ts`)
- `GET /api/config`
- Read `{dir}/.sales-iq.json`, parse JSON, return contents
- Return `{ error: "not found" }` with 404 if file doesn't exist

### 5b. Add brand-context endpoints to config route
<!-- Updated: Validation Session 1 - brand-context.md editable in dashboard -->
- `GET /api/brand-context` — read `{dir}/brand-context.md`, return `{ content: string, modified: string }`
- `PUT /api/brand-context` — write `req.body.content` to `{dir}/brand-context.md`
- Path is fixed (not user-supplied), so no traversal risk. Just check file exists on read.
- Return 404 if brand-context.md doesn't exist

### 6. Create `app.ts` (Express app factory)
```ts
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { workspaceRouter } from './routes/workspace.js';
import { systemRouter } from './routes/system.js';
import { configRouter } from './routes/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.resolve(__dirname, 'client');

export function createApp(projectDir: string) {
  const app = express();
  app.use(express.json());

  // API routes
  app.use('/api', workspaceRouter(projectDir));
  app.use('/api', systemRouter());
  app.use('/api', configRouter(projectDir));

  // Static SPA
  app.use(express.static(CLIENT_DIR, { dotfiles: 'deny' }));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'not found' });
    res.sendFile(path.join(CLIENT_DIR, 'index.html'));
  });

  return app;
}
```

### 7. Create `index.ts` (server entry + CLI)
```ts
import { createApp } from './app.js';
import getPort from 'get-port';
import open from 'open';

// Parse CLI args (lightweight, no dep needed)
const args = process.argv.slice(2);
const dirIndex = args.indexOf('--dir');
const portIndex = args.indexOf('--port');
const noOpen = args.includes('--no-open');

const dir = dirIndex !== -1 ? args[dirIndex + 1] : process.cwd();
const preferredPort = portIndex !== -1 ? parseInt(args[portIndex + 1], 10) : 4983;

const port = await getPort({ port: preferredPort });
const app = createApp(dir);

const server = app.listen(port, '127.0.0.1', () => {
  const url = `http://localhost:${port}`;
  console.log(`Sales-IQ Dashboard: ${url}`);
  console.log(`Workspace: ${dir}/workspace/`);
  if (!noOpen) open(url);
});

// Graceful shutdown
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => { server.close(); process.exit(0); });
}
```

### 8. Verify build
```bash
cd packages/dashboard && pnpm build
node dist/server.js --dir ../../test/gosnap --no-open
# Test: curl http://localhost:4983/api/workspace
# Test: curl http://localhost:4983/api/config
# Test: curl "http://localhost:4983/api/files?path=strategy/brand-voice-guide-2026-02-24.md"
```

## Todo List
- [ ] Create `src/server/utils/safe-path.ts`
- [ ] Create `src/server/utils/workspace-scanner.ts`
- [ ] Create `src/server/routes/workspace.ts` (GET /api/workspace, GET/PUT /api/files)
- [ ] Create `src/server/routes/system.ts` (GET /api/system)
- [ ] Create `src/server/routes/config.ts` (GET /api/config + GET/PUT /api/brand-context)
- [ ] Create `src/server/app.ts` (Express app factory)
- [ ] Replace `src/server/index.ts` with CLI entry + server start
- [ ] Build and test all API endpoints against `test/gosnap/`
- [ ] Verify path traversal prevention (test `../` paths return 403)
- [ ] Verify 127.0.0.1 binding (not 0.0.0.0)

## Success Criteria
- All 5 API endpoints return correct data when tested with `test/gosnap/`
- `GET /api/workspace` returns strategy (4 files) and intel (2 files) categories
- `GET /api/files?path=../package.json` returns 403 (traversal blocked)
- `GET /api/config` returns gosnap's `.sales-iq.json` contents
- Server binds to 127.0.0.1 only
- `--no-open` flag suppresses browser launch
- Clean shutdown on Ctrl+C

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Path traversal bypass | Low | `path.resolve` + `startsWith` + reject `..` early |
| Skills directory structure varies | Medium | Graceful fallback: return count 0 if dirs missing |
| `.sales-iq.json` missing | Medium | Return 404 with clear error message |
| Port already in use | Low | `get-port` auto-fallback; display chosen port |

## Security Considerations
- **Bind**: 127.0.0.1 only — no network exposure
- **Path traversal**: Double guard (reject `..` + resolve/startsWith check)
- **Dotfiles**: `express.static` with `dotfiles: 'deny'`
- **Write scope**: PUT only writes to `workspace/` subdirectory, existing files only
- **No shell execution**: No `child_process` or `exec` calls
- **Input validation**: JSON body parsing with express.json(), query param validation

## Next Steps
- Phase 3: Build React frontend that consumes these API endpoints
