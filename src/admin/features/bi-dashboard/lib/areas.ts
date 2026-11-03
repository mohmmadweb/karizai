import type { AreaKpi, BusinessArea, IndicatorStatus } from "../types";
import { evaluateFormula, variableValues } from "./formula";

/** The figure computed from the values read and the formula; `null` when the formula does not work. */
export function kpiValue(kpi: AreaKpi): number | null {
  const result = evaluateFormula(kpi.source.formula, variableValues(kpi.source.variables));
  return result.ok ? result.value : null;
}

/** Same three words as the indicator cards: inside the target, within 10% of it, or beyond. */
export function kpiStatus(kpi: AreaKpi): IndicatorStatus {
  const value = kpiValue(kpi);
  if (value === null) return "near";
  const { target, better } = kpi;
  if (better === "higher") return value >= target ? "ok" : value >= target * 0.9 ? "near" : "out";
  return value <= target ? "ok" : value <= target * 1.1 ? "near" : "out";
}

const rank: Record<IndicatorStatus, number> = { ok: 0, near: 1, out: 2 };

/** The worst status among the figures of an area. */
export function areaStatus(area: BusinessArea): IndicatorStatus {
  return area.kpis.map(kpiStatus).reduce((worst, s) => (rank[s] > rank[worst] ? s : worst), "ok" as IndicatorStatus);
}

/** The weekly series with its last week replaced by the figure just computed. */
export function seriesOf(kpi: AreaKpi): number[] | null {
  const value = kpiValue(kpi);
  if (!kpi.series || value === null) return null;
  return [...kpi.series.slice(0, -1), value];
}

/** Change since the previous week, and whether that change is good. */
export function weeklyChange(kpi: AreaKpi): { delta: number; good: boolean } | null {
  const s = seriesOf(kpi);
  if (!s || s.length < 2) return null;
  const delta = Math.round((s[s.length - 1] - s[s.length - 2]) * 100) / 100;
  return { delta, good: delta === 0 || (kpi.better === "higher") === delta > 0 };
}
