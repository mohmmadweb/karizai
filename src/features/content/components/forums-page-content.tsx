"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { CreateButton, DashedEmpty, FilterPill, MotoCard, MotoPage, MotoPageHeader, MotoPagination, MotoSearch, StatusTabs } from "@/components/shared/moto/moto";
import { formatDate, formatNumber } from "@/lib/format";
import { questions as seed } from "../data/forums";
import { currentUserId } from "../lib/people";
import { useListView } from "../lib/use-list-view";
import { AuthorLine } from "./author-line";
import { TagChip } from "./cover";
import { FormDialog } from "./form-dialog";
import { AiNote } from "./use-ai-answer";

type Tab = "all" | "open" | "solved";
type Sort = "new" | "votes";

export function ForumsPageContent() {
  const [questions, setQuestions] = useState(seed);
  const [tab, setTab] = useState<Tab>("all");
  const [sort, setSort] = useState<Sort>("new");
  const [creating, setCreating] = useState(false);
  const shown = questions
    .filter((q) => tab === "all" || (tab === "solved") === q.solved)
    .sort((a, b) => (sort === "votes" ? b.votes - a.votes : b.date.localeCompare(a.date)));
  const list = useListView(shown, (q) => `${q.title} ${q.body} ${q.tags.join(" ")}`, 5);
  const vote = (id: string, d: number) => setQuestions((l) => l.map((q) => (q.id === id ? { ...q, votes: q.votes + d } : q)));

  return (
    <MotoPage>
      <MotoPageHeader
        title="پرسش و پاسخ"
        search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجو در پرسش‌ها" />}
        filters={<FilterPill sort label="ترتیب" value={sort} onChange={setSort} options={[{ value: "new", label: "جدیدترین" }, { value: "votes", label: "بیشترین رأی" }]} />}
        action={<CreateButton onClick={() => setCreating(true)}>پرسش جدید</CreateButton>}
      />
      <StatusTabs label="وضعیت" value={tab} onChange={(v) => { setTab(v); list.setPage(1); }} options={[{ value: "all", label: "همه" }, { value: "open", label: "بدون پاسخ نهایی" }, { value: "solved", label: "حل‌شده" }]} />
      {list.rows.length === 0 ? <DashedEmpty title="پرسشی یافت نشد" /> : (
        <ul className="flex flex-col gap-3">
          {list.rows.map((q) => (
            <li key={q.id}>
              <MotoCard className="gap-3 sm:flex-row sm:gap-5">
                <div className="flex shrink-0 items-center gap-2 sm:w-16 sm:flex-col">
                  <button type="button" aria-label="رأی مثبت" onClick={() => vote(q.id, 1)} className="rounded-md p-1 hover:bg-accent"><ChevronUpIcon className="size-5" /></button>
                  <span className="text-h4">{formatNumber(q.votes)}</span>
                  <button type="button" aria-label="رأی منفی" onClick={() => vote(q.id, -1)} className="rounded-md p-1 hover:bg-accent"><ChevronDownIcon className="size-5" /></button>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <h2 className="text-h4">{q.title}</h2>
                  <p className="text-body-sm text-muted-foreground">{q.body}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={q.solved ? "rounded-full bg-success/10 px-2.5 py-0.5 text-caption text-success" : "rounded-full bg-muted px-2.5 py-0.5 text-caption"}>{formatNumber(q.answers)} پاسخ{q.solved ? " · حل‌شده" : ""}</span>
                    {q.tags.map((t) => <TagChip key={t}>{t}</TagChip>)}
                    <span className="text-caption text-muted-foreground">{formatNumber(q.views)} بازدید</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <AuthorLine id={q.authorId} note={formatDate(q.date, { dateStyle: "medium" })} />
                  </div>
                  <AiNote label="پیشنهاد پاسخ" answer={q.suggestion} />
                </div>
              </MotoCard>
            </li>
          ))}
        </ul>
      )}
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={creating} onOpenChange={setCreating} title="پرسش جدید" submitLabel="ثبت پرسش" fields={[
        { name: "title", label: "عنوان پرسش", required: true },
        { name: "body", label: "توضیح", kind: "textarea" },
        { name: "tags", label: "برچسب‌ها (با ویرگول جدا کنید)" },
      ]} onSubmit={(v) => setQuestions((l) => [{ id: `q-new-${l.length}`, title: v.title, body: v.body, authorId: currentUserId(), votes: 0, answers: 0, views: 1, tags: v.tags.split(/[,،]/).map((t) => t.trim()).filter(Boolean), date: "2026-11-04T09:00:00.000Z", solved: false, suggestion: "برای پاسخ دقیق، شماره‌ی بچ یا گرید مربوط را به پرسش اضافه کنید و رویه‌ی مرتبط را مرور کنید." }, ...l])} />
    </MotoPage>
  );
}
