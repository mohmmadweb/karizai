/**
 * Static hosting (GitHub Pages) needs every dynamic route built ahead of time.
 * Mock records have fixed ids; records made during a visit get counter ids
 * like `conv-new-3`, so the first few of those are built too.
 */
export function runtimeIds(prefix: string, count = 80): string[] {
  return Array.from({ length: count }, (_, index) => `${prefix}-${index + 1}`);
}

export function toParams<K extends string>(key: K, ids: string[]): Record<K, string>[] {
  return [...new Set(ids)].map((id) => ({ [key]: id }) as Record<K, string>);
}
