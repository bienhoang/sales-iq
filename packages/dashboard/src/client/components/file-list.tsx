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
    <div className="border-r border-gray-200 w-72 overflow-y-auto bg-white">
      {files.map((file) => (
        <button
          key={file.path}
          onClick={() => onSelectFile(file.path)}
          className={`w-full border-b border-gray-100 px-3 py-2 text-left ${
            selectedPath === file.path
              ? 'bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
        >
          <p className={`text-sm ${selectedPath === file.path ? 'text-blue-700 font-medium' : 'text-gray-800'}`}>
            {formatDisplayName(file.name)}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {formatDate(file.modified)} &middot; {formatSize(file.size)}
          </p>
        </button>
      ))}
    </div>
  );
}
