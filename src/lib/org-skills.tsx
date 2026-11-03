"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type OrgSkillStatus = "published" | "draft";

/** A skill uploaded by the admin that users can add to their own agents. */
export type OrgSkill = {
  id: string;
  name: string;
  description: string;
  /** SKILL.md-like instructions in Persian. */
  instructions: string;
  /** Attached file names, e.g. template documents. */
  files: string[];
  version: string;
  /** Groups that may use the skill; empty means everyone. */
  groupIds: string[];
  status: OrgSkillStatus;
  /** ISO date string. */
  updatedAt: string;
};

export const seedOrgSkills: OrgSkill[] = [
  {
    id: "orgskill-001",
    name: "فرمت‌دهی اسناد",
    description: "هر سند را به قالب رسمی پارسا پلیمر درمی‌آورد: سربرگ، شماره‌گذاری و فونت استاندارد.",
    instructions: [
      "# فرمت‌دهی اسناد پارسا پلیمر",
      "1. متن ورودی را بدون تغییر محتوا نگه دار؛ فقط قالب را اعمال کن.",
      "2. سربرگ رسمی را از فایل «سربرگ-پارسا-پلیمر.docx» بردار و بالای هر صفحه بگذار.",
      "3. شماره‌ی سند را به شکل PP-نوع-سال-ترتیب بساز (مثلاً PP-SOP-1405-012).",
      "4. فونت متن فارسی «وزیرمتن» ۱۱ و عنوان‌ها ۱۴ پررنگ باشد؛ متن لاتین Calibri.",
      "5. عنوان‌ها را سلسله‌مراتبی شماره‌گذاری کن (۱، ۱٫۱، ۱٫۲).",
      "6. پاورقی هر صفحه: شماره‌ی صفحه از کل، نسخه و تاریخ شمسی.",
      "7. جدول‌ها حاشیه‌ی نازک خاکستری و ردیف عنوان پررنگ داشته باشند.",
      "8. اگر سند محرمانه است، نشان «محرمانه» را در سربرگ اضافه کن.",
      "9. خروجی را به صورت .docx تحویل بده و فهرست تغییرات قالب را جداگانه بنویس.",
    ].join("\n"),
    files: ["سربرگ-پارسا-پلیمر.docx", "قالب-رسمی-سند.docx"],
    version: "۱٫۲",
    groupIds: [],
    status: "published",
    updatedAt: "2026-10-28T09:00:00.000Z",
  },
  {
    id: "orgskill-002",
    name: "پروپوزال‌نویس",
    description: "از شرح نیاز مشتری یک پیشنهاد فنی و بازرگانی با ساختار ثابت شرکت می‌نویسد.",
    instructions: [
      "# پروپوزال‌نویس",
      "1. ابتدا نیاز مشتری، صنعت، گرید مدنظر و حجم سالانه را از کاربر بپرس.",
      "2. ساختار ثابت: خلاصه‌ی مدیریتی، درک نیاز، راهکار پیشنهادی، مشخصات فنی، برنامه‌ی تحویل، قیمت و شرایط.",
      "3. مشخصات فنی را فقط از دیتاشیت‌های تأییدشده‌ی دانش سازمان بردار و منبع را بنویس.",
      "4. قیمت را حدس نزن؛ جدول قیمت را با جای‌خالی بگذار تا واحد بازرگانی پر کند.",
      "5. لحن رسمی و ساده؛ جمله‌ها کوتاه و بدون اغراق.",
      "6. در پایان فهرست مفروضات و پرسش‌های باز را بیاور.",
      "7. قالب نهایی را با اسکیل «فرمت‌دهی اسناد» یکدست کن.",
    ].join("\n"),
    files: ["قالب-پروپوزال.docx"],
    version: "۱٫۰",
    groupIds: ["group-001", "group-003"],
    status: "published",
    updatedAt: "2026-10-22T11:30:00.000Z",
  },
  {
    id: "orgskill-003",
    name: "ساخت پاورپوینت ارائه‌ی محصول",
    description: "برای هر گرید پلیمری یک ارائه‌ی ۸ تا ۱۰ اسلایدی با قالب برند می‌سازد.",
    instructions: [
      "# ساخت پاورپوینت ارائه‌ی محصول",
      "1. نام گرید و مخاطب ارائه (مشتری، مدیریت، نمایشگاه) را مشخص کن.",
      "2. اسلایدها: جلد، معرفی شرکت، معرفی گرید، مشخصات فنی، کاربردها، مزیت رقابتی، نتایج آزمون، گواهی‌ها، تماس.",
      "3. هر اسلاید فقط یک پیام اصلی و حداکثر پنج خط متن داشته باشد.",
      "4. اعداد فنی را از دیتاشیت بردار و در جدول ساده نشان بده.",
      "5. قالب «ارائه-محصول-پارسا.pptx» را بدون تغییر رنگ و فونت استفاده کن.",
      "6. توضیح گوینده را در بخش یادداشت‌های هر اسلاید بنویس.",
      "7. خروجی را به صورت .pptx تحویل بده.",
    ].join("\n"),
    files: ["ارائه-محصول-پارسا.pptx", "لوگو-پارسا-پلیمر.zip"],
    version: "۱٫۱",
    groupIds: ["group-001"],
    status: "published",
    updatedAt: "2026-10-25T14:00:00.000Z",
  },
  {
    id: "orgskill-004",
    name: "ساختار صورت‌جلسه",
    description: "یادداشت خام جلسه را به صورت‌جلسه‌ی رسمی با مصوبات، مسئول و مهلت تبدیل می‌کند.",
    instructions: [
      "# ساختار صورت‌جلسه",
      "1. سرتیتر: عنوان جلسه، تاریخ شمسی، مکان، حاضران و غایبان.",
      "2. دستور جلسه را به صورت فهرست شماره‌دار بیاور.",
      "3. برای هر موضوع، خلاصه‌ی بحث را در دو یا سه جمله بنویس.",
      "4. مصوبات را در جدولی با ستون‌های «اقدام»، «مسئول» و «مهلت» جمع کن.",
      "5. اگر مسئول یا مهلت در یادداشت نبود، خالی بگذار و در پایان بپرس.",
      "6. جلسه‌ی بعد و موضوعات معوق را در پایان یادداشت کن.",
    ].join("\n"),
    files: ["قالب-صورتجلسه.docx"],
    version: "۰٫۹",
    groupIds: [],
    status: "draft",
    updatedAt: "2026-11-01T08:15:00.000Z",
  },
];

type OrgSkillsContextValue = {
  skills: OrgSkill[];
  setSkills: React.Dispatch<React.SetStateAction<OrgSkill[]>>;
};

const OrgSkillsContext = createContext<OrgSkillsContextValue | null>(null);

/** Temporary in-memory organization skills shared by the admin and user panels. */
export function OrgSkillsProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<OrgSkill[]>(seedOrgSkills);
  const value = useMemo(() => ({ skills, setSkills }), [skills]);
  return <OrgSkillsContext.Provider value={value}>{children}</OrgSkillsContext.Provider>;
}

export function useOrgSkills(): OrgSkillsContextValue {
  const value = useContext(OrgSkillsContext);
  if (!value) throw new Error("useOrgSkills must be used inside OrgSkillsProvider");
  return value;
}
