"use client";

import { useState } from "react";
import { HistoryIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatNumber } from "@/lib/format";
import { getQuota } from "@/features/user-session/data/session";
import { tokensOfRun } from "../lib/run-cost";
import { CostSummary } from "./cost-summary";
import type { Run } from "../types";
import { RunDetailDialog } from "./run-detail-dialog";
import { RunStatusBadge } from "./workflow-status-badge";
import { useWorkflows } from "./workflows-provider";

/** History of the runs of one workflow, newest first. */
export function RunsTab({ workflowId }: { workflowId: string }) {
  const { runs } = useWorkflows();
  const [opened, setOpened] = useState<Run | null>(null);
  const own = runs.filter((run) => run.workflowId === workflowId);

  if (own.length === 0) {
    return <EmptyState icon={<HistoryIcon />} title="هنوز اجرایی نیست" description="کار را اجرا کنید یا منتظر راه‌انداز آن بمانید." />;
  }
  return (
    <div className="flex flex-col gap-6">
      <CostSummary runs={own} quotaLimit={getQuota().limit} />
      <ul className="flex flex-col divide-y divide-border rounded-xl border">
        {own.map((run) => (
          <li key={run.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 text-label">{formatDateTime(run.startedAt)}<RunStatusBadge status={run.status} /></span>
              <span className="text-body-sm text-muted-foreground">{run.startedBy}{tokensOfRun(run).total > 0 ? ` · ${formatNumber(tokensOfRun(run).total)} توکن` : ""}</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setOpened(run)}>جزئیات</Button>
          </li>
        ))}
      </ul>
      <RunDetailDialog run={opened} onOpenChange={(open) => !open && setOpened(null)} />
    </div>
  );
}
