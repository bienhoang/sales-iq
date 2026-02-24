# Phase 1: Shared Output Convention

## Context
- Parent plan: [plan.md](./plan.md)
- Brainstorm: [brainstorm report](../reports/brainstorm-260224-1334-workspace-output-persistence.md)
- Existing shared files: `packages/skills/shared/brand-context.md`, `icp-profiles.md`, `saas-benchmarks.md`

## Overview
- **Priority**: P0 (blocking all other phases)
- **Status**: Pending
- **Description**: Create the shared output convention file that all 20 skills will reference

## Key Insights
- Skills are markdown instructions — they can't run code. Output convention must be clear enough for Claude to follow consistently.
- Path discovery via `.sales-iq.json` is the same pattern used by the CLI's `init` command.
- The convention file lives alongside existing shared context files.

## Requirements
- Define workspace path discovery algorithm (walk up for `.sales-iq.json`)
- Define auto-save + display behavior
- Define file naming format: `{descriptor}-{YYYY-MM-DD}.md`
- Define on-demand directory creation
- Provide complete output_dir → workspace subdirectory mapping
- Handle edge case: no `.sales-iq.json` found (inform user, skip save)

## Architecture
```
packages/skills/shared/
├─ brand-context.md          (existing)
├─ icp-profiles.md           (existing)
├─ saas-benchmarks.md        (existing)
└─ output-convention.md      (NEW)
```

## Related Code Files
- **Create**: `packages/skills/shared/output-convention.md`

## Implementation Steps

1. Create `packages/skills/shared/output-convention.md` with:
   - **Project Detection**: Instructions to find `.sales-iq.json` by checking CWD, then parent dirs
   - **Save Protocol**: After generating any deliverable:
     a. Find project root (dir containing `.sales-iq.json`)
     b. Determine `workspace/{output_dir}/` path from skill's declared output_dir
     c. Create directory if it doesn't exist (`mkdir -p`)
     d. Generate filename: `{descriptor}-{YYYY-MM-DD}.md` where descriptor is context-derived (account name, campaign name, etc.)
     e. Write the full deliverable content to file
     f. Display the deliverable in conversation
     g. Print: `Saved to: {relative-path-from-project-root}`
   - **Naming Guide**: How to derive the descriptor for each content type
   - **Error Handling**: If no `.sales-iq.json` found, display output normally and note "Output not saved — run `sales-iq init` to enable workspace persistence"
   - **Directory Mapping Table**: Complete output_dir → workspace path mapping

2. Verify the file renders correctly as markdown

## Todo
- [ ] Create `packages/skills/shared/output-convention.md`
- [ ] Verify content is comprehensive and unambiguous

## Success Criteria
- Convention file exists at `packages/skills/shared/output-convention.md`
- Covers all 11 content type directories
- Includes clear step-by-step save protocol
- Handles the no-project-detected edge case

## Risk Assessment
- **Risk**: Convention too verbose → Claude ignores parts of it
  - **Mitigation**: Keep it concise, use numbered steps, use a table for the mapping
- **Risk**: Claude fails to reliably detect `.sales-iq.json`
  - **Mitigation**: Explicit step-by-step path walk instructions

## Next Steps
→ Phase 2: Update all 20 SKILL.md files to reference this convention
