import type { Member } from "../types";

/** A page of the 214 members synced from Active Directory; `col-*` ids have a chat in the messenger. */
const members: Member[] = [
  { id: "user-1", name: "مریم احمدی", role: "مسئول کیفیت", unit: "کیفیت", lastActive: "اکنون" },
  { id: "col-ali", name: "علی رضایی", role: "مدیر تدارک", unit: "تدارکات", lastActive: "امروز ۰۹:۴۸" },
  { id: "col-sara", name: "سارا کریمی", role: "مسئول انبار", unit: "انبار", lastActive: "امروز ۰۹:۱۰" },
  { id: "col-reza", name: "رضا محمدی", role: "سرپرست خط ۲", unit: "تولید", lastActive: "امروز ۰۹:۲۲" },
  { id: "col-narges", name: "نرگس حسینی", role: "مسئول آزمایشگاه", unit: "کیفیت", lastActive: "امروز ۰۹:۳۵" },
  { id: "col-mohammad", name: "محمد کاظمی", role: "مدیر فروش", unit: "فروش", lastActive: "دیروز" },
  { id: "col-mehdi", name: "مهدی صادقی", role: "سرپرست نگهداری", unit: "نگهداری", lastActive: "امروز ۰۸:۰۰" },
  { id: "mem-1", name: "حمید نوروزی", role: "مدیرعامل", unit: "مدیریت", lastActive: "دیروز" },
  { id: "mem-2", name: "زهرا موسوی", role: "کارشناس برنامه‌ریزی تولید", unit: "تولید", lastActive: "امروز ۰۹:۴۰" },
  { id: "mem-3", name: "امیر جعفری", role: "اپراتور اکسترودر", unit: "تولید", lastActive: "امروز ۰۷:۰۵" },
  { id: "mem-4", name: "لیلا رحیمی", role: "کارشناس خرید", unit: "تدارکات", lastActive: "۲ روز پیش" },
  { id: "mem-5", name: "پویا شریفی", role: "کارشناس فروش", unit: "فروش", lastActive: "امروز ۰۹:۵۲" },
  { id: "mem-6", name: "فاطمه قاسمی", role: "کارشناس منابع انسانی", unit: "منابع انسانی", lastActive: "دیروز" },
];

export const memberTotal = 214;

export function getMembers(): Member[] {
  return members;
}

/** Sign-in names of the sample members; the mail address and the rest follow from them. */
const usernames: Record<string, string> = {"user-1": "m.ahmadi", "col-ali": "a.rezaei", "col-sara": "s.karimi", "col-reza": "r.mohammadi", "col-narges": "n.hosseini", "col-mohammad": "m.kazemi", "col-mehdi": "m.sadeghi", "mem-1": "h.norouzi", "mem-2": "z.mousavi", "mem-3": "a.jafari", "mem-4": "l.rahimi", "mem-5": "p.sharifi", "mem-6": "f.ghasemi"};

/** Contact details shown in the members table: fixed sample values, the mobile number partly hidden. */
export function getMemberContact(id: string) {
  const index = Math.max(0, members.findIndex((member) => member.id === id));
  const username = usernames[id] ?? id;
  const tail = String(2153 + index * 417).slice(-4);
  const day = String(3 + (index * 5) % 24).padStart(2, "0");
  const month = String(1 + (index * 3) % 7).padStart(2, "0");
  return { username, email: `${username}@parsapolymer.ir`, mobile: `0912***${tail}`, joinedAt: `2026-${month}-${day}T08:30:00.000Z` };
}
