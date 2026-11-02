import type { Connection, ToolParam } from "../types";

const text = (key: string, label: string, extra: Partial<ToolParam> = {}): ToolParam => ({ key, label, kind: "text", required: true, ...extra });
const area = (key: string, label: string, extra: Partial<ToolParam> = {}): ToolParam => ({ key, label, kind: "textarea", required: true, ...extra });
const pick = (key: string, label: string, options: string[], defaultValue?: string, extra: Partial<ToolParam> = {}): ToolParam => ({ key, label, kind: "select", required: true, options: options.map((value) => ({ value, label: value })), defaultValue, ...extra });

/** Office and engineering tools: documents, code, projects and the team wiki. The admin keeps the keys; they never show here. */
export const officeConnections: Connection[] = [
  {
    id: "conn-20", name: "مایکروسافت ورد (Word)", domain: "اسناد و قالب‌های نامه",
    description: "جست‌وجو در اسناد ورد سازمان و ساخت سند تازه از روی قالب‌های رسمی.",
    endpoint: "https://graph.microsoft.com/v1.0", status: "ready",
    tools: [
      { id: "tool-40", name: "جست‌وجو در اسناد ورد", description: "اسناد ورد را با عنوان یا متن پیدا می‌کند و بخش‌های مرتبط را برمی‌گرداند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "عبارت", value: "قرارداد تأمین" }], params: [text("term", "عنوان یا عبارت", { placeholder: "قرارداد تأمین" })] },
      { id: "tool-41", name: "ساخت سند از قالب", description: "یک سند ورد تازه از روی قالب انتخاب‌شده می‌سازد تا پیش از ارسال بازبینی شود.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "قالب", value: "نامه‌ی رسمی" }, { label: "عنوان", value: "درخواست استعلام قیمت" }], params: [pick("template", "قالب", ["نامه‌ی رسمی", "قرارداد", "صورت‌جلسه", "پیش‌فاکتور"], "نامه‌ی رسمی"), text("title", "عنوان سند"), area("body", "متن یا نکته‌های سند")] },
    ],
  },
  {
    id: "conn-21", name: "گیت‌لب (GitLab)", domain: "مخزن کد و مسائل توسعه",
    description: "فهرست مسائل (Issue)، درخواست‌های ادغام و وضعیت پایپ‌لاین پروژه‌های نرم‌افزاری سازمان.",
    endpoint: "https://gitlab.company.local/api/v4", status: "ready",
    tools: [
      { id: "tool-42", name: "فهرست مسائل پروژه", description: "مسائل یک پروژه را بر اساس وضعیت می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "پروژه", value: "plant/mes-integration" }], params: [text("project", "پروژه", { placeholder: "plant/mes-integration" }), pick("state", "وضعیت", ["باز", "بسته", "همه"], "باز")] },
      { id: "tool-43", name: "وضعیت پایپ‌لاین", description: "نتیجه‌ی آخرین اجرای پایپ‌لاین یک شاخه را می‌دهد.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "پروژه", value: "plant/mes-integration" }], params: [text("project", "پروژه", { placeholder: "plant/mes-integration" }), text("branch", "شاخه", { defaultValue: "main" })] },
      { id: "tool-44", name: "ثبت مسئله‌ی تازه", description: "یک مسئله‌ی تازه در پروژه می‌سازد؛ فقط با تأیید شما.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "عنوان", value: "خطای خواندن شاخص‌ها" }], params: [text("project", "پروژه"), text("title", "عنوان مسئله"), area("description", "شرح مسئله", { required: false })] },
    ],
  },
  {
    id: "conn-22", name: "مایکروسافت پروجکت (MSP)", domain: "مدیریت پروژه و زمان‌بندی",
    description: "وضعیت پروژه‌ها، فعالیت‌های عقب‌افتاده و پیشرفت برنامه‌ی زمانی.",
    endpoint: "https://project.company.local/_api/ProjectData", status: "ready",
    tools: [
      { id: "tool-45", name: "وضعیت پروژه و فعالیت‌ها", description: "درصد پیشرفت، تاریخ پایان و فعالیت‌های عقب‌افتاده‌ی یک پروژه را می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "پروژه", value: "توسعه‌ی خط ۴" }], params: [text("project", "نام پروژه", { placeholder: "توسعه‌ی خط ۴" }), pick("scope", "نمایش", ["همه‌ی فعالیت‌ها", "فقط عقب‌افتاده‌ها"], "فقط عقب‌افتاده‌ها")] },
      { id: "tool-46", name: "به‌روزرسانی پیشرفت فعالیت", description: "درصد پیشرفت یک فعالیت را تغییر می‌دهد؛ فقط با تأیید مدیر پروژه.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "فعالیت", value: "نصب اکسترودر" }, { label: "درصد", value: "60" }], params: [text("task", "فعالیت"), text("percent", "درصد پیشرفت", { placeholder: "60" })] },
    ],
  },
  {
    id: "conn-23", name: "کانفلوئنس سازمانی (Confluence)", domain: "ویکی و مستندات تیم‌ها",
    description: "جست‌وجو و خواندن صفحه‌های ویکی سازمان و نوشتن صفحه‌ی تازه.",
    endpoint: "https://confluence.company.local/rest/api", status: "ready",
    tools: [
      { id: "tool-47", name: "جست‌وجو در صفحه‌ها", description: "صفحه‌های ویکی را با عبارت جست‌وجو می‌کند و گزیده‌ی هر صفحه را می‌دهد.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "عبارت", value: "راه‌اندازی اکسترودر" }], params: [text("term", "عبارت جست‌وجو", { placeholder: "راه‌اندازی اکسترودر" }), text("space", "فضا (Space)", { required: false, placeholder: "OPS" })] },
      { id: "tool-48", name: "ساخت صفحه‌ی تازه", description: "یک صفحه‌ی تازه در فضای انتخاب‌شده می‌سازد؛ فقط با تأیید شما.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "عنوان", value: "گزارش توقف خط ۲" }], params: [text("space", "فضا (Space)", { placeholder: "OPS" }), text("title", "عنوان صفحه"), area("content", "متن صفحه")] },
    ],
  },
];
