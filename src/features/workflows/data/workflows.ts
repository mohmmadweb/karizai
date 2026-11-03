import type { Run, Workflow } from "../types";
import { getTemplates } from "./templates";

const [weekly, customer, , pricing, reorder] = getTemplates();

const workflows: Workflow[] = [
  { id: "wf-1", name: weekly.name, description: weekly.description, status: "active", triggers: weekly.triggers, nodes: weekly.nodes, edges: weekly.edges, updatedAt: "2026-10-20T09:00:00.000Z", lastRunAt: "2026-10-24T05:00:00.000Z" },
  { id: "wf-2", name: customer.name, description: customer.description, status: "pending-approval", triggers: customer.triggers, nodes: customer.nodes, edges: customer.edges, updatedAt: "2026-10-25T11:30:00.000Z" },
  {
    id: "wf-3", name: "یادآوری مرخصی", description: "هر روز ساعت ۹ مانده‌ی مرخصی را بررسی می‌کند.", status: "paused",
    triggers: [{ kind: "schedule", every: "daily", time: "09:00" }],
    nodes: [{ id: "n1", kind: "tool", label: "مانده‌ی مرخصی", position: { x: 0, y: 0 }, config: { connectionId: "conn-3", toolId: "tool-6", params: { p0: "کابل شبکه" }, instruction: "مانده را بخوان." } }],
    edges: [], updatedAt: "2026-10-10T08:00:00.000Z", lastRunAt: "2026-10-18T05:30:00.000Z",
  },
  { id: "wf-5", name: pricing.name, description: pricing.description, status: "active", triggers: pricing.triggers, nodes: pricing.nodes, edges: pricing.edges, updatedAt: "2026-10-28T10:00:00.000Z", lastRunAt: "2026-10-29T08:35:00.000Z" },
  { id: "wf-6", name: reorder.name, description: reorder.description, status: "active", triggers: reorder.triggers, nodes: reorder.nodes, edges: reorder.edges, updatedAt: "2026-10-30T09:00:00.000Z", lastRunAt: "2026-10-31T05:00:00.000Z" },
];

const runs: Run[] = [
  {
    id: "run-1", workflowId: "wf-1", startedAt: "2026-10-24T05:00:00.000Z", endedAt: "2026-10-24T05:02:10.000Z", status: "succeeded", startedBy: "زمان‌بندی: هر شنبه ۰۸:۰۰",
    steps: [
      { nodeId: "n1", label: "ساخت آمار فروش", status: "succeeded", durationMs: 4200, output: "آمار ۳۱ استان دریافت شد.", modelName: "Claude Sonnet", inputTokens: 912, outputTokens: 466 },
      { nodeId: "n2", label: "نوشتن گزارش", status: "succeeded", durationMs: 6100, output: "گزارش ۴ پاراگرافی نوشته شد.", modelName: "Mistral", inputTokens: 1380, outputTokens: 702 },
      { nodeId: "n3", label: "تأیید مدیر", status: "succeeded", durationMs: 98000, output: "تأیید شد." },
      { nodeId: "n4", label: "ارسال پیامک", status: "succeeded", durationMs: 900, output: "پیامک ارسال شد." },
    ],
  },
  {
    id: "run-2", workflowId: "wf-1", startedAt: "2026-10-17T05:00:00.000Z", endedAt: "2026-10-17T05:00:12.000Z", status: "failed", startedBy: "زمان‌بندی: هر شنبه ۰۸:۰۰",
    steps: [
      { nodeId: "n1", label: "ساخت آمار فروش", status: "failed", durationMs: 12000, error: "انبار داده در زمان مشخص پاسخ نداد." },
      { nodeId: "n2", label: "نوشتن گزارش", status: "skipped" },
      { nodeId: "n3", label: "تأیید مدیر", status: "skipped" },
      { nodeId: "n4", label: "ارسال پیامک", status: "skipped" },
    ],
  },
  {
    id: "run-5", workflowId: "wf-5", startedAt: "2026-10-29T08:35:00.000Z", endedAt: "2026-10-29T08:41:30.000Z", status: "succeeded", startedBy: "رویداد: رسیدن ایمیل تازه",
    steps: [
      { nodeId: "n1", label: "درخواست مشتری", status: "succeeded", durationMs: 3100, output: "آریاپلاست، ۲۰ تن PP-T20، تحویل ظرف ۱۰ روز.", modelName: "Claude Sonnet", inputTokens: 780, outputTokens: 150 },
      { nodeId: "n2", label: "نرخ مواد اولیه", status: "succeeded", durationMs: 1200, output: "قیمت پایه‌ی PP کوپلیمر ۷۸٬۴۰۰ تومان بر کیلوگرم." },
      { nodeId: "n3", label: "موجودی و ظرفیت", status: "succeeded", durationMs: 1400, output: "۲۰ تن تا ۹ روز دیگر قابل تحویل است." },
      { nodeId: "n4", label: "محاسبه‌ی قیمت", status: "succeeded", durationMs: 4800, output: "قیمت پیشنهادی ۱۰۴٬۴۰۰ تومان بر کیلوگرم، حاشیه‌ی ۱۲٪.", modelName: "Claude Sonnet", inputTokens: 1620, outputTokens: 520 },
      { nodeId: "n5", label: "قیمت پایه بالاست؟", status: "succeeded", durationMs: 200, output: "بله: قیمت پایه ۷۸٬۴۰۰ تومان است و مدیر فروش باید تأیید کند." },
      { nodeId: "n6", label: "تأیید مدیر فروش", status: "succeeded", durationMs: 312000, output: "تأیید شد." },
      { nodeId: "n7", label: "پیش‌نویس پیش‌فاکتور", status: "succeeded", durationMs: 5600, output: "پیش‌فاکتور با اعتبار ۵ روز نوشته شد.", modelName: "Mistral", inputTokens: 1450, outputTokens: 640 },
      { nodeId: "n8", label: "اعلام به کانال فروش", status: "succeeded", durationMs: 900, output: "پیام در کانال فروش شبکه اجتماعی سازمان گذاشته شد." },
    ],
  },
  {
    id: "run-6", workflowId: "wf-6", startedAt: "2026-10-31T05:00:00.000Z", endedAt: "2026-10-31T05:06:40.000Z", status: "succeeded", startedBy: "زمان‌بندی: هر روز ۰۸:۰۰",
    steps: [
      { nodeId: "n1", label: "مواد کم‌موجودی", status: "succeeded", durationMs: 1600, output: "۳ ماده از ۶ ماده زیر نقطه‌ی سفارش است؛ HD5502 فقط ۳ روز پوشش دارد." },
      { nodeId: "n2", label: "محموله‌های در راه", status: "succeeded", durationMs: 1500, output: "محموله‌ی HD5502 تا ۱۸ آبان در گمرک است." },
      { nodeId: "n3", label: "کمبود پیش‌بینی می‌شود؟", status: "succeeded", durationMs: 250, output: "بله: حدود ۸ روز بدون موجودی HD5502." },
      { nodeId: "n4", label: "تأیید مدیر تدارک", status: "succeeded", durationMs: 214000, output: "تأیید شد." },
      { nodeId: "n5", label: "استعلام قیمت", status: "succeeded", durationMs: 2400, output: "از سه تامین‌کننده قیمت گرفته شد." },
      { nodeId: "n6", label: "مقایسه‌ی قیمت‌ها", status: "succeeded", durationMs: 5200, output: "پلیمر خزر: قیمت مناسب و تحویل ۷ روزه؛ گزینه‌ی برتر.", modelName: "Claude Sonnet", inputTokens: 1480, outputTokens: 520 },
      { nodeId: "n7", label: "پیش‌نویس سفارش خرید", status: "succeeded", durationMs: 1100, output: "پیش‌نویس ۸۰ تن HD5502 ساخته شد." },
      { nodeId: "n8", label: "اعلام به تدارک", status: "succeeded", durationMs: 800, output: "پیام در کانال تدارک گذاشته شد." },
      { nodeId: "n9", label: "ثبت وظیفه‌ی بازبینی", status: "succeeded", durationMs: 700, output: "وظیفه‌ی «بازبینی و تأیید نهایی پیش‌نویس سفارش ۸۰ تن HD5502» در وظایف من ثبت شد." },
    ],
  },
];

export function getWorkflows(): Workflow[] {
  return workflows;
}

export function getRuns(): Run[] {
  return runs;
}
