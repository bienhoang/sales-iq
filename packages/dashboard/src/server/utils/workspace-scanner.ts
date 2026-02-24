import fs from 'node:fs/promises';
import path from 'node:path';

/** Known categories in preferred display order. */
const KNOWN_CATEGORIES = [
  'proposals', 'emails', 'outreach', 'ad-copy', 'content',
  'social', 'intel', 'reports', 'strategy', 'sales-prep', 'research', 'plans',
] as const;

interface FileInfo {
  name: string;
  path: string;
  modified: string;
  size: number;
}

interface Category {
  name: string;
  files: FileInfo[];
}

export interface WorkspaceResponse {
  categories: Category[];
}

/** Recursively collect all .md files within a directory. */
async function collectMdFiles(dir: string, relativeTo: string): Promise<FileInfo[]> {
  const files: FileInfo[] = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectMdFiles(fullPath, relativeTo);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const stat = await fs.stat(fullPath);
      const relPath = path.relative(relativeTo, fullPath);
      files.push({
        name: entry.name,
        path: relPath,
        modified: stat.mtime.toISOString(),
        size: stat.size,
      });
    }
  }
  return files;
}

async function scanCategoryDir(workspaceDir: string, cat: string): Promise<Category | null> {
  const catDir = path.join(workspaceDir, cat);
  const files = await collectMdFiles(catDir, workspaceDir);
  if (files.length > 0) {
    files.sort((a, b) => b.modified.localeCompare(a.modified));
    return { name: cat, files };
  }
  return null;
}

export async function scanWorkspace(workspaceDir: string): Promise<WorkspaceResponse> {
  const categories: Category[] = [];
  const knownSet = new Set<string>(KNOWN_CATEGORIES);

  // Scan known categories in preferred order
  for (const cat of KNOWN_CATEGORIES) {
    const result = await scanCategoryDir(workspaceDir, cat);
    if (result) categories.push(result);
  }

  // Auto-discover extra directories not in the known list
  try {
    const entries = await fs.readdir(workspaceDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || knownSet.has(entry.name)) continue;
      const result = await scanCategoryDir(workspaceDir, entry.name);
      if (result) categories.push(result);
    }
  } catch {
    // workspace dir doesn't exist — skip
  }

  return { categories };
}
