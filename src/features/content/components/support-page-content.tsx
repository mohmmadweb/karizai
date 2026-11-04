"use client";

import { useState } from "react";
import { CreateButton, MotoPage, MotoPageHeader, MotoPagination, MotoSearch, StatusTabs } from "@/components/shared/moto/moto";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { priorityLabels, statusLabels, ticketCategories, tickets as seed, type Ticket, type TicketStatus } from "../data/support";
import { day } from "../lib/dates";
import { useListView } from "../lib/use-list-view";
import { ContentTable } from "./content-table";
import { FormDialog, InfoDialog } from "./form-dialog";
import { AiNote } from "./use-ai-answer";

const statusStyle: Record<TicketStatus, string> = { open: "bg-warning/25 text-warning-foreground", answered: "bg-success/10 text-success", closed: "bg-muted text-muted-foreground" };

export function SupportPageContent() {
  const [tickets, setTickets] = useState(seed);
  const [filter, setFilter] = useState<"all" | TicketStatus>("all");
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState<Ticket | null>(null);
  const list = useListView(tickets.filter((t) => filter === "all" || t.status === filter), (t) => `${t.id} ${t.subject}`, 6);
  return (
    <MotoPage>
      <MotoPageHeader title="تیکت پشتیبانی" search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجو در تیکت‌ها" />} action={<CreateButton onClick={() => setCreating(true)}>ثبت تیکت</CreateButton>} />
      <StatusTabs label="وضعیت تیکت" value={filter} onChange={(v) => { setFilter(v); list.setPage(1); }} options={[{ value: "all", label: "همه" }, { value: "open", label: "باز" }, { value: "answered", label: "پاسخ داده شد" }, { value: "closed", label: "بسته" }]} />
      <ContentTable rows={list.rows} total={list.total} rowKey={(t) => t.id} empty="تیکتی یافت نشد" columns={[
        { head: "شماره", cell: (t) => <span dir="ltr" className="inline-block font-mono">{t.id}</span> },
        { head: "موضوع", cell: (t) => <span className="font-medium">{t.subject}</span> },
        { head: "دسته", cell: (t) => t.category },
        { head: "اولویت", cell: (t) => priorityLabels[t.priority] },
        { head: "تاریخ", cell: (t) => day(t.date) },
        { head: "وضعیت", cell: (t) => <span className={cn("rounded-full px-2.5 py-0.5 text-caption", statusStyle[t.status])}>{statusLabels[t.status]}</span> },
        { head: "عملیات", cell: (t) => <Button type="button" size="xs" variant="outline" onClick={() => setOpen(t)}>مشاهده</Button> },
      ]} />
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={creating} onOpenChange={setCreating} title="ثبت تیکت" submitLabel="ثبت تیکت" fields={[
        { name: "subject", label: "موضوع", required: true },
        { name: "category", label: "دسته", kind: "select", options: ticketCategories.map((c) => ({ value: c, label: c })) },
        { name: "priority", label: "اولویت", kind: "select", initial: "normal", options: [{ value: "high", label: "فوری" }, { value: "normal", label: "عادی" }, { value: "low", label: "کم‌اهمیت" }] },
        { name: "body", label: "توضیح", kind: "textarea", required: true },
      ]} onSubmit={(v) => setTickets((l) => [{ id: `TK-1405-${String(113 + l.length - seed.length).padStart(4, "0")}`, subject: v.subject, category: v.category, priority: v.priority as Ticket["priority"], status: "open", date: "2026-11-04T09:00:00.000Z", body: v.body, reply: "سلام. تیکت شما دریافت شد؛ پشتیبانی معمولاً تا یک روز کاری پاسخ می‌دهد. اگر مورد فوری است شماره‌ی بچ یا گرید مربوط را اضافه کنید." }, ...l])} />
      <InfoDialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)} title={open?.subject ?? ""} description={open ? `${open.id} · ${statusLabels[open.status]}` : undefined}>
        {open ? <><p className="text-body-sm leading-7">{open.body}</p><AiNote key={open.id} label="پاسخ پیشنهادی" answer={open.reply} /></> : null}
      </InfoDialog>
    </MotoPage>
  );
}
