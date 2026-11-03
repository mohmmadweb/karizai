"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { demoToday } from "@/features/workspace/lib/today";
import { formatFullDate } from "../lib/jalali";
import { ApprovalInbox, sampleApproval } from "./approval-inbox";
import { DeskBrief } from "./desk-brief";
import { DeskAlerts, DeskChats, DeskEvents, DeskGroups, DeskTasks } from "./desk-cards";

/** «میز کار من»: the day at a glance, with the assistant's brief and what waits for the user. */
export function DeskPageContent() {
  const { runs } = useWorkflows();
  const { setStatus } = useWorkspace();
  const [sampleOpen, setSampleOpen] = useState(true);
  const approvals = runs.filter((run) => run.status === "waiting-approval").length + (sampleOpen ? 1 : 0);
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="میز کار من" description={formatFullDate(demoToday)} />
      <DeskBrief approvals={approvals} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ApprovalInbox sampleOpen={sampleOpen} onSampleDecided={(approved) => { setSampleOpen(false); if (approved) setStatus(sampleApproval.taskId, "done"); }} />
        <DeskEvents />
        <DeskGroups />
        <DeskAlerts />
        <DeskTasks />
        <DeskChats />
      </div>
    </div>
  );
}
