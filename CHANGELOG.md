# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-02-24

### Added

- **Monorepo initialization** with Turborepo + pnpm workspaces
- **CLI package** (`@bienhoang/sales-iq`) with 7 commands: `setup`, `install`, `configure`, `update`, `list`, `doctor`, `uninstall`
- **Interactive setup wizard** for non-technical users with guided onboarding
- **Doctor command** for installation health checks and diagnostics
- **Uninstall command** for clean removal of skills and configuration
- **Shell installer** (`setup.sh`) for zero-to-hero installation experience
- **MCP server** (`@bienhoang/sales-iq-mcp-server`) with stub tool implementations
- **Core types** (`@bienhoang/sales-iq-core`) with shared data models
- **Skills package** (`@bienhoang/sales-iq-skills`) with 3 skill clusters:
  - **Marketing** (~11 skills): brand-strategy hub, product-launch orchestrator, content-strategy, social-media, email-marketing, seo-content, ad-campaigns, analytics-reporting, market-research, community-engagement, content-repurpose
  - **Sales** (~8 skills): account-strategy hub, lead-qualification, pipeline-report, objection-handling, proposal-writer, follow-up, deal-closing, sales-enablement
  - **Strategy** (1 monolithic): strategy-consultant with 10 business frameworks
- **Shared reference materials**: brand-context, icp-profiles
- **Brainstorm skill** (`siq-brainstorm`) for ideation and trade-off analysis
- **Scout skill** (`siq-scout`) for market and competitive research
- **Research skill** (`siq-research`) for sales/marketing intelligence
- **Docs-seeker skill** (`siq-docs-seeker`) for web-based documentation search
- GitHub Packages migration with `@bienhoang` scope
- Comprehensive documentation: README, getting-started guide, per-cluster SETUP.md files
