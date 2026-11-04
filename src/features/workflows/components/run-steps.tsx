import Link from "@/components/shared/app-link";
import { CheckCircle2Icon, CircleDashedIcon, CircleXIcon, ClockIcon, HandIcon, MinusCircleIcon, RotateCcwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { effectMeta } from "@/features/live/lib/effect-meta";
import type { LiveEffect } from "@/features/live/types";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RunStep, StepStatus } from "../types";

const statusText: Record<StepStatus, string> = {
  pending: "در صف",
  running: "در حال اجرا",
  "waiting-approval": "منتظر تأیید شما",
  succeeded: "انجام شد",
  failed: "ناموفق",
  skipped: "انجام نشد",
};

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "running") return <Spinner aria-hidden />;
  const Icon = { pending: CircleDashedIcon, "waiting-approval": HandIcon, succeeded: CheckCircle2Icon, failed: CircleXIcon, skipped: MinusCircleIcon, running: ClockIcon }[status];
  const tone = status === "succeeded" ? "text-success" : status === "failed" ? "text-destructive" : status === "waiting-approval" ? "text-warning-foreground dark:text-warning" : "text-muted-foreground";
  return <Icon className={`size-5 ${tone}`} aria-hidden />;
}

/** The steps of one run, top to bottom, with what each step produced or why it failed. */
export function RunSteps({ steps, onRerun, effects = [] }: { steps: RunStep[]; /** Shown on failed steps of a finished run. */ onRerun?: (nodeId: string) => void; /** What this run did in the system, shown under the step that did it. */ effects?: LiveEffect[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step) => (
        <li key={step.nodeId} className={cn("flex gap-3 rounded-lg", step.status === "running" && "bg-info/10 p-2 ring-1 ring-info/40 motion-safe:animate-pulse")}>
          <StepIcon status={step.status} />
          <div className="flex min-w-0 flex-col gap-0.5 text-body-sm">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-label">
              {step.label} <span className="font-normal text-muted-foreground">— {statusText[step.status]}{step.durationMs ? ` (${formatNumber(Math.max(1, Math.round(step.durationMs / 1000)))} ثانیه)` : ""}</span>
              {step.parallel ? <Badge variant="info">موازی</Badge> : null}
              {step.attempts ? <Badge variant="outline">{formatNumber(step.attempts)} تلاش</Badge> : null}
            </span>
            {step.modelName || step.inputTokens !== undefined ? (
              <span className="text-caption text-muted-foreground">
                {step.modelName ? `مدل: ${step.modelName}` : ""}
                {step.modelName && step.inputTokens !== undefined ? " · " : ""}
                {step.inputTokens !== undefined ? `ورودی ${formatNumber(step.inputTokens)} · خروجی ${formatNumber(step.outputTokens ?? 0)} توکن` : ""}
              </span>
            ) : null}
            {step.output ? <span className="text-muted-foreground">{step.output}</span> : null}
            {step.error ? <span className="text-destructive">{step.error}</span> : null}
            {effects.filter((item) => item.nodeId === step.nodeId).map((item) => (
              <Link key={item.id} href={item.href} className="w-fit text-success hover:underline motion-safe:animate-in motion-safe:fade-in-0">→ {effectMeta[item.kind].short}{item.detail ? <span className="text-muted-foreground"> · {item.detail}</span> : null}</Link>
            ))}
            {step.status === "failed" && onRerun ? (
              <Button type="button" size="xs" variant="outline" className="mt-1 w-fit" onClick={() => onRerun(step.nodeId)}><RotateCcwIcon aria-hidden />اجرای دوباره از همین گام</Button>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
