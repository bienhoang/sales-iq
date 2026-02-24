# Documentation Update: GitHub Packages Migration

## Summary

Updated all package documentation to reflect migration from npm registry to GitHub Packages with @bienhoang scope. All packages now publish as private packages to npm.pkg.github.com and require GitHub Personal Access Token (PAT) authentication for installation.

## Changes Made

### 1. packages/cli/README.md
- Title: `sales-iq` → `@bienhoang/sales-iq`
- Added GitHub Packages setup section with PAT creation and .npmrc configuration steps
- Updated all commands: `npx sales-iq` → `npx @bienhoang/sales-iq`
- Moved authentication setup to top of installation instructions

### 2. packages/core/README.md
- Title: `sales-iq-core` → `@bienhoang/sales-iq-core`
- Updated import statement: `from 'sales-iq-core'` → `from '@bienhoang/sales-iq-core'`
- Updated internal dependency reference: `sales-iq-mcp-server` → `@bienhoang/sales-iq-mcp-server`
- Added note clarifying it's an internal package

### 3. packages/mcp-server/README.md
- Title: `sales-iq-mcp-server` → `@bienhoang/sales-iq-mcp-server`
- Added GitHub Packages setup section with PAT and .npmrc configuration
- Updated setup commands: `npx sales-iq configure --mcp` → `npx @bienhoang/sales-iq configure --mcp`
- Updated direct invocation: `npx sales-iq-mcp` → `npx @bienhoang/sales-iq-mcp-server`
- Updated manual MCP config: `args: ["sales-iq-mcp"]` → `args: ["@bienhoang/sales-iq-mcp-server"]`

### 4. packages/skills/README.md
- Title: `sales-iq-skills` → `@bienhoang/sales-iq-skills`
- Added GitHub Packages setup section with PAT and .npmrc configuration
- Updated all install commands: `npx sales-iq` → `npx @bienhoang/sales-iq`
- Updated brand configuration command with new scope

### 5. docs/getting-started.md
- Added GitHub Packages Setup section as prerequisite
- Detailed 2-step authentication setup (PAT creation + .npmrc configuration)
- Updated all `npx sales-iq` commands to `npx @bienhoang/sales-iq`
- Updated troubleshooting section:
  - Install command: `npx sales-iq install` → `npx @bienhoang/sales-iq install`
  - MCP name reference: `sales-iq-mcp` → `@bienhoang/sales-iq-mcp-server`

### 6. README.md (root)
- Already updated in previous work
- Maintained consistency with package documentation

## Files Modified

| File | Changes |
|------|---------|
| `packages/cli/README.md` | Title, auth setup section, command updates |
| `packages/core/README.md` | Title, import statements, dependency references |
| `packages/mcp-server/README.md` | Title, auth setup section, command + config updates |
| `packages/skills/README.md` | Title, auth setup section, command updates |
| `docs/getting-started.md` | Prerequisites, new auth setup section, command + references updates |
| `README.md` (root) | Already updated (not modified) |

## Key Updates Summary

**All Package Names:**
- `sales-iq` → `@bienhoang/sales-iq`
- `sales-iq-core` → `@bienhoang/sales-iq-core`
- `sales-iq-mcp-server` → `@bienhoang/sales-iq-mcp-server`
- `sales-iq-skills` → `@bienhoang/sales-iq-skills`

**All Commands:**
- `npx sales-iq` → `npx @bienhoang/sales-iq`
- `npx sales-iq-mcp` → `npx @bienhoang/sales-iq-mcp-server`

**New Requirement:**
Users must configure `~/.npmrc` with GitHub Packages registry and PAT before installing any packages.

## Consistency Verification

- All package references use consistent `@bienhoang` scope
- All command examples updated uniformly across documentation
- GitHub Packages authentication instructions present in CLI, MCP server, and skills READMEs
- Getting-started guide includes prerequisite authentication setup
- MCP server manual configuration reflects new package name

## Next Steps

- Commit these documentation updates
- Verify installation workflow with actual GitHub Packages authentication
- Test all documented commands (install, configure --brand, configure --mcp)
