import type { Member } from "../types";

/** A page of the 214 members synced from Active Directory; `col-*` ids have a chat in the messenger. */
const members: Member[] = [
  { id: "user-1", name: "مریم احمدی", role: "مسئول کیفیت", unit: "کیفیت", lastActive: "اکنون" },
  { id: "col-ali", name: "علی رضایی", role: "مدیر تدارک", unit: "تدارکات", lastActive: "امروز ۱۱:۵۵" },
  { id: "col-sara", name: "سارا کریمی", role: "مسئول انبار", unit: "انبار", lastActive: "امروز ۰۹:۱۰" },
  { id: "col-reza", name: "رضا محمدی", role: "سرپرست خط ۲", unit: "تولید", lastActive: "امروز ۰۹:۲۲" },
  { id: "col-narges", name: "نرگس حسینی", role: "مسئول آزمایشگاه", unit: "کیفیت", lastActive: "امروز ۰۹:۳۵" },
  { id: "col-mohammad", name: "محمد کاظمی", role: "مدیر فروش", unit: "فروش", lastActive: "دیروز" },
  { id: "col-mehdi", name: "مهدی صادقی", role: "سرپرست نگهداری", unit: "نگهداری", lastActive: "امروز ۰۸:۰۰" },
  { id: "mem-1", name: "حمید نوروزی", role: "مدیرعامل", unit: "مدیریت", lastActive: "دیروز" },
  { id: "mem-2", name: "زهرا موسوی", role: "کارشناس برنامه‌ریزی تولید", unit: "تولید", lastActive: "امروز ۱۰:۴۰" },
  { id: "mem-3", name: "امیر جعفری", role: "اپراتور اکسترودر", unit: "تولید", lastActive: "امروز ۰۷:۰۵" },
  { id: "mem-4", name: "لیلا رحیمی", role: "کارشناس خرید", unit: "تدارکات", lastActive: "۲ روز پیش" },
  { id: "mem-5", name: "پویا شریفی", role: "کارشناس فروش", unit: "فروش", lastActive: "امروز ۱۰:۰۲" },
  { id: "mem-6", name: "فاطمه قاسمی", role: "کارشناس منابع انسانی", unit: "منابع انسانی", lastActive: "دیروز" },
];

export const memberTotal = 214;

export function getMembers(): Member[] {
  return members;
}
