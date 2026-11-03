import {
  BookOpenIcon,
  BotIcon,
  BotMessageSquareIcon,
  CalendarDaysIcon,
  ChartNoAxesColumnIcon,
  CodeXmlIcon,
  ContactRoundIcon,
  DatabaseZapIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  ListChecksIcon,
  MegaphoneIcon,
  MessagesSquareIcon,
  NewspaperIcon,
  PlugIcon,
  SparklesIcon,
  SquarePenIcon,
  UserRoundIcon,
  UsersRoundIcon,
  WorkflowIcon,
  BriefcaseBusinessIcon,
  NetworkIcon,
} from "lucide-react";
import type { UserSection, UserSectionGroup } from "../types";

/** Pages under /messenger that are not a chat thread. */
const workspacePages = ["desk", "calendar", "members", "groups", "channels", "news", "projects", "tasks"];

const sections: UserSection[] = [
  { id: "new-chat", title: "گفتگوی تازه", href: "/chat", icon: SquarePenIcon, exact: true },
  { id: "desk", title: "میز کار من", href: "/messenger/desk", icon: LayoutDashboardIcon },
  { id: "calendar", title: "تقویم کاری من", href: "/messenger/calendar", icon: CalendarDaysIcon },
  { id: "assistant", title: "دستیار هوشمند من", href: "/chat", icon: BotMessageSquareIcon },
  { id: "agents", title: "عامل‌های من", href: "/agents", icon: BotIcon },
  { id: "agent-repository", title: "مخزن عامل‌ها", href: "/agent-repository", icon: LibraryBigIcon },
  { id: "skills", title: "اسکیل‌های من", href: "/skills", icon: SparklesIcon },
  { id: "workflows", title: "جریان‌های خودکار", href: "/workflows", icon: WorkflowIcon },
  { id: "knowledge", title: "دانش و فایل‌های من", href: "/knowledge", icon: BookOpenIcon },
  { id: "data", title: "داده و تحلیل", href: "/data", icon: DatabaseZapIcon },
  { id: "connections", title: "اتصال‌ها", href: "/connections", icon: PlugIcon },
  {
    id: "messenger",
    title: "گفتگوها",
    href: "/messenger",
    icon: MessagesSquareIcon,
    match: (pathname) => pathname === "/messenger" || (pathname.startsWith("/messenger/") && !workspacePages.includes(pathname.split("/")[2])),
  },
  { id: "members", title: "اعضای سازمان", href: "/messenger/members", icon: ContactRoundIcon },
  { id: "groups", title: "گروه‌ها", href: "/messenger/groups", icon: UsersRoundIcon },
  { id: "channels", title: "کانال‌ها", href: "/messenger/channels", icon: MegaphoneIcon },
  { id: "news", title: "اخبار سازمان", href: "/messenger/news", icon: NewspaperIcon },
  { id: "projects", title: "پروژه‌ها", href: "/messenger/projects", icon: FolderKanbanIcon },
  { id: "tasks", title: "فعالیت و وظایف من", href: "/messenger/tasks", icon: ListChecksIcon },
  { id: "usage", title: "مصرف من", href: "/usage", icon: ChartNoAxesColumnIcon },
  { id: "developer", title: "توسعه‌دهندگان و API", href: "/developer", icon: CodeXmlIcon },
];

const byId = (ids: string[]) => ids.map((id) => sections.find((section) => section.id === id)!);

/** One sidebar for the whole app, grouped like the Kariz mockup: AI and the messenger side by side. */
const groups: UserSectionGroup[] = [
  { id: "dashboard", title: "داشبورد", icon: LayoutDashboardIcon, sections: byId(["desk", "calendar"]) },
  { id: "ai", title: "✦ کاریز AI", icon: SparklesIcon, sections: byId(["assistant", "agents", "agent-repository", "skills", "workflows", "knowledge", "data", "connections"]) },
  { id: "network", title: "همکاران و شبکه", icon: NetworkIcon, sections: byId(["messenger", "members", "groups", "channels", "news"]) },
  { id: "work", title: "پروژه‌ها و فعالیت‌ها", icon: BriefcaseBusinessIcon, sections: byId(["projects", "tasks"]) },
  { id: "account", title: "حساب", icon: UserRoundIcon, sections: byId(["usage", "developer"]) },
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
  if (section.match) return section.match(pathname);
  if (section.exact) return pathname === section.href;
  return pathname === section.href || pathname.startsWith(`${section.href}/`);
}
