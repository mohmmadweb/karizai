import type { MessengerMessage } from "../types";

const messages: MessengerMessage[] = [
  {
    id: "msg-1", threadId: "alerts", from: "system", read: false, createdAt: "2026-11-02T08:00:00.000Z",
    text: "جریان «سفارش‌دهی خودکار مواد اولیه» کمبود پیش‌بینی کرد و منتظر تأیید شماست.",
    alert: {
      title: "کالا نیازمند سفارش مجدد است", tone: "warning", workflowId: "wf-6",
      fields: [
        { label: "کالا", value: "PE سنگین HD5502" },
        { label: "موجودی فعلی", value: "۱۸ تن (۳ روز پوشش)" },
        { label: "مقدار پیشنهادی سفارش", value: "۸۰ تن" },
        { label: "هزینه‌ی برآوردی", value: "حدود ۶٬۵۶۰ میلیون تومان" },
        { label: "بهترین قیمت", value: "پلیمر خزر، تحویل ۷ روزه" },
      ],
    },
  },
  {
    id: "msg-2", threadId: "alerts", from: "system", read: false, createdAt: "2026-11-02T07:10:00.000Z",
    text: "جریان «مرکز شاخص‌ها و هشدار هوشمند» یک شاخص خارج از حد پیدا کرد.",
    alert: {
      title: "شاخص خط ۲ از حد مجاز خارج شد", tone: "warning", workflowId: "wf-4",
      fields: [
        { label: "شاخص", value: "دمای ناحیه‌ی ۴ اکسترودر" },
        { label: "مقدار فعلی", value: "۲۴۸ درجه (حد مجاز تا ۲۴۰)" },
        { label: "اثر احتمالی", value: "ضایعات ۴٫۸٪ (حد ۴٪)" },
      ],
    },
  },
  { id: "msg-3", threadId: "col-ali", from: "other", read: false, createdAt: "2026-11-02T08:20:00.000Z", text: "سلام. هشدار سفارش HD5502 را دیدید؟ اگر تأیید کنید همین امروز استعلام می‌گیرم." },
  { id: "msg-4", threadId: "col-ali", from: "me", read: true, createdAt: "2026-11-02T08:25:00.000Z", text: "سلام، دیدم. مقدار ۸۰ تن را تأیید می‌کنم." },
  { id: "msg-5", threadId: "col-sara", from: "other", read: true, createdAt: "2026-11-01T14:00:00.000Z", text: "موجودی مستربچ مشکی شمارش شد، ۶٫۵ تن." },
];

export function getInitialMessages(): MessengerMessage[] {
  return messages;
}
