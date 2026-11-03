"use client";

import Link from "next/link";
import { CheckIcon, PackageIcon, WorkflowIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { formatNumber } from "@/lib/format";

/** The sample request of «سفارش‌دهی خودکار مواد اولیه» (wf-6) that waits for the user on arrival. */
export const sampleApproval = {
  workflowId: "wf-6",
  title: "کالا نیازمند سفارش مجدد است",
  detail: "جریان «سفارش‌دهی خودکار مواد اولیه» · PE سنگین HD5502 · موجودی ۱۸ تن (۳ روز) · پیشنهاد ۸۰ تن · حدود ۶٬۵۶۰ میلیون تومان · بهترین قیمت: پلیمر خزر",
  taskId: "task-6",
};

type ApprovalInboxProps = { sampleOpen: boolean; onSampleDecided: (approved: boolean) => void };

/** «نیاز به تأیید شما»: workflow runs that stopped at an approval step, plus the sample reorder request. */
export function ApprovalInbox({ sampleOpen, onSampleDecided }: ApprovalInboxProps) {
  const { runs, workflows, decide } = useWorkflows();
  const waiting = runs.filter((run) => run.status === "waiting-approval");
  const count = waiting.length + (sampleOpen ? 1 : 0);
  const viewFlow = (workflowId: string) => <Link href={`/workflows/${workflowId}`} className={buttonVariants({ variant: "ghost", size: "sm" })}><WorkflowIcon aria-hidden />مشاهده‌ی جریان</Link>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">نیاز به تأیید شما{count > 0 ? <Badge variant="warning">{formatNumber(count)} مورد</Badge> : null}</CardTitle>
      </CardHeader>
      <CardContent>
        {count === 0 ? <p className="py-4 text-center text-body-sm text-muted-foreground">موردی منتظر تأیید شما نیست.</p> : (
          <ul className="flex flex-col divide-y">
            {sampleOpen ? (
              <li className="flex gap-3 py-3 first:pt-0">
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-warning/25 text-warning-foreground dark:text-warning"><PackageIcon className="size-5" /></span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div><p className="text-label">{sampleApproval.title}</p><p className="text-body-sm text-muted-foreground">{sampleApproval.detail}</p></div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => { onSampleDecided(true); toast.success("تأیید شد؛ پیش‌نویس سفارش خرید در راهکاران ثبت شد"); }}><CheckIcon aria-hidden />تأیید</Button>
                    <Button size="sm" variant="outline" onClick={() => { onSampleDecided(false); toast("رد شد و به مسئول تدارکات اطلاع داده شد"); }}><XIcon aria-hidden />رد</Button>
                    {viewFlow(sampleApproval.workflowId)}
                  </div>
                </div>
              </li>
            ) : null}
            {waiting.map((run) => {
              const workflow = workflows.find((item) => item.id === run.workflowId);
              const step = run.steps.find((item) => item.status === "waiting-approval");
              return (
                <li key={run.id} className="flex gap-3 py-3 first:pt-0">
                  <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info"><WorkflowIcon className="size-5" /></span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div><p className="text-label">«{step?.label ?? "گام تأیید"}» منتظر تأیید شماست</p><p className="text-body-sm text-muted-foreground">جریان «{workflow?.name ?? "بی‌نام"}» · {run.startedBy}</p></div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => { decide(run.id, true); toast.success("تأیید شد و جریان ادامه پیدا کرد"); }}><CheckIcon aria-hidden />تأیید</Button>
                      <Button size="sm" variant="outline" onClick={() => { decide(run.id, false); toast("رد شد و جریان متوقف شد"); }}><XIcon aria-hidden />رد</Button>
                      {viewFlow(run.workflowId)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
