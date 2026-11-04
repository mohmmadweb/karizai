import {
  BarChart3Icon, BellRingIcon, BookOpenIcon, BotIcon, BotMessageSquareIcon, CalendarDaysIcon, CalendarRangeIcon, ChartNoAxesColumnIcon, CodeXmlIcon, ContactRoundIcon,
  DatabaseZapIcon, FolderKanbanIcon, FolderOpenIcon, FolderTreeIcon, HashIcon, HeadsetIcon, ImageIcon, LayoutDashboardIcon, LibraryBigIcon, ListChecksIcon, MegaphoneIcon,
  MessageCircleQuestionIcon, MessagesSquareIcon, NewspaperIcon, PlugIcon, RadioIcon, ScaleIcon, SettingsIcon, ShieldCheckIcon, SlidersHorizontalIcon, SparklesIcon,
  UserRoundCogIcon, UsersRoundIcon, WorkflowIcon,
} from "lucide-react";
import type { UserSection, UserSectionGroup } from "../types";

/** Pages under /messenger that are not a chat thread. */
const workspacePages = ["members", "groups", "channels", "news", "projects", "tasks"];

const sections: UserSection[] = [
  { id: "new-chat", title: "گفتگوی تازه", href: "/chat", icon: SparklesIcon, exact: true },
  // Motoshub: dashboard.
  { id: "desk", title: "میزکار من", href: "/desk", icon: LayoutDashboardIcon },
  { id: "calendar", title: "تقویم کاری من", href: "/calendar", icon: CalendarDaysIcon },
  { id: "knowledge", title: "مدیریت فایل‌های من", href: "/knowledge", icon: FolderOpenIcon },
  { id: "assistant", title: "دستیار هوشمند من", href: "/chat", icon: BotMessageSquareIcon },
  // Kariz AI, the extension.
  { id: "agents", title: "عامل‌های من", href: "/agents", icon: BotIcon },
  { id: "agent-repository", title: "مخزن عامل‌ها", href: "/agent-repository", icon: LibraryBigIcon },
  { id: "skills", title: "اسکیل‌های من", href: "/skills", icon: SparklesIcon },
  { id: "compare", title: "مقایسه‌ی مدل‌ها", href: "/compare", icon: ScaleIcon },
  { id: "workflows", title: "جریان‌های خودکار", href: "/workflows", icon: WorkflowIcon },
  { id: "connections", title: "اتصال‌ها", href: "/connections", icon: PlugIcon },
  { id: "alerts", title: "هشدارها و گزارش‌ها", href: "/alerts", icon: BellRingIcon },
  { id: "live", title: "فعالیت زنده", href: "/live", icon: RadioIcon },
  { id: "data", title: "داده و تحلیل", href: "/data", icon: DatabaseZapIcon },
  { id: "usage", title: "مصرف من", href: "/usage", icon: ChartNoAxesColumnIcon },
  { id: "developer", title: "توسعه‌دهندگان و API", href: "/developer", icon: CodeXmlIcon },
  // Motoshub: colleagues.
  { id: "members", title: "اعضای سازمان", href: "/messenger/members", icon: UsersRoundIcon },
  { id: "friends", title: "ارتباطات من", href: "/friends", icon: ContactRoundIcon },
  // Motoshub: knowledge and content.
  { id: "news", title: "اخبار سازمان", href: "/messenger/news", icon: NewspaperIcon },
  { id: "blogs", title: "وبلاگ‌ها", href: "/blogs", icon: BookOpenIcon },
  { id: "magazines", title: "مجلات", href: "/magazines", icon: LibraryBigIcon },
  { id: "media", title: "رسانه", href: "/media", icon: ImageIcon },
  { id: "forums", title: "پرسش و پاسخ", href: "/forums", icon: UsersRoundIcon },
  { id: "faqs", title: "سوالات متداول", href: "/faqs", icon: MessageCircleQuestionIcon },
  { id: "hashtags", title: "هشتگ‌ها", href: "/hashtags", icon: HashIcon },
  { id: "categories", title: "دسته‌بندی‌ها", href: "/categories", icon: FolderTreeIcon },
  // Motoshub: social network.
  {
    id: "messenger",
    title: "گفتگوها",
    href: "/messenger",
    icon: MessagesSquareIcon,
    match: (pathname) => pathname === "/messenger" || (pathname.startsWith("/messenger/") && !workspacePages.includes(pathname.split("/")[2])),
  },
  { id: "groups", title: "گروه‌ها", href: "/messenger/groups", icon: UsersRoundIcon },
  { id: "channels", title: "کانال‌ها", href: "/messenger/channels", icon: MegaphoneIcon },
  { id: "events", title: "رویدادها و جلسات", href: "/events", icon: CalendarRangeIcon },
  // Motoshub: projects and activities.
  { id: "projects", title: "پروژه‌ها", href: "/messenger/projects", icon: FolderKanbanIcon },
  { id: "tasks", title: "فعالیت و وظایف من", href: "/messenger/tasks", icon: ListChecksIcon },
  { id: "activity-report", title: "گزارش فعالیت‌های من", href: "/activity-report", icon: BarChart3Icon },
  { id: "project-settings", title: "تنظیمات پروژه", href: "/project-settings", icon: UserRoundCogIcon },
  // Motoshub: system management.
  { id: "access", title: "نقش و دسترسی من", href: "/access", icon: ShieldCheckIcon },
  { id: "settings", title: "تنظیمات سامانه", href: "/settings", icon: SettingsIcon },
  { id: "support", title: "تیکت پشتیبانی", href: "/support", icon: HeadsetIcon },
  { id: "admin", title: "مدیریت هوش مصنوعی", href: "/admin", icon: SlidersHorizontalIcon },
];

const byId = (ids: string[]) => ids.map((id) => sections.find((section) => section.id === id)!);

/** Motoshub's menu, in its order, with «✦ کاریز AI» as the extension. */
const groups: UserSectionGroup[] = [
  { id: "dashboard", title: "داشبورد", icon: LayoutDashboardIcon, always: true, sections: byId(["desk", "calendar", "knowledge", "assistant"]) },
  { id: "kariz", title: "✦ کاریز AI", icon: SparklesIcon, sections: byId(["agents", "agent-repository", "skills", "compare", "workflows", "connections", "alerts", "live", "data", "usage", "developer"]) },
  { id: "colleagues", title: "همکاران", icon: UsersRoundIcon, sections: byId(["members", "friends"]) },
  { id: "content", title: "دانش و محتوا", icon: BookOpenIcon, sections: byId(["news", "blogs", "magazines", "media", "forums", "faqs", "hashtags", "categories"]) },
  { id: "social", title: "شبکه اجتماعی", icon: MessagesSquareIcon, sections: byId(["messenger", "groups", "channels", "events"]) },
  { id: "work", title: "پروژه‌ها و فعالیت‌ها", icon: FolderKanbanIcon, sections: byId(["projects", "tasks", "activity-report", "project-settings"]) },
  { id: "system", title: "مدیریت سیستم", icon: SettingsIcon, sections: byId(["access", "settings", "support", "admin"]) },
];

/** The new-chat entry opens the assistant with an empty conversation. */
export function getNewChatSection(): UserSection {
  return sections.find((section) => section.id === "new-chat")!;
}

export function getUserSections(): UserSection[] {
  return sections;
}

export function getUserSectionGroups(): UserSectionGroup[] {
  return groups;
}

export function isSectionPath(pathname: string, section: UserSection) {
  if (section.match) return section.match(pathname);
  if (section.exact) return pathname === section.href;
  return pathname === section.href || pathname.startsWith(`${section.href}/`);
}
