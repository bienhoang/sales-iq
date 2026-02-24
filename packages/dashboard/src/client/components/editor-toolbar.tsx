import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Link as LinkIcon,
  Save,
  Loader2,
  Check,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  editor: Editor | null;
  onSave: () => void;
  saving: boolean;
  isDirty: boolean;
}

interface ToolbarButton {
  icon: LucideIcon;
  label: string;
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
}

const FORMAT_BUTTONS: ToolbarButton[] = [
  {
    icon: Bold,
    label: 'Bold',
    action: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive('bold'),
  },
  {
    icon: Italic,
    label: 'Italic',
    action: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive('italic'),
  },
  {
    icon: Strikethrough,
    label: 'Strikethrough',
    action: (e) => e.chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive('strike'),
  },
];

const HEADING_BUTTONS: ToolbarButton[] = [
  {
    icon: Heading1,
    label: 'Heading 1',
    action: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (e) => e.isActive('heading', { level: 1 }),
  },
  {
    icon: Heading2,
    label: 'Heading 2',
    action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (e) => e.isActive('heading', { level: 2 }),
  },
  {
    icon: Heading3,
    label: 'Heading 3',
    action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (e) => e.isActive('heading', { level: 3 }),
  },
];

const BLOCK_BUTTONS: ToolbarButton[] = [
  {
    icon: List,
    label: 'Bullet List',
    action: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive('bulletList'),
  },
  {
    icon: ListOrdered,
    label: 'Ordered List',
    action: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive('orderedList'),
  },
  {
    icon: Quote,
    label: 'Blockquote',
    action: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive('blockquote'),
  },
  {
    icon: Code2,
    label: 'Code Block',
    action: (e) => e.chain().focus().toggleCodeBlock().run(),
    isActive: (e) => e.isActive('codeBlock'),
  },
  {
    icon: Minus,
    label: 'Horizontal Rule',
    action: (e) => e.chain().focus().setHorizontalRule().run(),
  },
];

function ButtonGroup({ buttons, editor }: { buttons: ToolbarButton[]; editor: Editor }) {
  return (
    <div className="flex items-center gap-0.5">
      {buttons.map((btn) => {
        const active = btn.isActive?.(editor);
        return (
          <button
            key={btn.label}
            onClick={() => btn.action(editor)}
            className={`cursor-pointer rounded-md p-1.5 transition-colors duration-150 ${
              active
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            }`}
            title={btn.label}
          >
            <btn.icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}

export function EditorToolbar({ editor, onSave, saving, isDirty }: Props) {
  if (!editor) return null;

  const handleLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-3 py-1.5">
      <ButtonGroup buttons={FORMAT_BUTTONS} editor={editor} />
      <span className="mx-1 h-4 w-px bg-slate-200" />
      <ButtonGroup buttons={HEADING_BUTTONS} editor={editor} />
      <span className="mx-1 h-4 w-px bg-slate-200" />
      <ButtonGroup buttons={BLOCK_BUTTONS} editor={editor} />
      <span className="mx-1 h-4 w-px bg-slate-200" />
      <button
        onClick={handleLink}
        className={`cursor-pointer rounded-md p-1.5 transition-colors duration-150 ${
          editor.isActive('link')
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
        }`}
        title="Insert Link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      <div className="flex-1" />

      {isDirty && (
        <span className="mr-2 flex items-center gap-1 text-[11px] font-medium text-amber-500">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Unsaved
        </span>
      )}
      <button
        onClick={onSave}
        disabled={saving || !isDirty}
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
          isDirty
            ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
            : 'bg-slate-100 text-slate-400 cursor-default'
        }`}
      >
        {saving ? (
          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving</>
        ) : isDirty ? (
          <><Save className="h-3.5 w-3.5" /> Save</>
        ) : (
          <><Check className="h-3.5 w-3.5" /> Saved</>
        )}
      </button>
    </div>
  );
}
