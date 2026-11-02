import type { Run, Workflow } from "@/features/workflows/types";
import type { AlertContent } from "../types";

/** The connection that sends messages to colleagues; a workflow that uses it notifies someone. */
const notifyConnectionId = "conn-15";

export function notifiesSomeone(workflow: Workflow): boolean {
  return workflow.nodes.some((node) => node.kind === "tool" && node.config.connectionId === notifyConnectionId);
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
      ],
    };
  }
  if (workflow.id === "wf-4") {
    return {
      title: "شاخص خط ۲ از حد مجاز خارج شد", tone: "warning", workflowId: workflow.id,
      fields: [
        { label: "شاخص", value: "دمای ناحیه‌ی ۴ اکسترودر" },
        { label: "مقدار فعلی", value: "۲۴۸ درجه (حد مجاز تا ۲۴۰)" },
      ],
    };
  }
  const done = run.steps.filter((step) => step.status === "succeeded").length;
  return {
    title: `جریان «${workflow.name}» انجام شد`, tone: "info", workflowId: workflow.id,
    fields: [{ label: "گام‌های انجام‌شده", value: `${done.toLocaleString("fa-IR")} از ${run.steps.length.toLocaleString("fa-IR")}` }],
  };
}
