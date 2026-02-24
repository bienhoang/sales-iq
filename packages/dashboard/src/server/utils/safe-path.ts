import path from 'node:path';

/** Resolve user-supplied path against a base directory. Returns null if traversal detected. */
export function safePath(base: string, userInput: string): string | null {
  if (userInput.includes('..')) return null;
  const resolvedBase = path.resolve(base);
  const resolved = path.resolve(resolvedBase, userInput);
  if (!resolved.startsWith(resolvedBase + path.sep) && resolved !== resolvedBase) {
    return null;
  }
  return resolved;
}
