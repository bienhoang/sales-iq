interface FileInfo {
  name: string;
  path: string;
  modified: string;
  size: number;
}

function formatDisplayName(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/-\d{4}-\d{2}-\d{2}$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
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
    <div className="w-72 overflow-y-auto border-r border-slate-200 bg-slate-50">
      <div className="p-2 space-y-0.5">
        {files.map((file) => (
          <button
            key={file.path}
            onClick={() => onSelectFile(file.path)}
            className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
              selectedPath === file.path
                ? 'bg-blue-50 ring-1 ring-blue-200'
                : 'hover:bg-white'
            }`}
          >
            <p className={`text-sm leading-snug ${selectedPath === file.path ? 'text-blue-700 font-medium' : 'text-slate-800'}`}>
              {formatDisplayName(file.name)}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {formatDate(file.modified)} &middot; {formatSize(file.size)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
