"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDateTime, formatNumber } from "@/lib/format";
import type { Run } from "../types";
import { tokensOfRun } from "../lib/run-cost";
import { RunSteps } from "./run-steps";
import { RunStatusBadge } from "./workflow-status-badge";
import { useWorkflows } from "./workflows-provider";

type RunDetailDialogProps = { run: Run | null; onOpenChange: (open: boolean) => void };

export function RunDetailDialog({ run, onOpenChange }: RunDetailDialogProps) {
  const { runs, decide } = useWorkflows();
  // Read the live copy so steps keep updating while the dialog is open.
  const live = run ? (runs.find((item) => item.id === run.id) ?? run) : null;
  return (
    <Dialog open={live !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">جزئیات اجرا {live ? <RunStatusBadge status={live.status} /> : null}</DialogTitle>
          <DialogDescription>{live ? `${formatDateTime(live.startedAt)} · ${live.startedBy}` : ""}</DialogDescription>
        </DialogHeader>
        {live ? <RunSteps steps={live.steps} /> : null}
        {live && tokensOfRun(live).total > 0 ? (
          <p className="rounded-lg bg-muted/40 p-3 text-body-sm">جمع توکن این اجرا: <strong>{formatNumber(tokensOfRun(live).total)}</strong> (ورودی {formatNumber(tokensOfRun(live).input)} · خروجی {formatNumber(tokensOfRun(live).output)})</p>
        ) : null}
        {live?.status === "waiting-approval" ? (
          <DialogFooter>
            <Button onClick={() => decide(live.id, true)}>تأیید و ادامه</Button>
            <Button variant="outline" onClick={() => decide(live.id, false)}>رد کردن</Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
