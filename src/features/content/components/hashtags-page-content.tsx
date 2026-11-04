"use client";

import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { CreateButton, FilterPill, MotoPage, MotoPageHeader, MotoPagination, MotoSearch } from "@/components/shared/moto/moto";
import { formatDate, formatNumber } from "@/lib/format";
import { hashtags as seed } from "../data/hashtags";
import { useListView } from "../lib/use-list-view";
import { ContentTable } from "./content-table";
import { FormDialog } from "./form-dialog";

type Sort = "count" | "trend";

export function HashtagsPageContent() {
  const [tags, setTags] = useState(seed);
  const [sort, setSort] = useState<Sort>("count");
  const [creating, setCreating] = useState(false);
  const sorted = [...tags].sort((a, b) => (sort === "count" ? b.count - a.count : b.trend - a.trend));
  const list = useListView(sorted, (t) => t.tag, 8);
  return (
    <MotoPage>
      <MotoPageHeader
        title="هشتگ‌ها"
        search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجوی هشتگ" />}
        filters={<FilterPill sort label="ترتیب" value={sort} onChange={setSort} options={[{ value: "count", label: "بیشترین استفاده" }, { value: "trend", label: "بیشترین رشد" }]} />}
        action={<CreateButton onClick={() => setCreating(true)}>ایجاد هشتگ</CreateButton>}
      />
      <ContentTable rows={list.rows} total={list.total} rowKey={(t) => t.id} empty="هشتگی یافت نشد" columns={[
        { head: "هشتگ", cell: (t) => <span dir="ltr" className="inline-block font-mono">#{t.tag}</span> },
        { head: "تعداد استفاده", cell: (t) => formatNumber(t.count) },
        { head: "روند هفته", cell: (t) => (
          <span className={t.trend > 0 ? "inline-flex items-center gap-1 text-success" : t.trend < 0 ? "inline-flex items-center gap-1 text-destructive" : "inline-flex items-center gap-1 text-muted-foreground"}>
            {t.trend > 0 ? <ArrowUpIcon className="size-4" aria-hidden /> : t.trend < 0 ? <ArrowDownIcon className="size-4" aria-hidden /> : <MinusIcon className="size-4" aria-hidden />}
            <span dir="ltr">{formatNumber(Math.abs(t.trend))}٪</span>
          </span>
        ) },
        { head: "آخرین استفاده", cell: (t) => formatDate(t.last, { dateStyle: "medium" }) },
      ]} />
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={creating} onOpenChange={setCreating} title="هشتگ تازه" submitLabel="ایجاد" fields={[{ name: "tag", label: "هشتگ (انگلیسی، بدون #)", required: true, ltr: true, placeholder: "line2-maintenance" }]}
        onSubmit={(v) => setTags((l) => [{ id: `h-new-${l.length}`, tag: v.tag.replace(/^#/, "").trim(), count: 0, trend: 0, last: "2026-11-04T09:00:00.000Z" }, ...l])} />
    </MotoPage>
  );
}
