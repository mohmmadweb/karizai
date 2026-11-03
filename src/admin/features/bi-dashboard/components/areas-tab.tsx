"use client";

import { useState } from "react";
import { getReportNow } from "@/admin/features/usage-report/data/usage-records";
import { formatDateTime, formatNumber } from "@/admin/lib/format";
import { areaStatus } from "../lib/areas";
import type { AreaKpi } from "../types";
import { useBi } from "./bi-provider";
import { KpiDialog } from "./kpi-dialog";
import { AreaCard } from "./area-card";

/** The thirteen business areas of the organization, each with its figures and a weekly trend. */
export function AreasTab() {
  const { rows, areas } = useBi();
  const [editing, setEditing] = useState<AreaKpi | null>(null);
  const statuses = areas.map(areaStatus);
  const summary = [
    { label: "حوزه‌های خارج از هدف", value: statuses.filter((s) => s === "out").length, lead: true },
    { label: "نزدیک به هدف", value: statuses.filter((s) => s === "near").length },
    { label: "در هدف", value: statuses.filter((s) => s === "ok").length },
    { label: "شاخص‌های مجاز خارج از حد", value: rows.filter((r) => r.status === "out").length },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
          {summary.map((item) => (
            <li key={item.label} className="flex flex-col justify-between gap-2 bg-card p-4">
              <span className="text-body-sm text-muted-foreground">{item.label}</span>
              <span className={`tabular-nums ${item.lead ? "text-h2" : "text-h4"} ${item.lead && item.value > 0 ? "text-destructive" : ""}`}>{formatNumber(item.value)}</span>
            </li>
          ))}
        </ul>
        <p className="text-caption text-muted-foreground">مقدارها در {formatDateTime(getReportNow())} خوانده شده‌اند؛ نمودار هر حوزه روند ۱۲ هفته‌ی اخیر و خط چین هدف است.</p>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => <li key={area.id}><AreaCard area={area} onEdit={setEditing} /></li>)}
      </ul>
      <KpiDialog kpi={editing} onOpenChange={(open) => !open && setEditing(null)} />
    </div>
  );
}
