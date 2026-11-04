"use client";

import { useState } from "react";
import { BellIcon, CalendarIcon, ClockIcon, MapPinIcon, PinIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { CardViewLink, CreateButton, DashedEmpty, FilterPill, MotoPage, MotoPageHeader, MotoPagination, MotoSearch, StatusTabs } from "@/components/shared/moto/moto";
import { useCalendar } from "@/features/social/components/calendar-provider";
import type { CalendarEvent } from "@/features/social/types";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { defaultExtra, eventExtras, kindLabels, type EventExtra } from "../data/events";
import { clock, day } from "../lib/dates";
import { useListView } from "../lib/use-list-view";
import { Cover } from "./cover";
import { FormDialog, InfoDialog } from "./form-dialog";
import { AiNote } from "./use-ai-answer";

type Status = "upcoming" | "live" | "done";
const statusLabels: Record<Status, string> = { upcoming: "پیش رو", live: "درحال برگزاری", done: "پایان‌یافته" };
const statusStyle: Record<Status, string> = { upcoming: "bg-info/10 text-info", live: "bg-success/10 text-success", done: "bg-muted text-muted-foreground" };

function statusOf(event: CalendarEvent, now: number): Status {
  const start = new Date(event.start).getTime();
  if (now < start) return "upcoming";
  return now <= start + event.durationMinutes * 60000 ? "live" : "done";
}

const chip = "inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-caption text-accent-foreground";
const roundTool = "flex size-10 items-center justify-center rounded-lg border bg-card outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50";

export function EventsPageContent() {
  const { events, addEvent } = useCalendar();
  const [extras, setExtras] = useState<Record<string, EventExtra>>(eventExtras);
  const [status, setStatus] = useState<"all" | Status>("all");
  const [kind, setKind] = useState<"all" | "meeting" | "event">("all");
  const [sort, setSort] = useState<"start" | "latest">("start");
  const [creating, setCreating] = useState(false);
  const [agendaFor, setAgendaFor] = useState<CalendarEvent | null>(null);
  const [now] = useState(() => Date.now());
  const extraOf = (id: string) => extras[id] ?? defaultExtra;
  const shown = events
    .filter((e) => (status === "all" || statusOf(e, now) === status) && (kind === "all" || extraOf(e.id).kind === kind))
    .sort((a, b) => (sort === "start" ? Math.abs(new Date(a.start).getTime() - now) - Math.abs(new Date(b.start).getTime() - now) : b.start.localeCompare(a.start)));
  const list = useListView(shown, (e) => `${e.title} ${e.place}`, 6);

  return (
    <MotoPage>
      <MotoPageHeader
        title="رویدادها و جلسات"
        tools={<><button type="button" aria-label="تنظیمات" className={roundTool}><SettingsIcon className="size-4" /></button><button type="button" aria-label="اعلان‌ها" className={roundTool}><BellIcon className="size-4" /></button></>}
        search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجو در رویدادها و جلسات" />}
        filters={<>
          <FilterPill label="نوع" value={kind} onChange={(v) => { setKind(v); list.setPage(1); }} options={[{ value: "all", label: "همه" }, { value: "meeting", label: "جلسه" }, { value: "event", label: "رویداد" }]} />
          <FilterPill sort label="ترتیب" value={sort} onChange={setSort} options={[{ value: "start", label: "نزدیک‌ترین تاریخ شروع" }, { value: "latest", label: "دورترین تاریخ شروع" }]} />
        </>}
        action={<CreateButton onClick={() => setCreating(true)}>ایجاد رویداد جدید</CreateButton>}
      />
      <StatusTabs label="وضعیت رویداد" value={status} onChange={(v) => { setStatus(v); list.setPage(1); }} options={[{ value: "all", label: "همه" }, { value: "upcoming", label: "پیش رو" }, { value: "live", label: "درحال برگزاری" }, { value: "done", label: "پایان‌یافته" }]} />
      {list.rows.length === 0 ? <DashedEmpty title="رویدادی یافت نشد" /> : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.rows.map((event) => {
            const extra = extraOf(event.id);
            const st = statusOf(event, now);
            const end = new Date(new Date(event.start).getTime() + event.durationMinutes * 60000);
            return (
              <article key={event.id} className="relative flex min-w-0 flex-col gap-3 rounded-2xl border bg-card p-5">
                {extra.pinned ? <PinIcon className="absolute top-3 end-3 z-10 size-6 rotate-45 rounded-full bg-white/90 p-1 text-primary shadow-sm" aria-label="سنجاق‌شده" /> : null}
                <Cover kind="event" id={event.id} category={kindLabels[extra.kind]} />
                <h2 className="text-h4">{event.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className={cn(chip, statusStyle[st])}>{statusLabels[st]}</span>
                  <span className={chip}><MapPinIcon className="size-3" aria-hidden />{event.place}</span>
                  <span className={chip}><CalendarIcon className="size-3" aria-hidden />{day(event.start)}</span>
                  <span className={chip}><ClockIcon className="size-3" aria-hidden />{clock(event.start)} - {clock(end)}</span>
                  <span className={chip}><UsersIcon className="size-3" aria-hidden />{formatNumber(extra.registered)}{extra.capacity ? `/${formatNumber(extra.capacity)}` : ""}</span>
                  <span className={chip}>{kindLabels[extra.kind]}</span>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <CardViewLink onClick={() => setAgendaFor(event)}>مشاهده رویداد</CardViewLink>
                  <button type="button" data-ai onClick={() => setAgendaFor(event)} className="rounded-md text-caption text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">✦ دستور جلسه</button>
                  <span className="flex items-center gap-1 text-caption text-muted-foreground"><CalendarIcon className="size-3" aria-hidden />{day(event.start)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={creating} onOpenChange={setCreating} title="رویداد جدید" submitLabel="ایجاد رویداد" description="تاریخ را از تقویم مرورگر انتخاب کنید." fields={[
        { name: "title", label: "عنوان", required: true },
        { name: "kind", label: "نوع", kind: "select", options: [{ value: "meeting", label: "جلسه" }, { value: "event", label: "رویداد" }] },
        { name: "date", label: "تاریخ", kind: "date", required: true, initial: "2026-11-10" },
        { name: "time", label: "ساعت شروع", kind: "time", required: true, initial: "10:00" },
        { name: "minutes", label: "مدت (دقیقه)", kind: "number", initial: "60" },
        { name: "place", label: "مکان", required: true, initial: "اتاق جلسات ۱" },
        { name: "capacity", label: "ظرفیت (اختیاری)", kind: "number" },
      ]} onSubmit={(v) => {
        const id = addEvent({ title: v.title, start: new Date(`${v.date}T${v.time}`).toISOString(), durationMinutes: Number(v.minutes) || 60, place: v.place });
        setExtras((m) => ({ ...m, [id]: { ...defaultExtra, kind: v.kind as EventExtra["kind"], capacity: Number(v.capacity) || null } }));
      }} />
      <InfoDialog open={agendaFor !== null} onOpenChange={(o) => !o && setAgendaFor(null)} title={agendaFor?.title ?? ""} description={agendaFor ? `${day(agendaFor.start)} ${clock(agendaFor.start)} · ${agendaFor.place}` : undefined}>
        {agendaFor ? <AiNote key={agendaFor.id} label="دستور جلسه" answer={extraOf(agendaFor.id).agenda} /> : null}
      </InfoDialog>
    </MotoPage>
  );
}
