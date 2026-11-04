"use client";

import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { describeTrigger, eventLabels, needsApproval, weekdayLabels } from "../lib/describe-trigger";
import type { EventKind, Trigger, Weekday } from "../types";

type TriggersPanelProps = { triggers: Trigger[]; onChange: (triggers: Trigger[]) => void };

const everyItems = [{ value: "hourly", label: "هر ساعت" }, { value: "daily", label: "هر روز" }, { value: "weekly", label: "هر هفته" }];
const weekdayItems = (Object.keys(weekdayLabels) as Weekday[]).map((value) => ({ value, label: weekdayLabels[value] }));
const eventItems = (Object.keys(eventLabels) as EventKind[]).map((value) => ({ value, label: eventLabels[value] }));

function Pick({ items, value, onChange, label, wide }: { items: { value: string; label: string }[]; value: string; onChange: (value: string) => void; label: string; /** Long option texts: a wider box, and a list as wide as its longest text. */ wide?: boolean }) {
  return (
    <Select items={items} value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger aria-label={label} className={wide ? "w-72 max-w-full" : "w-44"}><SelectValue /></SelectTrigger>
      <SelectContent className={wide ? "w-max min-w-(--anchor-width) max-w-[90vw]" : undefined}><SelectGroup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
    </Select>
  );
}

/** When a workflow starts: by hand, on a schedule, or when something happens. */
export function TriggersPanel({ triggers, onChange }: TriggersPanelProps) {
  const replace = (index: number, trigger: Trigger) => onChange(triggers.map((item, i) => (i === index ? trigger : item)));
  return (
    <section className="flex flex-col gap-3" aria-label="راه‌اندازها">
      <h3 className="text-h4">راه‌اندازها</h3>
      {triggers.length === 0 ? <p className="text-body-sm text-muted-foreground">هنوز راه‌اندازی نیست.</p> : null}
      <ul className="flex flex-col gap-2">
        {triggers.map((trigger, index) => (
          <li key={index} className="flex flex-wrap items-end gap-3 rounded-lg border p-3">
            <span className="min-w-40 flex-1 basis-0 text-label">{describeTrigger(trigger)}</span>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="حذف راه‌انداز" onClick={() => onChange(triggers.filter((_, i) => i !== index))}><XIcon aria-hidden /></Button>
            {trigger.kind === "schedule" ? (
              <>
                <Pick label="تکرار" items={everyItems} value={trigger.every} onChange={(every) => replace(index, { ...trigger, every: every as "hourly" | "daily" | "weekly", weekday: every === "weekly" ? (trigger.weekday ?? "sat") : undefined })} />
                {trigger.every === "weekly" ? <Pick label="روز هفته" items={weekdayItems} value={trigger.weekday ?? "sat"} onChange={(weekday) => replace(index, { ...trigger, weekday: weekday as Weekday })} /> : null}
                {trigger.every !== "hourly" ? (
                  <Field className="w-32"><FieldLabel htmlFor={`time-${index}`} className="sr-only">ساعت</FieldLabel><Input id={`time-${index}`} type="text" inputMode="numeric" placeholder="08:00" maxLength={5} pattern="([01][0-9]|2[0-3]):[0-5][0-9]" dir="ltr" className="text-center tabular-nums" value={trigger.time} onChange={(event) => replace(index, { ...trigger, time: event.target.value.replace(/[^0-9:]/g, "") })} /></Field>
                ) : null}
              </>
            ) : null}
            {trigger.kind === "event" ? <Pick wide label="رویداد" items={eventItems} value={trigger.event} onChange={(event) => replace(index, { kind: "event", event: event as EventKind })} /> : null}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" disabled={triggers.some((t) => t.kind === "manual")} onClick={() => onChange([...triggers, { kind: "manual" }])}><PlusIcon aria-hidden />دستی</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...triggers, { kind: "schedule", every: "daily", time: "08:00" }])}><PlusIcon aria-hidden />زمان‌بندی</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...triggers, { kind: "event", event: "new-customer" }])}><PlusIcon aria-hidden />رویداد</Button>
      </div>
      {needsApproval(triggers) ? <p className="text-body-sm text-muted-foreground">راه‌اندازهای زمان‌بندی و رویداد بعد از تأیید ادمین شروع می‌شوند و کار با دسترسی خود شما اجرا می‌شود.</p> : null}
    </section>
  );
}
