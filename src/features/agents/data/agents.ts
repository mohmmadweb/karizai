import type { Agent, Skill, SkillContent } from "../types";

const skills: Skill[] = [
  { id: "skill-1", name: "خلاصه‌سازی جلسه", description: "از متن جلسه صورت‌جلسه می‌سازد.", instructions: "متن جلسه را بخوان و موضوع‌ها، تصمیم‌ها و اقدام‌های هر نفر را فهرست کن.", approval: "approved" },
  { id: "skill-2", name: "نگارش نامه‌ی اداری", description: "قالب رسمی نامه‌نگاری سازمان.", instructions: "نامه را با لحن رسمی و در سه بخش موضوع، متن و پایان بنویس.", approval: "approved" },
  { id: "skill-3", name: "تحلیل قرارداد", description: "بررسی بندهای قرارداد.", instructions: "بندهای پرخطر را مشخص کن و برای هرکدام پیشنهاد اصلاح بده.", approval: "pending" },
  { id: "skill-4", name: "ترجمه‌ی ایمیل", description: "ترجمه‌ی ایمیل‌های کاری.", instructions: "ایمیل را به فارسی روان ترجمه کن.", approval: "rejected", rejectionReason: "دستورالعمل شامل ارسال متن به سرویس بیرونی بود؛ آن را حذف کنید و دوباره بفرستید." },
];

const agents: Agent[] = [
  {
    id: "agent-1", knowledgeIds: ["kn-sales"], modelPolicy: "auto", runIn: ["assistant", "workflows"], version: "1.2", evalScore: 0.86, name: "دستیار فروش", purpose: "آماده‌کردن گزارش مشتریان و ثبت یادداشت پیگیری.",
    instructions: "همیشه محترمانه و کوتاه پاسخ بده و پیش از ثبت یادداشت از کاربر بپرس.",
    defaultModelId: "model-3", tools: [{ connectionId: "conn-1", toolId: "tool-1" }, { connectionId: "conn-1", toolId: "tool-2" }],
    skillIds: ["skill-1"], isSensitive: false, isEnabled: true, kind: "personal", useCount: 42, updatedAt: "2026-10-12T08:30:00.000Z",
    shareRequests: [
      { id: "share-1", targets: [{ kind: "group", name: "تیم فروش" }], status: "pending", requestedAt: "2026-10-17T09:00:00.000Z" },
    ],
  },
  {
    id: "agent-2", knowledgeIds: ["kn-letters", "kn-regulations"], modelPolicy: "auto", runIn: ["assistant", "workflows"], version: "1.4", evalScore: 0.91, name: "پیش‌نویس نامه", purpose: "نوشتن نامه‌ی اداری رسمی.",
    instructions: "نامه را با لحن رسمی و ساختار «موضوع، متن، پایان» بنویس.",
    defaultModelId: "model-10", tools: [], skillIds: ["skill-2"], isSensitive: false, isEnabled: true, kind: "personal",
    useCount: 9, updatedAt: "2026-10-05T11:00:00.000Z",
    shareRequests: [
      { id: "share-2", targets: [{ kind: "user", name: "علی رضایی" }], status: "rejected", rejectionReason: "این Agent قالب مشابهی در Agentهای سازمان دارد؛ از همان استفاده کنید.", requestedAt: "2026-10-08T10:00:00.000Z" },
    ],
  },
  {
    id: "agent-3", knowledgeIds: ["kn-regulations"], modelPolicy: "internal-only", runIn: ["assistant"], version: "1.1", evalScore: 0.9, name: "بررسی پرونده‌ی پرسنلی", purpose: "پاسخ به پرسش‌های منابع انسانی با داده‌ی حساس.",
    instructions: "فقط با اطلاعات پرونده پاسخ بده و چیزی را بیرون از سازمان نفرست.",
    defaultModelId: "model-8", tools: [{ connectionId: "conn-5", toolId: "tool-9" }], skillIds: [], isSensitive: true, isEnabled: true, kind: "personal",
    useCount: 17, updatedAt: "2026-09-28T07:15:00.000Z",
    shareRequests: [
      { id: "share-3", targets: [{ kind: "group", name: "منابع انسانی" }], status: "approved", requestedAt: "2026-09-30T12:00:00.000Z" },
    ],
  },
  {
    id: "agent-6", name: "بازرس کیفیت مواد ورودی", purpose: "نتایج آزمون مواد ورودی را با برگه‌ی فنی تامین‌کننده مقایسه می‌کند و موارد خارج از حد را گزارش می‌دهد.",
    instructions: "نتایج آزمون مواد ورودی را با برگه‌ی فنی تامین‌کننده مقایسه کن، موارد خارج از حد را با ارجاع به رویه‌ی QC-SOP-07 گزارش بده و در صورت مردودی، پیش‌نویس نامه به تامین‌کننده آماده کن.",
    knowledgeIds: ["kn-quality", "kn-datasheets"], modelPolicy: "internal-only", runIn: ["assistant", "group"], version: "1.2", evalScore: 0.9,
    defaultModelId: "model-8", tools: [{ connectionId: "conn-16", toolId: "tool-28" }, { connectionId: "conn-20", toolId: "tool-41" }], skillIds: ["skill-2"], isSensitive: false, isEnabled: true, kind: "personal",
    useCount: 11, updatedAt: "2026-10-29T10:20:00.000Z", shareRequests: [],
  },
  {
    id: "agent-4", knowledgeIds: [], modelPolicy: "auto", runIn: ["assistant"], version: "2.1", evalScore: 0.87, name: "گزارش مالی ماهانه", purpose: "تهیه‌ی گزارش هزینه برای مدیران.",
    instructions: "گزارش را در سه بخش خلاصه، جزئیات و پیشنهاد بنویس.",
    defaultModelId: "model-1", tools: [{ connectionId: "conn-4", toolId: "tool-8" }], skillIds: [], isSensitive: false, isEnabled: true, kind: "shared",
    useCount: 25, updatedAt: "2026-10-01T09:00:00.000Z", shareRequests: [],
  },
  {
    id: "agent-5", knowledgeIds: [], modelPolicy: "auto", runIn: ["assistant"], version: "1.0", evalScore: 0.78, name: "پاسخگوی پشتیبانی", purpose: "پیش‌نویس پاسخ به تیکت‌های مشتریان.",
    instructions: "پاسخ‌ها را مودبانه و گام‌به‌گام بنویس.",
    defaultModelId: "model-4", tools: [], skillIds: [], isSensitive: false, isEnabled: false,
    disabledReason: "ادمین این Agent را موقتاً غیرفعال کرده است.", kind: "shared", useCount: 3, updatedAt: "2026-08-20T09:00:00.000Z", shareRequests: [],
  },
];

const systemAgents: Agent[] = [
  {
    id: "agent-doc", knowledgeIds: ["kn-quality", "kn-sop", "kn-archive", "kn-regulations"], modelPolicy: "auto", runIn: ["assistant", "group", "workflows"], version: "3.2", evalScore: 0.94, name: "دستیار سند", purpose: "پاسخ به پرسش‌ها از روی اسناد سازمان، همراه با ارجاع به سند و بخش مربوط.",
    instructions: "فقط از اسناد مجاز کاربر پاسخ بده و اگر جوابی پیدا نشد همین را بگو.", defaultModelId: "model-3", tools: [], skillIds: [],
    isSensitive: false, isEnabled: true, kind: "shared", systemRole: "document", shareRequests: [], useCount: 33, updatedAt: "2026-09-01T09:00:00.000Z",
  },
  {
    id: "agent-bi", knowledgeIds: [], modelPolicy: "internal-only", runIn: ["assistant", "group", "workflows"], version: "2.4", evalScore: 0.9, name: "دستیار هوش تجاری", purpose: "پاسخ به پرسش‌های داده‌ای از انبار داده سازمان (فقط‌خواندنی) با جدول، نمودار یا کارت.",
    instructions: "کوئری فقط‌خواندنی بساز و نتیجه را ساختاریافته برگردان.", defaultModelId: "model-3", tools: [], skillIds: [],
    isSensitive: false, isEnabled: true, kind: "shared", systemRole: "bi", shareRequests: [], useCount: 21, updatedAt: "2026-09-01T09:00:00.000Z",
  },
  {
    id: "agent-quality", knowledgeIds: ["kn-quality", "kn-datasheets", "kn-sop"], modelPolicy: "internal-only", runIn: ["assistant", "group", "workflows"], version: "1.3", evalScore: 0.92, name: "دستیار کیفیت و فرمولاسیون", purpose: "یافتن علت مردودی بچ و پیشنهاد فرمول (رسپی) کامپاند بر پایه‌ی آزمایشگاه و فرمول‌های ثبت‌شده.",
    instructions: "از نتایج آزمایشگاه و فرمول‌های ثبت‌شده استفاده کن، علت‌ها را با شواهد و به ترتیب احتمال بنویس و هر پیشنهاد را با آزمون تأیید کن.", defaultModelId: "model-3",
    tools: [{ connectionId: "conn-16", toolId: "tool-28" }, { connectionId: "conn-16", toolId: "tool-29" }], skillIds: [],
    isSensitive: false, isEnabled: true, kind: "shared", shareRequests: [], useCount: 18, updatedAt: "2026-10-20T09:00:00.000Z",
  },
  {
    id: "agent-maint", knowledgeIds: ["kn-maintenance", "kn-maint-chat"], modelPolicy: "internal-only", runIn: ["assistant", "group"], version: "1.1", evalScore: 0.88, name: "دستیار نگهداری و تعمیرات", purpose: "پاسخ به پرسش‌های «این آلارم چیست و دفعه‌ی قبل چه کردیم؟» از گزارش‌های تعمیرات و گفتگوهای همکاران.",
    instructions: "اول گزارش‌های تعمیرات، بعد گفتگوهای همکاران را بخوان. فقط با منبع پاسخ بده و علت دفعه‌ی قبل را کنار پیشنهاد فعلی بنویس.", defaultModelId: "model-3",
    tools: [{ connectionId: "conn-17", toolId: "tool-30" }], skillIds: [],
    isSensitive: false, isEnabled: true, kind: "shared", shareRequests: [], useCount: 27, updatedAt: "2026-10-22T09:00:00.000Z",
  },
  {
    id: "agent-pricing", knowledgeIds: ["kn-sales"], modelPolicy: "auto", runIn: ["assistant", "workflows"], version: "1.0", evalScore: 0.85, name: "دستیار فروش و قیمت‌گذاری", purpose: "محاسبه‌ی قیمت و حاشیه‌ی سود یک سفارش، و آماده‌کردن پیش‌فاکتور.",
    instructions: "قیمت تمام‌شده را از نرخ‌های روز و موجودی حساب کن، حاشیه را با سیاست قیمت‌گذاری مقایسه کن و پیش‌فاکتور را پیش از ارسال برای تأیید بفرست.", defaultModelId: "model-3",
    tools: [{ connectionId: "conn-18", toolId: "tool-31" }, { connectionId: "conn-12", toolId: "tool-20" }], skillIds: [],
    isSensitive: false, isEnabled: true, kind: "shared", shareRequests: [], useCount: 14, updatedAt: "2026-10-24T09:00:00.000Z",
  },
  {
    id: "agent-indicators", knowledgeIds: ["kn-sop"], modelPolicy: "auto", runIn: ["assistant", "group", "workflows"], version: "2.0", evalScore: 0.9, name: "تحلیل‌گر شاخص‌های تولید", purpose: "بررسی شاخص‌های خط تولید نسبت به حد مجاز و نوشتن علت احتمالی خروج از حد.",
    instructions: "شاخص‌ها و روند ۲۴ ساعت را بخوان، شاخص‌های خارج از حد را فهرست کن و رابطه‌ی زمانی آن‌ها را برای مسئول توضیح بده.", defaultModelId: "model-3",
    tools: [{ connectionId: "conn-14", toolId: "tool-24" }, { connectionId: "conn-14", toolId: "tool-25" }], skillIds: [],
    isSensitive: false, isEnabled: true, kind: "shared", shareRequests: [], useCount: 31, updatedAt: "2026-10-26T09:00:00.000Z",
  },
  {
    id: "agent-planning", knowledgeIds: ["kn-sop", "kn-datasheets"], modelPolicy: "internal-only", runIn: ["assistant", "workflows"], version: "1.0", evalScore: 0.87,
    name: "دستیار برنامه‌ریزی تولید", purpose: "زمان‌بندی سفارش‌ها روی خطوط اکسترودر و پیشنهاد کمترین تعویض فرمول و رنگ.",
    instructions: "سفارش‌های باز، ظرفیت خطوط و موجودی مواد را بخوان؛ سفارش‌های هم‌رنگ و هم‌گرید را پشت هم بگذار تا تعویض فرمول کم شود و هر جابه‌جایی را با دلیل بنویس. برنامه را پیش از اعلام برای تأیید بفرست.", defaultModelId: "model-8",
    tools: [{ connectionId: "conn-14", toolId: "tool-24" }, { connectionId: "conn-12", toolId: "tool-20" }], skillIds: [],
    isSensitive: false, isEnabled: true, kind: "shared", shareRequests: [], useCount: 9, updatedAt: "2026-10-30T09:00:00.000Z",
  },
];

export function getMyAgents(): Agent[] {
  return agents.filter((agent) => agent.kind === "personal");
}

export function getSharedAgents(): Agent[] {
  return [...systemAgents, ...agents.filter((agent) => agent.kind === "shared")];
}

export function getSkills(): Skill[] {
  return skills;
}

/** Ready-made skills the user can import. Imported skills wait for admin approval. */
export function getSkillLibrary(): (SkillContent & { id: string })[] {
  return [
    { id: "lib-1", name: "ترجمه‌ی فنی", description: "ترجمه‌ی متن‌های فنی بین فارسی و انگلیسی.", instructions: "اصطلاح‌های فنی را دقیق ترجمه کن و در صورت ابهام معادل انگلیسی را در پرانتز بنویس." },
    { id: "lib-2", name: "بازبینی ویرایشی", description: "اصلاح نگارش و یکدست‌کردن لحن متن.", instructions: "غلط‌های نگارشی را اصلاح و لحن را یکدست کن." },
    { id: "lib-3", name: "استخراج جدول", description: "تبدیل متن یا تصویر جدول به جدول مرتب.", instructions: "داده‌ها را به جدول با عنوان ستون‌های روشن تبدیل کن." },
  ];
}

/** People and groups an Agent can be shared with. */
export function getShareTargetOptions(): { id: string; kind: "user" | "group"; name: string }[] {
  return [
    { id: "t-5", kind: "group", name: "تیم کیفیت" },
    { id: "t-6", kind: "group", name: "کل سازمان" },
    { id: "t-1", kind: "group", name: "تیم فروش" },
    { id: "t-2", kind: "group", name: "منابع انسانی" },
    { id: "t-3", kind: "user", name: "علی رضایی" },
    { id: "t-4", kind: "user", name: "سارا کریمی" },
  ];
}
