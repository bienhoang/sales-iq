import path from 'node:path';
import { createApp } from './app.js';
import getPort from 'get-port';
import open from 'open';

// Parse CLI args
const args = process.argv.slice(2);
const dirIndex = args.indexOf('--dir');
const portIndex = args.indexOf('--port');
const noOpen = args.includes('--no-open');

const dir = path.resolve(dirIndex !== -1 ? args[dirIndex + 1] : process.cwd());
const preferredPort = portIndex !== -1 ? parseInt(args[portIndex + 1], 10) : 4983;

const port = await getPort({ port: preferredPort });
const app = createApp(dir);

const server = app.listen(port, '127.0.0.1', () => {
  const url = `http://localhost:${port}`;
  console.log(`Sales-IQ Dashboard: ${url}`);
  console.log(`Workspace: ${dir}/workspace/`);
  if (!noOpen) open(url);
});

// Graceful shutdown
for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => {
    server.close();
    process.exit(0);
  });
}
