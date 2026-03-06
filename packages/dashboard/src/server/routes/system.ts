import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function countSkills(): Promise<number> {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  const skillsBase = path.join(home, '.claude', 'skills');
  try {
    // Skills are installed flat at ~/.claude/skills/siq-* (no cluster nesting)
    const entries = await fs.readdir(skillsBase);
    return entries.filter((e) => e.startsWith('siq-')).length;
  } catch {
    return 0;
  }
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
  const candidates = [
    path.resolve(__dirname, '..', 'package.json'),
    path.resolve(__dirname, '..', '..', 'package.json'),
  ];
  for (const pkgPath of candidates) {
    try {
      const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
      if (pkg.version) return pkg.version;
    } catch {
      // Try next candidate
    }
  }
  process.stderr.write('[sales-iq] Warning: Could not resolve dashboard version\n');
  return '0.0.0';
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
