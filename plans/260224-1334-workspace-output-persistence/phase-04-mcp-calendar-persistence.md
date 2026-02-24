# Phase 4: MCP Calendar Persistence

## Context
- Parent plan: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-shared-output-convention.md)
- File to modify: `packages/mcp-server/src/tools/content-calendar.ts`

## Overview
- **Priority**: P2
- **Status**: Pending
- **Description**: Add file-based persistence for content calendar entries so they survive MCP server restarts

## Key Insights
- Current implementation uses in-memory array `calendarEntries` — all data lost on restart
- MCP server runs as stdio process via Claude Code — restarts frequently
- Need to persist to `workspace/social/calendar-entries.json` in the user's project directory
- MCP server receives config but has no project dir awareness — need to add `projectDir` discovery
- The MCP server is configured in `~/.claude/settings.json` with a `command` field — could pass project dir as env var or argument

## Requirements
- Calendar entries persist to JSON file in workspace directory
- Load existing entries on startup (if file exists)
- Save after every create operation
- Handle gracefully when no project dir is found (fall back to in-memory only)
- Don't break existing API contract

## Architecture
```
{project-slug}/
└─ workspace/
   └─ social/
      └─ calendar-entries.json   ← NEW, auto-created
```

Data format:
```json
{
  "entries": [
    { "id": "cal-xxx", "date": "2026-02-24", "channel": "twitter", "content": "...", "status": "draft", "createdAt": "..." }
  ],
  "lastUpdated": "2026-02-24T12:00:00Z"
}
```

## Related Code Files
- **Modify**: `packages/mcp-server/src/tools/content-calendar.ts`

## Implementation Steps

1. Add `SALES_IQ_PROJECT_DIR` env var support to locate the project directory
   - MCP settings in `~/.claude/settings.json` can pass env vars to the MCP process
   - Alternatively: walk up from CWD to find `.sales-iq.json` (same as skills)

2. Update `content-calendar.ts`:
   - Add helper function `getCalendarFilePath()`: returns `{projectDir}/workspace/social/calendar-entries.json` or null
   - Add `loadEntries()`: Read JSON file if exists, populate `calendarEntries` array
   - Add `saveEntries()`: Write current `calendarEntries` to JSON file, create dirs if needed
   - Modify `handleContentCalendarTool()`:
     - On first call: lazy-load entries from file
     - After `calendar_create_entry`: call `saveEntries()`
   - Use `fs.mkdir` with `recursive: true` for directory creation
   - Wrap file ops in try/catch — fall back to in-memory on failure

3. Add project dir detection:
   ```typescript
   function findProjectDir(): string | null {
     // Check env var first
     if (process.env.SALES_IQ_PROJECT_DIR) return process.env.SALES_IQ_PROJECT_DIR;
     // Walk up from CWD
     let dir = process.cwd();
     while (dir !== path.dirname(dir)) {
       if (fs.existsSync(path.join(dir, '.sales-iq.json'))) return dir;
       dir = path.dirname(dir);
     }
     return null;
   }
   ```

## Todo
- [ ] Add `findProjectDir()` utility (could be in config.ts or a new util)
- [ ] Add `loadEntries()` and `saveEntries()` to content-calendar.ts
- [ ] Modify `calendar_create_entry` handler to persist after write
- [ ] Modify `calendar_list_entries` to lazy-load from file
- [ ] Test: create entry → restart MCP → list entries → verify persistence

## Success Criteria
- Calendar entries survive MCP server restarts
- File created at `workspace/social/calendar-entries.json`
- Graceful fallback to in-memory when no project dir found
- No TypeScript errors
- Existing API contract unchanged (same input/output schema)

## Risk Assessment
- **Risk**: MCP server CWD may not be inside project dir
  - **Mitigation**: Support `SALES_IQ_PROJECT_DIR` env var as primary, CWD walk-up as fallback
- **Risk**: Race condition if multiple Claude sessions write simultaneously
  - **Mitigation**: Acceptable for v1 — calendar is low-frequency. Can add file locking later if needed.
- **Risk**: Circular import if `findProjectDir` goes in config.ts
  - **Mitigation**: Keep it in content-calendar.ts as local function, or create small `utils/project-dir.ts`

## Security Considerations
- Don't write outside the project directory
- Validate that `.sales-iq.json` exists before writing to prevent writing to arbitrary dirs

## Next Steps
→ Phase 5: Build & verify
