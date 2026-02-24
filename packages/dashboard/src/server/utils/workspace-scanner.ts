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

async function scanCategoryDir(workspaceDir: string, cat: string): Promise<Category | null> {
  const catDir = path.join(workspaceDir, cat);
  try {
    const entries = await fs.readdir(catDir);
    const files: FileInfo[] = [];
    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue;
      const filePath = path.join(catDir, entry);
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;
      files.push({
        name: entry,
        path: `${cat}/${entry}`,
        modified: stat.mtime.toISOString(),
        size: stat.size,
      });
    }
    if (files.length > 0) {
      files.sort((a, b) => b.modified.localeCompare(a.modified));
      return { name: cat, files };
    }
  } catch {
    // Category dir doesn't exist — skip
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
