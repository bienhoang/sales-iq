# Code Review: packages/dashboard

**Date:** 2026-02-24
**Score: 8.5 / 10**

---

## Scope

- **Server:** `src/server/` — app.ts, index.ts, routes/*, utils/safe-path.ts, utils/workspace-scanner.ts
- **Client:** `src/client/` — App.tsx, hooks/*, components/* (10 files)
- **Config:** package.json, tsup.config.ts, vite.config.ts, tsconfig*.json
- **Skill:** packages/skills/siq-dashboard/SKILL.md
- **LOC:** ~500 (source), ~100 (config)
- Build: clean (no TS errors in build log)

---

## Overall Assessment

Solid, well-structured package. Security fundamentals are correct, separation of concerns is clean, hooks are idiomatic. A few issues need fixing before merge — none are catastrophic, but two are worth correcting.

---

## Critical Issues

None.

---

## High Priority

### 1. `safePath` — `..` substring check is fragile and redundant

**File:** `src/server/utils/safe-path.ts` line 5

```ts
if (userInput.includes('..')) return null;
```

This check catches obvious traversal but fires false-positives on legitimate filenames like `sales-prep/..company-overview.md`. More importantly, the `path.resolve` + `startsWith` check on lines 6–10 is a **complete and correct** guard on its own — the substring check adds nothing of value and introduces a bug.

**Fix:** Remove line 5. The resolve-and-prefix check is sufficient.

```ts
export function safePath(base: string, userInput: string): string | null {
  const resolvedBase = path.resolve(base);
  const resolved = path.resolve(resolvedBase, userInput);
  if (!resolved.startsWith(resolvedBase + path.sep) && resolved !== resolvedBase) {
    return null;
  }
  return resolved;
}
```

---

### 2. `config.ts` — `brand-context.md` write path is not validated

**File:** `src/server/routes/config.ts` line 33

```ts
const brandPath = path.join(projectDir, 'brand-context.md');
```

`projectDir` is controlled by the CLI `--dir` argument (index.ts line 12). There is no validation that `projectDir` is a real sales-iq project directory (i.e., contains `.sales-iq.json`). An attacker who can invoke the CLI can pass `--dir /tmp` and write to `/tmp/brand-context.md`. This is an acceptable risk for a local-only tool, but the GET `/config` reads `.sales-iq.json` which provides implicit validation — it should be checked first.

**Recommendation:** In `configRouter`, read `.sales-iq.json` once at startup. If missing, return 503 on all routes. This also de-duplicates the path-join logic.

---

## Medium Priority

### 3. `FileViewer` component is dead code

**File:** `src/client/components/file-viewer.tsx`

`FileViewer` is never imported or used. `App.tsx` goes straight to `TiptapEditor`. Either remove it or it will cause confusion.

**Fix:** Delete `src/client/components/file-viewer.tsx`.

---

### 4. `useBrandContext` — double fetch on `Sidebar` mount

**File:** `src/client/components/sidebar.tsx` line 42

```ts
const { exists } = useBrandContext();
```

`App.tsx` also calls `useBrandContext()` (line 23). Each hook call does its own independent `fetch('/api/brand-context')` on mount. The two fetches are not coordinated — it fires twice on load.

**Fix:** Lift `useBrandContext` to `App.tsx` only and pass `exists` as a prop to `Sidebar`:

```tsx
// App.tsx
const { content: brandContent, loading: brandLoading, exists: brandExists } = useBrandContext();
// ...
<Sidebar ... brandExists={brandExists} />
```

```tsx
// sidebar.tsx props
interface Props {
  ...
  brandExists: boolean;
}
export function Sidebar({ ..., brandExists }: Props) {
  // remove: const { exists } = useBrandContext();
```

---

### 5. Vite proxy port is hardcoded

**File:** `vite.config.ts` line 14

```ts
'/api': 'http://localhost:4983',
```

The server uses `get-port` to find a free port at runtime. If port 4983 is taken, the server starts on a different port while the Vite dev proxy still targets 4983, breaking local dev. This only affects `dev:client` + `dev:server` workflows, not production.

**Fix:** Either document that dev requires `--port 4983` explicitly, or load the proxy target from an env var:

```ts
'/api': process.env.API_URL || 'http://localhost:4983',
```

---

### 6. `workspace-scanner.ts` — serial `stat()` calls in hot path

**File:** `src/server/utils/workspace-scanner.ts` lines 33–40

```ts
for (const entry of entries) {
  const stat = await fs.stat(filePath); // serial
```

All `stat` calls within a category are sequential. For a category with many files this adds avoidable latency.

**Fix:**

```ts
const files = await Promise.all(
  entries
    .filter((e) => e.endsWith('.md'))
    .map(async (entry) => {
      const filePath = path.join(catDir, entry);
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) return null;
      return { name: entry, path: `${cat}/${entry}`, modified: stat.mtime.toISOString(), size: stat.size };
    })
).then((r) => r.filter(Boolean) as FileInfo[]);
```

---

## Low Priority

### 7. `editor-toolbar.tsx` — `window.prompt` for link insertion

**File:** `src/client/components/editor-toolbar.tsx` line 79

`window.prompt` blocks the main thread and is styled by the OS — jarring UX. Acceptable for v0.1 but worth noting.

### 8. Build bundle size warning

The build log shows a 633KB JS chunk. For a local tool this is fine, but Tiptap + StarterKit + Markdown extension is heavy. If startup feel matters later, dynamic import of `TiptapEditor` is the fix.

### 9. `package.json` — React/Tiptap in `devDependencies`

React, react-dom, and all Tiptap packages are in `devDependencies`. Since they're bundled by Vite into `dist/client/`, this is functionally correct — nothing is missing at runtime. Just unconventional. Acceptable as-is.

### 10. `tsconfig.client.json` missing `extends`

`tsconfig.client.json` doesn't extend `../../tsconfig.base.json` unlike the server tsconfig. Both share strict mode but the client restates all options manually. Minor inconsistency.

---

## Positive Observations

- `safe-path.ts` uses `path.resolve` + prefix check correctly — the right approach.
- `127.0.0.1` binding in `index.ts` is correct. No external exposure.
- `express.static` with `dotfiles: 'deny'` prevents serving `.env` etc. Good default.
- SPA catch-all correctly guards `/api` prefixes before serving `index.html`.
- All hooks handle cancellation (`cancelled = true` pattern in `use-file.ts`).
- `isDirtyRef` pattern in `App.tsx` avoids stale closure issues in the unsaved-changes guard.
- `get-port` fallback means port conflicts don't crash the server.
- Graceful shutdown handlers for SIGINT/SIGTERM.
- SKILL.md is clear and complete with correct `npx` fallback.
- File size is well within 200-line limit across all modules.

---

## Recommended Actions (priority order)

1. **Remove the `..` substring check** in `safe-path.ts` (line 5) — the resolve check is the real guard.
2. **Delete `file-viewer.tsx`** — dead code.
3. **Lift `useBrandContext` to `App.tsx`** and pass `exists` as prop to `Sidebar` — eliminates double fetch.
4. **Document or fix the Vite proxy port** for dev mode.
5. **Parallelize `stat()` calls** in `workspace-scanner.ts` with `Promise.all`.

---

## Unresolved Questions

- Is `siq-dashboard` intended to be published to npm (GitHub Packages per `publishConfig`) or only used as a local binary? If npm-published, React/Tiptap should stay in devDependencies with Vite bundling — current approach is correct but reviewers will question it.
- No rate limiting or body size cap on `PUT /files`. Max body Express parses by default is 100KB. For markdown files this is likely fine, but worth a comment if large files are expected.
