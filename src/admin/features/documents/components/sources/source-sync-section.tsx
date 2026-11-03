"use client";

import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime, formatNumber } from "@/admin/lib/format";
import { useDocuments } from "../../hooks/use-documents";
import { intervalLabel } from "../../lib/selectors";
import type { FileSource, SyncInterval } from "../../types";

const items = Object.entries(intervalLabel).map(([value, label]) => ({ value: value, label }));

export function SourceSyncSection({ source }: { source: FileSource }) {
  const { setSyncInterval, syncNow, syncing } = useDocuments();
  const allowed = source.testResult === "success";
  const summary = source.lastSyncSummary;
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-h4 text-foreground">همگام‌سازی</h2>
        <p className="text-body-sm text-muted-foreground">فایل‌های تازه، تغییرکرده و حذف‌شده‌ی پوشه به‌صورت دوره‌ای با سامانه هماهنگ می‌شود.</p>
      </div>
      <Field className="sm:max-w-xs">
        <FieldLabel htmlFor="sync-interval">بازه‌ی همگام‌سازی</FieldLabel>
        <Select
          items={items}
          value={String(source.syncIntervalMinutes)}
          onValueChange={(v) => {
            setSyncInterval(source.id, Number(v) as SyncInterval);
            toast.success("بازه‌ی همگام‌سازی ذخیره شد.");
          }}
        >
          <SelectTrigger id="sync-interval" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>{items.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          disabled={!allowed}
          loading={Boolean(syncing[source.id])}
          onClick={async () => {
            const r = await syncNow(source.id);
            if (r) toast.success("همگام‌سازی انجام شد.");
          }}
        >
          <RefreshCwIcon aria-hidden />
          همگام‌سازی حالا
        </Button>
        {allowed ? null : <p className="text-body-sm text-muted-foreground">ابتدا اتصال را آزمایش کنید و نتیجه موفق باشد.</p>}
      </div>
      <p className="text-body-sm text-muted-foreground">
        {source.lastSyncAt ? `آخرین همگام‌سازی: ${formatDateTime(source.lastSyncAt)}` : "هنوز همگام‌سازی نشده است."}
        {summary
          ? ` — ${formatNumber(summary.added)} فایل تازه، ${formatNumber(summary.changed)} تغییرکرده، ${formatNumber(summary.removed)} حذف‌شده`
          : ""}
      </p>
    </section>
  );
}
