"use client";

import { useState } from "react";
import Link from "@/components/shared/app-link";
import { ActivityIcon, CalendarClockIcon, HistoryIcon, ListChecksIcon, MessagesSquareIcon, PackageCheckIcon } from "lucide-react";
import { MotoPage } from "@/components/shared/moto/moto";
import { useCalendar } from "@/features/social/components/calendar-provider";
import { useChat } from "@/features/chat/components/chat-provider";
import { useMessenger } from "@/features/messenger/components/messenger-provider";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { formatDate, formatNumber } from "@/lib/format";
import { DeskAlerts } from "./desk-alerts";
import { DeskApprovals, sampleApproval } from "./desk-approvals";
import { DeskEvents } from "./desk-events";
import { DeskGroups } from "./desk-groups";
import { DeskPanel } from "./desk-panel";
import { DeskStats } from "./desk-stats";
import { DeskSummary } from "./desk-summary";

/** A first page for the day: the assistant's summary, what waits for me, events, groups, alerts, tasks, flows and chats. */
export function DeskPageContent() {
  const { tasks, setStatus } = useWorkspace();
  const { workflows, runs } = useWorkflows();
  const { events } = useCalendar();
  const [sampleOpen, setSampleOpen] = useState(true);
  const { state } = useChat();
  const { unreadTotal } = useMessenger();
  const pendingApprovalCount = runs.filter((run) => run.status === "waiting-approval").length + (sampleOpen ? 1 : 0);
  const ahead = events.filter((event) => new Date(new Date(event.start).getTime() + event.durationMinutes * 6e4) >= new Date()).sort((a, b) => a.start.localeCompare(b.start));
  const mine = tasks.filter((task) => task.assigneeId === currentUserId() && task.status !== "done").sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const active = workflows.filter((item) => item.status === "active");
  const recent = state.conversations.slice(0, 5);
  const next = ahead[0];
  const lines = [
    pendingApprovalCount > 0 ? `${formatNumber(pendingApprovalCount)} درخواست تأیید منتظر شماست.` : "",
    mine.length > 0 ? `${formatNumber(mine.length)} وظیفه‌ی باز دارید؛ نزدیک‌ترین: «${mine[0].title}».` : "",
    unreadTotal > 0 ? `${formatNumber(unreadTotal)} پیام خوانده‌نشده در گفتگوها و گروه‌ها دارید.` : "",
    next ? `رویداد بعدی: «${next.title}» ${formatDate(next.start, { weekday: "long", day: "numeric", month: "long" })}، ساعت ${formatDate(next.start, { timeStyle: "short" })}.` : "",
  ].filter(Boolean);
  return (
    <MotoPage>
      <header className="flex flex-col gap-1">
        <h1 className="text-h1">نمای کلی فعالیت‌های من</h1>
        <p className="text-body text-muted-foreground">{formatDate(new Date(), { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </header>
      <DeskStats stats={[
        { label: "منتظر تأیید شما", value: pendingApprovalCount, icon: PackageCheckIcon, tone: "warning", href: "/desk" },
        { label: "وظیفه‌ی باز", value: mine.length, icon: ListChecksIcon, tone: "primary", href: "/messenger/tasks" },
        { label: "پیام خوانده‌نشده", value: unreadTotal, icon: MessagesSquareIcon, tone: "info", href: "/messenger" },
        { label: "رویداد پیش رو", value: ahead.length, icon: CalendarClockIcon, tone: "violet", href: "/calendar" },
      ]} />
      <DeskSummary lines={lines} />
      <div className="grid gap-4 lg:grid-cols-2">
        <DeskApprovals sampleOpen={sampleOpen} onSampleDecided={(approved) => { setSampleOpen(false); if (approved) setStatus(sampleApproval.taskId, "done"); }} />
        <DeskEvents events={events} />
        <DeskGroups />
        <DeskAlerts />
        <DeskPanel tone="primary" title="وظایف باز من" icon={ListChecksIcon} href="/messenger/tasks" linkLabel="همه‌ی وظایف" empty="وظیفه‌ی بازی ندارید." isEmpty={mine.length === 0}>
          {mine.slice(0, 4).map((task) => (
            <li key={task.id} className="flex flex-col gap-0.5 py-3"><span className="text-label">{task.title}</span><span className="text-body-sm text-muted-foreground">موعد: {formatDate(task.dueDate)}</span></li>
          ))}
        </DeskPanel>
        <DeskPanel tone="success" title="جریان‌های فعال" icon={ActivityIcon} href="/workflows" linkLabel="همه‌ی جریان‌ها" empty="جریان فعالی ندارید." isEmpty={active.length === 0}>
          {active.slice(0, 4).map((item) => <li key={item.id}><Link href={`/workflows/${item.id}`} className="block py-3 text-label hover:text-primary">{item.name}</Link></li>)}
        </DeskPanel>
        <div className="lg:col-span-2">
          <DeskPanel tone="info" title="گفتگوهای اخیر" icon={HistoryIcon} href="/chat" linkLabel="گفتگوی تازه" empty="هنوز گفتگویی ندارید." isEmpty={recent.length === 0}>
            {recent.map((item) => <li key={item.id}><Link href={`/chat/${item.id}`} className="block py-3 text-label hover:text-primary">{item.title}</Link></li>)}
          </DeskPanel>
        </div>
      </div>
    </MotoPage>
  );
}
