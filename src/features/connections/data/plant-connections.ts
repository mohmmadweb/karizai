import type { Connection, ToolParam } from "../types";

const text = (key: string, label: string, extra: Partial<ToolParam> = {}): ToolParam => ({ key, label, kind: "text", required: true, ...extra });
const area = (key: string, label: string, extra: Partial<ToolParam> = {}): ToolParam => ({ key, label, kind: "textarea", required: true, ...extra });
const num = (key: string, label: string, min: number, max: number, defaultValue: string, extra: Partial<ToolParam> = {}): ToolParam => ({ key, label, kind: "number", required: true, min, max, defaultValue, ...extra });
const pick = (key: string, label: string, options: string[], defaultValue?: string, extra: Partial<ToolParam> = {}): ToolParam => ({ key, label, kind: "select", required: true, options: options.map((value) => ({ value, label: value })), defaultValue, ...extra });

const queryParams = (example: string): ToolParam[] => [
  area("query", "پرسش یا کوئری فقط‌خواندنی", { placeholder: example, hint: "فقط SELECT مجاز است؛ هیچ داده‌ای تغییر نمی‌کند." }),
  num("maxRows", "حداکثر تعداد ردیف نتیجه", 1, 1000, "100"),
];

/** Plant systems: each has the address of the system and tools with real settings. The admin keeps the keys; they never show here. */
export const plantConnections: Connection[] = [
  {
    id: "conn-12", name: "انبار و موجودی (SQL Server)", domain: "پایگاه داده‌ی انبار، فقط‌خواندنی",
    description: "موجودی مواد اولیه و محصول، حدود سفارش و مصرف. فقط خواندن؛ هیچ داده‌ای تغییر نمی‌کند.",
    endpoint: "mssql://sql-warehouse.plant.local:1433/Warehouse", status: "ready",
    tools: [
      { id: "tool-20", name: "اجرای کوئری فقط‌خواندنی", description: "از پرسش شما یک کوئری فقط‌خواندنی می‌سازد و روی پایگاه انبار اجرا می‌کند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "پرسش", value: "کدام مواد به نقطه‌ی سفارش رسیده‌اند؟" }], params: queryParams("کدام مواد به نقطه‌ی سفارش رسیده‌اند؟") },
      { id: "tool-21", name: "خواندن ساختار جدول‌ها", description: "نام جدول‌ها و ستون‌ها را برای ساخت کوئری می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "جدول", value: "InventoryStock" }], params: [text("table", "نام جدول", { placeholder: "InventoryStock" })] },
    ],
  },
  {
    id: "conn-13", name: "تدارک و خرید (SQL Server)", domain: "پایگاه داده‌ی تدارک، فقط‌خواندنی",
    description: "سفارش‌های خرید، تامین‌کنندگان و وضعیت محموله‌ها. فقط خواندن.",
    endpoint: "mssql://sql-procurement.plant.local:1433/Procurement", status: "ready",
    tools: [
      { id: "tool-22", name: "اجرای کوئری فقط‌خواندنی", description: "از پرسش شما یک کوئری فقط‌خواندنی می‌سازد و روی پایگاه تدارک اجرا می‌کند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "پرسش", value: "محموله‌های در راه کدام‌اند؟" }], params: queryParams("محموله‌های در راه کدام‌اند؟") },
      { id: "tool-23", name: "ثبت پیش‌نویس سفارش خرید", description: "یک پیش‌نویس سفارش خرید می‌سازد تا مدیر تدارک تأیید کند.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "ماده", value: "PE سنگین HD5502" }, { label: "مقدار (تن)", value: "80" }], params: [text("material", "ماده‌ی اولیه", { placeholder: "PE سنگین HD5502" }), num("quantityTon", "مقدار (تن)", 1, 500, "20"), text("vendor", "تامین‌کننده‌ی پیشنهادی", { required: false })] },
    ],
  },
  {
    id: "conn-14", name: "MES و شاخص‌های خط تولید", domain: "سامانه‌ی اجرای تولید",
    description: "شاخص‌های لحظه‌ای خط‌ها: دما، فشار، ضایعات، OEE و رطوبت. فقط خواندن.",
    endpoint: "https://mes.plant.local/api/v2", status: "ready",
    tools: [
      { id: "tool-24", name: "خواندن شاخص‌های لحظه‌ای", description: "مقدار فعلی شاخص‌های یک خط و حد مجاز هرکدام را می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "خط", value: "خط ۲" }], params: [pick("line", "خط تولید", ["خط ۱", "خط ۲", "خط ۳"], "خط ۲"), text("indicators", "شاخص‌ها (با ویرگول جدا کنید)", { defaultValue: "دما، فشار، ضایعات، OEE" })], outputs: [{ key: "scrap", label: "ضایعات", unit: "٪" }, { key: "oee", label: "OEE", unit: "٪" }, { key: "pressure", label: "فشار قالب", unit: "بار" }] },
      { id: "tool-25", name: "روند ۲۴ ساعت یک شاخص", description: "تغییرهای یک شاخص را در ساعت‌های اخیر می‌دهد.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "شاخص", value: "دمای ناحیه‌ی ۴" }], params: [pick("indicator", "شاخص", ["دمای ناحیه‌ی ۴", "فشار قالب", "ضایعات"], "دمای ناحیه‌ی ۴"), num("hours", "چند ساعت اخیر", 1, 72, "24")] },
    ],
  },
  {
    id: "conn-15", name: "شبکه اجتماعی سازمانی", domain: "ارتباط و اعلان درون‌سازمانی",
    description: "هشدار به مسئولان و پیام به کانال‌ها. هشدارها در شبکه اجتماعی سازمان برای افراد مسئول نمایش داده می‌شود.",
    endpoint: "https://social.plant.local/api/v1", status: "ready",
    tools: [
      { id: "tool-26", name: "ارسال هشدار به مسئول", description: "برای مسئول یک واحد در شبکه اجتماعی سازمان هشدار می‌فرستد.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "مسئول", value: "سرپرست خط ۲" }, { label: "هشدار", value: "دمای ناحیه‌ی ۴ از حد مجاز بالاتر است." }], params: [pick("recipient", "مسئول", ["سرپرست خط ۲", "مدیر تولید", "مسئول نگهداری", "مدیر کیفیت"], "سرپرست خط ۲"), pick("severity", "اهمیت", ["اطلاع", "هشدار", "بحرانی"], "هشدار"), area("message", "متن هشدار", { defaultValue: "شاخص از حد مجاز بیرون رفته است.", hint: "علت احتمالی از گام قبل به انتهای این متن اضافه می‌شود." })] },
      { id: "tool-27", name: "ارسال پیام به کانال", description: "یک پیام در کانال یک تیم می‌گذارد.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "کانال", value: "تولید" }, { label: "پیام", value: "گزارش شیفت آماده است." }], params: [pick("channel", "کانال", ["تولید", "کیفیت", "تدارک", "نگهداری", "فروش"], "تولید"), area("message", "پیام")] },
      { id: "tool-28", name: "ثبت وظیفه برای من", description: "یک وظیفه در «فعالیت و وظایف من» ثبت می‌کند تا نتیجه‌ی جریان پیگیری شود.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "پروژه", value: "کاهش ریسک تأمین مواد اولیه" }, { label: "عنوان", value: "بازبینی پیش‌نویس سفارش خرید" }], params: [pick("project", "پروژه", ["بهینه‌سازی خط ۲", "توسعه‌ی گرید PP-T20 با ضربه‌ی بالا", "کاهش ریسک تأمین مواد اولیه", "گزارش‌های مدیریتی خودکار"], "کاهش ریسک تأمین مواد اولیه"), text("title", "عنوان وظیفه"), pick("priority", "اهمیت", ["فوری", "عادی", "کم‌اهمیت"], "فوری")] },
    ],
  },
  {
    id: "conn-16", name: "آزمایشگاه و کنترل کیفیت (LIMS)", domain: "کیفیت و فرمولاسیون",
    description: "نتایج آزمون بچ‌ها و فرمول‌های ثبت‌شده. فقط خواندن.",
    endpoint: "https://lims.plant.local/api", status: "ready",
    tools: [
      { id: "tool-28", name: "نتایج آزمون بچ", description: "MFI، رنگ، ضربه و سایر آزمون‌های یک بچ را می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "شماره‌ی بچ", value: "B-1405-2217" }], params: [text("batch", "شماره‌ی بچ", { placeholder: "B-1405-2217" })], outputs: [{ key: "mfi", label: "MFI" }, { key: "deltaE", label: "اختلاف رنگ ΔE" }] },
      { id: "tool-29", name: "جست‌وجوی فرمول‌های مشابه", description: "فرمول‌های ثبت‌شده با خواص نزدیک را پیدا می‌کند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "خواص", value: "MFI حدود ۱۲، ضربه‌ی بالا" }], params: [area("properties", "خواص موردنظر", { placeholder: "MFI حدود ۱۲، ضربه‌ی بالا" }), num("limit", "حداکثر تعداد فرمول", 1, 20, "4")] },
    ],
  },
  {
    id: "conn-17", name: "تعمیرات و نگهداری (CMMS)", domain: "نگهداری و تعمیرات",
    description: "گزارش‌های تعمیر، دستور کارها و سابقه‌ی توقف دستگاه‌ها.",
    endpoint: "https://cmms.plant.local/api", status: "ready",
    tools: [
      { id: "tool-30", name: "جست‌وجوی گزارش‌های تعمیرات", description: "گزارش‌ها را با کد آلارم یا نام دستگاه پیدا می‌کند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "عبارت", value: "E-217 اکسترودر خط ۲" }], params: [text("term", "کد آلارم یا نام دستگاه", { placeholder: "E-217" }), num("months", "چند ماه اخیر", 1, 60, "12")] },
    ],
  },
  {
    id: "conn-18", name: "قیمت‌ها و تامین‌کنندگان", domain: "قیمت‌گذاری و تدارک",
    description: "نرخ ارز، قیمت پایه‌ی مواد اولیه و استعلام قیمت از تامین‌کنندگان.",
    endpoint: "https://prices.plant.local/api", status: "ready",
    tools: [
      { id: "tool-31", name: "نرخ ارز و مواد اولیه", description: "نرخ مرجع امروز و قیمت پایه‌ی پلیمرها را می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "ماده", value: "PP کوپلیمر" }], params: [pick("material", "ماده‌ی اولیه", ["PP کوپلیمر", "PP هموپلیمر", "PE سنگین", "POE الاستومر"], "PP کوپلیمر")], outputs: [{ key: "price", label: "قیمت پایه", unit: "تومان بر کیلوگرم" }] },
      { id: "tool-32", name: "استعلام قیمت از تامین‌کنندگان", description: "برای یک ماده از چند تامین‌کننده قیمت می‌گیرد و جدول مقایسه می‌سازد.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "ماده", value: "PE سنگین HD5502" }, { label: "مقدار (تن)", value: "80" }], params: [text("material", "ماده‌ی اولیه", { placeholder: "PE سنگین HD5502" }), num("quantityTon", "مقدار (تن)", 1, 500, "20"), num("vendors", "تعداد تامین‌کننده‌ی استعلام", 2, 10, "3")] },
    ],
  },
  {
    id: "conn-19", name: "حسگرها و IoT (MQTT)", domain: "اینترنت اشیا و حسگرهای کارخانه",
    description: "مقدار حسگرهای خط‌ها (دما، فشار، لرزش) از بروکر MQTT کارخانه. خواندن بدون تأیید است و فرمان به دستگاه فقط با تأیید و کلید فرمان.",
    endpoint: "mqtts://iot.plant.local:8883", status: "ready",
    tools: [
      { id: "tool-33", name: "خواندن مقدار حسگر", description: "آخرین مقدار و میانگین یک حسگر را از موضوع (topic) آن می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "موضوع حسگر", value: "plant/line2/zone4/temp" }], params: [text("topic", "موضوع حسگر (topic)", { placeholder: "plant/line2/zone4/temp", defaultValue: "plant/line2/zone4/temp", hint: "نشانی حسگر روی بروکر؛ با حروف لاتین و بدون فاصله." }), pick("unit", "واحد", ["°C", "bar", "mm/s", "٪"], "°C"), num("windowSeconds", "پنجره‌ی میانگین (ثانیه)", 1, 3600, "60")], outputs: [{ key: "value", label: "آخرین مقدار حسگر" }, { key: "avg", label: "میانگین پنجره" }] },
      { id: "tool-34", name: "ارسال فرمان به دستگاه", description: "یک فرمان روی موضوع دستگاه می‌فرستد؛ فقط با تأیید و کلید فرمان.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "موضوع دستگاه", value: "plant/line2/cmd" }], params: [text("topic", "موضوع فرمان (topic)", { placeholder: "plant/line2/cmd" }), text("payload", "متن فرمان", { placeholder: "SET_SPEED 80" }), { key: "commandKey", label: "کلید فرمان", kind: "secret", required: true, hint: "کلید را مسئول فنی می‌دهد. فقط برای همین گام و تا بستن صفحه نگه داشته می‌شود." }] },
    ],
  },
];
