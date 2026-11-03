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
  { id: "msg-3", threadId: "col-ali", from: "other", read: false, createdAt: "2026-11-02T08:20:00.000Z", text: "سلام. هشدار سفارش HD5502 را دیدید؟ اگر تأیید کنید همین امروز استعلام می‌گیرم." },
  { id: "msg-4", threadId: "col-ali", from: "me", read: true, createdAt: "2026-11-02T08:25:00.000Z", text: "سلام، دیدم. مقدار ۸۰ تن را تأیید می‌کنم." },
  { id: "msg-5", threadId: "col-sara", from: "other", read: true, createdAt: "2026-11-01T14:00:00.000Z", text: "موجودی مستربچ مشکی شمارش شد، ۶٫۵ تن." },
  {
    id: "msg-f1", threadId: "flows", from: "system", read: false, createdAt: "2026-11-02T08:41:00.000Z",
    text: "جریان «پیش‌فاکتور و قیمت‌گذاری خودکار» با موفقیت اجرا شد.",
    alert: { title: "پیش‌فاکتور آریاپلاست آماده شد", tone: "info", workflowId: "wf-5", fields: [{ label: "مبلغ نهایی", value: "۲٬۲۹۶٫۸ میلیون تومان" }, { label: "وضعیت", value: "منتظر تأیید مدیر فروش" }] },
  },
  {
    id: "msg-f2", threadId: "flows", from: "system", read: true, createdAt: "2026-11-01T05:02:00.000Z",
    text: "جریان «گزارش فروش هفتگی» اجرا شد و گزارش برای مدیر فروش فرستاده شد.",
    alert: { title: "گزارش فروش هفتگی ارسال شد", tone: "info", workflowId: "wf-1", fields: [{ label: "گام‌های انجام‌شده", value: "۳ از ۳" }] },
  },
  {
    id: "msg-f3", threadId: "flows", from: "system", read: true, createdAt: "2026-10-31T05:00:00.000Z",
    text: "اجرای جریان «گزارش فروش هفتگی» به خطا خورد؛ اتصال به پایگاه فروش پاسخ نداد.",
    alert: { title: "اجرای جریان ناموفق بود", tone: "warning", workflowId: "wf-1", fields: [{ label: "گام ناموفق", value: "خواندن فروش هفته" }, { label: "اقدام پیشنهادی", value: "اتصال را بررسی کنید و جریان را دوباره اجرا کنید" }] },
  },
];

export function getInitialMessages(): MessengerMessage[] {
  return messages;
}
