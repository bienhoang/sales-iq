# Brainstorm: /siq-dashboard — Project Workspace Dashboard

**Date**: 2026-02-24 15:36 GMT+7
**Status**: Agreed — ready for implementation plan

---

## Problem Statement

Users generate workspace outputs (proposals, emails, content, strategy docs) via sales-iq skills but have no visual way to browse, review, or edit them. They must navigate filesystem manually. Need a local web dashboard for visual workspace management.

## Agreed Solution

### Architecture

```
/siq-dashboard (Claude Code skill)
  → runs: npx @bienhoang/sales-iq-dashboard --dir $(pwd)
  → Express server starts on localhost:PORT
  → serves pre-built React SPA + REST API
  → Claude opens browser
```

**Package**: `packages/dashboard/` (new, published as `@bienhoang/sales-iq-dashboard`)

### Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React + Vite | Rich SPA, component-based |
| Editor | Tiptap (WYSIWYG) | Best markdown editing UX, ~300KB |
| Server | Express.js | Serves static + API, bundled |
| Styling | Tailwind CSS | Consistent with modern patterns |
| Build | Vite (frontend) + tsup (server) | Pre-built at publish time |

### Dashboard Sections

**1. Workspace File Browser (Main)**
- Sidebar: fixed categories matching workspace directories
  - `proposals/`, `emails/`, `outreach/`, `ad-copy/`, `content/`, `social/`, `intel/`, `reports/`, `strategy/`, `sales-prep/`, `research/`
- Only shows categories that have files (hide empty folders)
- Main area: file list → click to view/edit
- File operations: **Read + Edit + Save** (no delete, no create)

**2. System Info (Small, read-only)**
- Package version (from `package.json` or npm)
- Number of installed skills + list
- MCP server status (configured or not)
- `.sales-iq.json` summary (project name, industry, audience)

**3. Empty State**
- When workspace/ has no files: getting started guide
- Suggest: "Run `/siq-brand-strategy` to generate your first outputs"
- List popular skills by category

### API Design

```
GET  /api/workspace          → list all files by category
GET  /api/files?path=...     → read file content (markdown)
PUT  /api/files?path=...     → save file content (body: markdown string)
GET  /api/system             → package version, skills count, MCP status
GET  /api/config             → .sales-iq.json contents
```

### UI Layout

```
┌─────────────────────────────────────────────────┐
│  🏠 Sales-IQ Dashboard    [System ●] [Config ●] │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ 📁 Categories │  File content / Tiptap editor   │
│          │                                      │
│ proposals│  ┌────────────────────────────────┐  │
│ emails   │  │ Tiptap WYSIWYG Editor          │  │
│ outreach │  │                                │  │
│ content  │  │ [Save] button                  │  │
│ social   │  │                                │  │
│ strategy │  └────────────────────────────────┘  │
│ ...      │                                      │
├──────────┴──────────────────────────────────────┤
│ v1.4.1 │ 20 skills │ MCP: configured            │
└─────────────────────────────────────────────────┘
```

### Skill Definition (SKILL.md)

```yaml
---
name: siq-dashboard
description: "Open workspace dashboard to browse and edit your sales-iq outputs"
---
```

Skill instructs Claude to:
1. Detect project root (`.sales-iq.json`)
2. Run `npx @bienhoang/sales-iq-dashboard --dir <project-root>` in background
3. Wait for server ready, open browser
4. Report URL to user

### Security

- Bind to `127.0.0.1` only (no network exposure)
- Restrict file operations to `workspace/` directory (path traversal prevention)
- Read-only for system/config endpoints

### Package Structure

```
packages/dashboard/
├── package.json          # bin: { "siq-dashboard": "./dist/server.js" }
├── tsconfig.json
├── vite.config.ts        # React frontend build
├── tsup.config.ts        # Server build
├── src/
│   ├── server/           # Express server
│   │   ├── index.ts      # Entry, CLI args parsing
│   │   ├── routes/
│   │   │   ├── workspace.ts  # File CRUD API
│   │   │   ├── system.ts     # System info API
│   │   │   └── config.ts     # Config API
│   │   └── utils/
│   │       └── file-scanner.ts  # Workspace directory scanner
│   └── client/           # React SPA
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── Sidebar.tsx
│       │   ├── FileViewer.tsx
│       │   ├── TiptapEditor.tsx
│       │   ├── SystemInfo.tsx
│       │   └── EmptyState.tsx
│       ├── hooks/
│       │   └── useWorkspace.ts
│       └── styles/
│           └── globals.css
├── dist/                 # Built output
│   ├── server.js         # Bundled server
│   └── client/           # Built React app
└── README.md
```

## Evaluated Alternatives

### Entry Point
- **CLI command** (`sales-iq dashboard`) — viable but adds CLI complexity; user chose skill-only
- **Both CLI + skill** — over-engineered for current scope

### Editor
- **Basic textarea + preview** — too minimal for good UX
- **CodeMirror/Monaco** — code-focused, not ideal for markdown content
- **Tiptap (chosen)** — best WYSIWYG markdown editing, extensible

### Server
- **Vite dev server** — requires dependencies at runtime
- **Static serve only** — no API layer for file ops
- **Express bundled (chosen)** — API + static in one, zero runtime deps

## Implementation Considerations

1. **Tiptap markdown extension** needed: `@tiptap/extension-markdown` or `tiptap-markdown`
2. **Port selection**: try 4983 (SIQ), fallback to random available
3. **Hot workspace scanning**: watch `workspace/` for changes (or poll on focus)
4. **File path validation**: sanitize all paths to prevent directory traversal
5. **Build pipeline**: Vite builds client → tsup bundles server + client assets
6. **Monorepo integration**: add to `pnpm-workspace.yaml`, turbo build

## Risks

| Risk | Mitigation |
|------|------------|
| Tiptap markdown fidelity | Test with real workspace outputs, fallback to raw editor |
| npx cold start slow | Consider adding as optional dependency of CLI |
| Large workspace dirs | Paginate file lists, lazy load content |
| Port conflicts | Auto-detect available port, display in terminal |

## Success Metrics

- Dashboard loads in <2s on localhost
- All workspace categories visible with correct file counts
- Tiptap editor saves valid markdown without corruption
- System info accurate (version, skills count, MCP status)
- Empty state guides new users effectively

## Next Steps

1. Create implementation plan with phases
2. Set up `packages/dashboard/` with Vite + tsup
3. Build server API routes
4. Build React frontend with Tiptap
5. Create `/siq-dashboard` skill definition
6. Test with `test/gosnap/` project
