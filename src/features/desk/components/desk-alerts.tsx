"use client";

import Link from "next/link";
import { BellRingIcon, CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import { useMessenger } from "@/features/messenger/components/messenger-provider";
import { DeskPanel } from "./desk-panel";

/** The newest alerts and reports the workflows left for me. */
export function DeskAlerts() {
  const { messages } = useMessenger();
  const alerts = messages.filter((message) => message.alert).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);
  return (
    <DeskPanel tone="teal" title="هشدارهای جریان‌ها" icon={BellRingIcon} href="/messenger/alerts" linkLabel="مشاهده‌ی همه" empty="هشداری ندارید." isEmpty={alerts.length === 0}>
      {alerts.map((message) => {
        const alert = message.alert!;
        const warning = alert.tone === "warning";
        const Icon = warning ? TriangleAlertIcon : CircleCheckIcon;
        return (
          <li key={message.id}>
            <Link href={`/messenger/${message.threadId}`} className="flex items-start gap-3 rounded-lg py-3 outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50">
              <Icon className={warning ? "mt-0.5 size-5 shrink-0 text-warning" : "mt-0.5 size-5 shrink-0 text-success"} aria-hidden />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-label">{alert.title}</span>
                <span className="text-body-sm text-muted-foreground">{alert.fields.slice(0, 2).map((field) => `${field.label}: ${field.value}`).join(" · ")}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </DeskPanel>
  );
}
