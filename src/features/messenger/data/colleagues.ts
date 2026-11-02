import type { Colleague } from "../types";

const colleagues: Colleague[] = [
  { id: "col-ali", name: "علی رضایی", role: "مدیر تدارک", online: true },
  { id: "col-sara", name: "سارا کریمی", role: "مسئول انبار", online: true },
  { id: "col-reza", name: "رضا محمدی", role: "سرپرست خط ۲", online: false },
  { id: "col-narges", name: "نرگس حسینی", role: "مسئول آزمایشگاه", online: true },
  { id: "col-mohammad", name: "محمد کاظمی", role: "مدیر فروش", online: false },
  { id: "col-mehdi", name: "مهدی صادقی", role: "سرپرست نگهداری", online: false },
];

export function getColleagues(): Colleague[] {
  return colleagues;
}

export function getColleagueById(id: string): Colleague | undefined {
  return colleagues.find((item) => item.id === id);
}
