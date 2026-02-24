# Phase 3: React Frontend (No Editor)

## Context Links
- [Plan overview](./plan.md)
- [Brainstorm — UI layout](../reports/brainstorm-260224-1536-siq-dashboard.md)
- [Phase 2: Server API](./phase-02-server-implementation.md)

## Overview
- **Priority**: P1
- **Status**: complete
- **Effort**: 4h
- **Depends on**: Phase 2

React SPA with sidebar file browser, read-only file viewer (raw markdown), system info panel, and empty state. Tiptap editor added in Phase 4 — this phase uses a styled `<pre>` block for file viewing.

## Key Insights
- 11 workspace categories; only show categories that have files
- File naming convention: `{descriptor}-{YYYY-MM-DD}.md` — parse descriptor for display
- System info bar at bottom: version, skills count, MCP status
- Empty state when workspace has zero files across all categories
- Vite dev server proxies `/api` to Express on port 4983 (configured in Phase 1)

## Requirements

### Functional
- Sidebar lists workspace categories with file counts
- Click category to expand/show files list
- Click file to load content in main area (read-only for now)
- System info bar shows version, skills count, MCP status
- Config panel shows project name, industry, audience from `.sales-iq.json`
- Empty state with getting-started guide when no workspace files exist

### Non-functional
- Responsive layout (sidebar collapses on narrow screens)
- Fast: files list loads on mount, file content loads on click
- Tailwind CSS utility classes only (no custom CSS beyond globals.css)

## Architecture

```
src/client/
├── main.tsx                 # React root mount
├── App.tsx                  # Layout shell (sidebar + main + footer)
├── components/
│   ├── Sidebar.tsx          # Category list with file counts
│   ├── FileList.tsx         # Files within selected category
│   ├── FileViewer.tsx       # Read-only markdown display (Phase 3)
│   ├── SystemBar.tsx        # Bottom bar: version, skills, MCP
│   ├── ConfigPanel.tsx      # .sales-iq.json summary display
│   └── EmptyState.tsx       # Getting started guide
├── hooks/
│   ├── use-workspace.ts     # Fetch GET /api/workspace
│   ├── use-file.ts          # Fetch GET /api/files?path=...
│   ├── use-system.ts        # Fetch GET /api/system
│   ├── use-config.ts        # Fetch GET /api/config
│   └── use-brand-context.ts # Fetch GET /api/brand-context
└── styles/
    └── globals.css          # Tailwind directives (from Phase 1)
```

## Related Code Files

### Files to create
- `packages/dashboard/src/client/App.tsx`
- `packages/dashboard/src/client/components/Sidebar.tsx`
- `packages/dashboard/src/client/components/FileList.tsx`
- `packages/dashboard/src/client/components/FileViewer.tsx`
- `packages/dashboard/src/client/components/SystemBar.tsx`
- `packages/dashboard/src/client/components/ConfigPanel.tsx`
- `packages/dashboard/src/client/components/EmptyState.tsx`
- `packages/dashboard/src/client/hooks/use-workspace.ts`
- `packages/dashboard/src/client/hooks/use-file.ts`
- `packages/dashboard/src/client/hooks/use-system.ts`
- `packages/dashboard/src/client/hooks/use-config.ts`

### Files to modify
- `packages/dashboard/src/client/main.tsx` (replace placeholder)

## Implementation Steps

### 1. Create data-fetching hooks

**use-workspace.ts**
```ts
// Fetches GET /api/workspace on mount
// Returns { categories, loading, error, refetch }
// categories: Array<{ name: string, files: FileInfo[] }>
```

**use-file.ts**
```ts
// Fetches GET /api/files?path=... when path changes
// Returns { content, loading, error }
// Accepts path: string | null (null = no fetch)
```

**use-system.ts**
```ts
// Fetches GET /api/system on mount
// Returns { version, skillsCount, mcpConfigured, loading }
```

**use-config.ts**
```ts
// Fetches GET /api/config on mount
// Returns { config, loading, error }
```

All hooks: use `fetch()` + `useState` + `useEffect`. No external state library needed (YAGNI).

### 2. Create Sidebar component
- Renders list of categories from `useWorkspace()`
- Each category shows: icon (emoji or text label), name, file count badge
- Click category to select it (highlight active)
- Category display names: capitalize, replace hyphens with spaces
- Category icon mapping (simple object):
  - proposals: doc icon, emails: mail, outreach: send, ad-copy: megaphone, content: pen, social: globe, intel: search, reports: chart, strategy: compass, sales-prep: briefcase, research: microscope
- Use Tailwind: `w-64 border-r h-full overflow-y-auto`

### 3. Create FileList component
- Receives `files` array for selected category
- Each file row: display name (parsed from filename), date, file size
- Parse display name: strip date suffix and `.md`, convert kebab to title case
- Click file to select (passes path to parent)
- Active file highlighted
- Tailwind: list with hover states, `text-sm`

### 4. Create FileViewer component (read-only, Phase 3 only)
- Receives file `content` string (raw markdown)
- Renders in styled `<pre>` with `whitespace-pre-wrap` and `font-mono`
- Shows file path breadcrumb at top: `strategy / brand-voice-guide-2026-02-24.md`
- Loading spinner while fetching
- This component will be replaced by TiptapEditor in Phase 4

### 5. Create SystemBar component
- Horizontal bar at page bottom
- Shows: `v{version}`, `{count} skills installed`, `MCP: {configured|not configured}`
- Fetches via `useSystem()` hook
- Tailwind: `fixed bottom-0 bg-gray-50 border-t text-xs px-4 py-2`

### 6. Create ConfigPanel component
- Small section in sidebar or header area
- Shows project name, industry, audience from `.sales-iq.json`
- Falls back to "No project configured" if config missing
- Tailwind: compact card with `text-sm`

### 6b. Add Brand section in sidebar
<!-- Updated: Validation Session 1 - brand-context.md editable in dashboard -->
- Add "Brand" section at top of sidebar (above workspace categories)
- Shows `brand-context.md` as a clickable item
- Clicking opens brand-context.md in the main editor area (same TiptapEditor from Phase 4, FileViewer in Phase 3)
- Fetch via `GET /api/brand-context`, save via `PUT /api/brand-context`
- If brand-context.md doesn't exist, show subtle hint: "Run `/siq-brand-strategy` to create brand context"
- Create `use-brand-context.ts` hook (GET /api/brand-context)

### 7. Create EmptyState component
- Displayed when `useWorkspace()` returns zero total files
- Content:
  - "No workspace files yet" heading
  - "Get started by running a skill:" subheading
  - List of suggested skills:
    - `/siq-brand-strategy` — Define positioning and messaging
    - `/siq-email-campaign` — Draft email sequences
    - `/siq-competitor-intel` — Analyze competitors
    - `/siq-proposal-generator` — Create proposals
  - "Files will appear here automatically after skills generate output."
- Tailwind: centered layout, `max-w-md mx-auto py-16`

### 8. Create App.tsx (layout shell)
```
┌─────────────────────────────────────────────────┐
│  Sales-IQ Dashboard         [project: gosnap]   │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │  FileList → FileViewer               │
│          │  (or EmptyState)                      │
│          │                                       │
├──────────┴──────────────────────────────────────┤
│ SystemBar                                        │
└─────────────────────────────────────────────────┘
```

- State: `selectedCategory`, `selectedFile` (path string)
- If workspace empty: render EmptyState instead of FileList/FileViewer
- If no file selected: show prompt "Select a file to view"
- Tailwind: `flex h-screen flex-col`, inner `flex flex-1 overflow-hidden`

### 9. Update main.tsx
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);
```

### 10. Test with Vite dev server
```bash
# Terminal 1: start API server
node dist/server.js --dir ../../test/gosnap --no-open

# Terminal 2: start Vite dev server (proxies /api)
cd packages/dashboard && pnpm dev:client
# Opens http://localhost:5173 — verify sidebar shows strategy (4) + intel (2)
```

## Todo List
- [ ] Create `use-workspace.ts` hook
- [ ] Create `use-file.ts` hook
- [ ] Create `use-system.ts` hook
- [ ] Create `use-config.ts` hook
- [ ] Create `use-brand-context.ts` hook
- [ ] Add Brand section in sidebar for brand-context.md
- [ ] Create `Sidebar.tsx` with category list
- [ ] Create `FileList.tsx` with file rows
- [ ] Create `FileViewer.tsx` (read-only pre block)
- [ ] Create `SystemBar.tsx` with version/skills/MCP
- [ ] Create `ConfigPanel.tsx` with project summary
- [ ] Create `EmptyState.tsx` with getting-started guide
- [ ] Create `App.tsx` layout shell
- [ ] Update `main.tsx` entry point
- [ ] Test against `test/gosnap/` workspace (strategy + intel categories visible)
- [ ] Verify empty state renders when workspace/ is empty
- [ ] Verify production build: `pnpm build` → open `dist/client/index.html`

## Success Criteria
- Dashboard loads showing sidebar with `strategy` (4 files) and `intel` (2 files)
- Clicking a category shows its files in the file list
- Clicking a file displays its raw markdown content
- System bar shows version, skills count, MCP status
- Config panel shows "gosnap" project info
- Empty state renders correctly when no workspace files exist
- Production build works: `pnpm build && node dist/server.js --dir ../../test/gosnap`

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| CORS issues in dev | Low | Vite proxy configured in Phase 1 |
| Large file lists slow render | Low | 11 categories x ~10 files max = trivial |
| Tailwind classes not purged | Low | content config includes src/client/**/*.tsx |

## Security Considerations
- No user input sent to server except file path (already validated server-side)
- No `dangerouslySetInnerHTML` — raw markdown displayed as text in `<pre>`
- No external CDN resources — all assets bundled

## Next Steps
- Phase 4: Replace FileViewer with Tiptap WYSIWYG editor + save functionality
