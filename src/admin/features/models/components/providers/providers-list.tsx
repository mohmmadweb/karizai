"use client";

import Link from "@/components/shared/app-link";
import { EyeIcon, PencilIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type {
  DataTableActionGroup,
  DataTableColumn,
} from "@/admin/components/shared/data-table/types";
import { useModels } from "../../hooks/use-models";
import { useDeleteProvider } from "../../hooks/use-delete-provider";
import { modelsOfProvider, nextSyncAt, syncLabels } from "../../lib/selectors";
import { formatDateTime } from "@/admin/lib/format";
import type { ModelProvider } from "../../types";
import { ProviderStatusBadge } from "../models/model-badges";
import { ProviderModelsCell } from "./provider-models-cell";

type ProvidersListProps = { onEdit: (provider: ModelProvider) => void };

export function ProvidersList({ onEdit }: ProvidersListProps) {
  const { providers, models, fetchStatus, fetchModels } = useModels();
  const deleteProvider = useDeleteProvider();
  const countOf = (p: ModelProvider) => modelsOfProvider(p.id, models).length;

  const columns: DataTableColumn<ModelProvider>[] = [
    {
      id: "name",
      header: "ارائه‌دهنده",
      cell: (p) => (
        <Link href={`/admin/models/provider/${p.id}`} className="rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
          {p.name}
        </Link>
      ),
    },
    {
      id: "url",
      header: "نشانی پایه",
      hideBelow: "xl",
      className: "text-muted-foreground",
      cell: (p) => (
        <bdi dir="ltr" title={p.baseUrl} className="block max-w-52 truncate font-mono">
          {p.baseUrl}
        </bdi>
      ),
    },
    { id: "status", header: "وضعیت", cell: (p) => <ProviderStatusBadge status={p.status} /> },
    { id: "models", header: "مدل‌ها", cell: (p) => <ProviderModelsCell provider={p} count={countOf(p)} /> },
    {
      id: "sync",
      header: "همگام‌سازی زمان‌بندی‌شده",
      hideBelow: "lg",
      cell: (p) => {
        const next = nextSyncAt(p);
        return (
          <span className="flex flex-col text-body-sm">
            <span>{syncLabels[p.syncEvery ?? "off"]}</span>
            {next ? <span className="text-caption text-muted-foreground">بعدی: {formatDateTime(next)}</span> : null}
          </span>
        );
      },
    },
  ];

  function actionsOf(p: ModelProvider): DataTableActionGroup[] {
    const count = countOf(p);
    return [
      [
        { label: "مشاهده", icon: <EyeIcon aria-hidden />, inline: true, href: `/admin/models/provider/${p.id}` },
        {
          label: "به‌روزرسانی فهرست مدل‌ها",
          icon: <RefreshCwIcon aria-hidden />,
          inline: true,
          iconOnly: true,
          disabled: fetchStatus[p.id] === "fetching",
          onSelect: () => void fetchModels(p.id, p.baseUrl),
        },
        { label: "ویرایش", icon: <PencilIcon aria-hidden />, onSelect: () => onEdit(p) },
      ],
      [
        {
          label: "حذف",
          icon: <Trash2Icon aria-hidden />,
          destructive: true,
          onSelect: () => {
            deleteProvider(p.id);
            toast.success("ارائه‌دهنده حذف شد.");
          },
          confirm: {
            title: `ارائه‌دهنده‌ی «${p.name}» حذف شود؟`,
            description: `این ارائه‌دهنده ${count.toLocaleString("fa-IR")} مدل دارد. همه‌ی این مدل‌ها و دسترسی‌هایی که برایشان تعیین شده هم برداشته می‌شود.`,
            confirmLabel: "حذف",
          },
        },
      ],
    ];
  }

  return (
    <DataTable
      label="فهرست ارائه‌دهنده‌ها"
      rows={providers}
      columns={columns}
      getRowId={(p) => p.id}
      getRowLabel={(p) => `ارائه‌دهنده ${p.name}`}
      getRowActions={actionsOf}
      defaultPageSize={5}
      renderCard={(p, actions) => (
        <>
          <div className="flex items-start justify-between gap-3">
            <span className="font-medium">{p.name}</span>
            <div className="flex items-center gap-1">
              <ProviderStatusBadge status={p.status} />
              {actions}
            </div>
          </div>
          <p className="truncate text-body-sm text-muted-foreground">
            <bdi dir="ltr" className="font-mono">{p.baseUrl}</bdi>
          </p>
          <ProviderModelsCell provider={p} count={countOf(p)} />
        </>
      )}
    />
  );
}
