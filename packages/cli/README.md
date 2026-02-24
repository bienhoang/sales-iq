# @bienhoang/sales-iq

CLI for installing sales-iq skills and configuring the MCP server.

## Install

First, set up GitHub Packages authentication (one-time setup):

1. Create a GitHub Personal Access Token with `read:packages` scope: https://github.com/settings/tokens/new
2. Add to `~/.npmrc`:
```
@bienhoang:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install the CLI:

```bash
npm install -g @bienhoang/sales-iq
# or use directly via npx (no install required)
npx @bienhoang/sales-iq <command>
```

## Commands

### `install`

Install skills into `~/.claude/skills/`.

```bash
# Install all clusters
npx @bienhoang/sales-iq install --skills all

# Install a single cluster
npx @bienhoang/sales-iq install --skills marketing
npx @bienhoang/sales-iq install --skills sales
npx @bienhoang/sales-iq install --skills strategy
```

### `configure --brand`

Write brand context to `~/.claude/skills/shared/brand.md`.

```bash
npx @bienhoang/sales-iq configure --brand \
  --name "YourSaaS" \
  --industry "developer-tools" \
  --audience "engineering managers" \
  --tone "technical, direct"
```

All flags are optional. Omitted values use existing values from the brand file.

### `configure --mcp`

Append the MCP server block to Claude Code settings.

```bash
npx @bienhoang/sales-iq configure --mcp
```

Writes to `~/.claude/settings.json` by default. Restart Claude Code after running.

## Options

| Flag | Command | Description |
|------|---------|-------------|
| `--skills <cluster>` | `install` | `all`, `marketing`, `sales`, or `strategy` |
| `--brand` | `configure` | Write brand context file |
| `--name <name>` | `configure --brand` | Company or product name |
| `--industry <industry>` | `configure --brand` | Industry vertical |
| `--audience <audience>` | `configure --brand` | Primary target audience |
| `--tone <tone>` | `configure --brand` | Brand voice tone descriptor |
| `--mcp` | `configure` | Append MCP server to Claude Code settings |

## License

MIT
