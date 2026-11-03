"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { getDataSourceLevels } from "@/admin/features/policies/data/policy-models";
import { Badge } from "@/components/ui/badge";
import type { OrgAgent } from "../types";

const sourceName = new Map(getDataSourceLevels().map((s) => [s.id, s.name]));
const originLabels = { personal: "شخصی", shared: "اشتراکی", official: "رسمی سازمان" } as const;
const n = (v: number) => v.toLocaleString("fa-IR");

function StatusBadge({ status }: { status: OrgAgent["status"] }) {
  if (status === "active") return <Badge variant="success">فعال</Badge>;
  if (status === "pending") return <Badge variant="warning">در انتظار تأیید</Badge>;
  return <Badge variant="secondary">غیرفعال</Badge>;
}

/** All Agents of the organization with their policy at a glance. */
export function AgentsTable({ agents, onOpen }: { agents: OrgAgent[]; onOpen: (agent: OrgAgent) => void }) {
  const columns: DataTableColumn<OrgAgent>[] = [
    {
      id: "name",
      header: "عامل",
      cell: (a) => (
        <span className="flex flex-col">
          <span className="font-medium">{a.name}</span>
          <span className="text-caption text-muted-foreground">{originLabels[a.origin]} · {a.owner}</span>
        </span>
      ),
    },
    {
      id: "policy",
      header: "سیاست مدل",
      cell: (a) => (a.sensitive ? <Badge variant="warning">حساس · فقط مدل داخلی</Badge> : <Badge variant="outline">خودکار با پوشاندن</Badge>),
    },
    { id: "status", header: "وضعیت", cell: (a) => <StatusBadge status={a.status} /> },
    {
      id: "tools",
      header: "ابزارها",
      hideBelow: "lg",
      cell: (a) => {
        const on = a.tools.filter((t) => t.enabled);
        const writes = on.filter((t) => t.mode === "readwrite").length;
        return (
          <span className="text-body-sm">
            {on.length ? `${n(on.length)} ابزار` : "بدون ابزار"}
            {writes ? <span className="text-muted-foreground"> · {n(writes)} نوشتنی</span> : null}
          </span>
        );
      },
    },
    {
      id: "data",
      header: "دامنه‌ی داده",
      hideBelow: "xl",
      className: "max-w-64 text-body-sm text-muted-foreground",
      cell: (a) => (a.dataIds.length ? a.dataIds.map((id) => sourceName.get(id) ?? id).join("، ") : "—"),
    },
  ];

  return (
    <DataTable
      label="عامل‌های سازمان"
      rows={agents}
      columns={columns}
      getRowId={(a) => a.id}
      getRowLabel={(a) => `عامل ${a.name}`}
      getRowActions={(a) => [[{ label: "تنظیم اختیارات", icon: <SlidersHorizontalIcon aria-hidden />, inline: true, onSelect: () => onOpen(a) }]]}
      renderCard={(a, actions) => (
        <>
          <div className="flex items-start justify-between gap-3">
            <span className="font-medium">{a.name}</span>
            {actions}
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={a.status} />
            {a.sensitive ? <Badge variant="warning">حساس</Badge> : null}
          </div>
          <span className="text-caption text-muted-foreground">{a.owner} · {a.unit}</span>
        </>
      )}
    />
  );
}
