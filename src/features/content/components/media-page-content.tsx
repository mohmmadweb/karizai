"use client";

import { useState } from "react";
import { CreateButton, DashedEmpty, MotoCard, MotoPage, MotoPageHeader, MotoPagination, MotoSearch, StatusTabs } from "@/components/shared/moto/moto";
import { formatDate } from "@/lib/format";
import { mediaItems, typeLabels, type MediaItem, type MediaType } from "../data/media";
import { currentUserId } from "../lib/people";
import { useListView } from "../lib/use-list-view";
import { AuthorLine } from "./author-line";
import { Cover } from "./cover";
import { FormDialog, InfoDialog } from "./form-dialog";

type Filter = "all" | MediaType;

export function MediaPageContent() {
  const [items, setItems] = useState(mediaItems);
  const [filter, setFilter] = useState<Filter>("all");
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState<MediaItem | null>(null);
  const list = useListView(items.filter((i) => filter === "all" || i.type === filter), (i) => i.title, 8);
  const options = [{ value: "all" as Filter, label: "همه" }, ...(Object.keys(typeLabels) as MediaType[]).map((t) => ({ value: t as Filter, label: typeLabels[t] }))];
  return (
    <MotoPage>
      <MotoPageHeader title="رسانه" search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجو در رسانه‌ها" />} action={<CreateButton onClick={() => setCreating(true)}>آپلود رسانه</CreateButton>} />
      <StatusTabs label="نوع رسانه" value={filter} options={options} onChange={(v) => { setFilter(v); list.setPage(1); }} />
      {list.rows.length === 0 ? <DashedEmpty title="رسانه‌ای یافت نشد" /> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.rows.map((item) => (
            <button key={item.id} type="button" onClick={() => setOpen(item)} className="min-w-0 rounded-2xl text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <MotoCard className="h-full gap-2 p-3">
                <Cover kind={item.type} id={item.id} category={typeLabels[item.type]} />
                <span className="truncate text-body-sm font-medium">{item.title}</span>
                <span className="text-caption text-muted-foreground">{typeLabels[item.type]} · {item.size}</span>
              </MotoCard>
            </button>
          ))}
        </div>
      )}
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={creating} onOpenChange={setCreating} title="آپلود رسانه" submitLabel="آپلود" fields={[
        { name: "title", label: "عنوان", required: true },
        { name: "type", label: "نوع", kind: "select", options: (Object.keys(typeLabels) as MediaType[]).map((t) => ({ value: t, label: typeLabels[t] })) },
      ]} onSubmit={(v) => setItems((l) => [{ id: `md-new-${l.length}`, title: v.title, type: v.type as MediaType, size: "۱٫۰ مگابایت", date: "2026-11-04T09:00:00.000Z", authorId: currentUserId() }, ...l])} />
      <InfoDialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)} title={open?.title ?? ""} description={open ? `${typeLabels[open.type]} · ${open.size} · ${formatDate(open.date, { dateStyle: "medium" })}` : undefined}>
        {open ? <><Cover kind={open.type} id={open.id} category={typeLabels[open.type]} /><AuthorLine id={open.authorId} /></> : null}
      </InfoDialog>
    </MotoPage>
  );
}
