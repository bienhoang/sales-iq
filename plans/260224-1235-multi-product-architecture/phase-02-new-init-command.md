# Phase 2: New Init Command

## Context
- Parent: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-refactor-setup-silent-install.md)
- Brainstorm: [brainstorm report](../reports/brainstorm-260224-1235-multi-product-architecture.md)

## Overview
- **Priority**: P1
- **Effort**: 1h30m
- **Status**: Complete
- **Description**: Interactive wizard to create per-product project directory with CLAUDE.md, brand-context.md/json, .sales-iq.json

## Key Insights
- Brand prompts already exist in `wizard-prompts.ts` — reuse directly
- Need Vietnamese slug generation (diacritics → ASCII)
- Project created in CWD as subdirectory
- Re-init: detect `.sales-iq.json`, merge/update instead of overwrite
- CLAUDE.md is critical — must be concise but reference global skills

## Requirements

### Functional
- Wizard: product name, industry, audience, brand tones (same prompts as current setup)
- Name → slug: "Cafe Sài Gòn" → "cafe-sai-gon"
- Create flat project dir in CWD
- Generate 4 files: CLAUDE.md, brand-context.md, brand-context.json, .sales-iq.json
- Re-init: detect existing project, ask to update, merge without overwriting custom content
- Print next steps: `cd <slug> && claude`

### Non-functional
- Each new file < 200 lines
- Use `slugify` npm package
- Handle edge cases: empty name, dir already exists (non-sales-iq), special chars

## Architecture

```
init command flow:
1. Ask brand questions (reuse getBrandPrompts + resolveIndustry)
2. Generate slug from name
3. Check if dir exists:
   a. Has .sales-iq.json → re-init flow (update)
   b. Dir exists but no .sales-iq.json → warn, ask to continue
   c. No dir → create new
4. Write files from templates
5. Print next steps
```

## Related Code Files

**Create:**
- `packages/cli/src/commands/init.ts` — main init command (~120 lines)
- `packages/cli/src/utils/slug-utils.ts` — slug generation (~20 lines)
- `packages/cli/src/utils/templates.ts` — file templates for CLAUDE.md, brand-context.md/json, .sales-iq.json (~120 lines)

**Modify:**
- `packages/cli/src/index.ts` — register init command (+2 lines)
- `packages/cli/package.json` — add `slugify` dependency (+1 line)

**Reuse (no changes):**
- `packages/cli/src/utils/wizard-prompts.ts` — getBrandPrompts(), resolveIndustry()
- `packages/cli/src/utils/file-ops.ts` — ensureDir, writeJson, readJson, fileExists

## Implementation Steps

### Step 1: Add `slugify` dependency
```bash
cd packages/cli && pnpm add slugify
```

### Step 2: Create `slug-utils.ts`
```ts
// packages/cli/src/utils/slug-utils.ts
import slugify from 'slugify';

export function toSlug(name: string): string {
  return slugify(name, { lower: true, strict: true, locale: 'vi' });
}
```

### Step 3: Create `templates.ts`
Templates for generated files. Each function returns file content as string.

**`generateClaudeMd(input)`** — CLAUDE.md content:
```markdown
# {name} — Sales & Marketing Context

## Brand
- **Company**: {name}
- **Industry**: {industry}
- **Audience**: {audience}
- **Tone**: {tones}

See `brand-context.md` for detailed brand voice and messaging guidelines.

## Skills
This project uses sales-iq skills installed at `~/.claude/skills/`.

### Quick Start
- `/siq-brand-strategy` — Define positioning, voice, and messaging pillars
- `/siq-email-campaign` — Draft email sequences for any lifecycle stage
- `/siq-ad-copy` — Write ad copy for Meta, Google, LinkedIn
- `/siq-content-repurpose` — Transform content across formats and channels
- `/siq-competitor-intel` — Analyze competitors and create intelligence docs
- `/siq-account-strategy` — Build account plans and stakeholder maps
- `/siq-strategy-consultant` — Run SWOT, Porter's, or other strategic frameworks

## Files
- `brand-context.md` — Brand voice, ICP, messaging guidelines (edit this!)
- `brand-context.json` — Structured brand data for tools
- `.sales-iq.json` — Project config (auto-managed)
```

**`generateBrandContextMd(input)`** — brand-context.md content:
```markdown
---
generated-by: sales-iq init
date: {date}
---

# Brand Context

## Company Overview
- **Name**: {name}
- **Industry**: {industry}
- **Target Audience**: {audience}

## Brand Voice
- Tone: {tones}
- Style: (add your style guidelines)

## Key Messages
- Add your core value proposition here
- Add your key differentiators here

## ICP (Ideal Customer Profile)
- Add your primary ICP details here

## Competitive Positioning
- Add your main competitors here
- Add your unique advantages here

_Update this file with your actual brand details to improve skill outputs._
```

**`generateBrandContextJson(input)`** — brand-context.json:
```json
{
  "name": "{name}",
  "industry": "{industry}",
  "audience": "{audience}",
  "tones": ["{tone1}", "{tone2}"]
}
```

**`generateProjectConfig(input)`** — .sales-iq.json:
```json
{
  "name": "{name}",
  "slug": "{slug}",
  "version": "1.0.0",
  "created": "{iso-date}",
  "updated": "{iso-date}"
}
```

### Step 4: Create `init.ts`

```ts
// packages/cli/src/commands/init.ts
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import type { Command } from 'commander';
import { getBrandPrompts, resolveIndustry } from '../utils/wizard-prompts.js';
import { toSlug } from '../utils/slug-utils.js';
import { ensureDir, fileExists, readJson, writeJson } from '../utils/file-ops.js';
import {
  generateClaudeMd,
  generateBrandContextMd,
  generateBrandContextJson,
  generateProjectConfig,
} from '../utils/templates.js';
import fs from 'fs/promises';

export function registerInit(program: Command): void {
  program
    .command('init')
    .description('Create a new project for a product or company')
    .action(async () => { await runInit(); });
}

async function runInit(): Promise<void> {
  console.log(chalk.bold('\n  sales-iq — New Project\n'));

  // 1. Brand questions
  const answers = await prompts(getBrandPrompts(), { onCancel: () => process.exit(0) });
  const industry = resolveIndustry(answers);
  const slug = toSlug(answers.brandName);
  const projectDir = path.resolve(process.cwd(), slug);

  // 2. Check existing
  const configPath = path.join(projectDir, '.sales-iq.json');
  const existingConfig = await readJson(configPath);

  if (existingConfig) {
    // Re-init flow
    console.log(chalk.yellow(`\n  Project "${slug}" already exists. Updating...\n`));
  } else if (await fileExists(projectDir)) {
    // Dir exists but not a sales-iq project
    const { proceed } = await prompts({
      type: 'confirm', name: 'proceed',
      message: `Directory "${slug}" exists but isn't a sales-iq project. Continue?`,
      initial: false,
    });
    if (!proceed) return;
  }

  // 3. Generate files
  const spinner = ora('Creating project...').start();
  const input = {
    name: answers.brandName,
    slug,
    industry,
    audience: answers.audience ?? '',
    tones: answers.tones ?? ['professional'],
  };

  await ensureDir(projectDir);
  await fs.writeFile(path.join(projectDir, 'CLAUDE.md'), generateClaudeMd(input), 'utf-8');
  await fs.writeFile(path.join(projectDir, 'brand-context.md'), generateBrandContextMd(input), 'utf-8');
  await writeJson(path.join(projectDir, 'brand-context.json'), generateBrandContextJson(input));
  await writeJson(configPath, generateProjectConfig(input));
  spinner.succeed(`Project created: ${slug}/`);

  // 4. Next steps
  console.log(chalk.bold('\n  Next steps:\n'));
  console.log(`    ${chalk.cyan(`cd ${slug}`)}`);
  console.log(`    ${chalk.cyan('claude')}\n`);
}
```

### Step 5: Register in `index.ts`
Add import + `registerInit(program)` call.

### Step 6: Build & verify
```bash
pnpm --filter @bienhoang/sales-iq build
```

## Todo
- [ ] Add `slugify` dependency
- [ ] Create `slug-utils.ts`
- [ ] Create `templates.ts` with 4 template generators
- [ ] Create `init.ts` with wizard + re-init flow
- [ ] Register init command in `index.ts`
- [ ] Build and verify TypeScript compiles

## Success Criteria
- `sales-iq init` launches interactive wizard
- Vietnamese names slugified correctly: "Cafe Sài Gòn" → "cafe-sai-gon"
- 4 files generated in project dir
- CLAUDE.md references global skills
- Re-init on existing project updates without overwriting
- `cd <slug> && claude` → Claude loads brand context

## Risk Assessment
- **slugify edge cases**: Some Vietnamese chars may not convert. Test with: Phở Bò, Cà Phê, Đà Nẵng
- **Dir permissions**: CWD may not be writable. Wrap in try-catch with helpful error.
- **Large CLAUDE.md**: Keep under 80 lines. Claude loads this every session.

## Security Considerations
- Slug generation must sanitize path traversal chars (../, etc.) — slugify handles this
- Don't write files outside CWD

## Next Steps
- Phase 3: Update setup.sh
- Phase 4: Update doctor to check per-project context
