# Getting Started

## Prerequisites

- Node.js 20+
- Claude Code (claude.ai/code)
- GitHub Personal Access Token with `read:packages` scope

## GitHub Packages Setup

All sales-iq packages are published to GitHub Packages as private packages. Set this up once:

1. Create a GitHub Personal Access Token (PAT): https://github.com/settings/tokens/new
   - Select `read:packages` scope
   - Copy the token

2. Add to `~/.npmrc`:
```
@bienhoang:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Replace `YOUR_GITHUB_TOKEN` with your PAT from step 1.

## Install

Install all skills into your Claude Code configuration:

```bash
npx @bienhoang/sales-iq install --skills all
```

To install a single cluster only:

```bash
npx @bienhoang/sales-iq install --skills marketing
npx @bienhoang/sales-iq install --skills sales
npx @bienhoang/sales-iq install --skills strategy
```

Skills are written to `~/.claude/skills/` and are immediately available in Claude Code.

## Configure Brand

Set your brand context so all skills produce on-brand output:

```bash
npx @bienhoang/sales-iq configure --brand \
  --name "YourSaaS" \
  --industry "developer-tools" \
  --audience "engineering managers" \
  --tone "technical, direct"
```

This writes `~/.claude/skills/shared/brand.md`. All marketing and sales skills load this file automatically.

## Configure MCP Server

Add the MCP server to Claude Code for live data access:

```bash
npx @bienhoang/sales-iq configure --mcp
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

If the directory is missing, re-run `npx @bienhoang/sales-iq install --skills all`.

**MCP tools not available**

Check that `@bienhoang/sales-iq-mcp-server` appears in Claude Code's MCP panel. If not, re-run `npx @bienhoang/sales-iq configure --mcp` and restart Claude Code.

**API errors from MCP tools**

Each tool returns `{ error: "API key not configured. Set <VAR> env var." }` when the corresponding key is missing. Check that the environment variable is set in the shell that launched Claude Code.
