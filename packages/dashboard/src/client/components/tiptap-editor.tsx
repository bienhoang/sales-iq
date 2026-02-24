import { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import Link from '@tiptap/extension-link';
import { EditorToolbar } from './editor-toolbar.js';
import { useSaveFile } from '../hooks/use-save-file.js';

interface Props {
  content: string;
  filePath: string;
  saveEndpoint?: string;
  onSaved?: () => void;
}

export function TiptapEditor({ content, filePath, saveEndpoint, onSaved }: Props) {
  const [isDirty, setIsDirty] = useState(false);
  const { save, saving } = useSaveFile(filePath, saveEndpoint);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate() {
      setIsDirty(true);
    },
  });

  const handleSave = useCallback(async () => {
    if (!editor) return;
    const md = editor.getMarkdown?.() ?? editor.getText() ?? '';
    await save(md);
    setIsDirty(false);
    onSaved?.();
  }, [editor, save, onSaved]);

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
  }, [handleSave]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <EditorToolbar editor={editor} onSave={handleSave} saving={saving} isDirty={isDirty} />
      <div className="flex-1 overflow-y-auto p-4 prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
