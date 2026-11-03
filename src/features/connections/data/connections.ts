import type { Connection } from "../types";
import { officeConnections } from "./office-connections";
import { gatewayConnections } from "./gateway-connections";
import { plantConnections } from "./plant-connections";

const connections: Connection[] = [
  {
    id: "conn-1",
    name: "دیدار",
    domain: "مدیریت ارتباط با مشتری CRM",
    description: "دسترسی به مشتریان، فرصت‌ها و سرنخ‌های فروش.",
    status: "ready",
    tools: [
      { id: "tool-1", name: "جست‌وجوی مشتری", description: "مشتری را با نام یا شماره پیدا می‌کند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "عبارت جست‌وجو", value: "شرکت آسمان" }] },
      { id: "tool-2", name: "ثبت یادداشت برای مشتری", description: "یک یادداشت تازه در پرونده‌ی مشتری می‌نویسد.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "مشتری", value: "شرکت آسمان" }, { label: "یادداشت", value: "پیگیری قرارداد در هفته‌ی آینده" }] },
      { id: "tool-3", name: "حذف سرنخ", description: "یک سرنخ فروش را حذف می‌کند.", requiresApproval: true, userCanUse: false, sampleInputs: [{ label: "سرنخ", value: "سرنخ ۱۲۰۴" }] },
    ],
  },
  {
    id: "conn-2",
    name: "پیام‌گستر",
    domain: "مدیریت ارتباط با مشتری CRM",
    description: "سابقه‌ی تماس و پیام‌های مشتریان.",
    status: "ready",
    tools: [
      { id: "tool-4", name: "فهرست پیام‌های مشتری", description: "آخرین پیام‌های یک مشتری را نشان می‌دهد.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "مشتری", value: "شرکت آسمان" }] },
      { id: "tool-5", name: "ثبت پیگیری", description: "یک پیگیری تازه برای مشتری ثبت می‌کند.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "مشتری", value: "شرکت آسمان" }, { label: "موعد", value: "۱۴۰۵/۰۸/۱۰" }] },
    ],
  },
  {
    id: "conn-3",
    name: "راهکاران همکاران سیستم",
    domain: "منابع سازمانی، مالی، فروش و انبار",
    description: "سامانه‌ی یکپارچه‌ی منابع سازمان (ERP).",
    status: "ready",
    tools: [
      { id: "tool-6", name: "موجودی انبار", description: "موجودی یک کالا را در انبارها می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "کالا", value: "کابل شبکه" }] },
      { id: "tool-7", name: "ثبت سفارش فروش", description: "یک سفارش فروش تازه ثبت می‌کند.", writes: true, requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "مشتری", value: "شرکت آسمان" }, { label: "کالا", value: "کابل شبکه" }, { label: "تعداد", value: "۵۰" }] },
      { id: "tool-60", name: "پیش‌نویس سفارش خرید", description: "یک سفارش خرید با وضعیت «پیش‌نویس» در راهکاران می‌سازد تا مدیر تدارک تأیید و نهایی کند.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "ماده", value: "PE سنگین HD5502" }, { label: "مقدار (تن)", value: "80" }], params: [{ key: "material", label: "کالا", kind: "text", required: true, placeholder: "PE سنگین HD5502" }, { key: "quantityTon", label: "مقدار (تن)", kind: "number", required: true, min: 1, max: 500, defaultValue: "20" }, { key: "vendor", label: "تامین‌کننده", kind: "text", required: false }] },
      { id: "tool-61", name: "سفارش‌های باز فروش", description: "سفارش‌های باز مشتریان را با گرید، مقدار و موعد تحویل می‌خواند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "بازه (روز)", value: "10" }], params: [{ key: "days", label: "بازه‌ی پیش رو (روز)", kind: "number", required: true, min: 1, max: 60, defaultValue: "10" }] },
    ],
  },
  {
    id: "conn-4",
    name: "سپیدار",
    domain: "حسابداری و امور مالی",
    description: "گزارش‌های حسابداری و مالی.",
    status: "needs-auth",
    tools: [
      { id: "tool-8", name: "گزارش هزینه‌ی ماهانه", description: "جمع هزینه‌های یک ماه را می‌دهد.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "ماه", value: "مهر ۱۴۰۵" }] },
    ],
  },
  {
    id: "conn-5",
    name: "دیدگاه چارگون",
    domain: "اتوماسیون اداری و مکاتبات",
    description: "نامه‌ها و ارجاعات اداری.",
    status: "ready",
    tools: [
      { id: "tool-9", name: "جست‌وجوی نامه", description: "نامه‌ها را با موضوع یا شماره پیدا می‌کند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "موضوع", value: "قرارداد تأمین" }] },
      { id: "tool-10", name: "ثبت ارجاع نامه", description: "نامه‌ای را به همکار ارجاع می‌دهد.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "نامه", value: "۱۴۰۵/۱۲۳" }, { label: "گیرنده", value: "علی رضایی" }] },
    ],
  },
  {
    id: "conn-6",
    name: "فراگستر",
    domain: "اتوماسیون اداری و مدیریت فرایند",
    description: "فرایندها و کارتابل.",
    status: "ready",
    tools: [
      { id: "tool-11", name: "وضعیت فرایند", description: "وضعیت یک درخواست یا فرایند را می‌گوید.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "شماره‌ی درخواست", value: "۸۷۳۱" }] },
    ],
  },
  {
    id: "conn-7",
    name: "کاوه‌نگار",
    domain: "ارسال پیامک",
    description: "ارسال پیامک به مخاطبان.",
    status: "ready",
    tools: [
      { id: "tool-12", name: "ارسال پیامک", description: "یک پیامک برای یک شماره می‌فرستد.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "شماره", value: "۰۹۱۲۰۰۰۰۰۰۰" }, { label: "متن", value: "جلسه فردا ساعت ۱۰ است." }] },
    ],
  },
  {
    id: "conn-8",
    name: "نجوا",
    domain: "اعلان و ارتباط با کاربران",
    description: "اعلان‌های درون‌سازمانی.",
    status: "needs-auth",
    tools: [
      { id: "tool-13", name: "ارسال اعلان", description: "یک اعلان برای کاربران یا گروه می‌فرستد.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "گروه", value: "تیم فروش" }, { label: "متن", value: "گزارش ماه آماده است." }] },
    ],
  },
  {
    id: "conn-9",
    name: "نشان",
    domain: "نقشه و خدمات مکان‌محور",
    description: "جست‌وجوی مکان و خدمات مکانی.",
    status: "ready",
    tools: [
      { id: "tool-14", name: "جست‌وجوی مکان", description: "نشانی و مکان را پیدا می‌کند.", requiresApproval: false, userCanUse: true, sampleInputs: [{ label: "عبارت", value: "شعبه‌ی مرکزی" }] },
    ],
  },
  {
    id: "conn-11",
    name: "جریان کاری هوشمند",
    domain: "فلوی n8n",
    description: "فلوی n8n محلی که به‌صورت نقطه‌ی پایانی (webhook) وارد شده است. ورودی شما به فلو داده می‌شود و خروجی‌اش در گفتگو می‌آید.",
    endpoint: "http://localhost:5678/webhook/smart-workflow",
    status: "ready",
    tools: [
      { id: "tool-16", name: "اجرای جریان کاری", description: "پیام شما را به فلوی n8n می‌دهد و خروجی فلو را به گفتگو برمی‌گرداند.", requiresApproval: true, userCanUse: true, sampleInputs: [{ label: "ورودی فلو", value: "" }] },
    ],
  },
];

/** Plant systems (warehouse, procurement, MES, lab, maintenance, prices, social network). They stay available next to the connections the admin defines. */
export const plantConnectionIds = [...plantConnections, ...officeConnections, ...gatewayConnections].map((item) => item.id);

/** Connections of the current user, with their status. */
export function getUserConnections(): Connection[] {
  return [...connections, ...plantConnections, ...officeConnections, ...gatewayConnections];
}

export function getConnectionById(id: string): Connection | undefined {
  return getUserConnections().find((connection) => connection.id === id);
}
