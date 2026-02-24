# Getting Started

## Prerequisites

- Node.js 20+
- Claude Code (claude.ai/code)

## Install

Install all skills into your Claude Code configuration:

```bash
npx sales-iq install --skills all
```

To install a single cluster only:

```bash
npx sales-iq install --skills marketing
npx sales-iq install --skills sales
npx sales-iq install --skills strategy
```

Skills are written to `~/.claude/skills/` and are immediately available in Claude Code.

## Configure Brand

Set your brand context so all skills produce on-brand output:

```bash
npx sales-iq configure --brand \
  --name "YourSaaS" \
  --industry "developer-tools" \
  --audience "engineering managers" \
  --tone "technical, direct"
```

This writes `~/.claude/skills/shared/brand.md`. All marketing and sales skills load this file automatically.

## Configure MCP Server

Add the MCP server to Claude Code for live data access:

```bash
npx sales-iq configure --mcp
```

This appends the MCP block to your Claude Code settings. Set the required API keys as environment variables before starting Claude Code:

```bash
export HUBSPOT_API_KEY=your_key
export MAILCHIMP_API_KEY=your_key
export ANTHROPIC_API_KEY=your_key
```

See [MCP Server Configuration](mcp-server/configuration.md) for the full environment variables reference.

## First Use

Open Claude Code and run:

```
/siq-brand-strategy
```

The brand strategy skill is the hub for all marketing skills. Run it first to establish positioning, ICP, and voice. The output is used as context by all other marketing skills.

For sales, start with:

```
/siq-account-strategy
```

For a standalone strategic analysis:

```
/siq-strategy-consultant
```

## Troubleshooting

**Skills not found in Claude Code**

Verify the skills were installed:

```bash
ls ~/.claude/skills/marketing/
ls ~/.claude/skills/sales/
ls ~/.claude/skills/strategy/
```

If the directory is missing, re-run `npx sales-iq install --skills all`.

**MCP tools not available**

Check that `sales-iq-mcp` appears in Claude Code's MCP panel. If not, re-run `npx sales-iq configure --mcp` and restart Claude Code.

**API errors from MCP tools**

Each tool returns `{ error: "API key not configured. Set <VAR> env var." }` when the corresponding key is missing. Check that the environment variable is set in the shell that launched Claude Code.
