# Phase 1: Package Scaffolding

## Context Links
- [Plan overview](./plan.md)
- [Server build strategy](./research/researcher-02-server-build-strategy.md)
- CLI package pattern: `packages/cli/package.json`, `packages/cli/tsup.config.ts`

## Overview
- **Priority**: P1 (blocker for all other phases)
- **Status**: complete
- **Effort**: 2h

Create `packages/dashboard/` with dual build pipeline (Vite for React client, tsup for Express server), Tailwind CSS, and all dependency declarations.

## Key Insights
- Monorepo uses ESM (`"type": "module"`) throughout — use `open@10`, `get-port@7`
- tsup must run with `clean: false` so Vite's `dist/client/` output survives
- Build order: `vite build` first, then `tsup` second
- CLI package pattern: GitHub Packages registry, `publishConfig.access: "restricted"`

## Requirements

### Functional
- Package builds successfully with `pnpm build`
- Turborepo discovers and builds the package via `turbo build`
- Bin entry `siq-dashboard` resolves to `dist/server.js`

### Non-functional
- ESM output for both client and server
- TypeScript strict mode (extend `tsconfig.base.json`)

## Architecture

```
packages/dashboard/
├── package.json
├── tsconfig.json           # server TS config (extends base)
├── tsconfig.client.json    # client TS config (React JSX)
├── tsup.config.ts
├── vite.config.ts
├── index.html              # Vite entry HTML (no tailwind/postcss config files — Tailwind v4 CSS-first)              # Vite entry HTML
├── src/
│   ├── server/
│   │   └── index.ts        # Express entry (placeholder)
│   └── client/
│       ├── main.tsx         # React entry
│       ├── App.tsx          # Root component (placeholder)
│       └── styles/
│           └── globals.css  # Tailwind directives
└── dist/                   # build output (gitignored)
    ├── server.js
    └── client/
```

## Related Code Files

### Files to create
- `packages/dashboard/package.json`
- `packages/dashboard/tsconfig.json`
- `packages/dashboard/tsconfig.client.json`
- `packages/dashboard/tsup.config.ts`
- `packages/dashboard/vite.config.ts`
- `packages/dashboard/index.html`
- `packages/dashboard/src/server/index.ts` (minimal placeholder)
- `packages/dashboard/src/client/main.tsx` (minimal placeholder)
- `packages/dashboard/src/client/App.tsx` (minimal placeholder)
- `packages/dashboard/src/client/styles/globals.css`

### Files to modify
- None (pnpm-workspace.yaml already has `packages/*` glob)

## Implementation Steps

### 1. Create package.json
```json
{
  "name": "@bienhoang/sales-iq-dashboard",
  "version": "0.1.0",
  "description": "Local web dashboard for browsing and editing sales-iq workspace outputs",
  "type": "module",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/bienhoang/sales-iq.git",
    "directory": "packages/dashboard"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "bin": {
    "siq-dashboard": "./dist/server.js"
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build && tsup",
    "build:client": "vite build",
    "build:server": "tsup",
    "dev:client": "vite",
    "dev:server": "tsup --watch",
    "typecheck": "tsc --noEmit -p tsconfig.json && tsc --noEmit -p tsconfig.client.json",
    "lint": "eslint src/"
  },
  "dependencies": {
    "express": "^4",
    "get-port": "^7",
    "open": "^10"
  },
  "devDependencies": {
    "@types/express": "^4",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4",
    "react": "^19",
    "react-dom": "^19",
    "tailwindcss": "^4",
    "@tailwindcss/vite": "^4",
    "vite": "^6"
  }
}
```

### 2. Create tsconfig.json (server)
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src/server"
  },
  "include": ["src/server"]
}
```

### 3. Create tsconfig.client.json
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src/client"]
}
```

### 4. Create tsup.config.ts
```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server/index.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  clean: false,  // preserve vite output in dist/client/
  banner: { js: '#!/usr/bin/env node' },
});
```

### 5. Create vite.config.ts
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4983',
    },
  },
});
```

### 6. Tailwind v4 setup (CSS-first, no config files)
<!-- Updated: Validation Session 1 - Tailwind v4 replaces v3, no tailwind.config.ts or postcss.config.js needed -->
Tailwind v4 uses CSS-first configuration. No `tailwind.config.ts` or `postcss.config.js` needed.

In `globals.css`:
```css
@import "tailwindcss";
```

Install: `pnpm add -D tailwindcss @tailwindcss/vite` and add to vite.config.ts as a plugin.

### 7. Create index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sales-IQ Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/client/main.tsx"></script>
  </body>
</html>
```

### 8. Create placeholder source files
**src/client/styles/globals.css**
<!-- Updated: Validation Session 1 - Tailwind v4 CSS-first import -->
```css
@import "tailwindcss";
```

**src/client/main.tsx** — minimal React mount
**src/client/App.tsx** — "Dashboard loading" placeholder
**src/server/index.ts** — `console.log('server placeholder')` (built in Phase 2)

### 9. Install dependencies
```bash
cd packages/dashboard && pnpm install
```

### 10. Verify build
```bash
pnpm build  # should produce dist/client/ and dist/server.js
```

## Todo List
- [ ] Create `packages/dashboard/` directory
- [ ] Write `package.json` with correct deps and scripts
- [ ] Write `tsconfig.json` (server) extending base
- [ ] Write `tsconfig.client.json` (React)
- [ ] Write `tsup.config.ts` (ESM, clean: false)
- [ ] Write `vite.config.ts` (outDir: dist/client, proxy)
- [ ] Configure Tailwind v4 via `@tailwindcss/vite` plugin (no config files needed)
- [ ] Write `index.html`
- [ ] Write placeholder source files (main.tsx, App.tsx, globals.css, server/index.ts)
- [ ] Run `pnpm install` from monorepo root
- [ ] Verify `pnpm build` succeeds (both vite + tsup)
- [ ] Verify `turbo build` includes dashboard package

## Success Criteria
- `pnpm build` in `packages/dashboard/` produces `dist/server.js` and `dist/client/index.html`
- `turbo build` from root includes and builds dashboard
- `pnpm typecheck` passes for both server and client tsconfigs
- Bin entry `siq-dashboard` is declared and points to `dist/server.js`

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Vite + tsup build order conflict | Low | `clean: false` on tsup; vite runs first in script |
| Tailwind v3 vs v4 config differences | Low | Pin v3; well-documented config pattern |
| React 19 + Vite plugin compat | Low | `@vitejs/plugin-react@4` supports React 19 |

## Security Considerations
- No security surface in this phase (scaffolding only)
- Ensure `.env` files are in `.gitignore` (already covered by monorepo root)

## Next Steps
- Phase 2: Implement Express server with API routes
