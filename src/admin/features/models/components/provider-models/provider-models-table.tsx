"use client";

import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { formatDate, formatDateTime, formatNumber } from "@/admin/lib/format";
import { isNewModel } from "../../lib/selectors";
import { getModelMetrics } from "../../data/model-metrics";
import type { AiModel } from "../../types";
import { ModelFlags } from "../models/model-badges";
import { ModelEnabledSwitch } from "../models/model-enabled-switch";

const linkClass =
  "rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

const dash = <span className="text-muted-foreground">—</span>;

function cost(model: AiModel) {
  if (model.costInputPerMillion === null && model.costOutputPerMillion === null) return dash;
  const part = (value: number | null) => (value === null ? "—" : formatNumber(value));
  return (
    <span className="flex flex-col text-body-sm">
      <span>ورودی: {part(model.costInputPerMillion)}</span>
      <span>خروجی: {part(model.costOutputPerMillion)}</span>
    </span>
  );
}

/** Models of one provider with the figures the admin needs to judge each of them. */
export function ProviderModelsTable({ models, setAside }: { models: AiModel[]; setAside: boolean }) {
  const metricsOf = (model: AiModel) => getModelMetrics(model.id, model.enabled);

  const columns: DataTableColumn<AiModel>[] = [
    {
      id: "name",
      header: "مدل",
      cell: (m) => (
        <span className="flex flex-col items-start gap-1">
          <Link href={`/admin/models/${m.id}`} className={linkClass}>{m.displayName}</Link>
          <ModelFlags selfHosted={m.selfHosted} setAside={setAside} isNew={isNewModel(m)} />
        </span>
      ),
    },
    { id: "enabled", header: "وضعیت", cell: (m) => <ModelEnabledSwitch model={m} /> },
    { id: "released", header: "تاریخ انتشار", hideBelow: "lg", cell: (m) => (m.releasedAt ? formatDate(m.releasedAt, { dateStyle: "medium" }) : dash) },
    {
      id: "latency",
      header: "تأخیر (میانه)",
      align: "end",
      cell: (m) => (m.enabled ? `${formatNumber(metricsOf(m).latencyMs)} میلی‌ثانیه` : dash),
    },
    {
      id: "used",
      header: "مصرف ۲۴ ساعت اخیر",
      align: "end",
      cell: (m) => (m.enabled ? `${formatNumber(metricsOf(m).tokensUsed24h)} توکن` : dash),
    },
    {
      id: "remaining",
      header: "توکن باقی‌مانده",
      align: "end",
      hideBelow: "lg",
      cell: (m) => {
        const left = metricsOf(m).tokensRemaining;
        return left === null ? dash : `${formatNumber(left)} توکن`;
      },
    },
    { id: "cost", header: "هزینه در هر میلیون توکن", hideBelow: "xl", cell: cost },
    {
      id: "last",
      header: "آخرین استفاده",
      hideBelow: "xl",
      cell: (m) => {
        const at = metricsOf(m).lastUsedAt;
        return at ? formatDateTime(at) : dash;
      },
    },
    {
      id: "context",
      header: "طول پنجره‌ی متن",
      align: "end",
      hideBelow: "xl",
      cell: (m) => (m.contextWindow === null ? dash : `${formatNumber(m.contextWindow)} توکن`),
    },
  ];

  return (
    <DataTable
      label="فهرست مدل‌های ارائه‌دهنده"
      rows={models}
      columns={columns}
      getRowId={(m) => m.id}
      getRowLabel={(m) => `مدل ${m.displayName}`}
      getRowActions={(m) => [[{ label: "مشاهده جزئیات", icon: <EyeIcon aria-hidden />, inline: true, href: `/admin/models/${m.id}` }]]}
      defaultPageSize={10}
      renderCard={(m, actions) => {
        const metrics = metricsOf(m);
        return (
          <>
            <div className="flex items-start justify-between gap-3">
              <Link href={`/admin/models/${m.id}`} className={linkClass}>{m.displayName}</Link>
              {actions}
            </div>
            <ModelFlags selfHosted={m.selfHosted} setAside={setAside} isNew={isNewModel(m)} />
            <ModelEnabledSwitch model={m} />
            {m.enabled ? (
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-body-sm">
                <dt className="text-muted-foreground">تأخیر</dt><dd>{formatNumber(metrics.latencyMs)} میلی‌ثانیه</dd>
                <dt className="text-muted-foreground">مصرف ۲۴ ساعت</dt><dd>{formatNumber(metrics.tokensUsed24h)} توکن</dd>
                <dt className="text-muted-foreground">باقی‌مانده</dt><dd>{metrics.tokensRemaining === null ? "—" : `${formatNumber(metrics.tokensRemaining)} توکن`}</dd>
              </dl>
            ) : null}
          </>
        );
      }}
    />
  );
}
