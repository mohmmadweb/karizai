"use client";

import Link from "next/link";
import { EyeIcon, PowerIcon, PowerOffIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type {
  DataTableActionGroup,
  DataTableColumn,
} from "@/admin/components/shared/data-table/types";
import { useDataSources } from "../../hooks/use-data-sources";
import { useDeleteSource } from "../../hooks/use-delete-source";
import { databaseTypeLabel } from "../../lib/database-types";
import { canActivate } from "../../lib/selectors";
import type { DataSource } from "../../types";
import { ActiveBadge, TestResultBadge } from "./source-badges";

const linkClass =
  "rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

export function SourcesList({ sources }: { sources: DataSource[] }) {
  const { setActive } = useDataSources();
  const deleteSource = useDeleteSource();

  const columns: DataTableColumn<DataSource>[] = [
    {
      id: "name",
      header: "اتصال",
      cell: (s) => (
        <Link href={`/admin/data/${s.id}`} className={linkClass}>
          {s.name}
        </Link>
      ),
    },
    {
      id: "type",
      header: "نوع انبار داده",
      hideBelow: "lg",
      className: "text-muted-foreground",
      cell: (s) => <bdi dir="ltr">{databaseTypeLabel(s.type)}</bdi>,
    },
    { id: "test", header: "آزمایش اتصال", cell: (s) => <TestResultBadge result={s.testResult} /> },
    { id: "active", header: "وضعیت", cell: (s) => <ActiveBadge active={s.active} /> },
  ];

  function actionsOf(s: DataSource): DataTableActionGroup[] {
    const toggle = s.active
      ? {
          label: "غیرفعال‌کردن",
          icon: <PowerOffIcon aria-hidden />,
          onSelect: () => {
            setActive(s.id, false);
            toast.success("اتصال غیرفعال شد.");
          },
          confirm: {
            title: `اتصال «${s.name}» غیرفعال شود؟`,
            description: "دستیار هوش تجاری دیگر از این انبار داده جواب نمی‌دهد. ساختار و دسترسی‌ها می‌ماند.",
            confirmLabel: "غیرفعال‌کردن",
          },
        }
      : {
          label: canActivate(s) ? "فعال‌کردن" : "فعال‌کردن (ابتدا آزمایش کنید)",
          icon: <PowerIcon aria-hidden />,
          disabled: !canActivate(s),
          onSelect: () => {
            const result = setActive(s.id, true);
            if (result.ok) toast.success("اتصال فعال شد.");
            else toast.error(result.error);
          },
        };
    return [
      [{ label: "مشاهده جزئیات", icon: <EyeIcon aria-hidden />, inline: true, href: `/admin/data/${s.id}` }],
      [toggle],
      [
        {
          label: "حذف",
          icon: <Trash2Icon aria-hidden />,
          destructive: true,
          onSelect: () => {
            deleteSource(s.id);
            toast.success("اتصال حذف شد.");
          },
          confirm: {
            title: `اتصال «${s.name}» حذف شود؟`,
            description:
              "توضیح‌های جدول‌ها و ستون‌ها، اسکیماها و دسترسی‌هایی که برای این اتصال تعیین شده هم برداشته می‌شود.",
            confirmLabel: "حذف",
          },
        },
      ],
    ];
  }

  return (
    <DataTable
      label="فهرست اتصال‌ها"
      rows={sources}
      columns={columns}
      getRowId={(s) => s.id}
      getRowLabel={(s) => `اتصال ${s.name}`}
      getRowActions={actionsOf}
      defaultPageSize={5}
      renderCard={(s, actions) => (
        <>
          <div className="flex items-start justify-between gap-3">
            <Link href={`/admin/data/${s.id}`} className={linkClass}>
              {s.name}
            </Link>
            {actions}
          </div>
          <p className="text-body-sm text-muted-foreground">
            <bdi dir="ltr">{databaseTypeLabel(s.type)}</bdi>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <TestResultBadge result={s.testResult} />
            <ActiveBadge active={s.active} />
          </div>
        </>
      )}
    />
  );
}
