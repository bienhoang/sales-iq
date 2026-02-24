# Getting Started

## Quick Start

### Option A: One-command setup

```bash
curl -fsSL https://raw.githubusercontent.com/bienhoang/sales-iq/main/setup.sh | bash
```

The script will:
1. Install Node.js if needed (via nvm)
2. Open GitHub to create an access token
3. Configure npm authentication
4. Install CLI + dashboard globally
5. Install skills and configure MCP server
6. Run health check

### Option B: Manual install (Node.js 20+ required)

```bash
npm install -g @bienhoang/sales-iq @bienhoang/sales-iq-dashboard
sales-iq setup
```

### Option C: npx (no global install)

```bash
npx @bienhoang/sales-iq setup
```

Skills and MCP are installed, but dashboard uses `npx` on demand (slower first launch).

## Create Your First Project

```bash
sales-iq init
```

The wizard asks for your product name, industry, and target audience. A project directory is created with:
- `brand-context.md` — your brand positioning and ICP
- `brand-context.json` — structured brand data
- `CLAUDE.md` — Claude Code instructions (auto-loads brand context)
- `.sales-iq.json` — project config
- `.claude/settings.json` — MCP server config

## First Use

Open Claude Code in your project directory:

```bash
cd my-product
claude
```

### Hub skills (start here)

| Cluster | Hub Skill | Purpose |
|---------|-----------|---------|
| Marketing | `/siq-brand-strategy` | Brand voice, positioning, ICP |
| Sales | `/siq-account-strategy` | Sales motion, objection map |
| Strategy | `/siq-strategy-consultant` | 10 strategic frameworks |

### Workspace Dashboard

Browse and edit all generated outputs in a local web UI:

```
/siq-dashboard
```

Opens `http://localhost:4983` with a category sidebar, collapsible file tree, and rich markdown editor.

The dashboard is installed globally during setup. If not available, falls back to `npx @bienhoang/sales-iq-dashboard`.

You can also run it directly:

```bash
siq-dashboard --dir ./my-project
```

## Check Installation

```bash
sales-iq doctor
```

Checks: Node.js version, npm registry, installed skills, brand context, MCP config, and dashboard availability.

## Update Skills

```bash
sales-iq update
```

Re-downloads all skills from the latest version.

## Uninstall

```bash
sales-iq uninstall
```

Removes all installed skills and optionally removes MCP configuration.

## Configure MCP Server (Optional)

The MCP server provides live data from CRM, email, social, and analytics platforms.

```bash
sales-iq configure --mcp
```

Set API keys as environment variables before starting Claude Code:

```bash
export HUBSPOT_API_KEY=your_key
export MAILCHIMP_API_KEY=your_key
```

See [MCP Server Configuration](mcp-server/configuration.md) for all available integrations.

## Troubleshooting

Run `sales-iq doctor` first — it checks the most common issues.

**Skills not appearing in Claude Code?**
- Run `sales-iq doctor` to verify installation
- Try `sales-iq update` to re-install
- Restart Claude Code after installation

**Dashboard not starting?**
- Run `siq-dashboard --dir .` manually to see errors
- Check if port 4983 is already in use
- Try `npx @bienhoang/sales-iq-dashboard --dir .` if global install failed

**MCP tools not available?**
- Run `sales-iq configure --mcp` and restart Claude Code
- Check MCP panel in Claude Code for the sales-iq entry
- Verify API keys are set in your shell environment

**Authentication errors?**
- Run `sales-iq doctor` to check ~/.npmrc
- Re-run `setup.sh` to reconfigure your GitHub token
