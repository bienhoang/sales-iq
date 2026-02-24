import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function countSkills(): Promise<number> {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  const skillsBase = path.join(home, '.claude', 'skills');
  const clusters = ['marketing', 'sales', 'strategy', ''];
  let count = 0;

  for (const cluster of clusters) {
    const dir = cluster ? path.join(skillsBase, cluster) : skillsBase;
    try {
      const entries = await fs.readdir(dir);
      count += entries.filter((e) => e.startsWith('siq-')).length;
    } catch {
      // Dir doesn't exist — skip
    }
  }
  return count;
}

async function isMcpConfigured(): Promise<boolean> {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  const paths = [
    path.join(home, '.claude', 'settings.json'),
    path.join(home, '.claude', 'claude_desktop_config.json'),
  ];
  for (const p of paths) {
    try {
      const content = await fs.readFile(p, 'utf-8');
      if (content.includes('sales-iq-mcp')) return true;
    } catch {
      // File doesn't exist — skip
    }
  }
  return false;
}

async function getVersion(): Promise<string> {
  try {
    // Walk up from dist/server.js to find package.json
    const pkgPath = path.resolve(__dirname, '..', 'package.json');
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    // Fallback: try from project root (dev mode)
    try {
      const pkgPath = path.resolve(__dirname, '..', '..', 'package.json');
      const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
      return pkg.version || '0.0.0';
    } catch {
      return '0.0.0';
    }
  }
}

export function systemRouter(): Router {
  const router = Router();

  router.get('/system', async (_req, res) => {
    try {
      const [version, skillsCount, mcpConfigured] = await Promise.all([
        getVersion(),
        countSkills(),
        isMcpConfigured(),
      ]);
      res.json({ version, skillsCount, mcpConfigured });
    } catch {
      res.status(500).json({ error: 'Failed to get system info' });
    }
  });

  return router;
}
