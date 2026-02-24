import { useState, useMemo, useCallback, useEffect } from 'react';
import { FileText, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

interface FileInfo {
  name: string;
  path: string;
  modified: string;
  size: number;
}

interface TreeNode {
  name: string;
  fullPath: string;
  file?: FileInfo;
  fileCount: number;
  children: TreeNode[];
}

function titleCase(slug: string): string {
  return slug
    .replace(/-\d{4}-\d{2}-\d{2}$/, '')
    .replace(/^\d{6}-\d{4}-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

/** Build tree from flat file list. Strips category prefix (first path segment). */
function buildTree(files: FileInfo[]): TreeNode[] {
  const rootChildren: TreeNode[] = [];

  for (const file of files) {
    const segments = file.path.split('/').slice(1); // strip category prefix
    if (segments.length === 0) continue;

    let children = rootChildren;
    let pathSoFar = '';

    // traverse/create intermediate folder nodes
    for (let i = 0; i < segments.length - 1; i++) {
      pathSoFar += (pathSoFar ? '/' : '') + segments[i];
      let folder = children.find((c) => c.fullPath === pathSoFar && !c.file);
      if (!folder) {
        folder = { name: segments[i], fullPath: pathSoFar, fileCount: 0, children: [] };
        children.push(folder);
      }
      children = folder.children;
    }

    children.push({
      name: segments[segments.length - 1],
      fullPath: file.path,
      file,
      fileCount: 0,
      children: [],
    });
  }

  computeCounts(rootChildren);
  sortTree(rootChildren);
  return rootChildren;
}

/** Precompute file counts bottom-up so rendering doesn't recalculate. */
function computeCounts(nodes: TreeNode[]): number {
  let total = 0;
  for (const n of nodes) {
    if (n.file) {
      total += 1;
    } else {
      n.fileCount = computeCounts(n.children);
      total += n.fileCount;
    }
  }
  return total;
}

/** Sort: folders first (alphabetical), then files (alphabetical). */
function sortTree(nodes: TreeNode[]) {
  nodes.sort((a, b) => {
    const aDir = !a.file;
    const bDir = !b.file;
    if (aDir !== bDir) return aDir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  for (const n of nodes) {
    if (n.children.length > 0) sortTree(n.children);
  }
}

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  selectedPath: string | null;
  collapsed: Set<string>;
  onToggle: (path: string) => void;
  onSelectFile: (path: string) => void;
}

function TreeItem({ node, depth, selectedPath, collapsed, onToggle, onSelectFile }: TreeItemProps) {
  const indent = 8 + depth * 14;
  const isDir = !node.file;

  if (isDir) {
    const isOpen = !collapsed.has(node.fullPath);
    return (
      <>
        <button
          onClick={() => onToggle(node.fullPath)}
          className="flex w-full items-center gap-1 rounded-md px-1 py-1.5 text-left hover:bg-slate-50 transition-colors"
          style={{ paddingLeft: `${indent}px` }}
        >
          {isOpen
            ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
          {isOpen
            ? <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
            : <Folder className="h-4 w-4 shrink-0 text-amber-500" />}
          <span className="ml-1 truncate text-[13px] font-medium text-slate-600">
            {titleCase(node.name)}
          </span>
          <span className="ml-auto shrink-0 text-[10px] text-slate-400">
            {node.fileCount}
          </span>
        </button>
        {isOpen && node.children.map((child) => (
          <TreeItem
            key={child.fullPath}
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            collapsed={collapsed}
            onToggle={onToggle}
            onSelectFile={onSelectFile}
          />
        ))}
      </>
    );
  }

  // File leaf
  const isActive = selectedPath === node.file!.path;
  return (
    <button
      onClick={() => onSelectFile(node.file!.path)}
      className={`flex w-full items-start gap-2 rounded-lg py-1.5 pr-2 text-left transition-all duration-150 ${
        isActive
          ? 'bg-blue-50 shadow-sm ring-1 ring-blue-100'
          : 'hover:bg-slate-50'
      }`}
      style={{ paddingLeft: `${indent}px` }}
    >
      <FileText className={`mt-0.5 h-4 w-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm leading-snug ${
          isActive ? 'text-blue-700 font-medium' : 'text-slate-700'
        }`}>
          {titleCase(node.name.replace(/\.md$/, ''))}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          {formatDate(node.file!.modified)} · {formatSize(node.file!.size)}
        </p>
      </div>
    </button>
  );
}

interface Props {
  files: FileInfo[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

export function FileList({ files, selectedPath, onSelectFile }: Props) {
  const tree = useMemo(() => buildTree(files), [files]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Reset collapsed state when files change (category switch)
  useEffect(() => { setCollapsed(new Set()); }, [files]);

  const handleToggle = useCallback((path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  return (
    <div className="custom-scrollbar w-64 overflow-y-auto border-r border-slate-200 bg-white">
      <div className="px-3 pt-3 pb-1">
        <p className="px-1 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Files
        </p>
      </div>
      <div className="space-y-0.5 p-2">
        {tree.map((node) => (
          <TreeItem
            key={node.fullPath}
            node={node}
            depth={0}
            selectedPath={selectedPath}
            collapsed={collapsed}
            onToggle={handleToggle}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  );
}
