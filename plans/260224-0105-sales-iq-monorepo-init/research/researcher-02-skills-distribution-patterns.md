# Skills Distribution Patterns Research

Date: 2026-02-24
Author: researcher-02

---

## Topic 1: Claude Code Skills Distribution

### Discovery & Registration

Claude Code scans these locations at startup:
- `~/.claude/skills/` — user-level (global)
- `.claude/skills/` — project-level (local)
- Plugin-provided skills
- Built-in skills

Each subdirectory with a `SKILL.md` is registered as a skill. The `name` field in frontmatter **must match** the directory name. At startup, `name` + `description` for every skill are pre-loaded into the system prompt for Claude to decide when to invoke.

### SKILL.md Frontmatter Spec (v1.0, 2025-10-16)

```yaml
---
name: my-skill           # required; hyphen-case; must match directory name
description: |           # required; what it does + when to trigger
  Describe the skill and trigger contexts.
license: MIT             # optional
allowed-tools:           # optional; pre-approved tools list (Claude Code only)
  - Bash
  - Read
metadata:                # optional; arbitrary key/value map
  version: "1.0.0"
---
```

**Required:** `name`, `description`
**Optional:** `license`, `allowed-tools`, `metadata`
**Note:** `argument-hint` is surfaced in some Claude Code UI docs but is NOT in the official spec v1.0 — it may be a UI-layer field, not a SKILL.md field.

### Minimal Skill Structure

```
my-skill/
└── SKILL.md          # only required file
```

Complex skills may add `scripts/`, `prompts/`, or other resources referenced from SKILL.md.

### npm Install Mechanism

No official npm-based skill registry exists yet. Current distribution is:
- Clone/copy the `anthropics/skills` GitHub repo
- Manual copy of skill folders into `~/.claude/skills/`
- `install.sh` script for dependency setup (Python venv, system tools)

### CLI Copy Pattern (Best Practice)

A CLI that distributes skills should:

```js
// resolve installed package path, copy to target
const pkgDir = path.dirname(require.resolve('my-skills-pkg/package.json'));
const target = path.join(os.homedir(), '.claude', 'skills');
fs.cpSync(path.join(pkgDir, 'skills'), target, { recursive: true });
```

Key rules:
- Use `require.resolve()` to locate package root reliably (no hardcoded paths)
- Copy entire skill directories (not just SKILL.md)
- Preserve directory name = skill name invariant
- Support both `~/.claude/skills/` (global) and `.claude/skills/` (project) targets via CLI flag

---

## Topic 2: npm Publishing for Markdown-Only Packages

### package.json Setup

```json
{
  "name": "my-skills-pkg",
  "version": "1.0.0",
  "description": "Claude Code skills collection",
  "files": [
    "skills/**/*.md",
    "skills/**/SKILL.md"
  ],
  "scripts": {
    "postinstall": "node scripts/install.js"
  }
}
```

- No `main`/`index.js` required for content-only packages
- `files` field whitelist is the canonical way to control publish output
- `.npmignore` is an alternative but `files` is preferred (explicit > implicit)

### postinstall Copy Script

```js
// scripts/install.js
const fs = require('fs');
const path = require('path');
const os = require('os');

const pkgRoot = path.dirname(require.resolve('../package.json'));
const skillsSrc = path.join(pkgRoot, 'skills');
const skillsDest = path.join(os.homedir(), '.claude', 'skills');

if (!fs.existsSync(skillsDest)) fs.mkdirSync(skillsDest, { recursive: true });

for (const skill of fs.readdirSync(skillsSrc)) {
  const src = path.join(skillsSrc, skill);
  const dest = path.join(skillsDest, skill);
  if (fs.statSync(src).isDirectory()) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Installed skill: ${skill}`);
  }
}
```

### Consumption Patterns

| Pattern | Use Case |
|---|---|
| `postinstall` auto-copy | Zero-config: `npm install my-skills-pkg` installs skills immediately |
| CLI binary in package | User runs `npx my-skills-pkg install [--global\|--local]` for control |
| Programmatic import | `require('my-skills-pkg/skills/foo/SKILL.md')` — rare, no benefit for markdown |

**Recommendation:** CLI binary + optional `postinstall` flag via env var (`SKIP_SKILLS_INSTALL=1`).

### Similar Package Patterns

- `create-react-app` / `degit` — copy template files on install/exec
- `commitlint` config packages — markdown/JSON content with postinstall
- Prompt library packages on npm — pure markdown/text, `files` field only, no JS entrypoint

### Risks & Mitigations

- **postinstall security:** npm warns users; some orgs disable postinstall. Provide CLI fallback.
- **pnpm/yarn compat:** pnpm may restrict postinstall file writes to project dir. Test across package managers.
- **Path resolution:** Always use `require.resolve()` not `__dirname` inside postinstall — `__dirname` can resolve to the calling project, not the package.

---

## Summary for Plan

| Decision | Recommendation |
|---|---|
| Skill spec fields | `name` + `description` required; add `metadata.version` |
| Distribution method | npm package + CLI (`npx`) + optional postinstall |
| Copy target | Default `~/.claude/skills/`; `--local` flag for `.claude/skills/` |
| Package structure | `files: ["skills/**"]`, no `index.js` needed |
| Postinstall | Include but gate on `SKIP_SKILLS_INSTALL != "1"` |

---

## Unresolved Questions

1. Is `argument-hint` a real SKILL.md frontmatter field or only a Claude Code UI construct? Official spec v1.0 does not list it.
2. Will Anthropic publish an official npm registry / skill marketplace? No indication yet as of Feb 2026.
3. pnpm postinstall file-write restrictions — needs hands-on testing before shipping.

---

## Sources

- [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [Inside Claude Code Skills: Structure, prompts, invocation](https://mikhail.io/2025/10/claude-code-skills/)
- [skills/skill-creator/SKILL.md - anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [Equipping agents for the real world with Agent Skills - Anthropic](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [How to Automatically Copy Files via postinstall npm Script](https://www.w3tutorials.net/blog/how-to-automatically-copy-files-from-package-to-local-directory-via-postinstall-npm-script/)
- [npm scripts docs](https://docs.npmjs.com/cli/v8/using-npm/scripts/)
- [agent_skills_spec.md - local](~/.claude/skills/agent_skills_spec.md)
