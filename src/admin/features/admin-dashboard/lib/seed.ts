/** Stable number from an id, so the same item always shows the same figures. */
export function seed(id: string) {
  return [...id].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 9973, 7);
}

/** The «now» of the sample data, plus whole minutes. */
export function minutesAfter(nowIso: string, minutes: number) {
  return new Date(new Date(nowIso).getTime() + minutes * 60_000).toISOString();
}
