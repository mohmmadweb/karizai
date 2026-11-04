"use client";

import { useRef, useState } from "react";
import { BellIcon, SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { CreateButton, DashedEmpty, FilterPill, MotoPage, MotoPageHeader, MotoSearch, RoundIconButton, StatusTabs } from "@/components/shared/moto/moto";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AiAction } from "../components/ai-dialog";
import { categoryLabels, draftNews, getNews } from "../data/news";
import type { NewsCategory, NewsItem } from "../types";
import { NewsCard } from "./news-card";

const categories = Object.keys(categoryLabels) as NewsCategory[];

/** «اخبار سازمان»: category tabs, news cards with AI summary and translation; new items stay until reload. */
export function NewsPageContent() {
  const [items, setItems] = useState(getNews);
  const [tab, setTab] = useState<"all" | NewsCategory>("all");
  const [writing, setWriting] = useState(false);
  const [query, setQuery] = useState("");
  const [newest, setNewest] = useState(true);
  const counter = useRef(0);
  const add = (title: string, body: string, category: NewsCategory, draft: boolean) =>
    setItems((list) => [{ id: `news-new-${++counter.current}`, title, body, category, draft, publishedAt: new Date().toISOString(), summary: [body.split(/[.؛]/)[0]], english: { title: "Translation is ready after publishing", body: "The English version is written when the item is published." } }, ...list]);
  const shown = items
    .filter((item) => (tab === "all" || item.category === tab) && (!query.trim() || `${item.title} ${item.body}`.includes(query.trim())))
    .sort((a, b) => (newest ? b.publishedAt.localeCompare(a.publishedAt) : a.publishedAt.localeCompare(b.publishedAt)));
  return (
    <MotoPage>
      <MotoPageHeader
        title="اخبار سازمان"
        tools={<><RoundIconButton label="تنظیمات" icon={SettingsIcon} href="/settings" /><RoundIconButton label="اعلان‌ها" icon={BellIcon} href="/alerts" /></>}
        search={<MotoSearch value={query} onChange={setQuery} placeholder="جستجوی اخبار" />}
        filters={<FilterPill label="ترتیب" sort value={newest ? "new" : "old"} options={[{ value: "new", label: "جدیدترین" }, { value: "old", label: "قدیمی‌ترین" }]} onChange={(v) => setNewest(v === "new")} />}
        action={<>
          <AiAction label="نوشتن خبر با AI" size="default" context="اخبار سازمان">{(close) => <AiNewsDraft onSave={(title, body) => { add(title, body, "quality", true); toast.success("پیش‌نویس در بخش اخبار ذخیره شد"); close(); }} />}</AiAction>
          <CreateButton onClick={() => setWriting(true)}>ایجاد خبر جدید</CreateButton>
        </>}
      />
      <StatusTabs label="دسته‌ی خبر" value={tab} onChange={setTab} options={[{ value: "all", label: "همه" }, ...categories.map((c) => ({ value: c, label: categoryLabels[c] }))]} />
      {shown.length === 0 ? <DashedEmpty title="خبری در این دسته نیست." /> : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{shown.map((item: NewsItem) => <li key={item.id}><NewsCard item={item} /></li>)}</ul>
      )}
      <NewNewsDialog open={writing} onOpenChange={setWriting} onPublish={(title, body, category) => { add(title, body, category, false); toast.success("خبر منتشر شد"); }} />
    </MotoPage>
  );
}

function AiNewsDraft({ onSave }: { onSave: (title: string, body: string) => void }) {
  const [topic, setTopic] = useState("کاهش ۳۰ درصدی ضایعات خط ۲ در مهرماه");
  const [draft, setDraft] = useState(() => draftNews(topic));
  return (
    <div className="flex flex-col gap-3">
      <Field><FieldLabel htmlFor="news-topic">موضوع</FieldLabel>
        <div className="flex gap-2"><Input id="news-topic" value={topic} onChange={(e) => setTopic(e.target.value)} /><Button variant="outline" onClick={() => setDraft(draftNews(topic))}>بازنویسی</Button></div>
      </Field>
      <Field><FieldLabel htmlFor="news-dtitle">عنوان پیش‌نویس</FieldLabel><Input id="news-dtitle" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
      <Field><FieldLabel htmlFor="news-dbody">متن پیش‌نویس</FieldLabel><Textarea id="news-dbody" rows={5} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></Field>
      <Button size="sm" className="w-fit" disabled={!draft.title.trim()} onClick={() => onSave(draft.title.trim(), draft.body.trim())}>ذخیره به‌عنوان پیش‌نویس</Button>
    </div>
  );
}

function NewNewsDialog({ open, onOpenChange, onPublish }: { open: boolean; onOpenChange: (open: boolean) => void; onPublish: (title: string, body: string, category: NewsCategory) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<NewsCategory>("quality");
  const items = categories.map((c) => ({ value: c, label: categoryLabels[c] }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>خبر جدید</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return; onPublish(title.trim(), body.trim(), category); setTitle(""); setBody(""); onOpenChange(false); }} className="grid gap-3">
          <Field><FieldLabel htmlFor="news-title">عنوان</FieldLabel><Input id="news-title" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field><FieldLabel>دسته</FieldLabel>
            <Select items={items} value={category} onValueChange={(v) => v && setCategory(v as NewsCategory)}><SelectTrigger aria-label="دسته" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{items.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
          </Field>
          <Field><FieldLabel htmlFor="news-body">متن</FieldLabel><Textarea id="news-body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} /></Field>
          <Button type="submit" className="w-fit" disabled={!title.trim()}>انتشار خبر</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
