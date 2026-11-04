"use client";

import Link from "@/components/shared/app-link";
import { useRouter } from "next/navigation";
import { PauseIcon, PencilIcon, PlayIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { describeTrigger } from "../lib/describe-trigger";
import type { Workflow } from "../types";
import { StepStrip } from "./step-strip";
import { WorkflowStatusBadge } from "./workflow-status-badge";
import { useWorkflows } from "./workflows-provider";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const router = useRouter();
  const { run, runs, setPaused, remove } = useWorkflows();
  const [deleting, setDeleting] = useState(false);
  const canRun = workflow.nodes.length > 0 && workflow.status !== "pending-approval";
  const waiting = runs.filter((item) => item.workflowId === workflow.id && item.status === "waiting-approval").length;

  function runNow() {
    run(workflow.id, "دستی");
    toast.info(`کار «${workflow.name}» شروع شد.`, { action: { label: "مشاهده", onClick: () => router.push(`/workflows/${workflow.id}?tab=runs`) } });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">{workflow.name}<WorkflowStatusBadge status={workflow.status} /></CardTitle>
        <CardDescription>{workflow.description || "بدون توضیح"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-body-sm">
        <StepStrip workflow={workflow} />
        <ul className="flex flex-col gap-0.5 text-muted-foreground">
          {workflow.triggers.map((trigger, index) => <li key={index}>{describeTrigger(trigger)}</li>)}
        </ul>
        <p className="text-muted-foreground">{workflow.nodes.length.toLocaleString("fa-IR")} گام{workflow.lastRunAt ? ` · آخرین اجرا: ${formatDateTime(workflow.lastRunAt)}` : ""}{waiting ? ` · منتظر تأیید: ${waiting.toLocaleString("fa-IR")}` : ""}</p>
        {workflow.status === "pending-approval" ? <p className="text-muted-foreground">تا تأیید ادمین، راه‌اندازهای زمان‌بندی و رویداد کار نمی‌کنند.</p> : null}
        <div className="flex flex-wrap gap-2">
          <Link href={`/workflows/${workflow.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}><PencilIcon aria-hidden />ویرایش</Link>
          <Button size="sm" variant="outline" disabled={!canRun} onClick={runNow}><PlayIcon aria-hidden />اجرا</Button>
          {workflow.status === "active" ? <Button size="sm" variant="ghost" onClick={() => setPaused(workflow.id, true)}><PauseIcon aria-hidden />توقف</Button> : null}
          {workflow.status === "paused" ? <Button size="sm" variant="ghost" onClick={() => setPaused(workflow.id, false)}><PlayIcon aria-hidden />از سرگیری</Button> : null}
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleting(true)}><Trash2Icon aria-hidden />حذف</Button>
        </div>
      </CardContent>
      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف «{workflow.name}»؟</AlertDialogTitle>
            <AlertDialogDescription>این کار و راه‌اندازهایش از فهرست شما پاک می‌شود و دیگر اجرا نمی‌شود. سابقه‌ی اجراهای قبلی برای ادمین می‌ماند.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => { remove(workflow.id); toast.success(`کار «${workflow.name}» حذف شد.`); }}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
