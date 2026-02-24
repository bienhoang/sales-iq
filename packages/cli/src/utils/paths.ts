import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

/**
 * Resolve the skills source directory.
 * In dev: relative to this file (../../skills/ in monorepo).
 * In prod: from the installed 'sales-iq-skills' package.
 */
export function getSkillsSourceDir(): string {
  // Dev: packages/cli/src/utils/ -> packages/skills/
  const thisFile = fileURLToPath(import.meta.url);
  const devPath = path.resolve(path.dirname(thisFile), '..', '..', '..', 'skills');

  try {
    const require = createRequire(import.meta.url);
    const pkgPath = require.resolve('@bienhoang/sales-iq-skills/package.json');
    return path.dirname(pkgPath);
  } catch {
    // Not installed as separate package — use monorepo path
    return devPath;
  }
}

/** ~/.claude/skills — global install target */
export function getGlobalSkillsDir(): string {
  return path.join(os.homedir(), '.claude', 'skills');
}

/** ./.claude/skills — local/project install target */
export function getLocalSkillsDir(): string {
  return path.join(process.cwd(), '.claude', 'skills');
}

/**
 * Path to Claude's settings.json.
 * Global: ~/.claude/settings.json
 * Local:  ./.claude/settings.json
 */
export function getClaudeSettingsPath(global: boolean): string {
  const base = global ? os.homedir() : process.cwd();
  return path.join(base, '.claude', 'settings.json');
}

/** All known skill cluster names */
export const SKILL_CLUSTERS = ['marketing', 'sales', 'strategy'] as const;
export type SkillCluster = (typeof SKILL_CLUSTERS)[number];
