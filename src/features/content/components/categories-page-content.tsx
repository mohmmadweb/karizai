"use client";

import { useState } from "react";
import { CreateButton, MotoPage, MotoPageHeader, MotoPagination, MotoSearch } from "@/components/shared/moto/moto";
import { formatNumber } from "@/lib/format";
import { categories as seed, type Category } from "../data/categories";
import { useListView } from "../lib/use-list-view";
import { ContentTable } from "./content-table";
import { FormDialog } from "./form-dialog";

/** Parents first, each followed by its children. */
function tree(list: Category[]): (Category & { level: number })[] {
  const walk = (parent: string | null, level: number): (Category & { level: number })[] =>
    list.filter((c) => c.parentId === parent).flatMap((c) => [{ ...c, level }, ...walk(c.id, level + 1)]);
  return walk(null, 0);
}

export function CategoriesPageContent() {
  const [categories, setCategories] = useState(seed);
  const [creating, setCreating] = useState(false);
  const list = useListView(tree(categories), (c) => c.name, 8);
  return (
    <MotoPage>
      <MotoPageHeader title="دسته‌بندی‌ها" search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجوی دسته‌بندی" />} action={<CreateButton onClick={() => setCreating(true)}>ایجاد دسته‌بندی</CreateButton>} />
      <ContentTable rows={list.rows} total={list.total} rowKey={(c) => c.id} empty="دسته‌بندی‌ای یافت نشد" columns={[
        { head: "نام", cell: (c) => <span style={{ paddingInlineStart: `${c.level * 1.5}rem` }} className={c.level === 0 ? "font-medium" : "text-muted-foreground"}>{c.level > 0 ? "‹ " : ""}{c.name}</span> },
        { head: "نوع", cell: (c) => c.kind },
        { head: "تعداد آیتم", cell: (c) => formatNumber(c.items) },
        { head: "سطح", cell: (c) => (c.level === 0 ? "اصلی" : "زیرشاخه") },
      ]} />
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={creating} onOpenChange={setCreating} title="دسته‌بندی تازه" submitLabel="ایجاد" fields={[
        { name: "name", label: "نام", required: true },
        { name: "parent", label: "والد", kind: "select", options: [{ value: "", label: "بدون والد (اصلی)" }, ...seed.filter((c) => !c.parentId).map((c) => ({ value: c.id, label: c.name }))] },
      ]} onSubmit={(v) => setCategories((l) => [...l, { id: `c-new-${l.length}`, name: v.name, parentId: v.parent || null, items: 0, kind: "سند" }])} />
    </MotoPage>
  );
}
