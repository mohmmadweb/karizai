"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "../lib/model-speed";
import type { AgentRun } from "../types";
import { AgentDetailsDialog } from "./agent-details-dialog";
import { StepBar, StepLegend, totalMs } from "./step-bar";

export function AgentPerformance({ agents }: { agents: AgentRun[] }) {
  const [open, setOpen] = useState<AgentRun | null>(null);
  return (
    <>
      <ul className="grid gap-4">
        {agents.map((a) => (
          <li key={a.id}>
            <Card>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="text-body font-medium text-foreground">{a.name}</h3>
                    <p className="text-body-sm text-muted-foreground">
                      میانگین زمان اجرای کامل: <span className="tabular-nums text-foreground">{formatDuration(totalMs(a.steps))}</span>
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setOpen(a)} aria-label={`جزئیات ${a.name}`}>
                    جزئیات
                  </Button>
                </div>
                <StepBar steps={a.steps} />
                <StepLegend steps={a.steps} />
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      <AgentDetailsDialog agent={open} onClose={() => setOpen(null)} />
    </>
  );
}
