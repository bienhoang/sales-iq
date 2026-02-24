import { FileText } from 'lucide-react';

interface FileInfo {
  name: string;
  path: string;
  modified: string;
  size: number;
}

function titleCase(slug: string): string {
  return slug
    .replace(/-\d{4}-\d{2}-\d{2}$/, '')
    .replace(/^\d{6}-\d{4}-/, '') // strip date prefix like 260224-1543-
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Format display name, using parent dir for context when file is nested. */
function formatDisplayName(filePath: string): string {
  const parts = filePath.split('/');
  // Remove the category prefix (first segment)
  const withinCategory = parts.slice(1);
  if (withinCategory.length <= 1) {
    // Direct child: just format the filename
    return titleCase(withinCategory[0]?.replace(/\.md$/, '') ?? '');
  }
  // Nested: use parent dir name as primary label, filename as qualifier
  const filename = withinCategory[withinCategory.length - 1].replace(/\.md$/, '');
  const parentDir = withinCategory[withinCategory.length - 2];
  const dirLabel = titleCase(parentDir);
  const fileLabel = titleCase(filename);
  // If filename is generic (plan, index, readme), just show dir name
  if (['plan', 'index', 'readme'].includes(filename.toLowerCase())) {
    return dirLabel;
  }
  return `${dirLabel} / ${fileLabel}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

interface Props {
  files: FileInfo[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

export function FileList({ files, selectedPath, onSelectFile }: Props) {
  return (
    <div className="custom-scrollbar w-64 overflow-y-auto border-r border-slate-200 bg-white">
      <div className="px-3 pt-3 pb-1">
        <p className="px-1 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Files
        </p>
      </div>
      <div className="space-y-0.5 p-2">
        {files.map((file) => {
          const isActive = selectedPath === file.path;
          return (
            <button
              key={file.path}
              onClick={() => onSelectFile(file.path)}
              className={`flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 shadow-sm ring-1 ring-blue-100'
                  : 'hover:bg-slate-50'
              }`}
            >
              <FileText className={`mt-0.5 h-4 w-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm leading-snug ${
                  isActive ? 'text-blue-700 font-medium' : 'text-slate-700'
                }`}>
                  {formatDisplayName(file.path)}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {formatDate(file.modified)} · {formatSize(file.size)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
