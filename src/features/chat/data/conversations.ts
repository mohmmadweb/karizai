import type { Conversation, Message } from "../types";
import { scriptedExchange } from "../lib/scripted-message";
import { alarmQuestion, alarmReply } from "./scripted/maintenance";
import { moistureQuestion, moistureReply, secretQuestion, secretReply } from "./scripted/knowledge";
import { indicatorsQuestion, indicatorsReply, pricingQuestion, pricingReply } from "./scripted/pricing";
import { formulaQuestion, formulaReply, specksQuestion, specksReply } from "./scripted/quality";
import { inTransitQuestion, inTransitReply, reorderQuestion, reorderReply } from "./scripted/warehouse";

const sonnet = "Claude Sonnet";
const base = { model: "model-3", webSearch: false, supervisor: false } as const;

const conversations: Conversation[] = [
  { id: "conv-12", title: "وضعیت شاخص‌های خط ۲", updatedAt: "2026-10-30T11:05:00.000Z", settings: { ...base, connectionIds: [], agentId: "agent-indicators", knowledge: false } },
  { id: "conv-11", title: "قیمت و پیش‌فاکتور برای آریاپلاست", updatedAt: "2026-10-29T13:20:00.000Z", settings: { ...base, connectionIds: [], agentId: "agent-pricing", knowledge: false } },
  { id: "conv-10", title: "آلارم E-217 اکسترودر خط ۲", updatedAt: "2026-10-28T07:50:00.000Z", settings: { ...base, connectionIds: [], agentId: "agent-maint", knowledge: false } },
  { id: "conv-9", title: "شرایط خشک‌کردن و نگهداری مستربچ", updatedAt: "2026-10-27T10:15:00.000Z", settings: { ...base, connectionIds: [], agentId: null, knowledge: true } },
  { id: "conv-8", title: "علت لکه‌ی تیره و فرمول جایگزین", updatedAt: "2026-10-26T14:30:00.000Z", settings: { ...base, connectionIds: [], agentId: "agent-quality", knowledge: false } },
  { id: "conv-7", title: "مواد نیازمند سفارش و محموله‌های در راه", updatedAt: "2026-10-25T09:40:00.000Z", settings: { ...base, model: "auto", connectionIds: ["conn-12", "conn-13"], agentId: null, knowledge: false } },
  { id: "conv-1", title: "خلاصه‌ی قرارداد تأمین", updatedAt: "2026-10-18T14:20:00.000Z", settings: { model: "auto", connectionIds: [], agentId: null, webSearch: true, knowledge: false, supervisor: false } },
  { id: "conv-2", title: "برنامه‌ی جلسه‌ی فروش", updatedAt: "2026-10-16T09:10:00.000Z", settings: { model: "model-3", connectionIds: ["conn-1"], agentId: null, webSearch: true, knowledge: false, supervisor: false } },
  { id: "conv-3", title: "پرسش درباره‌ی موجودی انبار", updatedAt: "2026-10-10T16:45:00.000Z", settings: { model: "model-4", connectionIds: [], agentId: null, webSearch: true, knowledge: false, supervisor: false } },
];

const messages: Record<string, Message[]> = {
  "conv-12": scriptedExchange({ key: "c12", question: indicatorsQuestion, reply: indicatorsReply, at: "2026-10-30T11:04:00.000Z", modelName: sonnet, agentName: "تحلیل‌گر شاخص‌های تولید" }),
  "conv-11": scriptedExchange({ key: "c11", question: pricingQuestion, reply: pricingReply, at: "2026-10-29T13:19:00.000Z", modelName: sonnet, agentName: "دستیار فروش و قیمت‌گذاری" }),
  "conv-10": scriptedExchange({ key: "c10", question: alarmQuestion, reply: alarmReply, at: "2026-10-28T07:49:00.000Z", modelName: sonnet, agentName: "دستیار نگهداری و تعمیرات" }),
  "conv-9": [
    ...scriptedExchange({ key: "c9a", question: moistureQuestion, reply: moistureReply, at: "2026-10-27T10:10:00.000Z", modelName: sonnet }),
    ...scriptedExchange({ key: "c9b", question: secretQuestion, reply: secretReply, at: "2026-10-27T10:15:00.000Z", modelName: sonnet }),
  ],
  "conv-8": [
    ...scriptedExchange({ key: "c8a", question: specksQuestion, reply: specksReply, at: "2026-10-26T14:20:00.000Z", modelName: sonnet, agentName: "دستیار کیفیت و فرمولاسیون" }),
    ...scriptedExchange({ key: "c8b", question: formulaQuestion, reply: formulaReply, at: "2026-10-26T14:30:00.000Z", modelName: sonnet, agentName: "دستیار کیفیت و فرمولاسیون" }),
  ],
  "conv-7": [
    ...scriptedExchange({ key: "c7a", question: reorderQuestion, reply: reorderReply, at: "2026-10-25T09:30:00.000Z", modelName: sonnet }),
    ...scriptedExchange({ key: "c7b", question: inTransitQuestion, reply: inTransitReply, at: "2026-10-25T09:40:00.000Z", modelName: sonnet }),
  ],
  "conv-1": [
    { id: "msg-1", role: "user", text: "بندهای مهم قرارداد تأمین را خلاصه کن.", createdAt: "2026-10-18T14:19:00.000Z", status: "done", sources: [], attachments: [{ id: "att-1", name: "قرارداد-تامین.pdf", kind: "pdf", status: "ready" }] },
    { id: "msg-2", role: "assistant", text: "سه بند مهم این قرارداد: مدت قرارداد دوازده ماه است، تأخیر در تحویل جریمه‌ی روزانه دارد و امکان فسخ با یک ماه اخطار قبلی وجود دارد.", createdAt: "2026-10-18T14:20:00.000Z", status: "done", modelName: "Claude Sonnet", sources: [{ id: "src-1", title: "قرارداد-تامین.pdf", kind: "document", section: "بند ۴" }, { id: "src-2", title: "آیین‌نامه‌ی معاملات سازمان", kind: "document", section: "فصل ۲" }], attachments: [] },
  ],
  "conv-2": [
    { id: "msg-3", role: "user", text: "برای جلسه‌ی فروش فردا یک دستور جلسه بنویس.", createdAt: "2026-10-16T09:09:00.000Z", status: "done", sources: [], attachments: [] },
    { id: "msg-4", role: "assistant", text: "دستور جلسه: ۱. مرور فروش ماه گذشته ۲. بررسی سرنخ‌های مهم ۳. تعیین اهداف هفته‌ی آینده.", createdAt: "2026-10-16T09:10:00.000Z", status: "done", modelName: "Claude Sonnet", sources: [], attachments: [] },
  ],
  "conv-3": [
    { id: "msg-5", role: "user", text: "موجودی کابل شبکه در انبار مرکزی چقدر است؟", createdAt: "2026-10-10T16:44:00.000Z", status: "done", sources: [], attachments: [] },
    { id: "msg-6", role: "assistant", text: "برای دیدن موجودی دقیق، اتصال «راهکاران همکاران سیستم» را روشن کنید تا بتوانم آن را بخوانم.", createdAt: "2026-10-10T16:45:00.000Z", status: "done", modelName: "Claude Haiku", sources: [], attachments: [] },
  ],
};

export function getConversations(): Conversation[] {
  return conversations;
}

export function getInitialMessages(): Record<string, Message[]> {
  return messages;
}
