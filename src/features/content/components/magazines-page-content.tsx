"use client";

import { useState } from "react";
import { CardViewButton, CreateButton, DashedEmpty, MotoCard, MotoPage, MotoPageHeader, MotoPagination, MotoSearch } from "@/components/shared/moto/moto";
import { formatDate, formatNumber } from "@/lib/format";
import { issues as seed, type Issue } from "../data/magazines";
import { useListView } from "../lib/use-list-view";
import { TagChip } from "./cover";
import { FormDialog, InfoDialog } from "./form-dialog";
import { AiNote } from "./use-ai-answer";

export function MagazinesPageContent() {
  const [issues, setIssues] = useState(seed);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState<Issue | null>(null);
  const list = useListView(issues, (i) => `${i.title} ${i.topics.join(" ")} ${i.number}`, 6);
  return (
    <MotoPage>
      <MotoPageHeader title="مجلات" search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجو در مجلات" />} action={<CreateButton onClick={() => setCreating(true)}>ایجاد شماره</CreateButton>} />
      {list.rows.length === 0 ? <DashedEmpty title="شماره‌ای یافت نشد" /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.rows.map((issue) => (
            <MotoCard key={issue.id}>
              <div className="flex aspect-[3/4] max-h-64 w-full flex-col items-center justify-center gap-1 rounded-xl bg-primary text-primary-foreground" aria-hidden>
                <span className="text-caption opacity-80">پارسا پلیمر شریف</span>
                <span className="text-h1">{formatNumber(issue.number)}</span>
                <span className="text-body-sm">شماره‌ی {formatNumber(issue.number)}</span>
              </div>
              <h2 className="text-h4">{issue.title}</h2>
              <p className="text-caption text-muted-foreground">{formatDate(issue.date, { dateStyle: "long" })} · {formatNumber(issue.pages)} صفحه</p>
              <div className="flex flex-wrap gap-2">{issue.topics.map((t) => <TagChip key={t}>{t}</TagChip>)}</div>
              <AiNote label="خلاصه‌ی شماره" answer={issue.summary} />
              <CardViewButton onClick={() => setOpen(issue)}>مشاهده شماره</CardViewButton>
            </MotoCard>
          ))}
        </div>
      )}
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={creating} onOpenChange={setCreating} title="شماره‌ی تازه" submitLabel="ایجاد" fields={[
        { name: "title", label: "عنوان شماره", required: true },
        { name: "pages", label: "تعداد صفحه", kind: "number", initial: "24" },
        { name: "topics", label: "موضوع‌ها (با ویرگول جدا کنید)" },
      ]} onSubmit={(v) => setIssues((l) => [{ id: `mg-new-${l.length}`, number: Math.max(...l.map((i) => i.number)) + 1, title: v.title, date: "2026-11-04T09:00:00.000Z", pages: Number(v.pages) || 24, topics: v.topics.split(/[,،]/).map((t) => t.trim()).filter(Boolean), summary: "این شماره تازه ساخته شده و هنوز مطلبی ندارد." }, ...l])} />
      <InfoDialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)} title={open ? `شماره‌ی ${formatNumber(open.number)}: ${open.title}` : ""} description={open ? formatDate(open.date, { dateStyle: "long" }) : undefined}>
        <ul className="list-disc ps-5 text-body-sm leading-7">{open?.topics.map((t) => <li key={t}>{t}</li>)}</ul>
      </InfoDialog>
    </MotoPage>
  );
}
