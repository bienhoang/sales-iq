---
title: "UX Improvements for Non-Tech Users"
description: "Interactive wizard, doctor, uninstall commands + setup script for marketing/sales users"
status: complete
priority: P1
effort: 6h
branch: main
tags: [ux, cli, wizard, non-tech]
created: 2026-02-24
---

# UX Improvements for Non-Tech Users

## Problem
Current CLI requires developer skills (GitHub PAT, ~/.npmrc, CLI flags). Target users are marketing/sales people who abandon at step 1-2.

## Solution
Two onboarding paths: shell script (zero-to-hero) and `npx setup` (has Node.js). Plus doctor/uninstall for maintenance.

## New Dependencies
`prompts`, `open`, `ora` -- all ESM-native, lightweight, maintained.

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | Setup wizard command + deps | complete | 2h | [phase-01](phase-01-setup-wizard-command.md) |
| 2 | Doctor command | complete | 45m | [phase-02](phase-02-doctor-command.md) |
| 3 | Uninstall command | complete | 30m | [phase-03](phase-03-uninstall-command.md) |
| 4 | setup.sh shell script | complete | 1h | [phase-04](phase-04-setup-shell-script.md) |
| 5 | README + docs rewrite | complete | 1h | [phase-05](phase-05-readme-docs-update.md) |

## Dependencies
- Phase 1 must complete before Phase 4 (setup.sh calls `npx setup`)
- Phase 5 depends on all other phases (documents final commands)
- Phases 2 and 3 are independent of each other

## Key Decisions
- Reuse `runInstall()` and `configureBrand()`/`configureMcp()` from existing commands -- DRY
- Keep existing flag-based commands unchanged for power users and CI
- `parseAsync()` replaces `parse()` in index.ts (required for prompts)
- Wizard-prompts.ts extracts prompt definitions to keep setup.ts under 200 lines

## Research
- [CLI Codebase Analysis](research/researcher-01-cli-codebase.md)
- [NPM Packages Research](research/researcher-02-npm-packages.md)
- [Brainstorm Decisions](../reports/brainstorm-260224-1042-ux-improvements-nontech-users.md)

## Validation Log

### Session 1 — 2026-02-24
**Trigger:** Initial plan creation validation
**Questions asked:** 6

#### Questions & Answers

1. **[Scope]** setup.sh targets macOS/Linux only. Windows users get no automated path. Is this acceptable for your user base?
   - Options: macOS/Linux only (Recommended) | Add PowerShell script too | WSL instructions only
   - **Answer:** macOS/Linux only (Recommended)
   - **Rationale:** YAGNI — most Claude Code users are on Mac. Windows support deferred.

2. **[Security]** setup.sh stores the GitHub PAT in ~/.npmrc as plaintext. On shared/corporate machines this could be a concern. Should we add a warning or alternative?
   - Options: Plaintext is fine (Recommended) | Add chmod 600 after write | Both: chmod 600 + print warning
   - **Answer:** Plaintext is fine (Recommended)
   - **Rationale:** Standard npm behavior. ~/.npmrc is user-private by default.

3. **[Scope]** The wizard asks 'Connect live data (CRM, email, social)?' with default=No. Non-tech users won't understand MCP. How should this be handled?
   - Options: Skip MCP in wizard (Recommended) | Keep optional prompt | Plain-English explanation
   - **Answer:** Skip MCP in wizard (Recommended)
   - **Rationale:** Skills work without MCP. Removing MCP from wizard simplifies onboarding. Users discover it later via docs.

4. **[Architecture]** Phase 1 assumes runInstall() from install.ts can be imported and called directly from setup.ts. Should we verify this won't cause issues (e.g., console.log pollution during ora spinner)?
   - Options: Import as-is, fix if needed | Extract core logic first
   - **Answer:** Extract core logic first
   - **Rationale:** Separating pure install logic from console output prevents spinner conflicts and makes code more testable.

5. **[Architecture]** The plan uses `prompts` (terkelg) for interactive input. Alternative is `@inquirer/prompts`. Which do you prefer?
   - Options: prompts (terkelg) (Recommended) | @inquirer/prompts
   - **Answer:** prompts (terkelg) (Recommended)
   - **Rationale:** Lightweight, simple API, already researched. Stable despite less active maintenance.

6. **[Architecture]** Should `sales-iq doctor` be automatically run at the end of the setup wizard to verify everything worked?
   - Options: Yes, auto-run doctor (Recommended) | No, keep separate
   - **Answer:** Yes, auto-run doctor (Recommended)
   - **Rationale:** Immediate feedback after setup builds confidence for non-tech users.

#### Confirmed Decisions
- macOS/Linux only: No Windows support in v1 — YAGNI
- Plaintext PAT: Standard npm auth pattern, no extra chmod
- No MCP in wizard: Remove MCP prompt entirely from setup wizard
- Extract install core: Refactor install.ts to separate pure logic from console I/O
- prompts (terkelg): Confirmed as interactive prompt library
- Auto-run doctor: Wizard runs doctor checks after setup completes

#### Action Items
- [ ] Phase 1: Remove MCP prompt from wizard (getMcpPrompt unused in setup flow)
- [ ] Phase 1: Refactor install.ts — extract pure `installSkills()` function (no console.log) separate from `runInstall()` CLI wrapper
- [ ] Phase 1: Add doctor auto-run at end of setup wizard (import runDoctor from doctor.ts)
- [ ] Phase 2: Ensure runDoctor() can be called programmatically (return pass/fail count, not just console output)
- [ ] Phase 3: Remove configureMcpFromWizard() from setup.ts (MCP skipped in wizard)

#### Impact on Phases
- Phase 1: Remove MCP prompt + refactor install.ts to extract core logic + add doctor auto-run at end
- Phase 2: Make runDoctor() return a result object (not just console.log) so wizard can call it
- Phase 3: No change (uninstall still has its own MCP removal prompt)
