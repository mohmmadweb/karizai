import type { WorkflowTemplate } from "../types";

const templates: WorkflowTemplate[] = [
  {
    id: "tpl-weekly-report",
    name: "گزارش فروش هفتگی",
    description: "هر هفته آمار فروش را می‌سازد، متن گزارش را می‌نویسد و برای مدیر می‌فرستد.",
    triggers: [{ kind: "schedule", every: "weekly", weekday: "sat", time: "08:00" }],
    nodes: [
      { id: "n1", kind: "agent", label: "ساخت آمار فروش", position: { x: 0, y: 0 }, config: { agentId: "agent-bi", instruction: "فروش هفته‌ی گذشته را به تفکیک استان بگیر." } },
      { id: "n2", kind: "agent", label: "نوشتن گزارش", position: { x: 0, y: 117 }, config: { agentId: "agent-2", instruction: "از آمار یک گزارش کوتاه و رسمی بنویس." } },
      { id: "n3", kind: "approval", label: "تأیید مدیر", position: { x: 0, y: 234 }, config: { instruction: "گزارش را بخوانید و تأیید کنید." } },
      { id: "n4", kind: "tool", label: "ارسال پیامک", position: { x: 0, y: 351 }, config: { connectionId: "conn-7", toolId: "tool-12", params: { p0: "۰۹۱۲۰۰۰۰۰۰۰", p1: "گزارش فروش هفته آماده است." }, instruction: "گزارش را برای مدیر بفرست." } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4" },
    ],
  },
  {
    id: "tpl-new-customer",
    name: "خلاصه‌ی مشتری جدید",
    description: "وقتی مشتری تازه‌ای ثبت شد، پرونده‌اش را خلاصه می‌کند و یادداشت پیگیری می‌گذارد.",
    triggers: [{ kind: "event", event: "new-customer" }],
    nodes: [
      { id: "n1", kind: "tool", label: "جست‌وجوی مشتری", position: { x: 0, y: 0 }, config: { connectionId: "conn-1", toolId: "tool-1", params: { p0: "مشتری تازه" }, instruction: "اطلاعات مشتری تازه را بگیر." } },
      { id: "n2", kind: "condition", label: "مشتری سازمانی است؟", position: { x: 0, y: 117 }, config: { condition: "نوع مشتری سازمانی باشد" } },
      { id: "n3", kind: "agent", label: "خلاصه برای تیم فروش", position: { x: -120, y: 234 }, config: { agentId: "agent-1", instruction: "یک خلاصه‌ی کوتاه از مشتری بنویس." } },
      { id: "n4", kind: "tool", label: "ثبت یادداشت پیگیری", position: { x: -120, y: 351 }, config: { connectionId: "conn-1", toolId: "tool-2", params: { p0: "مشتری تازه", p1: "خلاصه‌ی پرونده برای پیگیری" }, instruction: "خلاصه را به پرونده اضافه کن." } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3", label: "بله" },
      { id: "e3", source: "n3", target: "n4" },
    ],
  },
  {
    id: "tpl-multi-agent",
    name: "آماده‌سازی جلسه (چند Agent)",
    description: "یک Agent هماهنگ‌کننده کار را بین Agent هوش تجاری، Agent سند و Agent نگارش تقسیم می‌کند.",
    triggers: [{ kind: "manual" }],
    nodes: [
      { id: "n1", kind: "orchestrator", label: "هماهنگ‌کننده‌ی جلسه", position: { x: 0, y: 0 }, config: { childAgentIds: ["agent-bi", "agent-doc", "agent-2"], maxSteps: 8, instruction: "برای جلسه‌ی فردا آمار فروش، خلاصه‌ی قرارداد و دستور جلسه را آماده کن." } },
      { id: "n2", kind: "approval", label: "بازبینی نهایی", position: { x: 0, y: 135 }, config: { instruction: "نتیجه را قبل از ارسال بررسی کنید." } },
    ],
    edges: [{ id: "e1", source: "n1", target: "n2" }],
  },
  {
    id: "tpl-pricing",
    name: "پیش‌فاکتور و قیمت‌گذاری خودکار",
    description: "از ایمیل استعلام مشتری، قیمت و حاشیه‌ی سود را حساب می‌کند، اگر ماده گران باشد تأیید مدیر فروش می‌گیرد و پیش‌فاکتور را آماده می‌کند.",
    triggers: [{ kind: "event", event: "new-email" }],
    nodes: [
      { id: "n1", kind: "agent", label: "درخواست مشتری", position: { x: 0, y: 0 }, config: { agentId: "agent-pricing", params: { inputFrom: "instruction", maxOutputTokens: "800" }, instruction: "از ایمیل، ماده، مقدار و زمان تحویل را بیرون بکش." } },
      { id: "n2", kind: "tool", label: "نرخ مواد اولیه", position: { x: 0, y: 117 }, config: { connectionId: "conn-18", toolId: "tool-31", params: { material: "PP کوپلیمر" }, instruction: "نرخ مرجع امروز و قیمت پایه‌ی مواد را بخوان." } },
      { id: "n3", kind: "tool", label: "موجودی و ظرفیت", position: { x: 0, y: 234 }, config: { connectionId: "conn-12", toolId: "tool-20", params: { query: "موجودی مواد لازم برای سفارش مشتری و زمان تحویل", maxRows: "50" }, instruction: "موجودی مواد لازم و زمان تحویل را بخوان." } },
      { id: "n4", kind: "agent", label: "محاسبه‌ی قیمت", position: { x: 0, y: 351 }, config: { agentId: "agent-pricing", params: { inputFrom: "previous", maxOutputTokens: "1500" }, instruction: "قیمت تمام‌شده و قیمت پیشنهادی را حساب کن." } },
      { id: "n5", kind: "condition", label: "قیمت پایه بالاست؟", position: { x: 0, y: 468 }, config: { condition: "قیمت پایه بیشتر از ۷۵۰۰۰ تومان بر کیلوگرم", rule: { sourceNodeId: "n2", field: "price", operator: ">", value: "75000" } } },
      { id: "n6", kind: "approval", label: "تأیید مدیر فروش", position: { x: -120, y: 585 }, config: { instruction: "قیمت پیشنهادی را بخوانید و تأیید کنید." } },
      { id: "n7", kind: "agent", label: "پیش‌نویس پیش‌فاکتور", position: { x: 0, y: 702 }, config: { agentId: "agent-2", params: { inputFrom: "previous", maxOutputTokens: "2000" }, instruction: "پیش‌فاکتور رسمی را با قیمت و زمان تحویل بنویس." } },
      { id: "n8", kind: "tool", label: "اعلام به کانال فروش", position: { x: 0, y: 819 }, config: { connectionId: "conn-15", toolId: "tool-27", params: { channel: "فروش", message: "پیش‌فاکتور مشتری آماده و برای او ارسال شد." }, instruction: "ارسال پیش‌فاکتور را به تیم فروش اطلاع بده." } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4" },
      { id: "e4", source: "n4", target: "n5" },
      { id: "e5", source: "n5", target: "n6", label: "بله" },
      { id: "e6", source: "n5", target: "n7", label: "خیر" },
      { id: "e7", source: "n6", target: "n7" },
      { id: "e8", source: "n7", target: "n8" },
    ],
  },
  {
    id: "tpl-reorder",
    name: "سفارش‌دهی خودکار مواد اولیه",
    description: "هر روز موجودی را با محموله‌های در راه مقایسه می‌کند. اگر کمبود پیش‌بینی شود، پس از تأیید مدیر تدارک از تامین‌کنندگان قیمت می‌گیرد، مقایسه می‌کند و پیش‌نویس سفارش خرید را آماده می‌کند.",
    triggers: [{ kind: "schedule", every: "daily", time: "08:00" }],
    nodes: [
      { id: "n1", kind: "tool", label: "مواد کم‌موجودی", position: { x: 0, y: 0 }, config: { connectionId: "conn-12", toolId: "tool-20", params: { query: "کدام مواد اولیه به نقطه‌ی سفارش رسیده‌اند؟", maxRows: "50" }, instruction: "مواد زیر نقطه‌ی سفارش و پوشش روزانه‌شان را بخوان." } },
      { id: "n2", kind: "tool", label: "محموله‌های در راه", position: { x: 0, y: 117 }, config: { connectionId: "conn-13", toolId: "tool-22", params: { query: "محموله‌های در راه این مواد و تاریخ رسیدنشان", maxRows: "50" }, instruction: "سفارش‌های باز و تاریخ ورود را بخوان." } },
      { id: "n3", kind: "condition", label: "کمبود پیش‌بینی می‌شود؟", position: { x: 0, y: 234 }, config: { condition: "پوشش موجودی پیش از رسیدن محموله تمام شود" } },
      { id: "n4", kind: "approval", label: "تأیید مدیر تدارک", position: { x: -120, y: 351 }, config: { instruction: "کمبود پیش‌بینی شده است. استعلام قیمت شروع شود؟" } },
      { id: "n5", kind: "tool", label: "استعلام قیمت", position: { x: -120, y: 468 }, config: { connectionId: "conn-18", toolId: "tool-32", params: { material: "PE سنگین HD5502", quantityTon: "80", vendors: "3" }, instruction: "از سه تامین‌کننده قیمت بگیر." } },
      { id: "n6", kind: "agent", label: "مقایسه‌ی قیمت‌ها", position: { x: -120, y: 585 }, config: { agentId: "agent-pricing", params: { inputFrom: "previous", maxOutputTokens: "1500" }, instruction: "قیمت، حداقل سفارش و زمان تحویل را مقایسه کن و بهترین گزینه را با دلیل بنویس." } },
      { id: "n7", kind: "tool", label: "پیش‌نویس سفارش خرید", position: { x: -120, y: 702 }, config: { connectionId: "conn-13", toolId: "tool-23", params: { material: "PE سنگین HD5502", quantityTon: "80", vendor: "پلیمر خزر" }, instruction: "پیش‌نویس سفارش خرید را با گزینه‌ی برتر بساز." } },
      { id: "n8", kind: "tool", label: "اعلام به تدارک", position: { x: -120, y: 819 }, config: { connectionId: "conn-15", toolId: "tool-27", params: { channel: "تدارک", message: "پیش‌نویس سفارش خرید آماده‌ی بررسی است." }, instruction: "آماده‌بودن پیش‌نویس را در کانال تدارک اعلام کن." } },
      { id: "n9", kind: "tool", label: "ثبت وظیفه‌ی بازبینی", position: { x: -120, y: 936 }, config: { connectionId: "conn-15", toolId: "tool-28", params: { project: "کاهش ریسک تأمین مواد اولیه", title: "بازبینی و تأیید نهایی پیش‌نویس سفارش ۸۰ تن HD5502", priority: "فوری" }, instruction: "یک وظیفه برای من ثبت کن تا پیش‌نویس سفارش را بازبینی و تأیید کنم." } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n4", label: "بله" },
      { id: "e4", source: "n4", target: "n5" },
      { id: "e5", source: "n5", target: "n6" },
      { id: "e6", source: "n6", target: "n7" },
      { id: "e7", source: "n7", target: "n8" },
      { id: "e8", source: "n8", target: "n9" },
    ],
  },
];

export function getTemplates(): WorkflowTemplate[] {
  return templates;
}
