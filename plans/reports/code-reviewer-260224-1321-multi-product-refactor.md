# Code Review: Multi-Product Architecture Refactor

**Date:** 2026-02-24
**Score: 7/10**
**Scope:** CLI refactoring -- setup stripped to silent install, new `init` command for per-project creation, brand-context changed from required to optional.

## Files Reviewed

| File | LOC | Status |
|------|-----|--------|
| `packages/cli/src/commands/init.ts` | 115 | New |
| `packages/cli/src/utils/slug-utils.ts` | 6 | New |
| `packages/cli/src/utils/templates.ts` | 101 | New |
| `packages/cli/src/commands/setup.ts` | 47 | Modified (net -101) |
| `packages/cli/src/commands/doctor.ts` | 112 | Modified |
| `packages/cli/src/commands/configure.ts` | 118 | Modified |
| `packages/cli/src/index.ts` | 27 | Modified |
| `packages/cli/package.json` | 39 | Modified |
| `setup.sh` | 124 | Modified |
| `README.md` | 181 | Modified |
| **Total** | **831** | |

## Build & Lint Status

- **TypeScript:** Compiles clean (0 errors)
- **Build:** Passes (tsup, 25.63 KB output)
- **ESLint:** 0 errors, 3 warnings (2 unused imports, 1 `any` type)
- **Tests:** None exist

---

## Critical Issues

None found.

---

## High Priority

### H1. Tautological ternary in `configureMcp` -- `--global` flag is dead code

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/commands/configure.ts` line 48

```typescript
const settingsPath = getClaudeSettingsPath(!opts.global ? true : true);
```

This always evaluates to `true` regardless of `opts.global`. The `--global` flag has zero effect on MCP configuration path. Pre-existing bug, but this refactor didn't address it and it's a logic error.

**Fix:**
```typescript
const settingsPath = getClaudeSettingsPath(opts.global);
```

Or if global should truly be the default:
```typescript
const settingsPath = getClaudeSettingsPath(true);
```

### H2. No `@types/slugify` and `any` cast in slug-utils

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/utils/slug-utils.ts` line 5

```typescript
return (slugify as any)(name, { lower: true, strict: true, locale: 'vi' });
```

The `as any` cast bypasses type safety. The `slugify` package ships its own types -- the default export should work directly without casting.

**Fix:**
```typescript
export function toSlug(name: string): string {
  return slugify(name, { lower: true, strict: true, locale: 'vi' });
}
```

If the default import has issues with ESM, use:
```typescript
import slugify from 'slugify';

export function toSlug(name: string): string {
  const fn = typeof slugify === 'function' ? slugify : (slugify as any).default;
  return fn(name, { lower: true, strict: true, locale: 'vi' });
}
```

### H3. No test coverage for new `init` command

The `init` command is the primary user-facing feature of this refactor. It writes files to the filesystem based on user input. Zero test files exist in the entire CLI package. At minimum, unit tests should cover:

- `toSlug()` edge cases (empty, path traversal characters, unicode)
- `generateClaudeMd()`, `generateBrandContextMd()` output correctness
- `generateProjectConfig()` produces valid JSON with required fields
- Re-init behavior (updates config but preserves `brand-context.md`)

---

## Medium Priority

### M1. Unused imports left behind from refactor

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/commands/doctor.ts` line 8
```typescript
import { SKILL_CLUSTERS } from '../utils/paths.js';  // unused
```

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/commands/configure.ts` line 4
```typescript
import { getLocalSkillsDir } from '../utils/paths.js';  // unused
```

**Fix:** Remove both unused imports.

### M2. `init` writes CLAUDE.md unconditionally on re-init

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/commands/init.ts` line 77

```typescript
// CLAUDE.md — always overwrite (auto-generated)
await fs.writeFile(path.join(projectDir, 'CLAUDE.md'), generateClaudeMd(input), 'utf-8');
```

The code intentionally preserves `brand-context.md` on re-init (line 80-86) but overwrites `CLAUDE.md`. If a user customized their project's `CLAUDE.md` (added extra instructions, skill preferences, etc.), a re-init would silently destroy those edits. The comment says "auto-generated" but users have no way to know this.

**Recommendation:** Either (a) back up the old file as `CLAUDE.md.bak`, (b) warn the user, or (c) add a comment in the generated `CLAUDE.md` saying "this file is auto-generated and will be overwritten by `sales-iq init`".

### M3. `init` does not validate `brandName` is non-empty before slugging

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/commands/init.ts` line 37

The `prompts` library `validate` function on `brandName` checks `v.trim().length > 0`, but prompts can be bypassed (piped input, ctrl+D). If `brandName` is `undefined`, `toSlug(undefined)` will throw. The empty-string check on line 39-42 catches empty slug but not `undefined` input.

**Fix:**
```typescript
const slug = toSlug(answers.brandName ?? '');
```

### M4. Re-init partial update is incomplete

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/commands/init.ts` lines 92-99

On re-init, the config update only writes `name`, `slug`, and `updated` -- it drops `industry`, `audience`, and `tones` from the update. The `brand-context.json` IS fully rewritten (line 89), but `.sales-iq.json` is not updated with new brand fields.

```typescript
const updated = {
  ...existingConfig,
  name: input.name,
  slug: input.slug,
  updated: new Date().toISOString(),
  // Missing: industry, audience, tones not updated
};
```

This creates inconsistency between `.sales-iq.json` and `brand-context.json` after re-init.

### M5. `setup.sh` removed `/dev/tty` redirect for `npx` call

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/setup.sh` line 114

Previous version: `npx @bienhoang/sales-iq@latest setup < /dev/tty`
Current version: `npx @bienhoang/sales-iq@latest setup`

The `/dev/tty` redirect was added in commit `f84b087` specifically for `curl | bash` pipe compatibility. Now that `setup` is silent (no prompts), the redirect is unnecessary -- this is correct. But the comment on line 109 should be consistent with the actual behavior.

This is actually fine since `setup` no longer needs stdin. No action needed, noting for completeness.

---

## Low Priority

### L1. Success message says "clusters" vs "skills"

Addressed in diff -- `spinner.succeed` changed from `${result.installed} clusters` to `${result.installed} skills`. Good fix. But note that `result.installed` counts individual skill directories plus shared/, so the count may be slightly misleading (e.g., "21 skills" when only 20 are actual skills and 1 is `shared/`).

### L2. Generated CLAUDE.md hardcodes skill list

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/utils/templates.ts` lines 28-37

The `generateClaudeMd` function hardcodes 10 skill names. If skills are added/removed, this template becomes stale. Consider generating the list dynamically from the installed skills, or at least adding a comment noting the maintenance burden.

### L3. `configure --brand` still uses `writeJson` for non-JSON file

**File:** `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/commands/configure.ts` lines 113-114

```typescript
// Writes brand-context.json via writeJson (correct)
await writeJson(brandContextPath.replace('.md', '.json'), { name, industry, market });

// Then uses raw fs.writeFile for .md (inconsistent with file-ops pattern)
const fs = await import('fs/promises');
await fs.writeFile(brandContextPath, content, 'utf-8');
```

Pre-existing issue, but inconsistent with the pattern used in `init.ts` which directly imports `fs` at the top.

---

## Edge Cases Found (Scout Phase)

| Edge Case | Risk | Handled? |
|-----------|------|----------|
| Empty/whitespace brand name | `toSlug` returns `""` | Yes -- line 39-42 checks and exits |
| Path traversal in name (`../../etc/passwd`) | Slug becomes `etcpasswd` | Yes -- `strict: true` strips dots/slashes |
| XSS in name (`<script>`) | Slug becomes `lessscriptgreater...` | Yes -- stripped by slugify |
| Unicode/Vietnamese chars | Properly transliterated | Yes -- `locale: 'vi'` option |
| Existing directory (not a sales-iq project) | Prompts user for confirmation | Yes -- line 52-59 |
| Re-init existing project | Updates config, preserves `brand-context.md` | Partially -- CLAUDE.md overwritten, .sales-iq.json update is incomplete (M4) |
| `answers.brandName` is `undefined` (ctrl+D) | `toSlug(undefined)` throws | No -- needs null coalescing (M3) |
| Concurrent `init` runs on same slug | Race condition on file writes | Low risk -- single user CLI |

---

## Positive Observations

1. **Clean separation of concerns.** Brand prompts in `wizard-prompts.ts`, slug logic in `slug-utils.ts`, templates in `templates.ts`. Each file is focused and under 120 lines.

2. **Good architectural decision.** Moving from global brand-context (one product) to per-project directories is the right pattern for multi-product support.

3. **Backwards-compatible migration.** `doctor` changed brand-context from FAIL to WARN. `configure --brand` adds deprecation notice. Existing users are not broken.

4. **Setup simplification.** Removing interactive prompts from `setup` and moving them to `init` makes the install-then-configure flow much cleaner. The `curl | bash` pipe path is now fully non-interactive.

5. **Consistent error handling.** All commands use try/catch with ora spinners. Error messages include the actual error.

6. **Re-init preserves user edits.** `brand-context.md` is not overwritten on re-init -- respects user customization.

---

## Recommended Actions (Priority Order)

1. **Fix the `configureMcp` tautology** (H1) -- 1-line fix, logic bug
2. **Remove `as any` cast in `toSlug`** (H2) -- test if direct import works first
3. **Add null guard for `answers.brandName`** (M3) -- defensive coding
4. **Fix re-init config update** (M4) -- add missing fields to `.sales-iq.json` update
5. **Remove unused imports** (M1) -- clean lint warnings
6. **Add unit tests for slug-utils and templates** (H3) -- invest ~30 min
7. **Add "auto-generated" header to CLAUDE.md output** (M2) -- UX clarity

---

## Metrics

| Metric | Value |
|--------|-------|
| Type Coverage | 100% (tsc --noEmit passes) |
| Test Coverage | 0% (no tests) |
| Lint Errors | 0 |
| Lint Warnings | 3 |
| Build | Passes |
| Security Issues | 0 (slugify properly sanitizes) |

---

## Unresolved Questions

1. Should `init` create a `.gitignore` in the project directory? Currently `brand-context.json` and `.sales-iq.json` would be committed to git, which may or may not be desired.
2. Should `CLAUDE.md` be added to `.gitignore` or be version-controlled? Different users may have different preferences.
3. The `--global` flag on `configure` is effectively dead code (H1). Is local MCP config (`./claude/settings.json`) a supported use case, or should the flag be removed entirely?
