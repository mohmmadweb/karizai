"use client";

import { useMemo, useState } from "react";
import { BookOpenIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { formatNumber } from "@/lib/format";
import { folderCounts, sortDocuments, type SortDirection, type SortKey } from "../lib/documents";
import type { KnowledgeDocument } from "../types";
import { DocumentTable } from "./document-table";
import { FolderList } from "./folder-list";

type KnowledgePageContentProps = { documents: KnowledgeDocument[] };

/** A file manager over the documents the user may read: folders on one side, files on the other, with search, sorting and download. */
export function KnowledgePageContent({ documents }: KnowledgePageContentProps) {
  const [folder, setFolder] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const folders = useMemo(() => folderCounts(documents), [documents]);
  const shown = useMemo(() => {
    const inFolder = documents.filter((doc) => folder === null || doc.source === folder);
    const found = inFolder.filter((doc) => `${doc.title} ${doc.source} ${doc.collection}`.includes(query.trim()));
    return sortDocuments(found, sortKey, direction);
  }, [documents, folder, query, sortKey, direction]);

  function sortBy(key: SortKey) {
    if (key === sortKey) setDirection(direction === "asc" ? "desc" : "asc");
    else { setSortKey(key); setDirection(key === "title" ? "asc" : "desc"); }
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="دانش سازمانی" description="اسنادی که به آن‌ها دسترسی دارید را در پوشه‌ها ببینید و دانلود کنید. افزودن و مدیریت اسناد در پنل ادمین انجام می‌شود." />
      {documents.length === 0 ? (
        <EmptyState icon={<BookOpenIcon />} title="سندی در دسترس نیست" description="هنوز به سندی دسترسی ندارید. با ادمین تماس بگیرید." />
      ) : (
        <div className="grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
          <FolderList folders={folders} total={documents.length} selected={folder} onSelect={setFolder} />
          <section aria-label="اسناد" className="flex min-w-0 flex-col gap-4">
            <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در اسناد" placeholder="جست‌وجو در اسناد" />
            <p className="text-body-sm text-muted-foreground" aria-live="polite">{folder ?? "همه‌ی اسناد"} · {formatNumber(shown.length)} سند</p>
            {shown.length === 0
              ? <p className="py-6 text-center text-body text-muted-foreground">سندی پیدا نشد.</p>
              : <div className="rounded-xl border bg-card"><DocumentTable documents={shown} sortKey={sortKey} direction={direction} onSort={sortBy} showFolder={folder === null} /></div>}
          </section>
        </div>
      )}
    </div>
  );
}
