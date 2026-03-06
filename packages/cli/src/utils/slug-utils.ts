import slugify from 'slugify';

/** Convert a name to URL/directory-safe slug. Handles Vietnamese diacritics. */
export function toSlug(name: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (slugify as any)(name, { lower: true, strict: true, locale: 'vi' });
}
