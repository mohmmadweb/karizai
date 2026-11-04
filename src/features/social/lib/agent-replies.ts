import { getAgentMember, getAgentMembers } from "../data/agents";
import type { AgentAnswer } from "../types";

type Reply = { match?: RegExp; text: string; sources: string[] };

const rejectedBatch: Reply = {
  match: /(مردود|علت|۲۲۱۷|2217|لکه|رنگ|بچ)/,
  text: "علت محتمل مردودی بچ B-1405-2217 پخش ناکامل مستربچ مشکیِ تأمین‌کننده‌ی تازه است؛ دمای ناحیه‌ی ۴ هم ۸ درجه بالاتر از معمول ثبت شده. پیشنهاد: یک نمونه با مستربچ قبلی بسازید و دمای ناحیه‌ی ۴ را به ۲۳۵ درجه برگردانید.",
  sources: ["LIMS: آزمون بچ B-1405-2217", "MES: روند دمای ناحیه‌ی ۴", "QC-SOP-07 بند ۴.۲"],
};

const lastRepair: Reply = {
  match: /(دما|آلارم|تعمیر|ناحیه|گرمکن|حسگر)/,
  text: "دفعه‌ی قبل که دمای ناحیه‌ی ۴ از حد گذشت (۱۸ مرداد)، علت شل‌شدن اتصال ترموکوپل بود و با سفت‌کردن اتصال و کالیبراسیون حسگر حل شد؛ ۴۵ دقیقه توقف خط.",
  sources: ["CMMS: دستور کار WO-3381", "گروه «نگهداری و تعمیرات»"],
};

const replies: Record<string, Reply[]> = {
  "agent-quality": [
    { match: /(گرید|جایگزین|مستربچ)/, text: "در شش ماه گذشته دو بار گرید جایگزین آزمون شده و نتایج در «گزارش آزمون ۱۴۰۵/۰۳» است. MFI گرید جایگزین ۱۲٫۱ و در حد مجاز (۱۰ تا ۱۴) بود؛ اختلاف رنگ هم زیر ۱٫۲ ماند.", sources: ["گزارش آزمون ۱۴۰۵/۰۳", "LIMS: نتایج گرید جایگزین"] },
    rejectedBatch,
    { match: /(MFI|فرمول|رسپی|ضربه)/i, text: "نزدیک‌ترین فرمول ثبت‌شده PP-T20-I است: MFI حدود ۱۲ و مقاومت ضربه‌ی ۵۲ کیلوژول بر متر مربع.", sources: ["LIMS: فرمول‌های ثبت‌شده"] },
    { text: "پرسش را دیدم. برای پاسخ دقیق، شماره‌ی بچ یا نام گرید را بنویسید؛ آخرین نتایج آزمایشگاه در دسترس من است.", sources: ["LIMS: آخرین آزمون‌ها"] },
  ],
  "agent-maint": [lastRepair, { text: "سوابق تعمیرات این تجهیز را بررسی کردم؛ در سه ماه گذشته دو دستور کار بسته شده و قطعه‌ی یدک گرمکن در انبار موجود است.", sources: ["CMMS: سوابق تعمیرات"] }],
  "agent-indicators": [{ text: "دمای ناحیه‌ی ۴ الان ۲۴۸ درجه است (حد ۲۴۰) و ضایعات خط ۲ به ۴٫۸٪ رسیده (حد ۴٪). روند ۲۴ ساعته از ساعت ۶ صبح رو به بالاست.", sources: ["MES: شاخص‌های لحظه‌ای خط ۲", "MES: روند ۲۴ ساعته"] }],
  "agent-pricing": [{ text: "پیش‌فاکتور فروش به مبلغ ۲٬۲۹۶٫۸ میلیون تومان آماده است و منتظر تأیید مدیر فروش است.", sources: ["جریان «پیش‌فاکتور و قیمت‌گذاری خودکار»"] }],
  "agent-doc": [{ text: "طبق رویه‌ی QC-SOP-07، از هر محموله دست‌کم سه نمونه از کیسه‌های مختلف گرفته می‌شود و آزمون‌های MFI، رطوبت و رنگ اجباری است.", sources: ["QC-SOP-07 · صفحه‌های ۲ تا ۵"] }],
  assistant: [
    rejectedBatch,
    { match: /(موجودی|HD5502|سفارش|خرید)/i, text: "موجودی HD5502 الان ۱۸ تن است (۳ روز پوشش). جریان سفارش‌دهی خودکار ۸۰ تن پیشنهاد داده و بهترین قیمت از پلیمر خزر با تحویل ۷ روزه است.", sources: ["SQL Server انبار: موجودی HD5502", "جریان «سفارش‌دهی خودکار مواد اولیه»"] },
    lastRepair,
    { text: "از دانش سازمانی و گفتگوهای همکاران پاسخ را آماده کردم؛ اگر شماره‌ی بچ، کالا یا تجهیز را بنویسید دقیق‌تر جواب می‌دهم.", sources: ["دانش سازمانی"] },
  ],
};

/** The Agent called in a message by its handle (for example «@دستیار کیفیت»), longest handle first. */
export function mentionedAgentId(text: string): string | undefined {
  const sorted = [...getAgentMembers()].sort((a, b) => b.handle.length - a.handle.length);
  return sorted.find((agent) => text.includes(agent.handle))?.id;
}

/** True when a message calls an Agent or the general assistant with «@دستیار». */
export function callsAssistant(text: string): boolean {
  return text.includes("@دستیار") || mentionedAgentId(text) !== undefined;
}

/** The prepared answer of an Agent (or of the general assistant, `assistant`) to a message. */
export function agentAnswer(agentId: string, text: string): AgentAnswer {
  const list = replies[agentId] ?? replies.assistant;
  const reply = list.find((item) => item.match?.test(text)) ?? list.find((item) => !item.match) ?? list[0];
  return { agentId, agentName: getAgentMember(agentId)?.name ?? "دستیار هوشمند", text: reply.text, sources: reply.sources };
}
