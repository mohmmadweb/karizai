import type { AgentSurface, EvalCase, ModelPolicy } from "../types";

/** Knowledge an Agent can answer from: collections and folders the user can already read. */
export type KnowledgeOption = { id: string; name: string; source: string; documents: number };

const knowledgeOptions: KnowledgeOption[] = [
  { id: "kn-quality", name: "پوشه‌ی کیفیت", source: "فایل‌های کاریز", documents: 234 },
  { id: "kn-datasheets", name: "برگه‌های فنی", source: "فایل‌های کاریز", documents: 96 },
  { id: "kn-sop", name: "رویه‌ها و دستورالعمل‌ها (SOP)", source: "فایل‌های کاریز", documents: 58 },
  { id: "kn-maintenance", name: "گزارش‌های تعمیرات", source: "CMMS", documents: 1840 },
  { id: "kn-maint-chat", name: "گفتگوهای گروه نگهداری", source: "پیام‌های کاریز", documents: 612 },
  { id: "kn-archive", name: "بایگانی فنی", source: "SharePoint", documents: 1204 },
  { id: "kn-letters", name: "نامه‌های اداری", source: "دیدگاه چارگون", documents: 3910 },
  { id: "kn-regulations", name: "آیین‌نامه‌ها و مقررات", source: "فایل‌های کاریز", documents: 58 },
  { id: "kn-sales", name: "قیمت‌ها و سیاست فروش", source: "سرور فایل فروش", documents: 41 },
];

export function getKnowledgeOptions(): KnowledgeOption[] {
  return knowledgeOptions;
}

export const surfaceLabels: Record<AgentSurface, string> = {
  assistant: "دستیار هوشمند",
  group: "گروه‌های کاریز",
  workflows: "جریان‌ها",
};

export const modelPolicyLabels: Record<ModelPolicy, { label: string; hint: string }> = {
  "internal-only": { label: "فقط مدل داخلی", hint: "برای داده‌ی حساس؛ هیچ متنی از سرورهای سازمان بیرون نمی‌رود." },
  auto: { label: "خودکار", hint: "مسیریاب هوشمند برای هر پرسش مدل مناسب را انتخاب می‌کند." },
};

/** The evaluation set: sample questions and the answers an inspection Agent should give. */
const evalSet: EvalCase[] = [
  { id: "ev-1", question: "حد مجاز MFI گرید PP-T20 در آزمون ورودی چقدر است؟", expected: "۱۸ تا ۲۲ گرم بر ۱۰ دقیقه (۲۳۰ درجه، ۲٫۱۶ کیلوگرم) طبق برگه‌ی فنی." },
  { id: "ev-2", question: "رطوبت مجاز مستربچ مشکی پیش از مصرف چقدر است؟", expected: "حداکثر ۰٫۱٪؛ بیشتر از آن باید خشک شود." },
  { id: "ev-3", question: "اگر نتیجه‌ی آزمون ضربه‌ی یک محموله خارج از حد بود، طبق QC-SOP-07 چه باید کرد؟", expected: "محموله قرنطینه شود، آزمون تکرار شود و در صورت تأیید نتیجه، گزارش عدم انطباق ثبت شود." },
  { id: "ev-4", question: "نمونه‌برداری از محموله‌ی ۲۰ تنی چند کیسه را شامل می‌شود؟", expected: "جذر تعداد کیسه‌ها به‌علاوه‌ی یک، طبق بند ۴ رویه‌ی QC-SOP-07." },
  { id: "ev-5", question: "چه کسی مجوز مصرف مشروط مواد خارج از حد را می‌دهد؟", expected: "مدیر کیفیت، با ثبت در فرم مصرف مشروط." },
  { id: "ev-6", question: "نتیجه‌ی آزمون رنگ (ΔE) بچ B-1405-212 چقدر بود؟", expected: "۱٫۸؛ در محدوده‌ی مجاز (کمتر از ۲)." },
  { id: "ev-7", question: "MFI بچ B-1405-212 چرا مردود شد؟", expected: "MFI ۱۴٫۲ و کمتر از حد پایین ۱۸ بود؛ علت محتمل دمای بالای ناحیه‌ی ۴ و رطوبت مواد." },
  { id: "ev-8", question: "برای تامین‌کننده‌ای که دو بار پیاپی مردودی داشته چه اقدامی لازم است؟", expected: "ارسال نامه‌ی عدم انطباق و درخواست اقدام اصلاحی؛ ارزیابی دوباره‌ی تامین‌کننده." },
  { id: "ev-9", question: "دمای آزمون MFI برای گریدهای PE چقدر است؟", expected: "۱۹۰ درجه‌ی سلسیوس با وزنه‌ی ۲٫۱۶ کیلوگرم." },
  { id: "ev-10", question: "گواهی آنالیز (COA) تامین‌کننده باید چه مواردی داشته باشد؟", expected: "شماره‌ی بچ، تاریخ تولید، MFI، چگالی و رطوبت." },
  { id: "ev-11", question: "اگر COA با نتیجه‌ی آزمایشگاه ما فرق داشت، کدام معتبر است؟", expected: "نتیجه‌ی آزمایشگاه پارسا پلیمر؛ اختلاف در گزارش ثبت می‌شود." },
  { id: "ev-12", question: "مدت نگهداری نمونه‌ی شاهد مواد ورودی چقدر است؟", expected: "شش ماه پس از مصرف آخرین کیسه‌ی آن بچ." },
  { id: "ev-13", question: "چگالی مجاز HD5502 چقدر است؟", expected: "۰٫۹۵۲ تا ۰٫۹۵۶ گرم بر سانتی‌متر مکعب." },
  { id: "ev-14", question: "نامه‌ی مردودی به تامین‌کننده از کدام قالب ساخته می‌شود؟", expected: "قالب Word «اعلام عدم انطباق مواد ورودی» با سربرگ سازمان." },
  { id: "ev-15", question: "آیا مواد قرنطینه‌شده را می‌توان به خط فرستاد؟", expected: "خیر، تا تصمیم مدیر کیفیت مصرف نمی‌شود." },
  { id: "ev-16", question: "آزمون‌های اجباری مستربچ مشکی کدام‌اند؟", expected: "درصد کربن، پراکندگی، رطوبت و MFI." },
  { id: "ev-17", question: "مهلت ثبت نتیجه‌ی آزمون ورودی در LIMS چقدر است؟", expected: "حداکثر ۲۴ ساعت پس از رسیدن محموله." },
  { id: "ev-18", question: "اگر پرسش درباره‌ی حقوق یک همکار بود، چه پاسخی بده؟", expected: "به این اطلاعات دسترسی ندارم؛ پرسش را به منابع انسانی ارجاع بده." },
];

export function getEvalSet(): EvalCase[] {
  return evalSet;
}

/** The two answers the sample evaluation marks wrong, with what the Agent said instead. */
export const evalMisses: Record<string, string> = {
  "ev-7": "MFI پایین بود؛ علت را به رطوبت مواد نسبت داد و دمای ناحیه‌ی ۴ را نیاورد.",
  "ev-13": "۰٫۹۴۵ تا ۰٫۹۵۰ (از برگه‌ی فنی قدیمی خوانده شد).",
};
