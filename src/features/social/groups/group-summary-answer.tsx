"use client";

import { formatNumber } from "@/lib/format";
import { AiBullets } from "../components/ai-parts";
import { SuggestedTasks } from "../components/suggested-tasks";
import type { Group } from "../types";

/** The assistant's digest of a group: topic, key points, the open decision and actions that can become tasks. */
export function GroupSummaryAnswer({ group }: { group: Group }) {
  const { summary } = group;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-label">{summary.unread > 0 ? `خلاصه‌ی ${formatNumber(summary.unread)} پیام خوانده‌نشده` : "خلاصه‌ی پیام‌های اخیر"}</h3>
      <p><span className="text-muted-foreground">موضوع اصلی: </span>{summary.topic}</p>
      <AiBullets items={summary.points} />
      <p><span className="text-muted-foreground">تصمیم باز: </span>{summary.openDecision}</p>
      {summary.actions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-label">اقدام‌های پیشنهادی</h4>
          <SuggestedTasks tasks={summary.actions} source="group" addAllLabel="✦ تبدیل اقدام‌ها به وظیفه" />
        </div>
      ) : null}
    </div>
  );
}
