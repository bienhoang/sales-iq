# Phase 4: Tiptap Editor Integration

## Context Links
- [Plan overview](./plan.md)
- [Tiptap + Markdown research](./research/researcher-01-tiptap-markdown.md)
- [Phase 3: React frontend](./phase-03-react-frontend.md)

## Overview
- **Priority**: P2
- **Status**: complete
- **Effort**: 3h
- **Depends on**: Phase 3

Replace read-only FileViewer with Tiptap WYSIWYG editor. Users can edit markdown visually and save back to disk via `PUT /api/files`.

## Key Insights
- Use `@tiptap/markdown` (official beta) — community package author deferred to official
- `contentType: 'markdown'` on editor init parses markdown input directly
- `editor.storage.markdown.getMarkdown()` serializes back to markdown
- StarterKit covers: bold, italic, strike, headings, lists, blockquote, code, HR
- Add `@tiptap/extension-link` for link support (not in StarterKit)
- Skip tables + syntax highlighting for v1 (YAGNI) — add later if needed
- Bundle cost: ~130 KB gzip without tables/lowlight
- Round-trip safe for standard markdown; HTML comments and complex HTML blocks lost

## Requirements

### Functional
- WYSIWYG editor renders markdown files with formatting
- Toolbar with: bold, italic, strike, headings (H1-H3), bullet list, ordered list, blockquote, code, link, HR
- Save button writes edited content back via PUT /api/files
- Unsaved changes indicator (dot or asterisk in tab/header)
- Keyboard shortcuts: Ctrl/Cmd+B (bold), Ctrl/Cmd+I (italic), Ctrl/Cmd+S (save)

### Non-functional
- Editor loads markdown without visible delay
- Save completes in <500ms (local file write)
- No data loss on standard markdown content

## Architecture

```
src/client/
├── components/
│   ├── FileViewer.tsx       # REMOVE (replaced by TiptapEditor)
│   ├── TiptapEditor.tsx     # Main editor component
│   └── EditorToolbar.tsx    # Formatting toolbar
└── hooks/
    └── use-save-file.ts     # PUT /api/files mutation hook
```

### Tiptap Extension Stack
```
StarterKit (bold, italic, strike, headings, lists, blockquote, code, HR)
+ Markdown (parse/serialize markdown)
+ Link (clickable links, openOnClick: false in edit mode)
```

## Related Code Files

### Files to create
- `packages/dashboard/src/client/components/TiptapEditor.tsx`
- `packages/dashboard/src/client/components/EditorToolbar.tsx`
- `packages/dashboard/src/client/hooks/use-save-file.ts`

### Files to modify
- `packages/dashboard/src/client/App.tsx` — swap FileViewer for TiptapEditor
- `packages/dashboard/src/client/components/FileViewer.tsx` — delete or repurpose as fallback
- `packages/dashboard/package.json` — add tiptap dependencies

### Dependencies to add
<!-- Updated: Validation Session 1 - All Tiptap packages pinned to v3 for coherence with official @tiptap/markdown -->
```json
{
  "devDependencies": {
    "@tiptap/react": "^3",
    "@tiptap/pm": "^3",
    "@tiptap/starter-kit": "^3",
    "@tiptap/markdown": "^3",
    "@tiptap/extension-link": "^3"
  }
}
```

Note: All Tiptap v3 (beta) for coherence with official `@tiptap/markdown`. Bundled by Vite — devDependencies only.

## Implementation Steps

### 1. Install Tiptap dependencies
```bash
cd packages/dashboard
pnpm add -D @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/markdown @tiptap/extension-link
```

### 2. Create `use-save-file.ts` hook
```ts
// Sends PUT /api/files?path=... with { content: string } body
// Returns { save(content: string): Promise<void>, saving: boolean, error: string | null }
```

### 3. Create TiptapEditor component
```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Link } from '@tiptap/extension-link';
import { EditorToolbar } from './EditorToolbar.js';

interface Props {
  content: string;        // markdown string from API
  filePath: string;       // for save target
  onSaved?: () => void;   // callback after successful save
}

export function TiptapEditor({ content, filePath, onSaved }: Props) {
  const [isDirty, setIsDirty] = useState(false);
  const { save, saving } = useSaveFile(filePath);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Link.configure({ openOnClick: false }),
    ],
    content,
    contentType: 'markdown',
    onUpdate() { setIsDirty(true); },
  });

  const handleSave = async () => {
    if (!editor) return;
    const md = editor.storage.markdown.getMarkdown();
    await save(md);
    setIsDirty(false);
    onSaved?.();
  };

  // Ctrl/Cmd+S shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [editor]);

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} onSave={handleSave} saving={saving} isDirty={isDirty} />
      <div className="flex-1 overflow-y-auto p-4 prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
```

### 4. Create EditorToolbar component
```tsx
// Horizontal bar with formatting buttons
// Each button calls editor.chain().focus().<command>().run()
// Buttons: Bold, Italic, Strike, H1, H2, H3, BulletList, OrderedList,
//          Blockquote, Code, Link, HR
// Save button on the right side with dirty indicator
// Active state: button highlighted when format is active at cursor
```

Button actions:
- Bold: `editor.chain().focus().toggleBold().run()`
- Italic: `editor.chain().focus().toggleItalic().run()`
- Strike: `editor.chain().focus().toggleStrike().run()`
- H1: `editor.chain().focus().toggleHeading({ level: 1 }).run()`
- H2: `editor.chain().focus().toggleHeading({ level: 2 }).run()`
- H3: `editor.chain().focus().toggleHeading({ level: 3 }).run()`
- Bullet: `editor.chain().focus().toggleBulletList().run()`
- Ordered: `editor.chain().focus().toggleOrderedList().run()`
- Blockquote: `editor.chain().focus().toggleBlockquote().run()`
- Code: `editor.chain().focus().toggleCodeBlock().run()`
- HR: `editor.chain().focus().setHorizontalRule().run()`
- Link: prompt for URL, `editor.chain().focus().setLink({ href }).run()`

Active state detection: `editor.isActive('bold')`, `editor.isActive('heading', { level: 1 })`, etc.

Tailwind styling: `flex items-center gap-1 border-b px-2 py-1 bg-gray-50`
Buttons: `p-1.5 rounded hover:bg-gray-200 text-sm` + `bg-gray-200` when active

### 5. Add editor Tailwind prose styles
<!-- Updated: Validation Session 1 - Tailwind v4 CSS-first config -->
Add `@tailwindcss/typography` for prose classes:
```bash
pnpm add -D @tailwindcss/typography
```

In `globals.css` (Tailwind v4 CSS-first — no config file):
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

### 6. Update App.tsx
- Replace `<FileViewer content={...} />` with `<TiptapEditor content={...} filePath={...} />`
- Pass `onSaved` callback to trigger refetch or show toast
- Keep FileViewer as fallback for non-markdown files (YAGNI for now, but simple guard)

### 7. Handle editor content updates on file switch
- When user clicks a different file, editor must reinitialize with new content
- Use `key={filePath}` on TiptapEditor to force remount on file change
- This is simpler and safer than calling `editor.commands.setContent()` imperatively
- Warn before switching if `isDirty` is true (basic confirm dialog)

### 8. Test round-trip fidelity
- Load each test file from `test/gosnap/workspace/`
- Edit, save, reload — verify content unchanged for standard markdown
- Test: headings, bold, italic, lists, links, blockquotes, code blocks
- Document any edge cases found

## Todo List
- [ ] Install tiptap + typography dependencies
- [ ] Create `use-save-file.ts` hook
- [ ] Create `TiptapEditor.tsx` component
- [ ] Create `EditorToolbar.tsx` component
- [ ] Add `@tailwindcss/typography` plugin to tailwind config
- [ ] Update `App.tsx` to use TiptapEditor instead of FileViewer
- [ ] Implement Ctrl/Cmd+S save shortcut
- [ ] Implement unsaved changes indicator
- [ ] Implement dirty state warning on file switch
- [ ] Test with all `test/gosnap/workspace/` files
- [ ] Verify markdown round-trip fidelity (edit → save → reload → compare)
- [ ] Production build test: `pnpm build && node dist/server.js --dir ../../test/gosnap`

## Success Criteria
- Files open in WYSIWYG editor with proper formatting (headings, lists, bold, etc.)
- Toolbar buttons toggle formatting correctly
- Cmd+S saves file; content round-trips without corruption
- Unsaved indicator appears when content modified
- Switching files with unsaved changes shows confirmation prompt
- Production build includes tiptap bundle and works end-to-end

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Markdown round-trip loses formatting | Medium | Test with real workspace files; fallback to raw editor if needed |
| Tiptap v2/v3 API mismatch | Low | Pin versions; follow official docs closely |
| Large file causes editor lag | Low | Workspace files typically <5KB markdown |
| @tiptap/markdown beta instability | Medium | Pin exact version; test thoroughly before release |

## Security Considerations
- No `dangerouslySetInnerHTML` — Tiptap renders via ProseMirror DOM
- Link `openOnClick: false` prevents unintended navigation during editing
- Save only writes to paths already validated by server-side `safePath()`
- No eval or dynamic code execution

## Next Steps
- Phase 5: Create SKILL.md, monorepo integration, final testing
