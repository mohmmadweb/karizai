"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { daysFromToday } from "@/features/workspace/lib/today";
import { formatNumber } from "@/lib/format";
import { AiAction } from "../components/ai-dialog";
import { AiBullets } from "../components/ai-parts";
import { AiButton } from "../components/ai-button";
import { batchAnalysis } from "../data/ai-answers";
import { getGroups } from "../data/groups";
import { GroupSummaryAnswer } from "../groups/group-summary-answer";
import { useAskAssistant } from "../lib/use-ask-assistant";

/** «✦ خلاصه هوشمند امروز»: what matters today, from groups, tasks, the calendar and the connected systems. */
export function DeskBrief({ approvals }: { approvals: number }) {
  const { tasks } = useWorkspace();
  const ask = useAskAssistant();
  const quality = getGroups()[0];
  const mine = tasks.filter((task) => task.assigneeId === currentUserId() && task.status !== "done");
  const dueSoon = mine.filter((task) => daysFromToday(task.dueDate) <= 2).length;
  return (
    <section aria-labelledby="desk-brief" className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <header className="flex flex-wrap items-baseline gap-x-2">
        <h2 id="desk-brief" className="flex items-center gap-1.5 text-h4"><span aria-hidden className="text-primary">✦</span>خلاصه‌ی هوشمند امروز</h2>
        <span className="text-caption text-muted-foreground">ساخته‌شده از گروه‌ها، وظایف، تقویم و سامانه‌های متصل</span>
      </header>
      <AiBullets items={[
        <>بچ <b>{batchAnalysis.batch}</b> در آزمون رنگ مردود شد (ΔE ۲٫۹)؛ تحلیل علت آماده است.</>,
        <>گروه «{quality.name}»: {formatNumber(quality.summary.unread)} پیام خوانده‌نشده؛ موضوع اصلی {quality.summary.topic}.</>,
        <>{approvals > 0 ? `${formatNumber(approvals)} درخواست تأیید منتظر شماست؛ از جمله سفارش ۸۰ تن PE سنگین HD5502.` : "درخواست تأییدی منتظر شما نیست."}</>,
        <>جلسه‌ی بازبینی کیفیت ساعت ۱۰:۳۰ است و دستور جلسه آماده است.</>,
        <>{formatNumber(mine.length)} وظیفه‌ی باز دارید که موعد {formatNumber(dueSoon)} مورد تا دو روز دیگر است.</>,
      ]} />
      <div className="flex flex-wrap gap-2">
        <AiAction label="خلاصه‌ی گروه کیفیت" variant="outline" context={`گروه ${quality.name}`}><GroupSummaryAnswer group={quality} /></AiAction>
        <AiButton label="تحلیل بچ مردود" variant="outline" onClick={() => ask(batchAnalysis.question, "agent-quality")} />
        <Link href="/chat" className={buttonVariants({ variant: "outline", size: "sm" })}>گفتگو با دستیار</Link>
      </div>
    </section>
  );
}
