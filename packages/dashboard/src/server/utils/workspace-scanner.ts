import fs from 'node:fs/promises';
import path from 'node:path';

const CATEGORIES = [
  'proposals', 'emails', 'outreach', 'ad-copy', 'content',
  'social', 'intel', 'reports', 'strategy', 'sales-prep', 'research',
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

export async function scanWorkspace(workspaceDir: string): Promise<WorkspaceResponse> {
  const categories: Category[] = [];

  for (const cat of CATEGORIES) {
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
        categories.push({ name: cat, files });
      }
    } catch {
      // Category dir doesn't exist — skip
    }
  }

  return { categories };
}
