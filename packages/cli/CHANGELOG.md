# @bienhoang/sales-iq

## 1.5.1

### Patch Changes

- Updated dependencies [[`3de1575`](https://github.com/bienhoang/sales-iq/commit/3de15758111e503f2b106cdc8b3ee3f8b9cec70a)]:
  - @bienhoang/sales-iq-skills@1.3.3

## 1.4.1

### Patch Changes

- Fix skill install flattening: rewrite `../../shared/` to `../shared/` in .md files after flattening cluster nesting
- Inject `cluster` metadata into SKILL.md frontmatter during install
- Fix `list` command to work with flat installed structure instead of assuming nested clusters

## 1.2.0

### Minor Changes

- Add workspace output persistence: skills auto-save deliverables to workspace/ directory, MCP content calendar persists to JSON file

### Patch Changes

- Updated dependencies []:
  - @bienhoang/sales-iq-skills@1.1.0

## 1.1.0

### Minor Changes

- Add multi-product support with new `init` command. Setup is now silent (zero prompts), and `init` creates per-product project directories with brand context. Supports Vietnamese slug generation.

### Patch Changes

- Updated dependencies []:
  - @bienhoang/sales-iq-skills@1.0.1
