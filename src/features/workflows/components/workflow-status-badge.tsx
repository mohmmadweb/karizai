import { Badge } from "@/components/ui/badge";
import type { RunStatus, WorkflowStatus } from "../types";

const workflowLabels: Record<WorkflowStatus, { label: string; variant: "secondary" | "warning" | "success" | "outline" }> = {
  draft: { label: "پیش‌نویس", variant: "secondary" },
  "pending-approval": { label: "در انتظار تأیید ادمین", variant: "warning" },
  active: { label: "فعال", variant: "success" },
  paused: { label: "متوقف", variant: "outline" },
};

const runLabels: Record<RunStatus, { label: string; variant: "info" | "warning" | "success" | "destructive" }> = {
  running: { label: "در حال اجرا", variant: "info" },
  "waiting-approval": { label: "منتظر تأیید شما", variant: "warning" },
  succeeded: { label: "موفق", variant: "success" },
  failed: { label: "ناموفق", variant: "destructive" },
};

export function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  const item = workflowLabels[status];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function RunStatusBadge({ status }: { status: RunStatus }) {
  const item = runLabels[status];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
