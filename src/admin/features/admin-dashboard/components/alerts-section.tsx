import { BellOffIcon, CircleAlertIcon, ClockIcon, GaugeIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/admin/lib/format";
import { alertTypeLabels } from "../lib/alerts";
import type { AlertType, DashboardAlert } from "../types";

const icons: Record<AlertType, typeof ClockIcon> = {
  down: CircleAlertIcon,
  ttft: ClockIcon,
  e2e: ClockIcon,
  errorRate: GaugeIcon,
};

export function AlertsSection({ alerts }: { alerts: DashboardAlert[] }) {
  if (alerts.length === 0) {
    return <EmptyState icon={<BellOffIcon aria-hidden />} title="هشدار فعالی نیست" description="هیچ جزء قطعی و هیچ تأخیر بالایی دیده نمی‌شود." />;
  }
  return (
    <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card" aria-label="هشدارهای فعال">
      {alerts.map((a) => {
        const Icon = icons[a.type];
        return (
          <li key={a.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col items-start gap-1">
              <Badge variant={a.type === "down" ? "destructive" : "warning"}>
                <Icon aria-hidden />
                {alertTypeLabels[a.type]}
              </Badge>
              <span className="break-words text-body-sm font-medium text-foreground">{a.component}</span>
            </div>
            <div className="flex flex-col gap-0.5 text-body-sm sm:items-end">
              <span className="tabular-nums text-foreground">{a.value}</span>
              <span className="text-caption text-muted-foreground">{formatDateTime(a.at)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
