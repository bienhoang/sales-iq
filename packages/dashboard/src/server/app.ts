import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { workspaceRouter } from './routes/workspace.js';
import { systemRouter } from './routes/system.js';
import { configRouter } from './routes/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.resolve(__dirname, 'client');

export function createApp(projectDir: string): express.Application {
  const app = express();
  app.use(express.json());

  // API routes
  app.use('/api', workspaceRouter(projectDir));
  app.use('/api', systemRouter());
  app.use('/api', configRouter(projectDir));

  // Static SPA serving
  app.use(express.static(CLIENT_DIR, { dotfiles: 'deny' }));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'not found' });
    res.sendFile(path.join(CLIENT_DIR, 'index.html'));
  });

  return app;
}
