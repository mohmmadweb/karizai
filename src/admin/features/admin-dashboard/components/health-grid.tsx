import { CircleAlertIcon, CircleCheckIcon, CircleHelpIcon, TriangleAlertIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/admin/lib/format";
import { groupLabels, groupOrder, statusLabels } from "../lib/health";
import { formatDuration } from "../lib/model-speed";
import type { ComponentHealth, HealthStatus } from "../types";

const variant = { healthy: "success", slow: "warning", down: "destructive", unknown: "secondary" } as const;
const icons = { healthy: CircleCheckIcon, slow: TriangleAlertIcon, down: CircleAlertIcon, unknown: CircleHelpIcon };

function StatusBadge({ status }: { status: HealthStatus }) {
  const Icon = icons[status];
  return (
    <Badge variant={variant[status]}>
      <Icon aria-hidden />
      {statusLabels[status]}
    </Badge>
  );
}

function Row({ c }: { c: ComponentHealth }) {
  const dash = "—";
  return (
    <li className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 break-words text-body-sm font-medium text-foreground">{c.name}</span>
        <StatusBadge status={c.status} />
      </div>
      <dl className="grid grid-cols-3 gap-2 text-caption text-muted-foreground">
        <div>
          <dt>میانه</dt>
          <dd className="text-foreground tabular-nums">{c.medianMs === null ? dash : formatDuration(c.medianMs)}</dd>
        </div>
        <div>
          <dt>صدک ۹۵</dt>
          <dd className="text-foreground tabular-nums">{c.p95Ms === null ? dash : formatDuration(c.p95Ms)}</dd>
        </div>
        <div>
          <dt>آخرین بررسی</dt>
          <dd className="text-foreground">{formatDateTime(c.checkedAt)}</dd>
        </div>
      </dl>
    </li>
  );
}

/** Components grouped by kind; each shows its state in text and an icon. */
export function HealthGrid({ components }: { components: ComponentHealth[] }) {
  const groups = groupOrder
    .map((id) => ({ id, items: components.filter((c) => c.group === id) }))
    .filter((g) => g.items.length > 0);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {groups.map((g) => (
        <Card key={g.id} className="h-fit">
          <CardHeader>
            <CardTitle>{groupLabels[g.id]}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y divide-border" aria-label={groupLabels[g.id]}>
              {g.items.map((c) => <Row key={c.id} c={c} />)}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
