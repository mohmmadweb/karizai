import type { Agent } from "@/features/agents/types";
import type { AnswerAction, GeneratedFile, Source, StructuredResult } from "../types";

export type Role = "document" | "bi" | null;

export type Reply = {
  text: string;
  sources: Source[];
  toolNames: string[];
  structured?: StructuredResult;
  files?: GeneratedFile[];
  actions?: AnswerAction[];
  routerReason?: string;
};

const documentSources: Source[] = [
  { id: "src-a", title: "راهنمای کارکنان سازمان", kind: "document", section: "بخش مرخصی‌ها" },
  { id: "src-b", title: "آیین‌نامه‌ی معاملات سازمان", kind: "document", section: "فصل ۲، ماده ۷" },
];

const webSources: Source[] = [
  { id: "web-1", title: "گزارش خبری درباره‌ی موضوع", kind: "web", url: "https://example.com/news/1" },
  { id: "web-2", title: "مقاله‌ی تحلیلی", kind: "web", url: "https://example.com/articles/2" },
];

const provinceSales = {
  columns: ["استان", "فروش (میلیون تومان)"],
  rows: [["تهران", 820], ["اصفهان", 410], ["فارس", 365], ["خراسان رضوی", 340], ["آذربایجان شرقی", 280]],
};

/** Decides which built-in assistant answers; the router picks one by keywords when none is chosen. */
export function resolveRole(text: string, agent: Agent | null, capabilities: string[]): { role: Role; auto: boolean } {
  if (agent) return { role: agent.systemRole ?? null, auto: false };
  if (capabilities.includes("data") && /(فروش|نمودار|گزارش داده|تعداد مشتری)/.test(text)) return { role: "bi", auto: true };
  if (capabilities.includes("knowledge") && /(آیین‌نامه|دستورالعمل|مرخصی|سند)/.test(text)) return { role: "document", auto: true };
  return { role: null, auto: false };
}

function dataReply(question: string): Reply {
  if (/(حذف|تغییر|درج|به‌روزرسانی)/.test(question)) {
    return { text: "انبار داده فقط‌خواندنی است و نمی‌توانم داده‌ای را حذف یا تغییر دهم. اگر می‌خواهید آمار ببینید، سؤال را به صورت پرسش بنویسید.", sources: [], toolNames: ["دستیار هوش تجاری"] };
  }
  if (/(روند|ماهانه|هر ماه)/.test(question)) {
    return {
      text: "روند فروش شش ماه اخیر را در نمودار می‌بینید.",
      sources: [], toolNames: ["دستیار هوش تجاری"],
      structured: { query: "SELECT month, SUM(amount) FROM sales GROUP BY month ORDER BY month", columns: ["ماه", "فروش (میلیون تومان)"], rows: [["اردیبهشت", 310], ["خرداد", 360], ["تیر", 340], ["مرداد", 420], ["شهریور", 455], ["مهر", 510]], suggested: "line" },
    };
  }
  if (/سهم/.test(question)) {
    return { text: "سهم هر استان از فروش:", sources: [], toolNames: ["دستیار هوش تجاری"], structured: { query: "SELECT province, SUM(amount) FROM sales GROUP BY province", ...provinceSales, suggested: "pie" } };
  }
  if (/(تعداد|چند)/.test(question)) {
    return { text: "تعداد مشتریان فعال این ماه:", sources: [], toolNames: ["دستیار هوش تجاری"], structured: { query: "SELECT COUNT(*) FROM customers WHERE active = 1", columns: ["تعداد مشتریان فعال"], rows: [[1284]], suggested: "card" } };
  }
  if (/(فروش|استان|گزارش)/.test(question)) {
    return { text: "فروش این ماه به تفکیک استان:", sources: [], toolNames: ["دستیار هوش تجاری"], structured: { query: "SELECT province, SUM(amount) FROM sales WHERE month = '1405-07' GROUP BY province", ...provinceSales, suggested: "bar" } };
  }
  return { text: "پس از چند بار تلاش، داده‌ای که با این پرسش جور باشد در انبار داده پیدا نکردم. لطفاً نام شاخص یا بازه‌ی زمانی را دقیق‌تر بنویسید؛ مثلاً «فروش این ماه به تفکیک استان».", sources: [], toolNames: ["دستیار هوش تجاری"] };
}

function documentReply(question: string): Reply {
  if (!/(آیین‌نامه|دستورالعمل|مرخصی|سند|قرارداد|قیمت|امنیت)/.test(question)) {
    return { text: "در اسناد مجاز شما پاسخی برای این پرسش پیدا نکردم و ترجیح می‌دهم جواب نسازم. پرسش را با نام سند یا موضوع دقیق‌تر بنویسید.", sources: [], toolNames: ["دستیار سند"] };
  }
  return {
    text: "طبق اسناد سازمان، هر کارمند سالانه ۲۶ روز مرخصی استحقاقی دارد و درخواست مرخصی باید دست‌کم سه روز قبل ثبت شود. معاملات بالای سقف تعیین‌شده نیز به تأیید کمیته نیاز دارند.",
    sources: documentSources, toolNames: ["دستیار سند"],
  };
}

/** Builds the canned answer text and details; no model is called. */
export function buildReply(question: string, agent: Agent | null, role: Role, webSearch: boolean): Reply {
  if (role === "bi") return dataReply(question);
  if (role === "document") return documentReply(question);
  const prefix = agent ? `به عنوان «${agent.name}»، ` : "";
  const searched = webSearch && /(اخبار|امروز|جدیدترین|امسال)/.test(question);
  return {
    text: `${prefix}درباره‌ی «${question.slice(0, 60)}» این نکته‌ها را می‌توانم بگویم:\n\n- **هدف** را روشن کنید.\n- اطلاعات لازم را کنار هم بگذارید.\n- نتیجه را بازبینی کنید.\n\nاگر جزئیات بیشتری بدهید، پاسخ دقیق‌تری می‌نویسم.`,
    sources: searched ? webSources : [],
    toolNames: searched ? ["وب‌سرچ"] : [],
  };
}

/** Rough token cost of one exchange, used for the quota bar. */
export function estimateUsage(question: string, answer: string): number {
  return (question.length + answer.length) * 4;
}
