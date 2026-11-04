import type { Run, Workflow } from "@/features/workflows/types";
import type { AlertContent } from "../types";

/** The report a finished run leaves in «ربات جریان‌ها». Known workflows say more than the generic text. */
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
