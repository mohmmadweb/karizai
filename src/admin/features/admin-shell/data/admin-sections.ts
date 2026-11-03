import {
  ActivityIcon,
  BadgeCheckIcon,
  BotIcon,
  BrainCircuitIcon,
  ClipboardCheckIcon,
  GaugeIcon,
  GitCompareArrowsIcon,
  Building2Icon,
  ScrollTextIcon,
  ServerCogIcon,
  ShieldCheckIcon,
  ListChecksIcon,
  SparklesIcon,
  WalletIcon,
  WebhookIcon,
  DatabaseIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PlugIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react";
import type { AdminSection, AdminSectionGroup } from "../types";

const sections: AdminSection[] = [
  {
    id: "section-dashboard",
    slug: "dashboard",
    title: "داشبورد",
    description: "مصرف گروه‌ها، کاربران و عامل‌ها، سقف‌ها و وضعیت سامانه.",
    icon: LayoutDashboardIcon,
  },
  {
    id: "section-documents",
    slug: "documents",
    title: "اسناد",
    description: "مدیریت اسناد سازمان.",
    icon: FileTextIcon,
  },
  {
    id: "section-data",
    slug: "data",
    title: "داده",
    description: "اتصال و فعال‌سازی داده‌های سازمان.",
    icon: DatabaseIcon,
  },
  {
    id: "section-users",
    slug: "users",
    title: "کاربران",
    description: "افزودن و مدیریت کاربران سازمان.",
    icon: UsersIcon,
  },
  {
    id: "section-groups",
    slug: "groups",
    title: "گروه‌ها",
    description: "سازمان‌دهی کاربران در گروه‌ها.",
    icon: UsersRoundIcon,
  },
  {
    id: "section-models",
    slug: "models",
    title: "مدل‌ها",
    description: "تنظیم مدل‌های هوش مصنوعی در دسترس.",
    icon: BotIcon,
  },
  {
    id: "section-connections",
    slug: "connections",
    title: "اتصال‌ها",
    description: "اتصال به سیستم‌های سازمان و ابزارهایشان.",
    icon: PlugIcon,
  },
  {
    id: "section-approvals",
    slug: "approvals",
    title: "صف تأیید",
    description: "تأیید یا رد عامل‌ها، مهارت‌ها، جریان‌ها و اتصال‌هایی که کاربران فرستاده‌اند.",
    icon: ClipboardCheckIcon,
  },
  {
    id: "section-agents",
    slug: "agents",
    title: "عامل‌ها",
    description: "همه‌ی عامل‌های سازمان، ابزار و داده‌ی مجاز و حد اقدام‌های نوشتنی.",
    icon: BrainCircuitIcon,
  },
  {
    id: "section-evaluations",
    slug: "evaluations",
    title: "ارزیابی عامل‌ها",
    description: "مجموعه‌های ارزیابی، دقت هر نسخه و جلوگیری از انتشار نسخه‌ی ضعیف‌تر.",
    icon: BadgeCheckIcon,
  },
  {
    id: "section-policies",
    slug: "policies",
    title: "سیاست‌ها",
    description: "محرمانگی، بودجه‌ی گروه‌ها، پنهان‌سازی، دسترسی خواندن و نوشتن و مدل‌های مجاز.",
    icon: ShieldCheckIcon,
  },
  {
    id: "section-audit",
    slug: "audit",
    title: "ممیزی",
    description: "ثبت همه‌ی دسترسی‌ها و کارهای کاربران و عامل‌ها.",
    icon: ScrollTextIcon,
  },
  {
    id: "section-budgets",
    slug: "budgets",
    title: "سهمیه‌ی کاربران",
    description: "بودجه‌ی ماهانه‌ی هر واحد و کاربر و رفتار پس از اتمام آن.",
    icon: WalletIcon,
  },
  {
    id: "section-limits",
    slug: "limits",
    title: "محدودیت نرخ",
    description: "حد درخواست و توکن در دقیقه و روز برای هر مدل و ارائه‌دهنده.",
    icon: GaugeIcon,
  },
  {
    id: "section-benchmark",
    slug: "benchmark",
    title: "آزمون مقایسه‌ای",
    description: "اجرای یک پرسش روی چند مدل و مقایسه‌ی سرعت، هزینه و کیفیت.",
    icon: GitCompareArrowsIcon,
  },
  {
    id: "section-status",
    slug: "status",
    title: "وضعیت و SLA",
    description: "دسترس‌پذیری سامانه، تاریخچه‌ی ماهانه و حالت بدون اینترنت.",
    icon: ActivityIcon,
  },
  {
    id: "section-organization",
    slug: "organization",
    title: "ساختار و نقش‌ها",
    description: "درخت واحدهای سازمان، نقش‌های مدیریتی و همگام‌سازی با Active Directory.",
    icon: Building2Icon,
  },
  {
    id: "section-webhooks",
    slug: "webhooks",
    title: "وب‌هوک‌ها",
    description: "رویدادهای ورودی و خروجی برای اتصال سامانه‌های دیگر.",
    icon: WebhookIcon,
  },
  {
    id: "section-ml-models",
    slug: "ml-models",
    title: "مدل‌های یادگیری ماشین",
    description: "ثبت مدل‌های پیش‌بینی و بهینه‌سازی و مدل‌های اختصاصی سازمان.",
    icon: ServerCogIcon,
  },
  {
    id: "section-rfi",
    slug: "rfi",
    title: "نقشه‌ی پوشش RFI",
    description: "همه‌ی نیازمندی‌های RFI پارسا پلیمر و جای نمایش هر کدام در دمو.",
    icon: ListChecksIcon,
  },
  {
    id: "section-skills",
    slug: "skills",
    title: "مهارت‌ها",
    description: "بارگذاری مهارت‌های سازمان برای استفاده‌ی کاربران در عامل‌ها.",
    icon: SparklesIcon,
  },
];

const byId = (ids: string[]) =>
  ids.map((id) => sections.find((section) => section.id === id)!);

const groups: AdminSectionGroup[] = [
  { id: "overview", title: "نمای کلی", sections: byId(["section-dashboard", "section-rfi"]) },
  { id: "people", title: "کاربران و ساختار", sections: byId(["section-users", "section-groups", "section-organization"]) },
  { id: "governance", title: "قواعد و حاکمیت", sections: byId(["section-policies", "section-approvals", "section-agents", "section-evaluations", "section-audit"]) },
  { id: "intelligence", title: "هوش و دانش", sections: byId(["section-models", "section-ml-models", "section-benchmark", "section-documents", "section-data", "section-connections", "section-skills", "section-webhooks"]) },
  { id: "operations", title: "ظرفیت و پایداری", sections: byId(["section-budgets", "section-limits", "section-status"]) },
];

export function getAdminSectionGroups(): AdminSectionGroup[] {
  return groups;
}

export function getAdminSections(): AdminSection[] {
  return sections;
}

export function getAdminSection(slug: string): AdminSection | undefined {
  return sections.find((section) => section.slug === slug);
}

/** True on the section page and on any page nested inside it. */
export function isSectionPath(pathname: string, section: AdminSection): boolean {
  const base = `/admin/${section.slug}`;
  return pathname === base || pathname.startsWith(`${base}/`);
}
