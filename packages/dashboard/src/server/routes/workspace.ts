import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { safePath } from '../utils/safe-path.js';
import { scanWorkspace } from '../utils/workspace-scanner.js';

export function workspaceRouter(projectDir: string): Router {
  const router = Router();
  const workspaceDir = path.join(projectDir, 'workspace');

  router.get('/workspace', async (_req, res) => {
    try {
      const data = await scanWorkspace(workspaceDir);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to scan workspace' });
    }
  });

  router.get('/files', async (req, res) => {
    const filePath = req.query.path as string | undefined;
    if (!filePath) return res.status(400).json({ error: 'Missing path parameter' });

    const resolved = safePath(workspaceDir, filePath);
    if (!resolved) return res.status(403).json({ error: 'Forbidden path' });

    try {
      const content = await fs.readFile(resolved, 'utf-8');
      const stat = await fs.stat(resolved);
      res.json({ path: filePath, content, modified: stat.mtime.toISOString() });
    } catch {
      res.status(404).json({ error: 'File not found' });
    }
  });

  router.put('/files', async (req, res) => {
    const filePath = req.query.path as string | undefined;
    if (!filePath) return res.status(400).json({ error: 'Missing path parameter' });

    const resolved = safePath(workspaceDir, filePath);
    if (!resolved) return res.status(403).json({ error: 'Forbidden path' });

    const { content } = req.body as { content?: string };
    if (typeof content !== 'string') return res.status(400).json({ error: 'Missing content in body' });

    try {
      await fs.writeFile(resolved, content, 'utf-8');
      res.json({ path: filePath, saved: true });
    } catch {
      res.status(500).json({ error: 'Failed to save file' });
    }
  });

  return router;
}
