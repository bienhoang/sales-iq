import { useState, useRef } from 'react';
import { useWorkspace } from './hooks/use-workspace.js';
import { useFile } from './hooks/use-file.js';
import { useBrandContext } from './hooks/use-brand-context.js';
import { Sidebar } from './components/sidebar.js';
import { FileList } from './components/file-list.js';
import { TiptapEditor } from './components/tiptap-editor.js';
import { SystemBar } from './components/system-bar.js';
import { EmptyState } from './components/empty-state.js';
import { useConfig } from './hooks/use-config.js';

function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}

function PlaceholderMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

export function App() {
  const { categories, loading: wsLoading } = useWorkspace();
  const { config } = useConfig();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isBrandSelected, setIsBrandSelected] = useState(false);
  const isDirtyRef = useRef(false);

  const { content: fileContent, loading: fileLoading } = useFile(
    isBrandSelected ? null : selectedFile,
  );
  const { content: brandContent, loading: brandLoading } = useBrandContext();

  const selectedCat = categories.find((c) => c.name === selectedCategory);
  const totalFiles = categories.reduce((sum, c) => sum + c.files.length, 0);

  const confirmSwitch = (): boolean => {
    if (!isDirtyRef.current) return true;
    return window.confirm('You have unsaved changes. Discard them?');
  };

  const handleSelectCategory = (name: string) => {
    if (!confirmSwitch()) return;
    isDirtyRef.current = false;
    setSelectedCategory(name);
    setSelectedFile(null);
    setIsBrandSelected(false);
  };

  const handleSelectBrand = () => {
    if (!confirmSwitch()) return;
    isDirtyRef.current = false;
    setIsBrandSelected(true);
    setSelectedCategory(null);
    setSelectedFile(null);
  };

  const handleSelectFile = (path: string) => {
    if (!confirmSwitch()) return;
    isDirtyRef.current = false;
    setSelectedFile(path);
    setIsBrandSelected(false);
  };

  let mainContent: React.ReactNode;
  if (wsLoading) {
    mainContent = <LoadingSpinner message="Loading workspace..." />;
  } else if (totalFiles === 0 && !isBrandSelected) {
    mainContent = <EmptyState />;
  } else if (isBrandSelected && !brandLoading) {
    mainContent = (
      <TiptapEditor
        key="brand-context"
        content={brandContent}
        filePath="brand-context.md"
        saveEndpoint="/api/brand-context"
        onSaved={() => { isDirtyRef.current = false; }}
      />
    );
  } else if (selectedFile && !fileLoading) {
    mainContent = (
      <TiptapEditor
        key={selectedFile}
        content={fileContent}
        filePath={selectedFile}
        onSaved={() => { isDirtyRef.current = false; }}
      />
    );
  } else if (fileLoading || brandLoading) {
    mainContent = <LoadingSpinner message="Loading file..." />;
  } else if (selectedCat) {
    mainContent = <PlaceholderMessage message="Select a file to view" />;
  } else {
    mainContent = <PlaceholderMessage message="Select a category from the sidebar" />;
  }

  return (
    <div className="flex h-screen flex-col font-sans antialiased">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          projectName={(config?.name as string) || null}
          onSelectBrand={handleSelectBrand}
          isBrandSelected={isBrandSelected}
        />
        {selectedCat && !isBrandSelected && (
          <FileList
            files={selectedCat.files}
            selectedPath={selectedFile}
            onSelectFile={handleSelectFile}
          />
        )}
        {mainContent}
      </div>
      <SystemBar />
    </div>
  );
}
