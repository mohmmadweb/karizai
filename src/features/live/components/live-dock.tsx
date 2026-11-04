"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivityIcon, CheckCircle2Icon, ChevronDownIcon, ChevronUpIcon, HandIcon, XCircleIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { effectMeta } from "../lib/effect-meta";
import { useLive } from "./live-provider";

/** Floating progress of the latest run: its steps, and what it did in the system as it happens. Stays until dismissed. */
export function LiveDock() {
  const pathname = usePathname();
  const { visitRuns, effects, summaryOf } = useLive();
  const { workflows, decide } = useWorkflows();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const feed = useRef<HTMLUListElement>(null);
  const open = visitRuns.filter((item) => !dismissed.includes(item.id));
  const run = open.find((item) => item.status === "running" || item.status === "waiting-approval") ?? open[0];
  const items = run ? effects.filter((item) => item.runId === run.id) : [];

  // A new run opens the dock again.
  const [seenRun, setSeenRun] = useState<string | undefined>(undefined);
  if (run?.id !== seenRun) {
    setSeenRun(run?.id);
    setCollapsed(false);
  }
  useEffect(() => {
    if (feed.current) feed.current.scrollTop = feed.current.scrollHeight;
  }, [items.length, collapsed]);

  if (!run || pathname === "/login") return null;
  const workflow = workflows.find((item) => item.id === run.workflowId);
  const steps = run.steps.filter((step) => step.status !== "skipped");
  const finished = steps.filter((step) => step.status === "succeeded" || step.status === "failed").length;
  const percent = steps.length ? Math.round((finished / steps.length) * 100) : 0;
  const busy = run.status === "running" || run.status === "waiting-approval";
  const waiting = run.steps.find((step) => step.status === "waiting-approval");
  const current = run.steps.filter((step) => step.status === "running").map((step) => step.label).join("، ");
  const summary = summaryOf(run);
  const StatusIcon = run.status === "failed" ? XCircleIcon : CheckCircle2Icon;
  const statusDot = busy ? (
    <span aria-hidden className="relative flex size-2.5 shrink-0">
      <span className="absolute inline-flex size-full rounded-full bg-info opacity-70 motion-safe:animate-ping" />
      <span className="relative inline-flex size-2.5 rounded-full bg-info" />
    </span>
  ) : <StatusIcon aria-hidden className={cn("size-4 shrink-0", run.status === "failed" ? "text-destructive" : "text-success")} />;
  const position = pathname.startsWith("/admin") ? "bottom-5" : "bottom-24";

  if (collapsed) {
    return (
      <button type="button" onClick={() => setCollapsed(false)} aria-label="بازکردن فعالیت زنده" className={cn("fixed end-5 z-sticky flex max-w-72 items-center gap-2 rounded-full border bg-card px-3 py-2 text-label shadow-lg outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50", position)}>
        {statusDot}
        <span className="truncate">{workflow?.name}</span>
        <span className="shrink-0 text-caption text-muted-foreground tabular-nums">{formatNumber(summary.effects)} اقدام</span>
        <ChevronUpIcon aria-hidden className="size-4 shrink-0" />
      </button>
    );
  }

  return (
    <section aria-label="فعالیت زنده" className={cn("fixed end-5 z-sticky flex w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col gap-3 rounded-2xl border bg-card p-4 shadow-xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3", position)}>
      <header className="flex items-start gap-2">
        <span className="mt-1.5">{statusDot}</span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-label">{workflow?.name}</h2>
          <p className="truncate text-caption text-muted-foreground">{run.startedBy}</p>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="جمع‌کردن" onClick={() => setCollapsed(true)}><ChevronDownIcon aria-hidden /></Button>
        {busy ? null : <Button type="button" variant="ghost" size="icon-sm" aria-label="بستن" onClick={() => setDismissed((list) => [...list, run.id])}><XIcon aria-hidden /></Button>}
      </header>

      <div className="flex flex-col gap-1.5">
        <div role="progressbar" aria-label="پیشرفت اجرا" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", run.status === "failed" ? "bg-destructive" : "bg-primary")} style={{ width: `${percent}%` }} />
        </div>
        <p className="truncate text-caption text-muted-foreground tabular-nums">
          {formatNumber(finished)} از {formatNumber(steps.length)} گام{current ? <> · <span className="text-foreground motion-safe:animate-pulse">{current}</span></> : null}
        </p>
      </div>

      {waiting ? (
        <div className="flex flex-col gap-2 rounded-xl border border-warning/50 bg-warning/10 p-3">
          <p className="flex items-center gap-1.5 text-label"><HandIcon aria-hidden className="size-4 shrink-0" />«{waiting.label}» منتظر تأیید شماست</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={() => decide(run.id, true)}>تأیید و ادامه</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => decide(run.id, false)}>رد کردن</Button>
          </div>
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul ref={feed} aria-live="polite" aria-label="اقدام‌های انجام‌شده در سیستم" className="flex max-h-56 flex-col gap-2 overflow-y-auto">
          {items.map((item) => {
            const Icon = effectMeta[item.kind].icon;
            return (
              <li key={item.id} className="flex items-start gap-2 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span>
                <span className="min-w-0 flex-1 text-body-sm">
                  <span className="block">{item.label}</span>
                  {item.detail ? <span className="block truncate text-caption text-muted-foreground" title={item.detail}>{item.detail}</span> : null}
                </span>
                <Link href={item.href} className="shrink-0 pt-0.5 text-caption text-primary outline-none hover:underline focus-visible:underline">مشاهده</Link>
              </li>
            );
          })}
        </ul>
      ) : null}

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-caption">
        <span className={cn("tabular-nums", busy ? "text-muted-foreground" : "font-medium")}>
          {formatNumber(summary.effects)} اقدام در سیستم {busy ? "تا اینجا" : "انجام شد"}{summary.costToman > 0 ? ` · ${formatNumber(summary.costToman)} تومان` : ""}
        </span>
        <Link href="/live" className="flex items-center gap-1 text-primary outline-none hover:underline focus-visible:underline"><ActivityIcon aria-hidden className="size-3.5" />فعالیت زنده</Link>
      </footer>
    </section>
  );
}
