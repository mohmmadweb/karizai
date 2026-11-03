import type { Run, Workflow } from "../types";
import { getTemplates } from "./templates";

const [weekly, customer, , indicators, pricing, reorder, planning, supervised] = getTemplates();

const workflows: Workflow[] = [
  { id: "wf-1", name: weekly.name, description: weekly.description, status: "active", triggers: weekly.triggers, nodes: weekly.nodes, edges: weekly.edges, updatedAt: "2026-10-20T09:00:00.000Z", lastRunAt: "2026-10-24T05:00:00.000Z" },
  { id: "wf-2", name: customer.name, description: customer.description, status: "pending-approval", triggers: customer.triggers, nodes: customer.nodes, edges: customer.edges, updatedAt: "2026-10-25T11:30:00.000Z" },
  {
    id: "wf-3", name: "یادآوری مرخصی", description: "هر روز ساعت ۹ مانده‌ی مرخصی را بررسی می‌کند.", status: "paused",
    triggers: [{ kind: "schedule", every: "daily", time: "09:00" }],
    nodes: [{ id: "n1", kind: "tool", label: "مانده‌ی مرخصی", position: { x: 0, y: 0 }, config: { connectionId: "conn-3", toolId: "tool-6", params: { p0: "کابل شبکه" }, instruction: "مانده را بخوان." } }],
    edges: [], updatedAt: "2026-10-10T08:00:00.000Z", lastRunAt: "2026-10-18T05:30:00.000Z",
  },
  { id: "wf-4", name: indicators.name, description: indicators.description, status: "active", triggers: indicators.triggers, nodes: indicators.nodes, edges: indicators.edges, updatedAt: "2026-10-27T08:00:00.000Z", lastRunAt: "2026-10-30T14:10:00.000Z" },
  { id: "wf-5", name: pricing.name, description: pricing.description, status: "active", triggers: pricing.triggers, nodes: pricing.nodes, edges: pricing.edges, updatedAt: "2026-10-28T10:00:00.000Z", lastRunAt: "2026-10-29T08:35:00.000Z" },
  { id: "wf-6", name: reorder.name, description: reorder.description, status: "active", triggers: reorder.triggers, nodes: reorder.nodes, edges: reorder.edges, updatedAt: "2026-10-30T09:00:00.000Z", lastRunAt: "2026-10-31T05:00:00.000Z" },
  { id: "wf-7", name: planning.name, description: planning.description, status: "active", triggers: planning.triggers, nodes: planning.nodes, edges: planning.edges, updatedAt: "2026-11-01T07:00:00.000Z", lastRunAt: "2026-11-02T02:30:00.000Z" },
  { id: "wf-8", name: supervised.name, description: supervised.description, status: "draft", triggers: supervised.triggers, nodes: supervised.nodes, edges: supervised.edges, updatedAt: "2026-11-02T10:00:00.000Z" },
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
    id: "run-3", workflowId: "wf-4", startedAt: "2026-10-30T14:10:00.000Z", endedAt: "2026-10-30T14:10:09.000Z", status: "succeeded", startedBy: "رویداد: خروج یک شاخص از حد مجاز",
    steps: [
      { nodeId: "n1", label: "شاخص‌های خط ۲", status: "succeeded", durationMs: 1800, output: "۶ شاخص خط ۲ خوانده شد؛ ۲ شاخص خارج از حد است." },
      { nodeId: "n5", label: "دمای ناحیه ۴", status: "succeeded", durationMs: 900, output: "آخرین مقدار ۲۴۸ °C؛ میانگین ۶۰ ثانیه ۲۴۶٫۵ °C." },
      { nodeId: "n2", label: "دما بالاتر از ۲۴۰؟", status: "succeeded", durationMs: 300, output: "بله: ۲۴۸ از ۲۴۰ بیشتر است." },
      { nodeId: "n3", label: "تحلیل علت", status: "succeeded", durationMs: 5200, output: "دما از ساعت ۱۴ بالا رفته و ضایعات حدود دو ساعت بعد؛ علت احتمالی ضایعات، دمای بالای ناحیه‌ی ۴ است.", modelName: "Claude Sonnet", inputTokens: 1240, outputTokens: 410 },
      { nodeId: "n4", label: "هشدار به مسئول", status: "succeeded", durationMs: 700, output: "هشدار برای سرپرست خط ۲ و مدیر تولید در شبکه اجتماعی سازمان ساخته شد." },
    ],
  },
  {
    id: "run-4", workflowId: "wf-4", startedAt: "2026-10-30T13:00:00.000Z", endedAt: "2026-10-30T13:00:03.000Z", status: "succeeded", startedBy: "زمان‌بندی: هر ساعت",
    steps: [
      { nodeId: "n1", label: "شاخص‌های خط ۲", status: "succeeded", durationMs: 1700, output: "۶ شاخص خط ۲ خوانده شد." },
      { nodeId: "n5", label: "دمای ناحیه ۴", status: "succeeded", durationMs: 800, output: "آخرین مقدار ۲۳۶ °C؛ میانگین ۶۰ ثانیه ۲۳۵٫۸ °C." },
      { nodeId: "n2", label: "دما بالاتر از ۲۴۰؟", status: "succeeded", durationMs: 250, output: "خیر: ۲۳۶ از ۲۴۰ بیشتر نیست." },
      { nodeId: "n3", label: "تحلیل علت", status: "skipped" },
      { nodeId: "n4", label: "هشدار به مسئول", status: "skipped" },
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
      { nodeId: "n1", label: "راهکاران: موجودی", status: "succeeded", durationMs: 1600, output: "۳ ماده از ۶ ماده زیر نقطه‌ی سفارش است؛ HD5502 با ۱۸ تن (نقطه‌ی سفارش ۴۰ تن) فقط ۳ روز پوشش دارد." },
      { nodeId: "n2", label: "SQL: محموله‌های در راه", status: "succeeded", durationMs: 1500, output: "محموله‌ی HD5502 تا ۱۸ آبان در گمرک است." },
      { nodeId: "n10", label: "✦ پیش‌بینی کمبود مواد", status: "succeeded", durationMs: 700, modelName: "XGBoost · نسخه ۳", output: "روز تا کمبود = ۳٫۲ روز · احتمال کمبود = ۸۷٪" },
      { nodeId: "n3", label: "کمتر از ۷ روز تا کمبود؟", status: "succeeded", durationMs: 250, output: "بله: ۳٫۲ روز تا کمبود HD5502." },
      { nodeId: "n4", label: "تأیید مدیر تدارکات", status: "succeeded", durationMs: 214000, output: "تأیید شد." },
      { nodeId: "n5", label: "استعلام از تامین‌کنندگان", status: "succeeded", durationMs: 2400, output: "از سه تامین‌کننده قیمت گرفته شد." },
      { nodeId: "n6", label: "✦ جدول مقایسه", status: "succeeded", durationMs: 5200, output: "پلیمر خزر: قیمت مناسب و تحویل ۷ روزه؛ گزینه‌ی برتر.", modelName: "Claude Sonnet", inputTokens: 1480, outputTokens: 520 },
      { nodeId: "n7", label: "راهکاران: پیش‌نویس سفارش خرید", status: "succeeded", durationMs: 1100, output: "پیش‌نویس سفارش خرید PO-1405-0862 در راهکاران ثبت شد: ۸۰ تن HD5502 از پلیمر خزر." },
      { nodeId: "n8", label: "🔔 اعلان در کاریز", status: "succeeded", durationMs: 800, output: "پیام در کانال تدارک گذاشته شد." },
      { nodeId: "n9", label: "ثبت وظیفه‌ی بازبینی", status: "succeeded", durationMs: 700, output: "وظیفه‌ی «بازبینی و تأیید نهایی پیش‌نویس سفارش ۸۰ تن HD5502» در وظایف من ثبت شد." },
    ],
  },
  {
    id: "run-7", workflowId: "wf-7", startedAt: "2026-11-02T02:30:00.000Z", endedAt: "2026-11-02T02:34:40.000Z", status: "succeeded", startedBy: "زمان‌بندی: هر روز ۰۶:۰۰", savedMs: 3400,
    steps: [
      { nodeId: "p1", label: "راهکاران: سفارش‌های باز", status: "succeeded", durationMs: 1400, output: "۱۴ سفارش باز فروش برای ۱۰ روز آینده، جمعاً ۳۱۲ تن در ۶ گرید." },
      { nodeId: "p2", label: "شاخه‌ی موازی", status: "succeeded", durationMs: 200, output: "۳ شاخه هم‌زمان شروع شد." },
      { nodeId: "p3", label: "MES: ظرفیت خطوط", status: "succeeded", durationMs: 1800, parallel: true, output: "خط ۱ و ۲ آماده، خط ۳ از ساعت ۱۴ تا ۱۸ توقف دارد." },
      { nodeId: "p4", label: "انبار: موجودی مواد", status: "succeeded", durationMs: 1600, parallel: true, output: "مواد ۱۲ سفارش موجود است؛ ۲ سفارش منتظر HD5502." },
      { nodeId: "p5", label: "CMMS: توقف‌های برنامه‌ریزی‌شده", status: "succeeded", durationMs: 1700, parallel: true, output: "تعویض اسکرو خط ۳، ۴ ساعت." },
      { nodeId: "p6", label: "پیوستن شاخه‌ها", status: "succeeded", durationMs: 200, output: "۳ شاخه تمام شد و نتیجه‌ها یکی شد." },
      { nodeId: "p7", label: "✦ بهینه‌ساز زمان‌بندی خطوط", status: "succeeded", durationMs: 2600, modelName: "برنامه‌ریزی محدودیت (CP-SAT)", output: "تعداد تعویض فرمول = ۴ · بهره‌وری خطوط = ۹۱ ٪ · سفارش‌های دیرکرد = ۱" },
      { nodeId: "p8", label: "پیشنهاد برنامه و تعویض فرمول", status: "succeeded", durationMs: 5100, modelName: "Qwen", inputTokens: 1720, outputTokens: 860, output: "خط ۱: PP-T20 طبیعی ← PP-T20 مشکی؛ خط ۲: کامپاند PE سفید ← طوسی؛ تعویض‌های هم‌رنگ پشت هم چیده شد." },
      { nodeId: "p9", label: "بیش از ۳ تعویض فرمول؟", status: "succeeded", durationMs: 200, output: "بله: ۴ تعویض فرمول." },
      { nodeId: "p10", label: "تأیید مدیر تولید", status: "succeeded", durationMs: 141000, output: "تأیید شد." },
      { nodeId: "p11", label: "اعلام برنامه به کانال تولید", status: "succeeded", durationMs: 800, output: "برنامه در کانال تولید اعلام شد." },
    ],
  },
];

export function getWorkflows(): Workflow[] {
  return workflows;
}

export function getRuns(): Run[] {
  return runs;
}
