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
    contentType: 'markdown',
    onUpdate() {
      setIsDirty(true);
    },
  });

  const handleSave = useCallback(async () => {
    if (!editor) return;
    const md = editor.getMarkdown();
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

  // Format file path for breadcrumb
  const displayPath = filePath.replace(/^workspace\//, '').replace(/\.md$/, '');

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* File path breadcrumb */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2">
        <span className="text-xs font-medium text-slate-400">{displayPath}</span>
      </div>
      <EditorToolbar editor={editor} onSave={handleSave} saving={saving} isDirty={isDirty} />
      <div className="tiptap-editor custom-scrollbar flex-1 overflow-y-auto px-8 py-6">
        <div className="prose prose-sm prose-slate mx-auto max-w-3xl">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
