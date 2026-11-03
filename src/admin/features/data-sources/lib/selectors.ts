import type { DataSource } from "../types";

/** Same letters typed with Arabic keyboards match Persian ones. */
function normalize(value: string) {
  return value.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();
}

export function filterSources(sources: DataSource[], query: string): DataSource[] {
  const q = normalize(query);
  if (!q) return sources;
  return sources.filter((s) => normalize(s.name).includes(q));
}

export const canActivate = (source: DataSource) => source.testResult === "success";
