import type { Source } from "../types";

export type PlannedStep = {
  id: string;
  kind: "thinking" | "agent" | "tool" | "approval" | "supervisor";
  title: string;
  /** The Agent that does the step; its default model is shown on the row. */
  agentId?: string;
  /** What the user must be allowed to use for this step to run. */
  capability?: "data" | "knowledge";
  /** Connection or source the step used. */
  via?: string;
  lines: string[];
  result: string;
  approval?: { toolName: string; description: string; inputs: { label: string; value: string }[] };
};

const wantsData = /(فروش|آمار|درآمد)/;
const wantsDocs = /(قرارداد|سند|آیین‌نامه)/;
const wantsSend = /(بفرست|ارسال)/;

/**
 * A prompt that needs sales data and documents is shared between agents.
 * Key words stand in for real understanding, which comes with the backend.
 */
export function planOrchestration(text: string): PlannedStep[] | null {
  if (!wantsData.test(text) || !wantsDocs.test(text)) return null;
  const steps: PlannedStep[] = [
    {
      id: "think",
      kind: "thinking",
      title: "در حال فکر کردن",
      lines: ["پرسش بررسی می‌شود", "کار بین دو عامل تقسیم می‌شود"],
      result: "پرسش به دو کار تقسیم شد: محاسبه‌ی آمار فروش، و خواندن قراردادهای مرتبط و نوشتن خلاصه.",
    },
    {
      id: "bi",
      kind: "agent",
      title: "عامل هوش تجاری",
      agentId: "agent-bi",
      capability: "data",
      lines: ["اتصال فقط‌خواندنی به انبار داده", "فروش این ماه به تفکیک استان محاسبه می‌شود", "با ماه قبل مقایسه می‌شود"],
      result: "فروش این ماه ۲٬۳۱۰ میلیون تومان است؛ ۱۲٪ بیشتر از ماه قبل. بیشترین سهم با تهران (۳۸٪) است.",
    },
    {
      id: "writer",
      kind: "agent",
      title: "عامل نگارش سند",
      agentId: "agent-2",
      capability: "knowledge",
      lines: ["سه قرارداد مرتبط خوانده می‌شود", "نکته‌های قرارداد با آمار فروش مقایسه می‌شود", "خلاصه برای مدیر نوشته می‌شود"],
      result: "خلاصه‌ی یک‌صفحه‌ای برای مدیر نوشته شد؛ دو قرارداد با رشد فروش هم‌خوان‌اند و یکی نیاز به بازنگری دارد.",
    },
  ];
  if (wantsSend.test(text)) {
    steps.push({
      id: "send",
      kind: "approval",
      title: "ارسال خلاصه برای مدیر",
      lines: ["پیامک آماده‌ی ارسال است"],
      result: "پیامک برای مدیر ارسال شد.",
      approval: {
        toolName: "ارسال پیامک",
        description: "خلاصه را به‌صورت پیامک برای مدیر می‌فرستد.",
        inputs: [{ label: "گیرنده", value: "مدیر فروش" }, { label: "متن", value: "خلاصه‌ی فروش این ماه و قراردادهای مرتبط" }],
      },
    });
  }
  return steps;
}

/** The last step when the smart supervisor is on; its verdict comes from `decideSupervision`. */
export const supervisorStep: PlannedStep = { id: "supervisor", kind: "supervisor", title: "ناظر هوشمند", lines: [], result: "" };

export const documentSources: Source[] = [
  { id: "ct-1", title: "قرارداد تأمین", kind: "document", section: "بند ۴" },
  { id: "ct-2", title: "آیین‌نامه‌ی معاملات سازمان", kind: "document", section: "فصل ۲" },
];
