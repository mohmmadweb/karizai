import { formatNumber } from "@/lib/format";

/** «1.3» → «1.4». A missing version counts as «1.0». */
export function nextVersion(version: string | undefined): string {
  const [major, minor] = (version ?? "1.0").split(".").map((part) => Number(part) || 0);
  return `${major || 1}.${minor + 1}`;
}

/** «1.3» → «۱.۳». */
export function formatVersion(version: string | undefined): string {
  return (version ?? "1.0").split(".").map((part) => formatNumber(Number(part) || 0)).join(".");
}

/** 0.92 → «۹۲٪». */
export function formatScore(score: number): string {
  return `${formatNumber(Math.round(score * 100))}٪`;
}
