"use client";

import { useState } from "react";
import { BotIcon, BrainIcon, CheckCircle2Icon, ChevronDownIcon, CircleDashedIcon, CircleXIcon, HandIcon, PlugIcon, ShieldCheckIcon, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TimelineStatus, TimelineStep } from "../types";

const statusText: Record<TimelineStatus, string> = {
  pending: "در صف",
  running: "در حال اجرا",
  "waiting-approval": "منتظر تأیید شما",
  done: "انجام شد",
  failed: "ناموفق",
};

const kindIcon: Record<TimelineStep["kind"], LucideIcon> = { thinking: BrainIcon, agent: BotIcon, tool: PlugIcon, approval: HandIcon, supervisor: ShieldCheckIcon };

function StatusIcon({ status }: { status: TimelineStatus }) {
  if (status === "running") return <Spinner aria-hidden />;
  if (status === "done") return <CheckCircle2Icon className="size-4 text-success" aria-hidden />;
  if (status === "failed") return <CircleXIcon className="size-4 text-destructive" aria-hidden />;
  if (status === "waiting-approval") return <HandIcon className="size-4 text-warning-foreground dark:text-warning" aria-hidden />;
  return <CircleDashedIcon className="size-4 text-muted-foreground" aria-hidden />;
}

/** One collapsible row. Steps that run, wait, or failed are open unless the user closes them. */
function TimelineRow({ step }: { step: TimelineStep }) {
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? (step.status === "running" || step.status === "waiting-approval" || step.status === "failed");
  const Icon = kindIcon[step.kind];
  const bodyId = `timeline-${step.id}`;
  const hasTokens = step.inputTokens !== undefined && step.outputTokens !== undefined;

  return (
    <li className="rounded-xl border bg-card">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setManual(!open)}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-xl px-3 py-2 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <StatusIcon status={step.status} />
        <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="text-label">{step.title}</span>
        <span className={cn("text-caption", step.status === "failed" ? "text-destructive" : "text-muted-foreground")}>{statusText[step.status]}</span>
        <span className="ms-auto flex flex-wrap items-center gap-1">
          {step.modelName ? <Badge variant="secondary">{step.modelName}</Badge> : null}
          <ChevronDownIcon className={cn("size-4 transition-transform motion-reduce:transition-none", open && "rotate-180")} aria-hidden />
        </span>
      </button>
      {open ? (
        <div id={bodyId} className="flex flex-col gap-1 border-t px-3 py-2 text-body-sm">
          {step.via ? <p className="text-label">{step.via}</p> : null}
          {step.lines.map((line) => <p key={line} className="text-muted-foreground">{line}</p>)}
          {step.result ? <p>{step.result}</p> : null}
          {step.error ? <p className="text-destructive">{step.error}</p> : null}
          {hasTokens ? <p className="text-caption text-muted-foreground">توکن‌های مصرف‌شده: ورودی {formatNumber(step.inputTokens!)} · خروجی {formatNumber(step.outputTokens!)}</p> : null}
          {step.lines.length === 0 && !step.result && !step.error ? <p className="text-muted-foreground">منتظر نوبت…</p> : null}
        </div>
      ) : null}
    </li>
  );
}

/** The steps of a multi-agent answer, above the answer text. */
export function TimelineView({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col gap-2" aria-label="گام‌های پاسخ" aria-live="polite">
      {steps.map((step) => <TimelineRow key={step.id} step={step} />)}
    </ol>
  );
}
