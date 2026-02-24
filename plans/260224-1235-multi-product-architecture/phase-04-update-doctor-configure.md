# Phase 4: Update Doctor + Configure Commands

## Context
- Parent: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-refactor-setup-silent-install.md), [Phase 2](./phase-02-new-init-command.md)

## Overview
- **Priority**: P2
- **Effort**: 20m
- **Status**: Complete
- **Description**: Update doctor to remove brand-context check from global path (no longer created during setup). Update configure to reflect new architecture.

## Key Insights
- Doctor currently checks `~/.claude/skills/shared/brand-context.md` — this file no longer created during setup
- Brand context now lives per-project (created by `init`)
- Doctor should still check skills installed, but skip brand-context check or make it informational
- Configure `--brand` flag writes to global shared dir — may deprecate or redirect to `init`

## Related Code Files

**Modify:**
- `packages/cli/src/commands/doctor.ts` — update brand-context check
- `packages/cli/src/commands/configure.ts` — update `--brand` behavior or add deprecation notice

## Implementation Steps

### Step 1: Update `doctor.ts`

Replace brand-context check (check #4, lines 77-87):

```ts
// 4. Brand context — now per-project, just inform
const brandPath = path.join(skillsDir, 'shared', 'brand-context.md');
if (await fileExists(brandPath)) {
  console.log(`${PASS} brand-context.md (global/legacy)`);
  result.checks.push({ label: 'brand-context.md', status: 'pass' });
} else {
  console.log(`${WARN} No global brand-context.md (expected — use per-project)`);
  console.log(chalk.dim('       Run: sales-iq init  — creates project with brand context'));
  result.warnings++;
  result.checks.push({ label: 'brand-context.md', status: 'warn' });
}
```

Change: `FAIL` → `WARN`, decrement issues → increment warnings. No longer a hard failure.

### Step 2: Update `configure.ts`

Add deprecation notice to `--brand` flag:

```ts
async function configureBrand(opts: ConfigureOptions): Promise<void> {
  console.log(chalk.yellow('\n  Note: --brand writes to global ~/.claude/skills/shared/.'));
  console.log(chalk.yellow('  For per-project brand context, use: sales-iq init\n'));
  // ... keep existing logic for backward compat
}
```

## Todo
- [ ] Update doctor brand-context check: FAIL → WARN
- [ ] Update doctor hint message: "sales-iq init" instead of "sales-iq setup"
- [ ] Add deprecation hint to configure --brand
- [ ] Build and verify

## Success Criteria
- `sales-iq doctor` passes without brand-context.md in global dir (warn, not fail)
- `sales-iq configure --brand` still works but shows deprecation hint
- Doctor hints point to `sales-iq init`

## Next Steps
- Phase 5: Update README + docs
