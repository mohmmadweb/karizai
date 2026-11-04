"use client";

import { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { DashedEmpty, FilterPill, MotoPage, MotoPageHeader, MotoPagination, MotoSearch } from "@/components/shared/moto/moto";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/format";
import { connections as seed, requests as seedRequests } from "../data/friends";
import { personName } from "../lib/people";
import { useListView } from "../lib/use-list-view";
import { AuthorLine } from "./author-line";
import { ContentTable } from "./content-table";

type Sort = "new" | "old";

export function FriendsPageContent() {
  const [connections, setConnections] = useState(seed);
  const [requests, setRequests] = useState(seedRequests);
  const [tab, setTab] = useState<"connections" | "requests">("connections");
  const [sort, setSort] = useState<Sort>("new");
  const sorted = [...connections].sort((a, b) => (sort === "new" ? -1 : 1) * a.since.localeCompare(b.since));
  const list = useListView(sorted, (c) => `${personName(c.personId)} ${c.unit}`, 8);

  function accept(id: string) {
    const request = requests.find((r) => r.id === id);
    if (!request) return;
    setRequests((l) => l.filter((r) => r.id !== id));
    setConnections((l) => [{ id: `cn-${request.id}`, personId: request.personId, unit: request.unit, mutual: 2, since: "2026-11-04T09:00:00.000Z" }, ...l]);
  }

  return (
    <MotoPage>
      <MotoPageHeader
        title="ارتباطات من"
        search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجوی ارتباطات" />}
        filters={<FilterPill label="ترتیب" sort value={sort} onChange={setSort} options={[{ value: "new", label: "جدیدترین" }, { value: "old", label: "قدیمی‌ترین" }]} />}
        action={<Button type="button" className="h-10" onClick={() => setTab(tab === "requests" ? "connections" : "requests")}>{tab === "requests" ? "بازگشت به ارتباطات" : `مشاهده درخواست‌های ارتباطی (${formatNumber(requests.length)})`}</Button>}
      />
      {tab === "requests" ? (
        requests.length === 0 ? <DashedEmpty title="درخواست ارتباطی تازه‌ای ندارید" /> : (
          <ul className="grid gap-3 md:grid-cols-2">
            {requests.map((r) => (
              <li key={r.id} className="flex min-w-0 flex-col gap-3 rounded-2xl border bg-card p-5">
                <AuthorLine id={r.personId} note={r.unit} />
                <p className="text-body-sm text-muted-foreground">{r.note}</p>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="text-caption text-muted-foreground">{formatDate(r.at, { dateStyle: "medium" })}</span>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={() => accept(r.id)}><CheckIcon aria-hidden />پذیرفتن</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setRequests((l) => l.filter((x) => x.id !== r.id))}><XIcon aria-hidden />رد</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <>
          <ContentTable
            rows={list.rows}
            total={list.total}
            rowKey={(c) => c.id}
            empty="هیچ ارتباطی یافت نشد"
            columns={[
              { head: "نام", cell: (c) => <AuthorLine id={c.personId} /> },
              { head: "واحد", cell: (c) => c.unit },
              { head: "ارتباط مشترک", cell: (c) => formatNumber(c.mutual) },
              { head: "تاریخ ارتباط", cell: (c) => formatDate(c.since, { dateStyle: "medium" }) },
              { head: "عملیات", cell: (c) => <Button type="button" size="xs" variant="outline" onClick={() => setConnections((l) => l.filter((x) => x.id !== c.id))}>حذف ارتباط</Button> },
            ]}
          />
          <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
        </>
      )}
    </MotoPage>
  );
}
