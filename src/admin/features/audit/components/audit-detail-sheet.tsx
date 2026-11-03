"use client";

import { formatDateTime } from "@/admin/lib/format";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { channelLabels, type AuditEvent } from "../types";
import { ResultBadge } from "./result-badge";

/** Everything recorded about one event. */
export function AuditDetailSheet({ event, onOpenChange }: { event: AuditEvent | null; onOpenChange: (open: boolean) => void }) {
  const rows: [string, string][] = event
    ? [
        ["زمان", formatDateTime(event.at)],
        ["کاربر", `${event.user} (واحد ${event.unit})`],
        ["عامل", event.agent],
        ["ابزار یا منبع", event.source],
        ["مدل", event.model],
        ["نوع", channelLabels[event.channel]],
        ["موارد پوشانده", event.maskedCount ? `${event.maskedCount.toLocaleString("fa-IR")} مورد` : "هیچ"],
        ["مدت", `${(event.durationMs / 1000).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} ثانیه`],
        ["شناسه", event.id],
      ]
    : [];
  return (
    <Sheet open={event !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        {event ? (
          <>
            <SheetHeader className="pe-14">
              <SheetTitle className="text-h4">{event.action}</SheetTitle>
              <SheetDescription>رویداد ممیزی؛ این سابقه قابل ویرایش یا حذف نیست.</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-6">
              <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
                <ResultBadge result={event.result} />
                {event.reason ? <p className="text-body-sm">{event.reason}</p> : null}
              </div>
              <dl className="flex flex-col divide-y divide-border rounded-xl border border-border">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 p-3 text-body-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-end font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
