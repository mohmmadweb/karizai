import {
  BellRingIcon,
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
  ScaleIcon,
  SparklesIcon,
  SquarePenIcon,
  UserRoundIcon,
  UsersRoundIcon,
  WorkflowIcon,
  ZapIcon,
  LibraryIcon,
  RadioIcon,
  BriefcaseBusinessIcon,
  NetworkIcon,
} from "lucide-react";
import type { UserSection, UserSectionGroup } from "../types";

/** Pages under /messenger that are not a chat thread. */
const workspacePages = ["members", "groups", "channels", "news", "projects", "tasks"];

const sections: UserSection[] = [
  { id: "new-chat", title: "گفتگوی تازه", href: "/chat", icon: SquarePenIcon, exact: true },
  { id: "desk", title: "میز کار", href: "/desk", icon: LayoutDashboardIcon },
  { id: "calendar", title: "تقویم کاری من", href: "/calendar", icon: CalendarDaysIcon },
  { id: "agents", title: "عامل‌های من", href: "/agents", icon: BotIcon },
  { id: "agent-repository", title: "مخزن عامل‌ها", href: "/agent-repository", icon: LibraryBigIcon },
  { id: "skills", title: "اسکیل‌های من", href: "/skills", icon: SparklesIcon },
  { id: "compare", title: "مقایسه‌ی مدل‌ها", href: "/compare", icon: ScaleIcon },
  { id: "workflows", title: "جریان‌های خودکار", href: "/workflows", icon: WorkflowIcon },
  { id: "alerts", title: "هشدارها و گزارش‌ها", href: "/alerts", icon: BellRingIcon },
  { id: "live", title: "فعالیت زنده", href: "/live", icon: RadioIcon },
  { id: "knowledge", title: "دانش و مدیریت فایل", href: "/knowledge", icon: BookOpenIcon },
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
  { id: "start", title: "", icon: LayoutDashboardIcon, bare: true, sections: byId(["desk", "calendar"]) },
  { id: "agents", title: "عامل‌ها", heading: "Kariz AI", icon: BotMessageSquareIcon, sections: byId(["agents", "agent-repository", "skills", "compare"]) },
  { id: "automation", title: "اتوماسیون", icon: ZapIcon, sections: byId(["workflows", "connections", "alerts", "live"]) },
  { id: "knowledge-usage", title: "", icon: LibraryIcon, bare: true, sections: byId(["knowledge", "data", "usage", "developer"]) },
  { id: "network", title: "همکاران و شبکه", icon: NetworkIcon, sections: byId(["messenger", "members", "groups", "channels", "news"]) },
  { id: "work", title: "پروژه‌ها و فعالیت‌ها", icon: BriefcaseBusinessIcon, sections: byId(["projects", "tasks"]) },
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
