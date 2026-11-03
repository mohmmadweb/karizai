import { CodeXmlIcon, DatabaseZapIcon, BookOpenIcon, BotMessageSquareIcon, LibraryIcon, UserRoundIcon, ZapIcon, BotIcon, ChartNoAxesColumnIcon, LibraryBigIcon, PlugIcon, SparklesIcon, SquarePenIcon, WorkflowIcon } from "lucide-react";
import type { UserSection, UserSectionGroup } from "../types";

const sections: UserSection[] = [
  { id: "new-chat", title: "گفتگوی تازه", href: "/chat", icon: SquarePenIcon, exact: true },
  { id: "agents", title: "عامل‌های من", href: "/agents", icon: BotIcon },
  { id: "workflows", title: "جریان‌ها", href: "/workflows", icon: WorkflowIcon },
  { id: "agent-repository", title: "مخزن عامل‌ها", href: "/agent-repository", icon: LibraryBigIcon },
  { id: "skills", title: "اسکیل‌های من", href: "/skills", icon: SparklesIcon },
  { id: "connections", title: "اتصال‌ها", href: "/connections", icon: PlugIcon },
  { id: "knowledge", title: "دانش سازمانی", href: "/knowledge", icon: BookOpenIcon },
  { id: "usage", title: "مصرف من", href: "/usage", icon: ChartNoAxesColumnIcon },
  { id: "data", title: "داده و تحلیل", href: "/data", icon: DatabaseZapIcon },
  { id: "developer", title: "توسعه‌دهندگان و API", href: "/developer", icon: CodeXmlIcon },
];

const byId = (ids: string[]) => ids.map((id) => sections.find((section) => section.id === id)!);

const groups: UserSectionGroup[] = [
  { id: "assistants", title: "دستیارها", icon: BotMessageSquareIcon, sections: byId(["agents", "agent-repository", "skills"]) },
  { id: "automation", title: "اتوماسیون", icon: ZapIcon, sections: byId(["workflows", "connections"]) },
  { id: "knowledge", title: "دانش", icon: LibraryIcon, sections: byId(["knowledge"]) },
  { id: "account", title: "حساب", icon: UserRoundIcon, sections: byId(["usage"]) },
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
