"use client";

import Link from "@/components/shared/app-link";
import { PackageIcon, WorkflowIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { DeskPanel } from "./desk-panel";

/** The reorder request of «سفارش‌دهی خودکار مواد اولیه» (wf-6) that waits for me on arrival. */
export const sampleApproval = {
  workflowId: "wf-6",
  title: "کالا نیازمند سفارش مجدد است",
  detail: "جریان «سفارش‌دهی خودکار مواد اولیه» · PE سنگین HD5502 · موجودی ۱۸ تن · پیشنهاد ۸۰ تن · حدود ۶٬۵۶۰ میلیون تومان",
  taskId: "task-6",
};

type DeskApprovalsProps = { sampleOpen: boolean; onSampleDecided: (approved: boolean) => void };

/** What waits for my decision: the sample request and every workflow run that stopped at an approval step. Deciding is temporary. */
export function DeskApprovals({ sampleOpen, onSampleDecided }: DeskApprovalsProps) {
  const { runs, workflows, decide } = useWorkflows();
  const waiting = runs.filter((run) => run.status === "waiting-approval");
  const count = waiting.length + (sampleOpen ? 1 : 0);
  const viewFlow = (workflowId: string) => <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/workflows/${workflowId}`} />}><WorkflowIcon aria-hidden />مشاهده‌ی جریان</Button>;
  return (
    <DeskPanel tone="warning" title="نیاز به تأیید شما" icon={PackageIcon} badge={count > 0 ? <Badge variant="warning">{count.toLocaleString("fa-IR")} مورد</Badge> : null} empty="موردی منتظر تأیید شما نیست." isEmpty={count === 0}>
      {sampleOpen ? (
        <li className="flex flex-col gap-3 py-3">
          <div className="flex flex-col gap-1"><span className="text-label">{sampleApproval.title}</span><span className="text-body-sm text-muted-foreground">{sampleApproval.detail}</span></div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => { onSampleDecided(true); toast.success("تأیید شد؛ پیش‌نویس سفارش خرید در راهکاران ثبت شد"); }}>تأیید</Button>
            <Button size="sm" variant="ghost" onClick={() => { onSampleDecided(false); toast("رد شد و به مسئول تدارکات اطلاع داده شد"); }}>رد</Button>
            {viewFlow(sampleApproval.workflowId)}
          </div>
        </li>
      ) : null}
      {waiting.map((run) => {
        const workflow = workflows.find((item) => item.id === run.workflowId);
        const step = run.steps.find((item) => item.status === "waiting-approval");
        return (
          <li key={run.id} className="flex flex-col gap-3 py-3">
            <div className="flex flex-col gap-1">
              <span className="text-label">«{step?.label ?? "گام تأیید"}» منتظر تأیید شماست</span>
              <span className="text-body-sm text-muted-foreground">جریان «{workflow?.name ?? "بی‌نام"}» · {run.startedBy}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => { decide(run.id, true); toast.success("تأیید شد و جریان ادامه پیدا کرد"); }}>تأیید</Button>
              <Button size="sm" variant="ghost" onClick={() => { decide(run.id, false); toast("رد شد و جریان متوقف شد"); }}>رد</Button>
              {viewFlow(run.workflowId)}
            </div>
          </li>
        );
      })}
    </DeskPanel>
  );
}
