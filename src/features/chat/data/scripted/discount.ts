import type { ScriptedEntry, ScriptedReply } from "../../types";

export const discountQuestion = "حداکثر تخفیف مجاز برای یک مشتری عمده‌ی پلیمری چقدر است و حاشیه‌ی سود چه می‌شود؟";

const search = { id: "d-search", kind: "tool" as const, via: "منبع: دانش سازمانی", title: "جست‌وجو در اسناد مجاز شما", lines: ["پرسش به بردار معنایی تبدیل می‌شود", "فقط اسنادی که گروه شما مجوز دارد بررسی می‌شود"] };

/** What the sales group sees: the discount ladder, without the cost documents. */
const salesReply: ScriptedReply = {
  steps: [{ ...search, result: "۳ بخش از ۱ سند مجاز پیدا شد؛ اسناد هزینه‌ی تمام‌شده برای گروه شما بسته است." }],
  sources: [{ id: "pricing-policy", title: "سیاست قیمت‌گذاری و تخفیف فروش", kind: "document", section: "بند ۲: پلکان تخفیف", excerpt: "تخفیف تا ۵٪ با تأیید سرپرست فروش و تا ۸٪ با تأیید مدیر فروش مجاز است." }],
  text: `طبق **سیاست قیمت‌گذاری و تخفیف فروش**، برای مشتری عمده:

- تا **۵٪** با تأیید سرپرست فروش؛
- تا **۸٪** با تأیید مدیر فروش؛
- بیش از ۸٪ نیاز به تأیید مدیر مالی دارد.

درباره‌ی حاشیه‌ی سود اطلاعاتی نمی‌دهم: اسناد هزینه‌ی تمام‌شده برای گروه شما قابل‌دسترس نیست، و وجودشان را هم در پاسخ نمی‌آورم. اگر لازم است، از مدیر مالی دسترسی بگیرید.`,
};

/** What the finance group sees: the same ladder plus the cost documents. */
const financeReply: ScriptedReply = {
  steps: [{ ...search, result: "۶ بخش از ۳ سند مجاز پیدا شد؛ شامل اسناد هزینه‌ی تمام‌شده." }],
  sources: [
    { id: "pricing-policy", title: "سیاست قیمت‌گذاری و تخفیف فروش", kind: "document", section: "بند ۲: پلکان تخفیف", excerpt: "تخفیف تا ۵٪ با تأیید سرپرست فروش و تا ۸٪ با تأیید مدیر فروش مجاز است." },
    { id: "cost-sheet", title: "گزارش هزینه‌ی تمام‌شده‌ی محصولات", kind: "document", section: "جدول ۳: کامپاند PP-T20", excerpt: "قیمت تمام‌شده‌ی هر کیلوگرم ۹۳٬۲۰۰ تومان؛ قیمت پایه‌ی فروش ۱۰۴٬۴۰۰ تومان." },
    { id: "margin-rule", title: "حداقل حاشیه‌ی سود مصوب", kind: "document", section: "بند ۱", excerpt: "حداقل حاشیه‌ی سود مجاز برای هر فاکتور ۸٪ است." },
  ],
  text: `تخفیف مجاز برای مشتری عمده: تا **۵٪** با سرپرست فروش، تا **۸٪** با مدیر فروش و بیشتر از آن با تأیید شما (مدیر مالی).

اثر آن بر **حاشیه‌ی سود** برای PP-T20: قیمت تمام‌شده ۹۳٬۲۰۰ و قیمت پایه ۱۰۴٬۴۰۰ تومان است؛ حاشیه‌ی ۱۲٪ می‌شود.
- با تخفیف ۵٪ حاشیه حدود **۶٫۴٪** می‌شود.
- تخفیف ۸٪ حاشیه را به حدود **۳٫۱٪** می‌رساند، و این از حداقل مصوب ۸٪ پایین‌تر است.

پس عملاً بیش از حدود ۳٫۶٪ تخفیف بدون تأیید استثنای شما نباید ثبت شود.`,
};

export const discountEntries: ScriptedEntry[] = [
  { scope: { knowledge: true }, match: /(تخفیف|حاشیه)/, audience: { groups: ["group-002"] }, reply: financeReply },
  { scope: { knowledge: true }, match: /(تخفیف|حاشیه)/, audience: { exceptGroups: ["group-002"] }, reply: salesReply },
];
