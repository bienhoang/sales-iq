# Code Review: Workspace Output Persistence

**Date**: 2026-02-24
**Reviewer**: code-reviewer
**Commit**: e1f358c (HEAD of main)

---

## Scope

- **Files reviewed**: 24 (1 TypeScript, 1 convention doc, 1 template, 20 SKILL.md, 1 init command)
- **LOC changed**: ~319 (core files) + ~100 lines across 20 SKILL.md appendages
- **Focus**: Workspace output persistence -- convention doc, CLI template, MCP tool persistence, SKILL.md consistency

---

## Overall Assessment

Solid implementation. The output convention is well-designed, the SKILL.md sections are consistent, and the content-calendar persistence follows a clean pattern. Found **1 bug** (copy-paste artifact in siq-seo-content), **1 high-priority architectural concern** (stale singleton in long-running MCP), and a few medium-priority items.

---

## Critical Issues

None.

---

## High Priority

### H1. Stale singleton cache in long-running MCP server

**File**: `/Users/bienhoang/Documents/Projects/sales-iq/packages/mcp-server/src/tools/content-calendar.ts` (lines 19-21)

```typescript
let calendarEntries: CalendarEntry[] = [];
let loaded = false;
```

The MCP server is a long-running stdio process. The module-level `loaded` flag means:
1. Data is read from disk exactly once. External edits to `calendar-entries.json` (e.g., manual edits or a skill writing directly) are never picked up.
2. If the user changes CWD (unlikely but possible), the cached entries from project A could be written to project B when `saveEntries()` is called because `getCalendarFilePath()` resolves fresh each time while entries stay stale.

**Impact**: Silent data corruption in multi-project scenarios; stale reads in single-project scenarios.

**Fix options** (pick one):
- **Option A** (simple): Remove the `loaded` flag entirely. Read from disk on every `loadEntries()` call. File is small JSON; the I/O cost is negligible.
- **Option B** (defensive): Track the `projectDir` used for loading. If `findProjectDir()` returns a different dir on next call, reset `loaded` and `calendarEntries`.

```typescript
// Option A -- simplest fix
function loadEntries(): void {
  calendarEntries = [];
  try {
    const filePath = getCalendarFilePath();
    if (!filePath || !existsSync(filePath)) return;
    const raw = readFileSync(filePath, 'utf-8');
    const data: CalendarData = JSON.parse(raw);
    if (Array.isArray(data.entries)) {
      calendarEntries = data.entries;
    }
  } catch {
    // Fall back to empty
  }
}
```

### H2. SALES_IQ_PROJECT_DIR env var not validated

**File**: `/Users/bienhoang/Documents/Projects/sales-iq/packages/mcp-server/src/tools/content-calendar.ts` (line 25)

```typescript
if (process.env.SALES_IQ_PROJECT_DIR) return process.env.SALES_IQ_PROJECT_DIR;
```

The env var is returned without checking that `.sales-iq.json` exists in that directory. This means:
- A misconfigured env var could cause writes to arbitrary directories.
- The `saveEntries()` call creates `workspace/social/` via `mkdirSync({ recursive: true })` at that path.

**Fix**: Validate the env var points to a real sales-iq project:

```typescript
if (process.env.SALES_IQ_PROJECT_DIR) {
  const envDir = process.env.SALES_IQ_PROJECT_DIR;
  if (existsSync(join(envDir, '.sales-iq.json'))) return envDir;
}
```

---

## Medium Priority

### M1. Copy-paste artifact in siq-seo-content/SKILL.md

**File**: `/Users/bienhoang/Documents/Projects/sales-iq/packages/skills/marketing/siq-seo-content/SKILL.md` (line 158)

```markdown
- **File naming**: `{topic-slug}-{content-type}-{YYYY-MM-DD}.md` "would I share this?" test
```

The trailing `"would I share this?" test` is a copy-paste artifact from the preceding checklist item (line 153). Should be:

```markdown
- **File naming**: `{topic-slug}-{content-type}-{YYYY-MM-DD}.md`
```

### M2. `workspace/` not in user project .gitignore

The `init` command (`/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/commands/init.ts`) creates `CLAUDE.md`, `brand-context.md`, `brand-context.json`, and `.sales-iq.json` but does not create a `.gitignore` in the user project directory. Since skills auto-save deliverables to `workspace/`, users could accidentally commit generated proposals, emails, and reports.

**Fix**: Add `.gitignore` creation to `init.ts` with at minimum:

```
workspace/
```

Or alternatively mention it in the CLAUDE.md `## Workspace` section as a user action item.

### M3. `workspace/research/` directory has no mapped skill

The output convention table lists `research` as a valid output_dir, and the CLAUDE.md template includes `workspace/research/ | Research reports, brainstorm summaries`. However, no SKILL.md currently maps to this directory.

**Impact**: Low -- this is future-proofing. But it creates a promise in the user-facing CLAUDE.md that no current skill fulfills. Consider either removing it from both tables or adding a note that it is reserved.

### M4. `findProjectDir()` should be extracted to shared utility

The `findProjectDir()` function in `content-calendar.ts` will be needed by other MCP tools (analytics, crm, email, social, lead-scoring) when they get persistence. It should live in a shared utility module (e.g., `packages/mcp-server/src/utils/project.ts`) to avoid duplication.

**Impact**: Not broken now, but pre-empts copy-paste when other tools get persistence.

### M5. Silent error swallowing in save/load

**File**: `/Users/bienhoang/Documents/Projects/sales-iq/packages/mcp-server/src/tools/content-calendar.ts` (lines 51-53, 67-68)

Both `loadEntries()` and `saveEntries()` catch all errors silently. Consider logging to `process.stderr` so operators can diagnose issues:

```typescript
} catch (err) {
  process.stderr.write(`[sales-iq] Failed to save calendar: ${(err as Error).message}\n`);
}
```

---

## Low Priority

### L1. Date comparison uses string comparison for date filtering

**File**: `/Users/bienhoang/Documents/Projects/sales-iq/packages/mcp-server/src/tools/content-calendar.ts` (lines 109-111)

```typescript
const filtered = calendarEntries.filter(
  (e) => e.date >= startDate && e.date <= endDate,
);
```

String comparison works correctly for `YYYY-MM-DD` format, which is what the schema enforces. This is fine, but adding a comment noting the ISO format dependency would prevent future regressions if the date format changes.

### L2. `Date.now()` for ID generation

```typescript
const entry: CalendarEntry = { id: `cal-${Date.now()}`, ... };
```

Two rapid consecutive calls within the same millisecond could produce duplicate IDs. Extremely unlikely but worth noting. A counter suffix or `crypto.randomUUID()` would be more robust.

---

## Consistency Audit: SKILL.md Output Sections

All 20 skills checked. Results:

| Check | Status | Notes |
|-------|--------|-------|
| All 20 skills have `## Output` section | PASS | All appended correctly |
| All reference `../../shared/output-convention.md` | PASS | Relative path resolves from all 3 cluster dirs |
| Hub skills (brand-strategy, account-strategy) have `references/` caveat | PASS | Both include "Continue saving internal reference data to `references/` as before." |
| Output dirs match convention table | PASS | All 11 convention dirs used correctly |
| File naming patterns present | PASS | All 20 have skill-appropriate patterns |
| No naming pattern collisions | PASS | Each skill has distinct descriptor patterns |

**Directory mapping summary** (verified against convention table):

| Convention Dir | Skills Mapped |
|----------------|---------------|
| `proposals` | siq-proposal-generator |
| `emails` | siq-email-campaign, siq-follow-up |
| `outreach` | siq-outreach-sequence |
| `ad-copy` | siq-ad-copy |
| `content` | siq-content-repurpose, siq-seo-content |
| `social` | siq-social-media-calendar, siq-social-media-post, siq-community-engagement |
| `intel` | siq-competitor-intel, siq-lead-qualification |
| `reports` | siq-metrics-report, siq-pipeline-report |
| `strategy` | siq-brand-strategy, siq-product-launch, siq-strategy-consultant |
| `sales-prep` | siq-account-strategy, siq-demo-prep, siq-objection-handling |
| `research` | **(none -- unused)** |

**Bug found**: siq-seo-content line 158 has trailing copy-paste text (see M1).

---

## CLAUDE.md Template Consistency

**File**: `/Users/bienhoang/Documents/Projects/sales-iq/packages/cli/src/utils/templates.ts`

- Workspace table in `generateClaudeMd()` matches the output convention table: **PASS**
- All 11 directories listed: **PASS**
- File naming convention documented: **PASS**
- Template string escaping (backticks, pipes) correct: **PASS**

---

## Positive Observations

1. **Clean architecture**: Output convention as a shared doc referenced by all skills is DRY and maintainable. Changing the convention requires editing one file.
2. **Graceful degradation**: `findProjectDir()` returns null when no project found; all callers handle null correctly.
3. **On-demand directory creation**: `mkdirSync({ recursive: true })` in `saveEntries()` matches the convention's "on-demand creation" principle.
4. **Hub skill caveat**: brand-strategy and account-strategy correctly note that `references/` saves continue alongside workspace saves, avoiding confusion.
5. **TypeScript compiles clean**: `npx tsc --noEmit` passes with zero errors.
6. **Consistent format**: All 20 SKILL.md output sections follow identical structure (convention reference, output directory, file naming).

---

## Recommended Actions

1. **[H1]** Remove `loaded` singleton flag -- reload from disk each call (prevents stale data in long-running MCP)
2. **[H2]** Validate `SALES_IQ_PROJECT_DIR` env var against `.sales-iq.json` existence
3. **[M1]** Fix copy-paste artifact in siq-seo-content SKILL.md line 158
4. **[M2]** Consider adding `.gitignore` with `workspace/` to `init` output
5. **[M4]** Extract `findProjectDir()` to shared utility before other tools get persistence
6. **[M5]** Add stderr logging in catch blocks instead of silent swallow

---

## Metrics

- **Type Coverage**: 100% (all parameters and return types typed)
- **Test Coverage**: Not assessed (no tests for content-calendar persistence yet)
- **Linting Issues**: 0 (TypeScript compiles clean)
- **SKILL.md Consistency**: 19/20 clean, 1 has copy-paste artifact

---

## Unresolved Questions

1. Should `workspace/` be added to the monorepo `.gitignore` as well, or only to user project `.gitignore` via `init`? (Answer: only user project -- the monorepo workspace/ dir is a user-project concern, not a monorepo concern.)
2. When other MCP tools (crm, analytics, etc.) gain persistence, will they each implement their own `findProjectDir()`? Recommend extracting to shared now to prevent drift.
3. The `research` output_dir is documented in both the convention and CLAUDE.md but no skill uses it. Is a research-focused skill planned, or should it be removed from the tables?
