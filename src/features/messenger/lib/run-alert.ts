import type { Run, Workflow } from "@/features/workflows/types";
import { alertsThreadId, salesGroupId, type AlertContent } from "../types";

/** The connection that sends messages to colleagues; a workflow that uses it notifies someone. */
const notifyConnectionId = "conn-15";

export function notifiesSomeone(workflow: Workflow): boolean {
  return workflow.nodes.some((node) => node.kind === "tool" && node.config.connectionId === notifyConnectionId);
}

/** Where a finished run announces itself: the sales workflow tells the sales group, the others the alert bot. */
export function alertThreadFor(workflow: Workflow): string {
  return workflow.id === "wf-5" ? salesGroupId : alertsThreadId;
}

/** The alert a finished run leaves in the messenger. Known workflows say more than the generic text. */
export function alertForRun(workflow: Workflow, run: Run): AlertContent {
  if (workflow.id === "wf-6") {
    return {
      title: "کالا نیازمند سفارش مجدد است", tone: "warning", workflowId: workflow.id,
      fields: [
        { label: "کالا", value: "PE سنگین HD5502" },
        { label: "مقدار پیشنهادی سفارش", value: "۸۰ تن" },
        { label: "هزینه‌ی برآوردی", value: "حدود ۶٬۵۶۰ میلیون تومان" },
        { label: "وضعیت", value: "پیش‌نویس سفارش خرید ساخته شد" },
        { label: "وظیفه‌ی شما", value: "بازبینی و تأیید پیش‌نویس در «وظایف من» ثبت شد" },
      ],
    };
  }
  if (workflow.id === "wf-5") {
    return {
      title: "پیش‌فاکتور فروش آماده شد", tone: "info", workflowId: workflow.id,
      fields: [
        { label: "مشتری", value: "شرکت متقاضی" },
        { label: "کالا", value: "۲۰ تن کامپاند PP-T20" },
        { label: "مبلغ نهایی", value: "۲٬۲۹۶٫۸ میلیون تومان" },
        { label: "وضعیت", value: "تأیید مدیر فروش گرفته شد و پیش‌فاکتور آماده‌ی ارسال است" },
      ],
    };
  }
  const done = run.steps.filter((step) => step.status === "succeeded").length;
  return {
    title: `جریان «${workflow.name}» انجام شد`, tone: "info", workflowId: workflow.id,
    fields: [{ label: "گام‌های انجام‌شده", value: `${done.toLocaleString("fa-IR")} از ${run.steps.length.toLocaleString("fa-IR")}` }],
  };
}
