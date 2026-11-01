"use client";

import { HandIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Workflow } from "../types";
import { useWorkflows } from "./workflows-provider";

/** Opens by itself when a run of this workflow reaches an approval step. */
export function ApprovalPrompt({ workflow }: { workflow: Workflow }) {
  const { runs, decide } = useWorkflows();
  const run = runs.find((item) => item.workflowId === workflow.id && item.status === "waiting-approval");
  const step = run?.steps.find((item) => item.status === "waiting-approval");
  const node = workflow.nodes.find((item) => item.id === step?.nodeId);

  return (
    <AlertDialog open={Boolean(run)} onOpenChange={() => undefined}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2"><HandIcon className="size-4" aria-hidden />«{step?.label}» منتظر تأیید شماست</AlertDialogTitle>
          <AlertDialogDescription>{node?.config.instruction || "برای ادامه‌ی کار تأیید کنید."}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => run && decide(run.id, false)}>رد کردن</AlertDialogCancel>
          <AlertDialogAction onClick={() => run && decide(run.id, true)}>تأیید و ادامه</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
