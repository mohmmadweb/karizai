import { formatNumber } from "@/admin/lib/format";
import type { ComponentHealth, DashboardAlert, ModelSpeed, Thresholds } from "../types";
import { complexities, complexityLabels, formatDuration } from "./model-speed";

/** One alert per down component, per slow time to first word, per slow request, and one for errors. */
export function computeAlerts(input: {
  components: ComponentHealth[];
  speeds: ModelSpeed[];
  errorRate: number;
  thresholds: Thresholds;
  nowIso: string;
}): DashboardAlert[] {
  const { components, speeds, errorRate, thresholds, nowIso } = input;
  const alerts: DashboardAlert[] = [];
  for (const c of components.filter((x) => x.status === "down")) {
    alerts.push({ id: `down-${c.id}`, type: "down", component: c.name, value: "قطع", at: c.checkedAt });
  }
  for (const s of speeds) {
    if (s.ttft.p95Ms > thresholds.ttftP95Sec * 1000) {
      alerts.push({ id: `ttft-${s.modelId}`, type: "ttft", component: s.name, value: formatDuration(s.ttft.p95Ms), at: nowIso });
    }
    for (const c of complexities) {
      if (s.e2e[c].p95Ms > thresholds.e2eP95Sec * 1000) {
        alerts.push({
          id: `e2e-${s.modelId}-${c}`,
          type: "e2e",
          component: `${s.name} (${complexityLabels[c]})`,
          value: formatDuration(s.e2e[c].p95Ms),
          at: nowIso,
        });
      }
    }
  }
  if (errorRate * 100 > thresholds.errorRatePercent) {
    alerts.push({
      id: "error-rate",
      type: "errorRate",
      component: "کل سامانه",
      value: `${formatNumber(errorRate * 100, { maximumFractionDigits: 1 })}٪`,
      at: nowIso,
    });
  }
  return alerts;
}

export const alertTypeLabels = {
  down: "جزء قطع",
  ttft: "تأخیر اولین کلمه",
  e2e: "تأخیر زمان کامل",
  errorRate: "نرخ خطا",
} as const;
