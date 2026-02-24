---
title: "/siq-dashboard — Workspace Dashboard"
description: "Local web dashboard for browsing and editing sales-iq workspace outputs"
status: complete
priority: P2
effort: 16h
branch: main
tags: [dashboard, react, tiptap, express, vite]
created: 2026-02-24
---

# /siq-dashboard Implementation Plan

New `packages/dashboard/` package: Express server + React SPA + Tiptap editor for browsing/editing `workspace/` files locally.

## Architecture

```
npx @bienhoang/sales-iq-dashboard --dir $(pwd)
  → Express (127.0.0.1:4983) serves dist/client/ + REST API
  → API reads/writes workspace/ files under --dir
  → React SPA with sidebar file browser + Tiptap WYSIWYG editor
```

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Package scaffolding | 2h | complete | [phase-01](./phase-01-package-setup.md) |
| 2 | Express server + API | 4h | complete | [phase-02](./phase-02-server-implementation.md) |
| 3 | React frontend (no editor) | 4h | complete | [phase-03](./phase-03-react-frontend.md) |
| 4 | Tiptap editor integration | 3h | complete | [phase-04](./phase-04-tiptap-editor.md) |
| 5 | Skill + monorepo integration | 3h | complete | [phase-05](./phase-05-skill-integration.md) |

## Key Dependencies

- Phase 2 depends on Phase 1 (package must exist)
- Phase 3 depends on Phase 2 (API must exist for data fetching)
- Phase 4 depends on Phase 3 (editor replaces read-only viewer)
- Phase 5 depends on Phase 4 (skill wraps completed package)

## Research

- [Tiptap + Markdown](./research/researcher-01-tiptap-markdown.md)
- [Server build strategy](./research/researcher-02-server-build-strategy.md)
- [Brainstorm](../reports/brainstorm-260224-1536-siq-dashboard.md)

## Key Decisions

- ESM throughout (`"type": "module"`) — matches CLI/MCP patterns
- `open@10` + `get-port@7` (ESM-native)
- `@tiptap/markdown` (official) over community `tiptap-markdown`
- **Tiptap v3** all packages (cohesive with official markdown extension)
- **Tailwind v4** (CSS-first config, no tailwind.config.ts)
- Build: `vite build → dist/client/` then `tsup → dist/server.js` (clean: false)
- Security: 127.0.0.1 bind, path.resolve + startsWith guard, dotfiles: deny
- **brand-context.md** editable in dashboard (separate "Brand" section)
- Raw `process.argv` for CLI args (only 3 flags, KISS)
- Local bin link for dev, npx for published version
- No delete — Read + Edit + Save only

## Validation Log

### Session 1 — 2026-02-24
**Trigger:** Initial plan creation validation
**Questions asked:** 6

#### Questions & Answers

1. **[Architecture]** Plan Phase 4 lists `@tiptap/react: ^2` + `@tiptap/starter-kit: ^2` alongside `@tiptap/markdown: ^3.7`. The official `@tiptap/markdown` extension is part of Tiptap v3 (beta). This creates a version mismatch. Should we use Tiptap v3 across the board (beta, newer API) or stick with v2 + community `tiptap-markdown` package (stable, proven)?
   - Options: Tiptap v3 all packages (Recommended) | Tiptap v2 + community markdown | Tiptap v2, no WYSIWYG markdown
   - **Answer:** Tiptap v3 all packages
   - **Rationale:** Version coherence prevents subtle incompatibilities. Official markdown extension actively maintained. Beta risk acceptable for internal tool.

2. **[Architecture]** Phase 1 pins Tailwind CSS v3 (`tailwindcss: ^3`). Tailwind v4 is current (released Jan 2025) with a new CSS-first config system (no tailwind.config.ts needed). Which version?
   - Options: Tailwind v4 (Recommended) | Tailwind v3
   - **Answer:** Tailwind v4
   - **Rationale:** Fewer config files, simpler setup. Dashboard is greenfield — no migration cost.

3. **[Scope]** You originally mentioned wanting delete ("xóa") but brainstorm settled on Read + Edit + Save only. Should we add delete in this version?
   - Options: Add delete (with confirm dialog) | No delete, keep it simple
   - **Answer:** No delete, keep it simple
   - **Rationale:** KISS. Delete from terminal if needed. Can add later.

4. **[Scope]** Dashboard currently only edits workspace/ files. Should `brand-context.md` (the main brand voice doc users are told to edit) also be viewable/editable in the dashboard?
   - Options: Yes, add brand-context.md | No, workspace only
   - **Answer:** Yes, add brand-context.md
   - **Rationale:** brand-context.md is the #1 file users manually edit. High value, small scope increase.

5. **[Architecture]** The `/siq-dashboard` skill instructs Claude to run `npx @bienhoang/sales-iq-dashboard --dir ...`. This requires the package to be published first. During dev/testing, how should the skill work?
   - Options: Local bin link (Recommended) | Always npx | CLI subcommand
   - **Answer:** Local bin link
   - **Rationale:** pnpm links bin during dev, no publish needed. Published version uses npx. Clean separation.

6. **[Architecture]** Phase 2 uses raw `process.argv` parsing for CLI args. The existing CLI uses `commander@^12`. Should dashboard use a parser?
   - Options: Raw process.argv (Recommended) | commander or similar | parseArgs (Node built-in)
   - **Answer:** Raw process.argv
   - **Rationale:** Only 3 flags (--dir, --port, --no-open). KISS principle — no dependency for trivial parsing.

#### Confirmed Decisions
- Tiptap v3: all @tiptap/* packages pinned to ^3 — coherent with official markdown extension
- Tailwind v4: CSS-first config, remove tailwind.config.ts and postcss.config.js
- brand-context.md: editable in dashboard, separate "Brand" section in sidebar
- No delete: Read + Edit + Save scope confirmed
- Local bin link: dev uses linked binary, published uses npx
- Raw argv: no arg parser dependency

#### Action Items
- [ ] Update Phase 1: Tailwind v4 setup (remove config files, use CSS @import)
- [ ] Update Phase 1: Tiptap v3 version pins in package.json
- [ ] Update Phase 2: Add brand-context.md read/write API endpoint
- [ ] Update Phase 3: Add Brand section in sidebar for brand-context.md
- [ ] Update Phase 4: Fix all Tiptap package versions to ^3
- [ ] Update Phase 5: Skill detects local bin vs npx

#### Impact on Phases
- Phase 1: Tailwind v4 removes tailwind.config.ts + postcss.config.js; globals.css uses `@import "tailwindcss"` instead of directives. Tiptap devDeps pinned to v3.
- Phase 2: Add `GET/PUT /api/brand-context` endpoint for brand-context.md read/write
- Phase 3: Add "Brand" section in sidebar linking to brand-context.md editor
- Phase 4: All @tiptap/* packages → ^3 (react, starter-kit, pm, markdown, extension-link)
- Phase 5: SKILL.md checks for local `siq-dashboard` binary before falling back to npx
