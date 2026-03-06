import path from 'node:path';

/** Resolve user-supplied path against a base directory. Returns null if traversal detected. */
export function safePath(base: string, userInput: string): string | null {
  // Block null bytes
  if (userInput.includes('\0')) return null;

  const resolvedBase = path.resolve(base);
  const resolved = path.resolve(resolvedBase, path.normalize(userInput));

  // Must be within base directory
  const relative = path.relative(resolvedBase, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  return resolved;
}
