# Server Build Strategy: Express + Vite SPA

**Context:** macOS, Node.js 20+, pnpm monorepo, tsup for server, Vite for client

---

## 1. Bundle Strategy: tsup + Vite into Single Distributable

**Approach: Two-pass build, output merged into `dist/`**

```
build/
  1. vite build → dist/client/   (React SPA assets)
  2. tsup build → dist/server.js (Express server, CJS or ESM)
```

**tsup.config.ts**
```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],           // CJS for bin compatibility without .mjs hassle
  target: 'node20',
  outDir: 'dist',
  clean: false,              // don't wipe vite output; run vite first
  minify: false,             // keep readable for CLI tool
  banner: { js: '#!/usr/bin/env node' },  // if this is the bin entry
})
```

**package.json scripts**
```json
{
  "scripts": {
    "build": "vite build --outDir dist/client && tsup",
    "prepublishOnly": "pnpm build"
  },
  "bin": { "siq-dashboard": "dist/server.js" },
  "files": ["dist"]
}
```

**Key point:** tsup does NOT natively copy arbitrary static folders. Use `cpx` or a shell `cp -r` step; do NOT use tsup `publicDir` (buggy with `clean: true`, see issue #1366).

```json
"build": "vite build --outDir dist/client && tsup && true"
```

Or use `esbuild-plugin-copy` if inline is preferred.

---

## 2. Bin Entry Point: Express Serves Static + API

**src/server.ts pattern**
```ts
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIR = path.resolve(__dirname, 'client') // dist/client/

const app = express()

// API routes first
app.use('/api', apiRouter)

// Static files with security headers
app.use(express.static(CLIENT_DIR, { dotfiles: 'deny' }))

// SPA fallback — ONLY for non-API, non-dotfile paths
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(CLIENT_DIR, 'index.html'))
})
```

**Note:** When bundled via tsup (CJS), `__dirname` is available. For ESM output, use the `fileURLToPath` pattern above.

---

## 3. Port Selection: Default 4983 → Fallback Random

**Use `get-port` (sindresorhus, ESM-only v7+)**

```ts
import getPort, { portNumbers } from 'get-port'

const port = await getPort({ port: 4983 })
// Returns 4983 if free, else next available random port
```

For CJS bundles, pin `get-port@6.x` (last CJS version):
```json
"get-port": "^6.5.0"
```

v6 API is identical. v7+ is ESM-only — use only if `"type": "module"` or tsup outputs ESM.

**Alternative (zero-dep):** Pass port `0` to `server.listen(0)` — OS assigns ephemeral port (49152–65535). Then read back `server.address().port`. Fine for fallback but gives no control over range.

**Recommended for CLI:**
```ts
const port = await getPort({ port: [4983, 4984, 4985] })
server.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
```

---

## 4. Open Browser from Node CLI

**Package:** `open` by sindresorhus — v9+ is ESM-only.

For CJS output, use `open@8.x` (last CJS-compatible):
```json
"open": "^8.4.2"
```

```ts
import open from 'open'

server.listen(port, () => {
  const url = `http://localhost:${port}`
  console.log(`Server: ${url}`)
  open(url)  // opens default browser, non-blocking
})
```

Uses `open` on macOS, `start` on Windows, `xdg-open` on Linux. No extra deps.

**ESM path:** Use `open@10` with tsup `format: ['esm']` — requires package `"type": "module"`.

---

## 5. Path Traversal Prevention

**2025 context:** Vite dev server had multiple path traversal CVEs (CVE-2025-30208, CVE-2025-62522, CVE-2025-58752) — these affect Vite's dev middleware only, NOT production Express static serving. Still, apply best practices:

**Express `express.static` is safe by default** — it uses `serve-static` which normalizes and resolves paths. Key settings:

```ts
app.use('/assets', express.static(CLIENT_DIR, {
  dotfiles: 'deny',        // block .env, .htaccess etc.
  index: false,            // explicit SPA fallback only
  redirect: false,
}))
```

**For REST API file-serving routes** (e.g., serving user-uploaded or workspace files):

```ts
import path from 'path'

function safePath(base: string, userInput: string): string | null {
  const resolved = path.resolve(base, userInput)
  if (!resolved.startsWith(path.resolve(base))) return null  // traversal detected
  return resolved
}

app.get('/files/:name', (req, res) => {
  const safe = safePath(ALLOWED_DIR, req.params.name)
  if (!safe) return res.status(403).send('Forbidden')
  res.sendFile(safe)
})
```

**Rules:**
- Always `path.resolve()` then check `.startsWith(base)`
- Reject paths containing `..` before resolve as early-exit
- Never pass raw `req.params` to `fs.readFile` or `res.sendFile` without validation
- Set `dotfiles: 'deny'` on all static middleware

---

## Summary Table

| Concern | Decision |
|---|---|
| Server bundler | tsup, CJS format, `clean: false` |
| Static copy | `cp -r` in build script (not tsup publicDir) |
| Port fallback | `get-port@6` (CJS compat), try 4983 first |
| Browser open | `open@8` (CJS compat) |
| Path traversal | `path.resolve` + `startsWith` guard; `dotfiles: deny` |

---

## Unresolved Questions

1. **ESM vs CJS output:** If monorepo uses `"type": "module"` throughout, tsup can output ESM and use `open@10`/`get-port@7` — but bin scripts with ESM require `.mjs` extension or explicit type. Confirm package `type` setting.
2. **Asset hashing:** Vite hashes assets by default (`dist/client/assets/index-abc123.js`). Express static works fine, but confirm `vite.config` `build.outDir` matches the path embedded in `server.ts`.
3. **`--no-open` flag:** CLI tools typically respect a `--no-open` flag; wiring this to argv needs confirmation of CLI arg parsing approach.

---

Sources:
- [get-port (npm)](https://www.npmjs.com/package/get-port)
- [sindresorhus/get-port (GitHub)](https://github.com/sindresorhus/get-port)
- [open (npm)](https://www.npmjs.com/package/open)
- [sindresorhus/open (GitHub)](https://github.com/sindresorhus/open)
- [tsup (egoist.dev)](https://tsup.egoist.dev/)
- [tsup copy static files issue #278](https://github.com/egoist/tsup/issues/278)
- [tsup publicDir dts issue #1366](https://github.com/egoist/tsup/issues/1366)
- [CVE-2025-30208 Vite path traversal](https://www.offsec.com/blog/cve-2025-30208/)
- [Node.js path traversal prevention](https://www.nodejs-security.com/book/path-traversal)
