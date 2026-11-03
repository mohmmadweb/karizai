import {
  BadgePercentIcon, BanknoteIcon, BoxesIcon, FactoryIcon, FlaskConicalIcon, MegaphoneIcon, PackageCheckIcon,
  CalendarRangeIcon, ShoppingCartIcon, ShieldCheckIcon, TruckIcon, UsersRoundIcon, WrenchIcon,
} from "lucide-react";
import type { AreaKpi, BusinessArea } from "../types";
import { getKpiSource } from "./kpi-sources";

type Base = Omit<AreaKpi, "source">;
type BaseArea = Omit<BusinessArea, "kpis"> & { kpis: Base[] };

const kpi = (id: string, label: string, unit: string, target: number, better: AreaKpi["better"], series?: number[]): Base =>
  ({ id, label, unit, target, better, series });

const areas: BaseArea[] = [
  { id: "marketing", title: "بازاریابی", icon: MegaphoneIcon, kpis: [
    kpi("mk-conv", "نرخ تبدیل سرنخ به استعلام", "٪", 20, "higher", [14, 15, 16, 15, 17, 16, 18, 17, 19, 17, 17, 18]),
    kpi("mk-leads", "سرنخ‌های جدید این ماه", "عدد", 120, "higher"),
    kpi("mk-cost", "هزینه‌ی جذب هر سرنخ", "میلیون تومان", 2.5, "lower"),
  ] },
  { id: "sales", title: "فروش", icon: ShoppingCartIcon, kpis: [
    kpi("sl-vol", "فروش ماه", "تن", 2000, "higher", [1620, 1700, 1650, 1780, 1810, 1760, 1900, 1870, 1820, 1860, 1790, 1840]),
    kpi("sl-open", "سفارش‌های باز", "عدد", 30, "higher"),
    kpi("sl-ontime", "تحویل به‌موقع سفارش‌ها", "٪", 95, "higher"),
  ] },
  { id: "pricing", title: "قیمت‌گذاری", icon: BadgePercentIcon, kpis: [
    kpi("pr-margin", "میانگین حاشیه‌ی سود پیش‌فاکتورها", "٪", 8, "higher", [10, 11, 10, 12, 11, 13, 12, 11, 12, 13, 11, 12]),
    kpi("pr-wait", "پیش‌فاکتورهای منتظر تأیید", "عدد", 6, "lower"),
    kpi("pr-time", "زمان صدور پیش‌فاکتور", "ساعت", 4, "lower"),
  ] },
  { id: "rnd", title: "تحقیق و توسعه", icon: FlaskConicalIcon, kpis: [
    kpi("rd-success", "نرخ موفقیت آزمون فرمولاسیون", "٪", 70, "higher", [58, 60, 59, 62, 61, 63, 65, 62, 66, 63, 65, 64]),
    kpi("rd-projects", "پروژه‌های فعال", "عدد", 8, "higher"),
    kpi("rd-testing", "فرمولاسیون در آزمون", "عدد", 4, "higher"),
  ] },
  { id: "planning", title: "برنامه‌ریزی تولید", icon: CalendarRangeIcon, kpis: [
    kpi("pl-adherence", "پایبندی به برنامه‌ی تولید", "٪", 90, "higher", [84, 86, 85, 89, 87, 90, 88, 91, 87, 89, 86, 88]),
    kpi("pl-late", "سفارش‌های تولید دچار تأخیر", "عدد", 3, "lower"),
    kpi("pl-change", "زمان تعویض فرمول", "ساعت", 2.5, "lower"),
  ] },
  { id: "procurement", title: "تأمین و خرید", icon: PackageCheckIcon, kpis: [
    kpi("pc-ontime", "تحویل به‌موقع تأمین‌کنندگان", "٪", 90, "higher", [90, 88, 91, 87, 89, 86, 88, 85, 84, 86, 83, 82]),
    kpi("pc-cover", "پوشش موجودی کم‌ترین ماده‌ی کلیدی", "روز", 5, "higher"),
    kpi("pc-customs", "محموله‌های در ترخیص", "عدد", 3, "lower"),
  ] },
  { id: "inventory", title: "مدیریت موجودی", icon: BoxesIcon, kpis: [
    kpi("iv-value", "ارزش موجودی", "میلیارد تومان", 450, "lower", [455, 448, 440, 436, 430, 428, 425, 421, 418, 416, 414, 412]),
    kpi("iv-reorder", "مواد زیر نقطه‌ی سفارش", "عدد", 0, "lower"),
    kpi("iv-turn", "گردش موجودی سالانه", "بار", 9, "higher"),
  ] },
  { id: "production", title: "تولید", icon: FactoryIcon, kpis: [
    kpi("pd-oee", "OEE خط‌های تولید", "٪", 75, "higher", [76, 77, 79, 78, 80, 82, 81, 79, 80, 83, 82, 81]),
    kpi("pd-scrap", "ضایعات خط ۲", "٪", 4, "lower"),
    kpi("pd-daily", "تولید روزانه", "تن", 60, "higher"),
  ] },
  { id: "quality", title: "کنترل کیفیت", icon: ShieldCheckIcon, kpis: [
    kpi("qc-pass", "نرخ پذیرش بچ‌ها", "٪", 98, "higher", [98.1, 97.8, 98.4, 97.9, 98.2, 97.6, 98, 97.4, 97.9, 97.5, 97.3, 97.2]),
    kpi("qc-return", "مرجوعی مشتریان", "٪", 1, "lower"),
    kpi("qc-mfi", "بچ‌های خارج از حد MFI", "عدد", 0, "lower"),
  ] },
  { id: "maintenance", title: "تعمیرات و نگهداری", icon: WrenchIcon, kpis: [
    kpi("mt-down", "توقف برنامه‌ریزی‌نشده", "ساعت", 20, "lower", [26, 24, 22, 23, 21, 22, 20, 21, 19, 20, 19, 18]),
    kpi("mt-mtbf", "میانگین زمان بین خرابی‌ها", "ساعت", 300, "higher"),
    kpi("mt-prev", "نگهداری پیشگیرانه‌ی انجام‌شده", "٪", 90, "higher"),
  ] },
  { id: "logistics", title: "لجستیک", icon: TruckIcon, kpis: [
    kpi("lg-ontime", "تحویل به‌موقع به مشتری", "٪", 95, "higher", [91, 92, 94, 93, 92, 95, 94, 93, 92, 94, 93, 93]),
    kpi("lg-cost", "هزینه‌ی حمل هر تن", "هزار تومان", 600, "lower"),
    kpi("lg-late", "محموله‌های دچار تأخیر", "عدد", 3, "lower"),
  ] },
  { id: "finance", title: "مالی", icon: BanknoteIcon, kpis: [
    kpi("fn-cash", "جریان نقد ماه", "میلیارد تومان", 50, "higher", [41, 48, 45, 52, 50, 58, 55, 49, 60, 57, 62, 64]),
    kpi("fn-overdue", "مطالبات معوق", "میلیارد تومان", 30, "lower"),
    kpi("fn-margin", "حاشیه‌ی سود ناخالص", "٪", 20, "higher"),
  ] },
  { id: "hr", title: "منابع انسانی", icon: UsersRoundIcon, kpis: [
    kpi("hr-attend", "نرخ حضور", "٪", 94, "higher", [93, 94, 94, 95, 93, 94, 96, 95, 94, 95, 96, 95]),
    kpi("hr-turnover", "ترک خدمت سالانه", "٪", 8, "lower"),
    kpi("hr-training", "آموزش هر نفر در ماه", "ساعت", 4, "higher"),
  ] },
];

/** The areas with each figure joined to its source (connection, tool, values and formula). */
export function getBusinessAreas(): BusinessArea[] {
  return areas.map((area) => ({ ...area, kpis: area.kpis.map((item) => ({ ...item, source: getKpiSource(item.id) })) }));
}
