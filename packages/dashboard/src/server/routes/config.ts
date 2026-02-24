import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

export function configRouter(projectDir: string): Router {
  const router = Router();

  // GET /api/config — read .sales-iq.json
  router.get('/config', async (_req, res) => {
    const configPath = path.join(projectDir, '.sales-iq.json');
    try {
      const raw = await fs.readFile(configPath, 'utf-8');
      res.json(JSON.parse(raw));
    } catch {
      res.status(404).json({ error: 'not found' });
    }
  });

  // GET /api/brand-context — read brand-context.md
  router.get('/brand-context', async (_req, res) => {
    const brandPath = path.join(projectDir, 'brand-context.md');
    try {
      const content = await fs.readFile(brandPath, 'utf-8');
      const stat = await fs.stat(brandPath);
      res.json({ content, modified: stat.mtime.toISOString() });
    } catch {
      res.status(404).json({ error: 'brand-context.md not found' });
    }
  });

  // PUT /api/brand-context — write brand-context.md
  router.put('/brand-context', async (req, res) => {
    const brandPath = path.join(projectDir, 'brand-context.md');
    const { content } = req.body as { content?: string };
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Missing content in body' });
    }
    try {
      await fs.writeFile(brandPath, content, 'utf-8');
      res.json({ saved: true });
    } catch {
      res.status(500).json({ error: 'Failed to save brand-context.md' });
    }
  });

  return router;
}
