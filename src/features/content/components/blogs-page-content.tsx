"use client";

import { useState } from "react";
import { CreateButton, FilterPill, MotoCard, MotoPage, MotoPageHeader, MotoPagination, MotoSearch, CardViewLink, DashedEmpty } from "@/components/shared/moto/moto";
import { formatDate, formatNumber } from "@/lib/format";
import { posts as seed, type Post } from "../data/blogs";
import { currentUserId } from "../lib/people";
import { useListView } from "../lib/use-list-view";
import { AuthorLine } from "./author-line";
import { CodeText } from "@/components/shared/code-text";
import { Cover, TagChip } from "./cover";
import { FormDialog, InfoDialog } from "./form-dialog";
import { AiNote } from "./use-ai-answer";

export function BlogsPageContent() {
  const [posts, setPosts] = useState(seed);
  const [tag, setTag] = useState("all");
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState<Post | null>(null);
  const tags = [...new Set(seed.flatMap((p) => p.tags))];
  const shown = posts.filter((p) => tag === "all" || p.tags.includes(tag));
  const list = useListView(shown, (p) => `${p.title} ${p.excerpt} ${p.tags.join(" ")}`, 6);

  return (
    <MotoPage>
      <MotoPageHeader
        title="وبلاگ‌ها"
        search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجو در وبلاگ‌ها" />}
        filters={<FilterPill label="برچسب" value={tag} onChange={(v) => { setTag(v); list.setPage(1); }} options={[{ value: "all", label: "همه‌ی برچسب‌ها" }, ...tags.map((t) => ({ value: t, label: t }))]} />}
        action={<CreateButton onClick={() => setCreating(true)}>ایجاد وبلاگ</CreateButton>}
      />
      {list.rows.length === 0 ? <DashedEmpty title="وبلاگی یافت نشد" /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.rows.map((post) => (
            <MotoCard key={post.id}>
              <Cover kind="blog" id={post.id} category={post.tags[0]} />
              <h2 className="text-h4"><CodeText>{post.title}</CodeText></h2>
              <p className="text-body-sm text-muted-foreground">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">{post.tags.map((t) => <TagChip key={t}>{t}</TagChip>)}</div>
              <AuthorLine id={post.authorId} note={`${formatDate(post.date, { dateStyle: "medium" })} · ${formatNumber(post.minutes)} دقیقه`} />
              <div className="mt-auto flex flex-col gap-2 border-t pt-3">
                <AiNote label="خلاصه" answer={post.summary} />
                <CardViewLink onClick={() => setOpen(post)}>مشاهده وبلاگ</CardViewLink>
              </div>
            </MotoCard>
          ))}
        </div>
      )}
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={creating} onOpenChange={setCreating} title="وبلاگ تازه" submitLabel="انتشار" fields={[
        { name: "title", label: "عنوان", required: true },
        { name: "excerpt", label: "چکیده", kind: "textarea", required: true },
        { name: "tags", label: "برچسب‌ها (با ویرگول جدا کنید)" },
      ]} onSubmit={(v) => setPosts((l) => [{ id: `bl-new-${l.length}`, title: v.title, excerpt: v.excerpt, authorId: currentUserId(), date: "2026-11-04T09:00:00.000Z", tags: v.tags.split(/[,،]/).map((t) => t.trim()).filter(Boolean), minutes: 3, summary: "این نوشته تازه منتشر شده و هنوز خلاصه‌ی کامل ندارد." }, ...l])} />
      <InfoDialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)} title={open?.title ?? ""} description={open ? formatDate(open.date, { dateStyle: "long" }) : undefined}>
        <p className="text-body-sm leading-7">{open?.excerpt} {open?.summary}</p>
      </InfoDialog>
    </MotoPage>
  );
}
