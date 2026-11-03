"use client";

import { useState } from "react";
import { PlusIcon, RotateCwIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/admin/lib/format";
import { simulateRequest } from "@/lib/simulate-request";
import { getDeliveries, getWebhooks, webhookEvents, type Delivery, type Webhook, type WebhookEvent } from "../data/webhooks";
import { WebhookDialog } from "./webhook-dialog";

const clock = () => new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(new Date());

function StatusBadge({ status }: { status: number | null }) {
  if (status === null) return <Badge variant="destructive">بدون پاسخ (۱۰ ثانیه)</Badge>;
  return <Badge variant={status < 300 ? "success" : "destructive"}><bdi dir="ltr">{status}</bdi>{status < 300 ? " موفق" : " خطا"}</Badge>;
}

/** Outgoing and incoming webhooks with masked secrets, and the delivery log with resend. */
export function WebhooksPageContent() {
  const [hooks, setHooks] = useState(getWebhooks);
  const [log, setLog] = useState(getDeliveries);
  const [tab, setTab] = useState<Webhook["direction"]>("out");
  const [creating, setCreating] = useState(false);
  const [resending, setResending] = useState<string | null>(null);
  const nameOf = (id: string) => hooks.find((h) => h.id === id)?.name ?? "حذف‌شده";

  async function resend(d: Delivery) {
    setResending(d.id);
    await simulateRequest(900);
    setLog((l) => [{ id: `dl-${Date.now()}`, at: clock(), webhookId: d.webhookId, event: d.event, status: 200, ms: 180 }, ...l]);
    setResending(null);
    toast.success("دوباره فرستاده شد؛ پاسخ ۲۰۰.");
  }

  const hookColumns: DataTableColumn<Webhook>[] = [
    { id: "name", header: "نام", cell: (h) => <span className="flex flex-col gap-0.5"><span className="font-medium">{h.name}</span><bdi dir="ltr" className="max-w-72 truncate text-caption text-muted-foreground">{h.url}</bdi></span> },
    {
      id: "events",
      header: tab === "out" ? "رویدادها" : "مقصد در کاریز",
      cell: (h) => (h.direction === "out"
        ? <span className="flex flex-wrap gap-1">{h.events.map((e) => <Badge key={e} variant="outline" title={webhookEvents[e as WebhookEvent]}><bdi dir="ltr">{e}</bdi></Badge>)}</span>
        : <span className="text-body-sm">{h.target}</span>),
    },
    { id: "secret", header: "رمز امضا", hideBelow: "lg", cell: (h) => <bdi dir="ltr" className="font-mono text-body-sm text-muted-foreground">whsec_••••{h.secretTail}</bdi> },
    { id: "active", header: "فعال", cell: (h) => <Switch checked={h.active} aria-label={`فعال بودن ${h.name}`} onCheckedChange={(c) => setHooks((l) => l.map((x) => (x.id === h.id ? { ...x, active: c } : x)))} /> },
  ];
  const logColumns: DataTableColumn<Delivery>[] = [
    { id: "at", header: "زمان", cell: (d) => <span className="tabular-nums">{d.at}</span> },
    { id: "hook", header: "وب‌هوک", cell: (d) => nameOf(d.webhookId) },
    { id: "event", header: "رویداد", cell: (d) => <bdi dir="ltr">{d.event}</bdi> },
    { id: "status", header: "پاسخ", cell: (d) => <StatusBadge status={d.status} /> },
    { id: "ms", header: "زمان پاسخ", align: "end", hideBelow: "lg", cell: (d) => `${formatNumber(d.ms)} میلی‌ثانیه` },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="وب‌هوک‌ها"
        description="رویدادهای کاریز را به سامانه‌های دیگر بفرستید یا رویداد آن‌ها را برای اجرای جریان‌ها و عامل‌ها بگیرید. هر درخواست با رمز امضا (HMAC) امضا می‌شود."
        action={<Button onClick={() => setCreating(true)}><PlusIcon aria-hidden />{tab === "out" ? "وب‌هوک خروجی" : "وب‌هوک ورودی"}</Button>}
      />
      <Tabs value={tab} onValueChange={(v) => setTab(v as Webhook["direction"])}>
        <TabsList>
          <TabsTrigger value="out">خروجی</TabsTrigger>
          <TabsTrigger value="in">ورودی</TabsTrigger>
        </TabsList>
        {(["out", "in"] as const).map((dir) => (
          <TabsContent key={dir} value={dir} className="pt-4">
            <DataTable
              label={dir === "out" ? "وب‌هوک‌های خروجی" : "وب‌هوک‌های ورودی"}
              rows={hooks.filter((h) => h.direction === dir)}
              columns={hookColumns}
              getRowId={(h) => h.id}
              getRowLabel={(h) => h.name}
              getRowActions={(h) => [[{ label: "حذف", icon: <Trash2Icon aria-hidden />, destructive: true, onSelect: () => setHooks((l) => l.filter((x) => x.id !== h.id)), confirm: { title: `«${h.name}» حذف شود؟`, description: "دیگر رویدادی از این راه فرستاده یا گرفته نمی‌شود.", confirmLabel: "حذف" } }]]}
              hidePagerWhenSingle
            />
          </TabsContent>
        ))}
      </Tabs>
      <section className="flex flex-col gap-3" aria-label="گزارش تحویل">
        <h2 className="text-h3">گزارش تحویل</h2>
        <DataTable
          label="گزارش تحویل وب‌هوک‌ها"
          rows={log}
          columns={logColumns}
          getRowId={(d) => d.id}
          getRowLabel={(d) => `${d.event} ${d.at}`}
          getRowActions={(d) => (d.status !== null && d.status < 300 ? [] : [[{ label: resending === d.id ? "در حال ارسال…" : "ارسال دوباره", icon: <RotateCwIcon aria-hidden />, inline: true, disabled: resending !== null, onSelect: () => void resend(d) }]])}
          defaultPageSize={10}
        />
      </section>
      <WebhookDialog open={creating} direction={tab} onOpenChange={setCreating} onCreate={(h) => setHooks((l) => [...l, h])} />
    </div>
  );
}
