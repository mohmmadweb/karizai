"use client";

import { RefreshCwIcon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatNumber, formatPercent } from "@/admin/lib/format";
import type { ProviderCredit } from "../types";

type Props = {
  credits: ProviderCredit[];
  checking: Record<string, boolean | undefined>;
  onCheck: (providerId: string) => void;
};

const tokens = (value: number) => `${formatNumber(value)} توکن`;

function Figures({ c }: { c: ProviderCredit }) {
  if (c.state === "noCredit") return <span className="text-muted-foreground">اعتبار ندارد</span>;
  if (c.state === "unavailable") return <span className="text-muted-foreground">در دسترس نیست</span>;
  return (
    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-caption text-muted-foreground">
      <div><dt>خریداری‌شده</dt><dd className="text-foreground tabular-nums">{tokens(c.purchasedTokens)}</dd></div>
      <div><dt>طبق تأمین‌کننده</dt><dd className="text-foreground tabular-nums">{tokens(c.reportedTokens)}</dd></div>
      <div><dt>طبق ثبت سامانه</dt><dd className="text-foreground tabular-nums">{tokens(c.recordedTokens)}</dd></div>
      <div><dt>تفاوت</dt><dd className="text-foreground tabular-nums">{formatPercent(Math.abs(c.difference))}</dd></div>
    </dl>
  );
}

function Match({ c }: { c: ProviderCredit }) {
  if (c.state !== "available") return <span aria-hidden>—</span>;
  return (
    <span className="flex flex-col items-start gap-1">
      <Badge variant={c.matches ? "success" : "warning"}>{c.matches ? "مطابق" : "اختلاف"}</Badge>
      {c.matches ? null : (
        <span className="text-caption text-muted-foreground">گزارش مصرف را با تأمین‌کننده مقایسه کنید.</span>
      )}
    </span>
  );
}

function CheckButton({ c, busy, onCheck }: { c: ProviderCredit; busy: boolean; onCheck: () => void }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        variant="outline"
        size="sm"
        loading={busy}
        disabled={c.state !== "available"}
        onClick={onCheck}
        aria-label={`بررسی دوباره‌ی ${c.name}`}
      >
        <RefreshCwIcon data-icon="inline-start" aria-hidden />
        بررسی دوباره
      </Button>
      {c.state === "available" ? (
        <span className="text-caption text-muted-foreground">آخرین بررسی: {formatDateTime(c.checkedAt)}</span>
      ) : null}
    </div>
  );
}

export function ProviderCredits({ credits, checking, onCheck }: Props) {
  if (credits.length === 0) {
    return (
      <EmptyState
        title="ارائه‌دهنده‌ای ثبت نشده است"
        description="پس از ثبت ارائه‌دهنده در بخش مدل‌ها، اعتبار آن اینجا دیده می‌شود."
      />
    );
  }
  const columns: DataTableColumn<ProviderCredit>[] = [
    { id: "name", header: "ارائه‌دهنده", cell: (c) => <span className="font-medium text-foreground">{c.name}</span> },
    { id: "figures", header: "اعتبار و مصرف", cell: (c) => <Figures c={c} /> },
    { id: "status", header: "وضعیت", cell: (c) => <Match c={c} /> },
    { id: "check", header: "بررسی", cell: (c) => <CheckButton c={c} busy={!!checking[c.providerId]} onCheck={() => onCheck(c.providerId)} /> },
  ];
  return (
    <DataTable
      label="اعتبار تأمین‌کننده‌ها"
      rows={credits}
      columns={columns}
      getRowId={(c) => c.providerId}
      getRowLabel={(c) => `ارائه‌دهنده ${c.name}`}
      defaultPageSize={5}
      renderCard={(c) => (
        <>
          <p className="font-medium text-foreground">{c.name}</p>
          <Figures c={c} />
          <Match c={c} />
          <CheckButton c={c} busy={!!checking[c.providerId]} onCheck={() => onCheck(c.providerId)} />
        </>
      )}
    />
  );
}
