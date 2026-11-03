"use client";

import Link from "next/link";
import { useState } from "react";
import { EyeIcon, PlugIcon, PlusIcon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { formatNumber } from "@/admin/lib/format";
import { connectionTypeLabels, type DefinedConnection } from "@/lib/connections";
import { ConnectionDialog } from "./connection-dialog";
import { useConnections } from "./connections-provider";

export function ConnectionsPageContent() {
  const { connections } = useConnections();
  const { groups } = useDirectory();
  const [creating, setCreating] = useState(false);
  const groupNames = (item: DefinedConnection) => item.groupIds.map((id) => groups.find((g) => g.id === id)?.name).filter(Boolean).join("، ") || "هیچ گروهی";
  const createButton = <Button onClick={() => setCreating(true)}><PlusIcon aria-hidden />اتصال تازه</Button>;

  const columns: DataTableColumn<DefinedConnection>[] = [
    {
      id: "name",
      header: "اتصال",
      cell: (c) => (
        <span className="flex flex-col items-start">
          <Link href={`/admin/connections/${c.id}`} className="rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">{c.name}</Link>
          {c.domain ? <span className="text-body-sm text-muted-foreground">{c.domain}</span> : null}
        </span>
      ),
    },
    { id: "type", header: "نوع", hideBelow: "lg", className: "text-muted-foreground", cell: (c) => connectionTypeLabels[c.type] },
    { id: "tools", header: "ابزارها", cell: (c) => (c.tools.length ? `${formatNumber(c.tools.length)} ابزار` : <span className="text-warning-foreground dark:text-warning">بدون ابزار</span>) },
    { id: "groups", header: "دسترسی", hideBelow: "xl", className: "text-muted-foreground", cell: groupNames },
    { id: "status", header: "وضعیت", cell: (c) => (c.active ? <Badge variant="success">فعال</Badge> : <Badge variant="secondary">غیرفعال</Badge>) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="اتصال‌ها" description="اتصال‌ها را شما تعریف می‌کنید و گروه‌ها دسترسی می‌گیرند؛ کاربران فقط اتصال‌های مجاز خود را می‌بینند و استفاده می‌کنند." action={connections.length > 0 ? createButton : undefined} />
      {connections.length === 0 ? (
        <EmptyState icon={<PlugIcon />} title="هنوز اتصالی تعریف نشده است" description="اولین اتصال را به یکی از سیستم‌های سازمان بسازید، ابزارهایش را تعیین کنید و به گروه‌ها دسترسی بدهید." action={createButton} />
      ) : (
        <DataTable
          label="فهرست اتصال‌ها"
          rows={connections}
          columns={columns}
          getRowId={(c) => c.id}
          getRowLabel={(c) => `اتصال ${c.name}`}
          getRowActions={(c) => [[{ label: "مشاهده", icon: <EyeIcon aria-hidden />, inline: true, href: `/admin/connections/${c.id}` }]]}
          defaultPageSize={10}
          renderCard={(c, actions) => (
            <>
              <div className="flex items-start justify-between gap-3">
                <span className="font-medium">{c.name}</span>
                {actions}
              </div>
              <p className="text-body-sm text-muted-foreground">{connectionTypeLabels[c.type]} · {formatNumber(c.tools.length)} ابزار · {c.active ? "فعال" : "غیرفعال"}</p>
            </>
          )}
        />
      )}
      <ConnectionDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}
