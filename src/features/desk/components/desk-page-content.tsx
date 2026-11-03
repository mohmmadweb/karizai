"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { useChat } from "@/features/chat/components/chat-provider";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { formatDate } from "@/lib/format";
import { DeskCard } from "./desk-card";

/** A first page for the day: my open tasks, active workflows and recent conversations, from what the panel already holds. */
export function DeskPageContent() {
  const { tasks } = useWorkspace();
  const { workflows } = useWorkflows();
  const { state } = useChat();
  const mine = tasks.filter((task) => task.assigneeId === currentUserId() && task.status !== "done").sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const active = workflows.filter((item) => item.status === "active");
  const recent = state.conversations.slice(0, 5);
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="میز کار" description="وظایف باز، جریان‌های فعال و گفتگوهای اخیر شما یک‌جا." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DeskCard title="وظایف باز من" href="/messenger/tasks" linkLabel="همه‌ی وظایف" empty="وظیفه‌ی بازی ندارید." isEmpty={mine.length === 0}>
          {mine.slice(0, 5).map((task) => (
            <li key={task.id} className="flex flex-col"><span>{task.title}</span><span className="text-caption text-muted-foreground">موعد: {formatDate(task.dueDate)}</span></li>
          ))}
        </DeskCard>
        <DeskCard title="جریان‌های فعال" href="/workflows" linkLabel="همه‌ی جریان‌ها" empty="جریان فعالی ندارید." isEmpty={active.length === 0}>
          {active.slice(0, 5).map((item) => <li key={item.id}><Link href={`/workflows/${item.id}`} className="hover:underline">{item.name}</Link></li>)}
        </DeskCard>
        <DeskCard title="گفتگوهای اخیر" href="/chat" linkLabel="گفتگوی تازه" empty="هنوز گفتگویی ندارید." isEmpty={recent.length === 0}>
          {recent.map((item) => <li key={item.id}><Link href={`/chat/${item.id}`} className="hover:underline">{item.title}</Link></li>)}
        </DeskCard>
      </div>
    </div>
  );
}
