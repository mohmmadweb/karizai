import { BellRingIcon, BookOpenIcon, CalendarDaysIcon, LayoutDashboardIcon, ScaleIcon, BotMessageSquareIcon, LibraryIcon, ZapIcon, BotIcon, ChartNoAxesColumnIcon, LibraryBigIcon, PlugIcon, SparklesIcon, SquarePenIcon, WorkflowIcon } from "lucide-react";
import type { UserSection, UserSectionGroup } from "../types";

const sections: UserSection[] = [
  { id: "new-chat", title: "گفتگوی تازه", href: "/chat", icon: SquarePenIcon, exact: true },
  { id: "desk", title: "میز کار", href: "/desk", icon: LayoutDashboardIcon },
  { id: "calendar", title: "تقویم کاری من", href: "/calendar", icon: CalendarDaysIcon },
  { id: "agents", title: "عامل‌های من", href: "/agents", icon: BotIcon },
  { id: "agent-repository", title: "مخزن عامل‌ها", href: "/agent-repository", icon: LibraryBigIcon },
  { id: "skills", title: "اسکیل‌های من", href: "/skills", icon: SparklesIcon },
  { id: "compare", title: "مقایسه‌ی مدل‌ها", href: "/compare", icon: ScaleIcon },
  { id: "workflows", title: "جریان‌ها", href: "/workflows", icon: WorkflowIcon },
  { id: "connections", title: "اتصال‌ها", href: "/connections", icon: PlugIcon },
  { id: "alerts", title: "هشدارها و گزارش‌ها", href: "/alerts", icon: BellRingIcon },
  { id: "knowledge", title: "دانش و مدیریت فایل", href: "/knowledge", icon: BookOpenIcon },
  { id: "usage", title: "مصرف من", href: "/usage", icon: ChartNoAxesColumnIcon },
];

const byId = (ids: string[]) => ids.map((id) => sections.find((section) => section.id === id)!);

const groups: UserSectionGroup[] = [
  { id: "start", title: "", icon: LayoutDashboardIcon, bare: true, sections: byId(["desk", "calendar"]) },
  { id: "agents", title: "عامل‌ها", heading: "Kariz AI", icon: BotMessageSquareIcon, sections: byId(["agents", "agent-repository", "skills", "compare"]) },
  { id: "automation", title: "اتوماسیون", icon: ZapIcon, sections: byId(["workflows", "connections", "alerts"]) },
  { id: "knowledge-usage", title: "", icon: LibraryIcon, bare: true, sections: byId(["knowledge", "usage"]) },
];

/** The new-chat entry is a prominent button above the groups, not a list item. */
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
  if (section.exact) return pathname === section.href;
  return pathname === section.href || pathname.startsWith(`${section.href}/`);
}
