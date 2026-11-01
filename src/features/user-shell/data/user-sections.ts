import { BookOpenIcon, BotIcon, ChartNoAxesColumnIcon, KeyRoundIcon, PlugIcon, SparklesIcon, SquarePenIcon, WorkflowIcon } from "lucide-react";
import type { UserSection, UserSectionGroup } from "../types";

const sections: UserSection[] = [
  { id: "new-chat", title: "گفتگوی تازه", href: "/chat", icon: SquarePenIcon, exact: true },
  { id: "agents", title: "عامل‌های من", href: "/agents", icon: BotIcon },
  { id: "workflows", title: "کارهای من", href: "/workflows", icon: WorkflowIcon },
  { id: "skills", title: "اسکیل‌های من", href: "/skills", icon: SparklesIcon },
  { id: "connections", title: "اتصال‌ها", href: "/connections", icon: PlugIcon },
  { id: "api-keys", title: "API من", href: "/api-keys", icon: KeyRoundIcon },
  { id: "knowledge", title: "دانش", href: "/knowledge", icon: BookOpenIcon },
  { id: "usage", title: "مصرف من", href: "/usage", icon: ChartNoAxesColumnIcon },
];

const byId = (ids: string[]) => ids.map((id) => sections.find((section) => section.id === id)!);

const groups: UserSectionGroup[] = [
  { id: "assistants", title: "گفتگو و دستیارها", sections: byId(["new-chat", "agents", "skills"]) },
  { id: "automation", title: "کارها و اتصال‌ها", sections: byId(["workflows", "connections", "api-keys"]) },
  { id: "knowledge", title: "دانش و مصرف", sections: byId(["knowledge", "usage"]) },
];

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
