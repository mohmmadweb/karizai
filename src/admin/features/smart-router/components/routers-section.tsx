"use client";

import Link from "@/components/shared/app-link";
import { useState } from "react";
import { EyeIcon, PlusIcon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { formatNumber } from "@/admin/lib/format";
import type { SmartRouter } from "@/lib/smart-routing";
import { RouterDialog } from "./router-dialog";
import { useRouters } from "./routers-provider";

/** The smart routers on the models page. The default one is what users see as «خودکار». */
export function RoutersSection() {
  const { routers } = useRouters();
  const { groups } = useDirectory();
  const [creating, setCreating] = useState(false);
  const groupNames = (router: SmartRouter) =>
    router.isDefault ? "همه‌ی کاربران" : router.groupIds.map((id) => groups.find((g) => g.id === id)?.name).filter(Boolean).join("، ") || "هیچ گروهی";

  const columns: DataTableColumn<SmartRouter>[] = [
    {
      id: "name",
      header: "مسیریاب هوشمند",
      cell: (r) => (
        <span className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/models/router/${r.id}`} className="rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">{r.name}</Link>
          {r.isDefault ? <Badge variant="info">پیش‌فرض</Badge> : null}
        </span>
      ),
    },
    { id: "members", header: "مدل‌ها", cell: (r) => (r.members.length ? `${formatNumber(r.members.length)} مدل` : <span className="text-warning-foreground dark:text-warning">هنوز مدلی ندارد</span>) },
    { id: "groups", header: "برای چه کسانی", hideBelow: "lg", className: "text-muted-foreground", cell: groupNames },
  ];

  return (
    <section className="flex flex-col gap-4" aria-label="مسیریاب‌های هوشمند">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3">مسیریاب‌های هوشمند</h2>
          <p className="max-w-reading text-body-sm text-muted-foreground">وقتی کاربر «خودکار» را انتخاب می‌کند، مسیریاب بر اساس پیچیدگی پرسش بهترین مدل را از مدل‌های همین فهرست برمی‌دارد. می‌توانید برای گروه‌های مختلف مسیریاب جدا با مدل‌های جدا بسازید.</p>
        </div>
        <Button variant="outline" onClick={() => setCreating(true)}><PlusIcon aria-hidden />مسیریاب تازه</Button>
      </div>
      <DataTable
        label="فهرست مسیریاب‌های هوشمند"
        rows={routers}
        columns={columns}
        getRowId={(r) => r.id}
        getRowLabel={(r) => `مسیریاب ${r.name}`}
        getRowActions={(r) => [[{ label: "مشاهده", icon: <EyeIcon aria-hidden />, inline: true, href: `/admin/models/router/${r.id}` }]]}
        defaultPageSize={5}
        renderCard={(r, actions) => (
          <>
            <div className="flex items-start justify-between gap-3">
              <span className="flex flex-wrap items-center gap-2 font-medium">{r.name}{r.isDefault ? <Badge variant="info">پیش‌فرض</Badge> : null}</span>
              {actions}
            </div>
            <p className="text-body-sm text-muted-foreground">{formatNumber(r.members.length)} مدل · {groupNames(r)}</p>
          </>
        )}
      />
      <RouterDialog open={creating} onOpenChange={setCreating} />
    </section>
  );
}
