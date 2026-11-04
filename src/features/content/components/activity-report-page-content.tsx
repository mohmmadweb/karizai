"use client";

import { useState } from "react";
import { MotoCard, MotoPage, MotoPageHeader, MotoPagination, MotoSearch, StatusTabs } from "@/components/shared/moto/moto";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { priorityLabels, statusLabels, type Task, type TaskStatus } from "@/features/workspace/types";
import { formatDate, formatNumber } from "@/lib/format";
import { TODAY, day } from "../lib/dates";
import { currentUserId } from "../lib/people";
import { useListView } from "../lib/use-list-view";
import { ContentTable } from "./content-table";
import { AiNote } from "./use-ai-answer";

const isLate = (task: Task) => task.status !== "done" && task.dueDate.slice(0, 10) < TODAY.slice(0, 10);
const statusStyle: Record<TaskStatus, string> = { todo: "bg-muted text-foreground", doing: "bg-info/10 text-info", done: "bg-success/10 text-success" };

export function ActivityReportPageContent() {
  const { tasks, projects } = useWorkspace();
  const [filter, setFilter] = useState<"all" | TaskStatus | "late">("all");
  const mine = tasks.filter((t) => t.assigneeId === currentUserId());
  const shown = mine.filter((t) => filter === "all" || (filter === "late" ? isLate(t) : t.status === filter));
  const list = useListView(shown, (t) => t.title, 8);
  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "";
  const done = mine.filter((t) => t.status === "done").length;
  const stats = [
    { label: "کل وظایف من", value: mine.length },
    { label: "انجام‌شده", value: done },
    { label: "در حال انجام", value: mine.filter((t) => t.status === "doing").length },
    { label: "معوق", value: mine.filter(isLate).length },
  ];
  const open = mine.filter((t) => t.status !== "done").sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const report = `گزارش هفته‌ی من (۱۰ تا ۱۶ آبان ۱۴۰۵)\n${formatNumber(done)} از ${formatNumber(mine.length)} وظیفه انجام شده است.\nنزدیک‌ترین موعدها: ${open.slice(0, 3).map((t) => `${t.title} (${formatDate(t.dueDate, { dateStyle: "medium" })})`).join("، ")}.\nپیشنهاد: اقدام اصلاحی بچ B-1405-2217 و تأیید سفارش HD5502 را در اولویت بگذارید.`;

  return (
    <MotoPage>
      <MotoPageHeader title="گزارش فعالیت‌های من" search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجو در وظایف" />} action={<AiNote label="گزارش هفته‌ی من" answer={report} />} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => <MotoCard key={s.label} className="gap-1 p-4"><span className="text-caption text-muted-foreground">{s.label}</span><span className="text-h2">{formatNumber(s.value)}</span></MotoCard>)}
      </div>
      <StatusTabs label="وضعیت وظیفه" value={filter} onChange={(v) => { setFilter(v); list.setPage(1); }} options={[{ value: "all", label: "همه" }, { value: "todo", label: "انجام‌نشده" }, { value: "doing", label: "در حال انجام" }, { value: "done", label: "انجام‌شده" }, { value: "late", label: "معوق" }]} />
      <ContentTable rows={list.rows} total={list.total} rowKey={(t) => t.id} empty="وظیفه‌ای یافت نشد" columns={[
        { head: "وظیفه", cell: (t) => <span className="font-medium">{t.title}</span> },
        { head: "پروژه", cell: (t) => projectName(t.projectId) },
        { head: "اولویت", cell: (t) => priorityLabels[t.priority] },
        { head: "موعد", cell: (t) => <span className={isLate(t) ? "text-destructive" : undefined}>{day(t.dueDate)}</span> },
        { head: "وضعیت", cell: (t) => <span className={`rounded-full px-2.5 py-0.5 text-caption ${statusStyle[t.status]}`}>{statusLabels[t.status]}</span> },
      ]} />
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
    </MotoPage>
  );
}
