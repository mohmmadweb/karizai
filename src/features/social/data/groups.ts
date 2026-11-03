import type { Group, GroupMessage } from "../types";

const groups: Group[] = [
  {
    id: "grp-quality", name: "کیفیت و فرمولاسیون", description: "آزمون بچ‌ها، فرمول‌ها و رویه‌های کنترل کیفیت", memberCount: 18, agentIds: ["agent-quality"],
    summary: {
      unread: 24, topic: "تأخیر تأمین مستربچ مشکی و آزمون گرید جایگزین",
      points: ["تأمین‌کننده‌ی فعلی مستربچ مشکی ۴۰٪ تحویل را ۱۰ روز عقب انداخته است (سارا کریمی).", "رضا محمدی پیشنهاد آزمون گرید جایگزین روی خط ۲ را داده است.", "دستیار کیفیت نتیجه‌ی آزمون‌های قبلی گرید جایگزین را آورده: MFI ۱۲٫۱ و در حد مجاز."],
      openDecision: "تأیید آزمون آزمایشی گرید جایگزین تا پنجشنبه",
      actions: [
        { title: "آزمون آزمایشی گرید جایگزین مستربچ روی خط ۲", assigneeId: "col-reza", dueDate: "2026-11-05T00:00:00.000Z", projectId: "proj-5" },
        { title: "پیگیری تحویل مستربچ مشکی با تأمین‌کننده‌ی فعلی", assigneeId: "col-ali", dueDate: "2026-11-04T00:00:00.000Z", projectId: "proj-5" },
      ],
    },
  },
  {
    id: "grp-line2", name: "تولید خط ۲", description: "شیفت‌ها، شاخص‌ها و ضایعات خط ۲", memberCount: 22, agentIds: ["agent-indicators"],
    summary: {
      unread: 7, topic: "دمای ناحیه‌ی ۴ اکسترودر و ضایعات خط",
      points: ["دمای ناحیه‌ی ۴ از صبح ۲۴۸ درجه است (حد ۲۴۰).", "ضایعات شیفت شب به ۴٫۸٪ رسید (حد ۴٪).", "مهدی صادقی بازبینی گرمکن را برای امروز عصر گذاشته است."],
      openDecision: "توقف کوتاه خط برای کالیبراسیون حسگر یا ادامه تا پایان شیفت",
      actions: [
        { title: "کالیبراسیون حسگر دمای ناحیه‌ی ۴", assigneeId: "col-mehdi", dueDate: "2026-11-03T00:00:00.000Z", projectId: "proj-1" },
        { title: "گزارش ضایعات شیفت شب خط ۲", assigneeId: "col-reza", dueDate: "2026-11-03T00:00:00.000Z", projectId: "proj-1" },
      ],
    },
  },
  {
    id: "grp-maint", name: "نگهداری و تعمیرات", description: "دستور کارها و تعمیرات پیشگیرانه", memberCount: 12, agentIds: ["agent-maint"],
    summary: {
      unread: 3, topic: "برنامه‌ی تعمیرات پیشگیرانه‌ی آبان",
      points: ["سرویس گیربکس اکسترودر خط ۱ برای ۱۵ آبان برنامه‌ریزی شد.", "قطعه‌ی یدک گرمکن ناحیه‌ی ۴ در انبار موجود است."],
      openDecision: "زمان توقف خط ۱ برای سرویس",
      actions: [{ title: "هماهنگی زمان توقف خط ۱ با برنامه‌ریزی تولید", assigneeId: "col-mehdi", dueDate: "2026-11-05T00:00:00.000Z", projectId: "proj-1" }],
    },
  },
  {
    id: "grp-supply", name: "تدارکات و انبار", description: "سفارش‌ها، موجودی و تأمین‌کننده‌ها", memberCount: 9, agentIds: [],
    summary: { unread: 0, topic: "سفارش HD5502 و موجودی مستربچ", points: ["جریان سفارش‌دهی خودکار ۸۰ تن HD5502 پیشنهاد داده و منتظر تأیید است.", "موجودی مستربچ مشکی ۶٫۵ تن شمارش شد."], openDecision: "تأیید سفارش ۸۰ تن HD5502", actions: [] },
  },
  {
    id: "grp-sales", name: "فروش", description: "مشتریان، پیش‌فاکتورها و قیمت‌ها", memberCount: 14, agentIds: ["agent-pricing"],
    summary: { unread: 0, topic: "پیش‌فاکتور آریاپلاست", points: ["پیش‌فاکتور ۲٬۲۹۶٫۸ میلیون تومانی آریاپلاست آماده و منتظر تأیید مدیر فروش است."], openDecision: "تأیید تخفیف ۳٪ برای آریاپلاست", actions: [] },
  },
];

const messages: GroupMessage[] = [
  { id: "gm-1", groupId: "grp-quality", authorId: "col-sara", createdAt: "2026-11-02T05:40:00.000Z", text: "تأمین‌کننده‌ی فعلی مستربچ مشکی تحویل را ۱۰ روز عقب انداخت؛ فقط ۶٫۵ تن در انبار داریم." },
  { id: "gm-2", groupId: "grp-quality", authorId: "col-reza", createdAt: "2026-11-02T05:52:00.000Z", text: "پیشنهاد می‌کنم گرید جایگزین را روی خط ۲ آزمون کنیم. @دستیار کیفیت قبلاً آزمونش کرده‌ایم؟" },
  { id: "gm-3", groupId: "grp-quality", authorId: "agent-quality", createdAt: "2026-11-02T05:52:30.000Z", text: "در شش ماه گذشته دو بار گرید جایگزین آزمون شده و نتایج در «گزارش آزمون ۱۴۰۵/۰۳» است. MFI گرید جایگزین ۱۲٫۱ و در حد مجاز (۱۰ تا ۱۴) بود.", sources: ["گزارش آزمون ۱۴۰۵/۰۳", "LIMS: نتایج گرید جایگزین"] },
  { id: "gm-4", groupId: "grp-quality", authorId: "col-narges", createdAt: "2026-11-02T06:05:00.000Z", text: "اگر تا پنجشنبه تأیید شود، آزمایشگاه نمونه‌ها را شنبه آزمون می‌کند." },
  { id: "gm-5", groupId: "grp-line2", authorId: "col-reza", createdAt: "2026-11-02T04:10:00.000Z", text: "ضایعات شیفت شب ۴٫۸٪ شد؛ از حد گذشتیم." },
  { id: "gm-6", groupId: "grp-line2", authorId: "agent-indicators", createdAt: "2026-11-02T04:11:00.000Z", text: "دمای ناحیه‌ی ۴ از ساعت ۶ صبح بالای ۲۴۰ درجه است و هم‌زمان ضایعات بالا رفته؛ علت احتمالی تنظیم گرمکن یا خطای حسگر است.", sources: ["MES: روند دمای ناحیه‌ی ۴", "MES: ضایعات شیفت شب"] },
  { id: "gm-7", groupId: "grp-line2", authorId: "col-mehdi", createdAt: "2026-11-02T04:30:00.000Z", text: "عصر گرمکن را بازبینی می‌کنم." },
  { id: "gm-8", groupId: "grp-maint", authorId: "col-mehdi", createdAt: "2026-11-01T09:00:00.000Z", text: "سرویس گیربکس اکسترودر خط ۱ را برای ۱۵ آبان گذاشتم." },
  { id: "gm-9", groupId: "grp-supply", authorId: "col-ali", createdAt: "2026-11-02T05:00:00.000Z", text: "پیشنهاد سفارش ۸۰ تن HD5502 آمد؛ منتظر تأیید خانم احمدی هستیم." },
  { id: "gm-11", groupId: "grp-sales", authorId: "col-narges", createdAt: "2026-11-01T09:10:00.000Z", text: "قیمت پایه‌ی PP این هفته ۲٪ بالا رفته؛ در پیش‌فاکتورها اعتبار را ۵ روزه بنویسید." },
  { id: "gm-12", groupId: "grp-sales", authorId: "col-mohammad", createdAt: "2026-11-01T09:25:00.000Z", text: "موافقم. پیش‌فاکتورهای بالای سقف را برای تأیید من بفرستید." },
  { id: "gm-10", groupId: "grp-sales", authorId: "col-mohammad", createdAt: "2026-11-01T12:00:00.000Z", text: "پیش‌فاکتور آریاپلاست را دیدم، فردا تأیید می‌کنم." },
];

export function getGroups(): Group[] {
  return groups;
}

export function getGroupMessages(): GroupMessage[] {
  return messages;
}
