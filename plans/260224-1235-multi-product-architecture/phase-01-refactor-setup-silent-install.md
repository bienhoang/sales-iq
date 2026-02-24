# Phase 1: Refactor Setup → Silent Install

## Context
- Parent: [plan.md](./plan.md)
- Brainstorm: [brainstorm report](../reports/brainstorm-260224-1235-multi-product-architecture.md)

## Overview
- **Priority**: P1 (must complete first)
- **Effort**: 30m
- **Status**: Complete
- **Description**: Strip brand questions from setup command, make it silent (zero prompts). Install skills + run doctor only.

## Key Insights
- Current setup.ts has brand questions → install → write brand context → summary → doctor
- Brand prompts defined in wizard-prompts.ts — `getBrandPrompts()` and `resolveIndustry()`
- These functions will move to init command (Phase 2), not deleted
- `writeBrandContext()` in setup.ts also moves to init

## Requirements
- Setup must complete with zero user interaction
- Install all skills to `~/.claude/skills/`
- Run doctor health check
- Print guidance: "Run sales-iq init to create your first project"
- No brand-context files created during setup

## Related Code Files

**Modify:**
- `packages/cli/src/commands/setup.ts` — remove brand questions, writeBrandContext, simplify flow

**Keep unchanged:**
- `packages/cli/src/utils/wizard-prompts.ts` — keep file, reused by init command
- `packages/cli/src/commands/install.ts` — no changes
- `packages/cli/src/commands/doctor.ts` — no changes (Phase 4 updates later)

## Implementation Steps

1. **Edit `setup.ts`**:
   - Remove imports: `getBrandPrompts`, `resolveIndustry` from wizard-prompts
   - Remove `writeBrandContext()` function entirely
   - Remove `printSummary()` function
   - Remove `BrandInput` interface
   - Simplify `runSetup()`:
     ```ts
     export async function runSetup(): Promise<void> {
       console.log(chalk.bold('\n  sales-iq — Installing...\n'));

       // Install all skills (silent)
       const spinner = ora('Installing skills...').start();
       const result = await installSkills({
         skills: 'all', global: true, local: false, force: false,
       });
       if (result.errors.length > 0) {
         spinner.fail(`Install had errors: ${result.errors.join(', ')}`);
       } else {
         spinner.succeed(`Skills installed (${result.installed} skills)`);
       }

       // Health check
       console.log(chalk.dim('\n  Running health check...\n'));
       await runDoctor();

       // Next steps
       console.log(chalk.bold('\n  Next step:\n'));
       console.log(chalk.cyan('    sales-iq init') + chalk.dim('  — create a project for your product\n'));
     }
     ```
   - Remove unused imports: `prompts`, `path`, `fs`, `ensureDir`, `writeJson`, `getGlobalSkillsDir`
   - Keep: `chalk`, `ora`, `Command`, `installSkills`, `runDoctor`, `SKILL_CLUSTERS`

2. **Verify build**: `pnpm --filter @bienhoang/sales-iq build`

## Todo
- [ ] Strip brand questions from setup.ts
- [ ] Remove writeBrandContext + printSummary + BrandInput
- [ ] Add "next step: sales-iq init" message
- [ ] Clean up unused imports
- [ ] Verify TypeScript compiles

## Success Criteria
- `sales-iq setup` runs with zero prompts
- Skills installed to `~/.claude/skills/`
- Doctor health check runs
- "sales-iq init" guidance printed
- No brand-context files created

## Risk Assessment
- **Breaking change**: Existing setup.sh calls `npx @bienhoang/sales-iq@latest setup` — still works but no longer creates brand context
- **Mitigation**: setup.sh updated in Phase 3 to guide users to `init`

## Next Steps
- Phase 2: Build init command (uses brand prompts from wizard-prompts.ts)
