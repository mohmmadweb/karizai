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

/** First `${prefix}-${n}` not used yet, so new records get ids the static build already has pages for. */
export function nextFreeId(prefix: string, usedIds: string[]): string {
  const used = new Set(usedIds);
  let n = 1;
  while (used.has(`${prefix}-${n}`)) n += 1;
  return `${prefix}-${n}`;
}

/** False on the static demo (GitHub Pages): there is no server, so `/api` calls are skipped. */
export const hasServer = process.env.NEXT_PUBLIC_STATIC_EXPORT !== "1";
