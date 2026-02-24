# Tiptap WYSIWYG + Markdown — Research Report
Date: 2026-02-24 | Env: React 19, Vite, TS, Node 20+

---

## 1. Markdown Package Decision: Official vs Community

| | `@tiptap/markdown` (official) | `tiptap-markdown` (community) |
|---|---|---|
| Maintainer | Tiptap team | aguingand (community) |
| Status | Beta (v3.7.0+), actively developed | Maintenance mode; no v1 planned |
| Tiptap v3 support | Yes | Yes (compat layer) |
| Parser | MarkedJS (CommonMark compliant) | Custom |
| API | `contentType: 'markdown'` on editor init | `getMarkdown()` / `setContent()` |

**Decision: use `@tiptap/markdown` (official).** Community package author explicitly deferred to official now that Tiptap ships one.

---

## 2. Required Packages

### Core (always needed)
```
@tiptap/react      # React bindings + useEditor, EditorContent
@tiptap/pm         # ProseMirror peer deps
@tiptap/starter-kit # Bold, italic, headings, lists, blockquote, code, HR, paragraph
```

### Markdown serialization
```
@tiptap/markdown   # Official beta — parse/serialize markdown
```

### Extras NOT in StarterKit (add only what you need)
```
@tiptap/extension-link        # Links (not in starter-kit)
@tiptap/extension-table       # Tables + TableRow, TableCell, TableHeader
@tiptap/extension-code-block-lowlight  # Syntax-highlighted code blocks
lowlight                      # peer dep for lowlight extension
```

StarterKit already covers: Bold, Italic, Strike, Code (inline), Heading (h1–h6), BulletList, OrderedList, ListItem, Blockquote, CodeBlock (plain), HardBreak, HorizontalRule.

---

## 3. React Integration — useEditor + EditorContent

```tsx
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { Link } from '@tiptap/extension-link'

export function MarkdownEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Markdown, Link.configure({ openOnClick: false })],
    content: value,           // accepts markdown string when Markdown ext present
    contentType: 'markdown',  // tells Tiptap to treat content as markdown
    onUpdate({ editor }) {
      onChange(editor.storage.markdown.getMarkdown())
    },
  })

  return <EditorContent editor={editor} />
}
```

Key hooks/components:
- `useEditor(options)` — creates + manages editor lifecycle; auto-destroys on unmount
- `EditorContent` — renders the contenteditable div
- `useCurrentEditor()` — access editor from deep child without prop-drilling
- `EditorProvider` — context provider alternative to prop passing (v2.4+)

Performance note: wrap `useEditor` options in `useMemo` if extensions array is built dynamically to avoid re-initialization on every render.

---

## 4. Bundle Size (Approximate)

Bundlephobia exact numbers vary by version; realistic estimates for a full markdown editing stack:

| Package | Minified | Gzipped (est.) |
|---|---|---|
| `@tiptap/pm` (ProseMirror) | ~250 KB | ~80 KB |
| `@tiptap/react` + `@tiptap/core` | ~60 KB | ~18 KB |
| `@tiptap/starter-kit` | ~80 KB | ~25 KB |
| `@tiptap/markdown` | ~30 KB | ~10 KB |
| `@tiptap/extension-link` | ~15 KB | ~5 KB |
| `@tiptap/extension-table` | ~20 KB | ~7 KB |
| `lowlight` + `@tiptap/extension-code-block-lowlight` | ~40 KB | ~15 KB |
| **Total (full stack)** | **~495 KB** | **~160 KB gzip** |

Without tables + syntax highlight: ~130 KB gzip. ProseMirror (~80 KB gzip) is the dominant cost — unavoidable with any Tiptap setup. Tree-shaking reduces unused language grammars from lowlight significantly.

---

## 5. Markdown Fidelity & Round-Trip Gotchas

**Works well (round-trip safe):**
- Headings, bold, italic, strikethrough
- Ordered/unordered lists (including nested)
- Blockquotes
- Inline code and fenced code blocks
- Horizontal rules
- Links (basic `[text](url)`)

**Known limitations (official docs):**
1. **Comments stripped** — HTML comments in markdown are lost on parse
2. **Table cells**: only one child node per cell; `<br>` inside cells causes data loss
3. **Complex inline HTML**: not preserved — Tiptap's ProseMirror schema wins
4. **Tight lists** vs loose lists: spacing may differ after round-trip (CommonMark ambiguity)
5. **Markdown in HTML blocks**: mixed HTML+markdown inside `<div>` blocks not supported
6. **Beta caveat**: edge cases actively being fixed; pin a specific version in production

**Recommendation for fidelity:** If source-of-truth is markdown (e.g., files in git), test your specific content patterns before shipping. For user-generated content stored as markdown, round-trip is generally reliable for standard formatting.

---

## Sources
- [Tiptap Markdown Docs](https://tiptap.dev/docs/editor/markdown)
- [Install Markdown | Tiptap](https://tiptap.dev/docs/editor/markdown/getting-started/installation)
- [React Install | Tiptap](https://tiptap.dev/docs/editor/getting-started/install/react)
- [tiptap-markdown npm](https://www.npmjs.com/package/tiptap-markdown)
- [GitHub: aguingand/tiptap-markdown](https://github.com/aguingand/tiptap-markdown)
- [Bundlephobia: @tiptap/starter-kit](https://bundlephobia.com/package/@tiptap/starter-kit)

---

## Unresolved Questions
1. `@tiptap/markdown` exact gzip size — bundlephobia didn't expose it via fetch; verify at bundlephobia.com before final decision
2. React 19 compatibility: Tiptap v2 targets React 16+; Tiptap v3 (beta) may have stricter React version requirements — verify with `npm ls` after install
3. SSR/hydration: `useEditor` returns `null` on first render; confirm no hydration mismatch with Vite SSR if applicable
4. Collaborative editing future-proofing: if real-time collab is planned, factor in Yjs + `@tiptap/extension-collaboration` which adds ~50 KB gzip
