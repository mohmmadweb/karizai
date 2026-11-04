"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { CreateButton, DashedEmpty, MotoCard, MotoPage, MotoPageHeader, MotoPagination, MotoSearch, StatusTabs } from "@/components/shared/moto/moto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { askAnswer, faqCategories, faqs as seed } from "../data/faqs";
import { useListView } from "../lib/use-list-view";
import { FormDialog } from "./form-dialog";
import { AiAnswerBox, useAiAnswer } from "./use-ai-answer";
import { AiButton } from "@/features/social/components/ai-button";

export function FaqsPageContent() {
  const [faqs, setFaqs] = useState(seed);
  const [category, setCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [asking, setAsking] = useState(false);
  const [question, setQuestion] = useState("");
  const ai = useAiAnswer(askAnswer);
  const list = useListView(faqs.filter((f) => category === "all" || f.category === category), (f) => `${f.question} ${f.answer}`, 6);
  const options = [{ value: "all", label: "همه" }, ...faqCategories.map((c) => ({ value: c, label: `${c} (${formatNumber(faqs.filter((f) => f.category === c).length)})` }))];

  return (
    <MotoPage>
      <MotoPageHeader
        title="سوالات متداول"
        search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجو در سوالات" />}
        action={<><AiButton label="از سوالات بپرس" size="default" data-ai onClick={() => setAsking((v) => !v)} /><CreateButton onClick={() => setCreating(true)}>ایجاد سوال</CreateButton></>}
      />
      {asking ? (
        <MotoCard>
          <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); if (question.trim()) void ai.run(); }}>
            <Input value={question} onChange={(e) => { setQuestion(e.target.value); ai.close(); }} placeholder="سوال خود را بنویسید، مثلاً حد مجاز رطوبت چقدر است؟" aria-label="سوال شما" />
            <Button type="submit" disabled={ai.state === "loading" || !question.trim()} data-ai><span aria-hidden>✦</span>{ai.state === "loading" ? "در حال جستجو…" : "بپرس"}</Button>
          </form>
          {ai.state === "done" ? <AiAnswerBox text={ai.answer} onClose={ai.close} /> : null}
        </MotoCard>
      ) : null}
      <StatusTabs label="دسته‌بندی" value={category} options={options} onChange={(v) => { setCategory(v); list.setPage(1); setOpenId(null); }} />
      {list.rows.length === 0 ? <DashedEmpty title="سوالی یافت نشد" /> : (
        <ul className="flex flex-col gap-2">
          {list.rows.map((f) => {
            const open = openId === f.id;
            return (
              <li key={f.id} className="min-w-0 rounded-2xl border bg-card">
                <button type="button" aria-expanded={open} onClick={() => setOpenId(open ? null : f.id)} className="flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                  <span className="min-w-0"><span className="block text-body font-medium">{f.question}</span><span className="text-caption text-muted-foreground">{f.category}</span></span>
                  <ChevronDownIcon className={cn("size-5 shrink-0 transition-transform", open && "rotate-180")} aria-hidden />
                </button>
                {open ? <p className="border-t px-4 py-3 text-body-sm leading-7 text-muted-foreground">{f.answer}</p> : null}
              </li>
            );
          })}
        </ul>
      )}
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={creating} onOpenChange={setCreating} title="سوال تازه" submitLabel="ثبت" fields={[
        { name: "category", label: "دسته‌بندی", kind: "select", options: faqCategories.map((c) => ({ value: c, label: c })) },
        { name: "question", label: "سوال", required: true },
        { name: "answer", label: "پاسخ", kind: "textarea", required: true },
      ]} onSubmit={(v) => setFaqs((l) => [{ id: `f-new-${l.length}`, category: v.category, question: v.question, answer: v.answer }, ...l])} />
    </MotoPage>
  );
}
