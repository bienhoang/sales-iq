# Phase 01 — Monorepo Foundation

## Context Links

- Parent: [plan.md](./plan.md)
- Dependencies: none (first phase)
- Ref: [Turborepo docs](https://turbo.build/repo/docs)

## Overview

- **Date**: 2026-02-24
- **Priority**: P1
- **Status**: pending
- **Effort**: 3h
- **Description**: Initialize git repo, pnpm workspaces, Turborepo, TypeScript configs, linting, CI skeleton. This is the scaffold everything else builds on.

## Key Insights

- Skills package needs NO build pipeline — just file copy. Turborepo should not require a `build` task for it.
- Use `tsup` for TS packages (core, mcp-server, cli) — fast, zero-config ESM/CJS bundler.
- pnpm workspaces + Turborepo is the standard monorepo pattern for npm-published packages.
- Keep root package.json as workspace root only; no publishable code at root.

## Requirements

### Functional
- Git repo initialized with proper .gitignore
- pnpm workspace config recognizing 4 packages
- Turborepo pipeline: `build`, `lint`, `test`, `typecheck`
- Shared TypeScript base config extended by each package
- ESLint + Prettier for consistent formatting
- GitHub Actions CI running lint + build + typecheck on PR

### Non-Functional
- Clean `pnpm install` from fresh clone
- `turbo build` completes without errors (even with empty packages)
- CI runs in under 3 minutes

## Architecture

```
sales-iq/
├── packages/
│   ├── skills/          # sales-iq-skills (no build)
│   ├── mcp-server/      # sales-iq-mcp-server (TS)
│   ├── core/            # sales-iq-core (TS)
│   └── cli/             # sales-iq (TS)
├── turbo.json
├── pnpm-workspace.yaml
├── package.json         # root workspace
├── tsconfig.base.json   # shared TS config
├── .eslintrc.cjs
├── .prettierrc
├── .editorconfig
├── .gitignore
├── LICENSE              # MIT
└── README.md
```

## Related Code Files

### Create
- `package.json` — root workspace, scripts: `build`, `lint`, `test`, `typecheck`, `format`
- `pnpm-workspace.yaml` — `packages: ["packages/*"]`
- `turbo.json` — pipeline config for build/lint/test/typecheck
- `tsconfig.base.json` — shared compiler options (strict, ESNext, NodeNext)
- `.eslintrc.cjs` — TypeScript ESLint config, extends recommended
- `.prettierrc` — singleQuote, semi, trailingComma all, printWidth 100
- `.editorconfig` — indent_style space, indent_size 2, end_of_line lf
- `.gitignore` — node_modules, dist, .turbo, .env, .DS_Store, .ref/
- `LICENSE` — MIT license
- `README.md` — project overview (placeholder, finalized in phase 08)
- `.github/workflows/ci.yml` — lint + build + typecheck on push/PR
- `packages/skills/package.json` — name: `sales-iq-skills`, no build script
- `packages/mcp-server/package.json` — name: `sales-iq-mcp-server`
- `packages/mcp-server/tsconfig.json` — extends base
- `packages/mcp-server/src/index.ts` — empty entry
- `packages/core/package.json` — name: `sales-iq-core`
- `packages/core/tsconfig.json` — extends base
- `packages/core/src/index.ts` — empty entry
- `packages/cli/package.json` — name: `sales-iq`, bin field
- `packages/cli/tsconfig.json` — extends base
- `packages/cli/src/index.ts` — empty entry with shebang

## Implementation Steps

1. `git init` in project root
2. Create root `package.json`:
   ```json
   {
     "name": "sales-iq-monorepo",
     "private": true,
     "packageManager": "pnpm@9.15.0",
     "scripts": {
       "build": "turbo build",
       "lint": "turbo lint",
       "test": "turbo test",
       "typecheck": "turbo typecheck",
       "format": "prettier --write \"**/*.{ts,md,json}\""
     },
     "devDependencies": {
       "turbo": "^2",
       "typescript": "^5.7",
       "eslint": "^9",
       "@typescript-eslint/eslint-plugin": "^8",
       "@typescript-eslint/parser": "^8",
       "prettier": "^3",
       "tsup": "^8"
     }
   }
   ```
3. Create `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - "packages/*"
   ```
4. Create `turbo.json` with pipeline:
   - `build` depends on `^build` (topological)
   - `lint` — no deps
   - `test` depends on `build`
   - `typecheck` — no deps
   - Skills package: skip build (use `"build": {}` override or no build script)
5. Create `tsconfig.base.json` — strict mode, target ES2022, module NodeNext
6. Create stub `package.json` + `tsconfig.json` + `src/index.ts` for each TS package
7. Create `packages/skills/package.json` with only `name`, `version`, `files` field
8. Create `.eslintrc.cjs`, `.prettierrc`, `.editorconfig`
9. Create `.gitignore` including `.ref/`, `.env*`, `node_modules/`, `dist/`, `.turbo/`
10. Create `LICENSE` (MIT)
11. Create `.github/workflows/ci.yml`:
    - Trigger: push to main, pull_request
    - Steps: checkout, setup pnpm, setup node, install, turbo build, turbo lint, turbo typecheck
12. Run `pnpm install` and verify clean install
13. Run `turbo build` and verify no errors

## Todo List

- [ ] Init git repo
- [ ] Create root package.json + pnpm-workspace.yaml
- [ ] Create turbo.json pipeline
- [ ] Create tsconfig.base.json
- [ ] Create stub packages (4x)
- [ ] Configure ESLint + Prettier
- [ ] Create .gitignore, .editorconfig, LICENSE
- [ ] Create GitHub Actions CI
- [ ] Verify `pnpm install && turbo build` works

## Success Criteria

- `pnpm install` resolves all dependencies cleanly
- `turbo build` passes (skills package skipped, TS packages compile)
- `turbo lint` passes with zero errors
- `turbo typecheck` passes
- CI workflow runs successfully on push
- All 4 packages recognized by pnpm workspace

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Turborepo version breaking changes | Pin turbo@^2, test before upgrading |
| pnpm version mismatch on CI | Use `packageManager` field + corepack |
| Skills package confuses Turborepo (no build) | Empty build script or turbo pipeline override |

## Security Considerations

- `.ref/` directory must be gitignored (contains client-specific ref materials)
- `.env*` files gitignored
- No secrets in CI config; use GitHub secrets for npm publish later

## Next Steps

- Phase 02 (Core Package): define types and utils
- Phase 03/04 (Skills): can begin immediately after foundation
