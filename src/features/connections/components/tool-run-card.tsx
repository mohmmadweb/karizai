"use client";

import { CheckCircle2Icon, CircleXIcon, WrenchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ToolRun, ToolRunStatus } from "../types";

const statusLabel: Record<ToolRunStatus, string> = {
  "awaiting-approval": "در انتظار تأیید شما",
  running: "در حال اجرا",
  succeeded: "انجام شد",
  failed: "ناموفق",
  rejected: "رد شد",
};

type ToolRunCardProps = {
  run: ToolRun;
  onApprove: () => void;
  onReject: () => void;
};

/** Shows a tool call in the chat: what it does, its inputs, and its state. */
export function ToolRunCard({ run, onApprove, onReject }: ToolRunCardProps) {
  const variant = run.status === "succeeded" ? "success" : run.status === "failed" ? "destructive" : run.status === "awaiting-approval" ? "warning" : "secondary";
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 text-body-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-label"><WrenchIcon className="size-4" aria-hidden />{run.toolName}</span>
        <Badge variant={variant}>
          {run.status === "running" ? <Spinner /> : null}
          {statusLabel[run.status]}
        </Badge>
      </div>
      <p className="text-muted-foreground">{run.description}</p>
      <dl className="grid gap-1">
        {run.inputs.map((input) => (
          <div key={input.label} className="flex gap-2">
            <dt className="text-muted-foreground">{input.label}:</dt>
            <dd>{input.value}</dd>
          </div>
        ))}
      </dl>
      {run.status === "awaiting-approval" ? (
        <div className="flex gap-2">
          <Button size="sm" onClick={onApprove}>تأیید و اجرا</Button>
          <Button size="sm" variant="outline" onClick={onReject}>رد کردن</Button>
        </div>
      ) : null}
      {run.status === "succeeded" ? <p className="flex items-center gap-2 text-success"><CheckCircle2Icon className="size-4" aria-hidden />{run.result}</p> : null}
      {run.status === "failed" ? <p className="flex items-center gap-2 text-destructive"><CircleXIcon className="size-4" aria-hidden />{run.error}</p> : null}
    </div>
  );
}
