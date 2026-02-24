import type { Editor } from '@tiptap/react';

interface Props {
  editor: Editor | null;
  onSave: () => void;
  saving: boolean;
  isDirty: boolean;
}

interface ToolbarButton {
  label: string;
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
}

const BUTTONS: ToolbarButton[] = [
  {
    label: 'B',
    action: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive('bold'),
  },
  {
    label: 'I',
    action: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive('italic'),
  },
  {
    label: 'S',
    action: (e) => e.chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive('strike'),
  },
  { label: '|', action: () => {} },
  {
    label: 'H1',
    action: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (e) => e.isActive('heading', { level: 1 }),
  },
  {
    label: 'H2',
    action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (e) => e.isActive('heading', { level: 2 }),
  },
  {
    label: 'H3',
    action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (e) => e.isActive('heading', { level: 3 }),
  },
  { label: '|', action: () => {} },
  {
    label: '\u2022',
    action: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive('bulletList'),
  },
  {
    label: '1.',
    action: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive('orderedList'),
  },
  {
    label: '\u201C',
    action: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive('blockquote'),
  },
  {
    label: '</>',
    action: (e) => e.chain().focus().toggleCodeBlock().run(),
    isActive: (e) => e.isActive('codeBlock'),
  },
  {
    label: '\u2014',
    action: (e) => e.chain().focus().setHorizontalRule().run(),
  },
];

export function EditorToolbar({ editor, onSave, saving, isDirty }: Props) {
  if (!editor) return null;

  const handleLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex items-center gap-0.5 border-b border-slate-200 bg-white px-3 py-1.5">
      {BUTTONS.map((btn, i) => {
        if (btn.label === '|') {
          return <span key={i} className="mx-1.5 h-4 w-px bg-slate-200" />;
        }
        const active = btn.isActive?.(editor);
        return (
          <button
            key={btn.label + i}
            onClick={() => btn.action(editor)}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              active
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
            title={btn.label}
          >
            {btn.label}
          </button>
        );
      })}
      <button
        onClick={handleLink}
        className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        title="Link"
      >
        Link
      </button>

      <div className="flex-1" />

      {isDirty && (
        <span className="mr-2 text-[10px] text-amber-500 font-medium">Unsaved</span>
      )}
      <button
        onClick={onSave}
        disabled={saving || !isDirty}
        className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-colors ${
          isDirty
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            : 'bg-slate-100 text-slate-400 cursor-default'
        }`}
      >
        {saving ? 'Saving...' : isDirty ? 'Save' : 'Saved'}
      </button>
    </div>
  );
}
