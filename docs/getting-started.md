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
4. Launch the interactive setup wizard

### Option B: Interactive wizard (Node.js 20+ required)

```bash
npx @bienhoang/sales-iq setup
```

The wizard asks for your brand info and installs skills interactively.

### Option C: Manual setup (power users)

See the [Advanced section in README](../README.md#advanced).

## First Use

Open Claude Code and run your first skill:

```
/siq-brand-strategy
```

This is the hub skill for all marketing skills. It establishes your positioning, ICP, and voice. Other marketing skills use this output as context.

For sales:
```
/siq-account-strategy
```

For strategy:
```
/siq-strategy-consultant
```

To browse and edit your workspace outputs in a local dashboard:
```
/siq-dashboard
```

This opens a web UI on `http://localhost:4983` for viewing and editing generated files with a rich text editor.

## Check Installation

Run the doctor command to verify everything is set up correctly:

```bash
npx @bienhoang/sales-iq doctor
```

This checks: Node.js version, npm registry, installed skills, brand context, and MCP config.

## Update Skills

```bash
npx @bienhoang/sales-iq update
```

Re-downloads all skills from the latest version.

## Uninstall

```bash
npx @bienhoang/sales-iq uninstall
```

Removes all installed skills and optionally removes MCP configuration.

## Configure MCP Server (Optional)

The MCP server provides live data from CRM, email, social, and analytics platforms.

```bash
npx @bienhoang/sales-iq configure --mcp
```

Set API keys as environment variables before starting Claude Code:

```bash
export HUBSPOT_API_KEY=your_key
export MAILCHIMP_API_KEY=your_key
```

See [MCP Server Configuration](mcp-server/configuration.md) for all available integrations and environment variables.

## Troubleshooting

Run `sales-iq doctor` first — it checks the most common issues.

**Skills not appearing in Claude Code?**
- Run `sales-iq doctor` to verify installation
- Try `sales-iq update` to re-install
- Restart Claude Code after installation

**MCP tools not available?**
- Run `sales-iq configure --mcp` and restart Claude Code
- Check MCP panel in Claude Code for the sales-iq entry
- Verify API keys are set in your shell environment

**Authentication errors?**
- Run `sales-iq doctor` to check ~/.npmrc
- Re-run `setup.sh` to reconfigure your GitHub token
