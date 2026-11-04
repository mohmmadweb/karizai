"use client";

import Link from "@/components/shared/app-link";
import { ChevronDownIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { isSectionPath } from "../data/user-sections";
import type { UserSection, UserSectionGroup } from "../types";

export const itemClass =
  "flex h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-body text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50 aria-[current=page]:border-(--sidebar-active-border) aria-[current=page]:bg-sidebar-primary aria-[current=page]:text-sidebar-primary-foreground";

type SidebarNavProps = {
  groups: UserSectionGroup[];
  pathname: string;
  /** Icons only, with a tooltip carrying the name. */
  collapsed?: boolean;
  /** Classic look: one list without group titles. */
  flat?: boolean;
  onNavigate?: () => void;
};

export function Item({ section, pathname, collapsed, onNavigate }: { section: UserSection; pathname: string; collapsed: boolean; onNavigate?: () => void }) {
  const Icon = section.icon;
  const current = isSectionPath(pathname, section) ? "page" : undefined;
  const link = <Link href={section.href} aria-current={current} aria-label={collapsed ? section.title : undefined} onClick={onNavigate} className={cn(itemClass, collapsed && "justify-center px-0")} />;
  if (!collapsed) {
    return (
      <Link href={section.href} aria-current={current} onClick={onNavigate} className={itemClass}>
        <Icon className="size-5 shrink-0" aria-hidden />
        <span className="truncate">{section.title}</span>
      </Link>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger render={link}><Icon className="size-5 shrink-0" aria-hidden /></TooltipTrigger>
      <TooltipContent side="left">{section.title}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Motoshub's menu: bold group titles that open like an accordion, one at a time; with a collapsed sidebar only the icons remain.
 * Groups are native <details> elements, so the arrows and links work even while the page's scripts are still downloading.
 */
export function SidebarNav({ groups, pathname, collapsed = false, flat = false, onNavigate }: SidebarNavProps) {
  const activeGroup = groups.find((group) => !group.always && group.sections.some((section) => isSectionPath(pathname, section)))?.id ?? null;
  const list = (group: UserSectionGroup) => (
    <ul className="flex flex-col gap-1">
      {group.sections.map((section) => <li key={section.id}><Item section={section} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} /></li>)}
    </ul>
  );
  if (flat) {
    return (
      <nav aria-label="بخش‌های پنل کاربر">
        <ul className="flex flex-col gap-0.5">
          {groups.flatMap((group) => group.sections).map((section) => <li key={section.id}><Item section={section} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} /></li>)}
        </ul>
      </nav>
    );
  }
  return (
    <nav aria-label="بخش‌های پنل کاربر" className="flex flex-col gap-1">
      {groups.map((group, index) => {
        if (collapsed) return <section key={group.id} aria-label={group.title} className={cn("flex flex-col gap-1", index > 0 && "border-t border-sidebar-border pt-2")}>{list(group)}</section>;
        if (group.always) return <section key={group.id} aria-label={group.title} className="flex flex-col gap-1"><h2 className="flex h-10 items-center px-3 text-body font-bold">{group.title}</h2>{list(group)}</section>;
        return (
          <details key={group.id} name="sidebar-groups" open={group.id === activeGroup} className="group flex flex-col gap-1">
            <summary className="flex h-11 cursor-pointer list-none items-center justify-between rounded-lg px-3 text-start text-body font-bold outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50 [&::-webkit-details-marker]:hidden">
              {group.title}
              <ChevronDownIcon className="size-4 text-sidebar-foreground/70 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
            </summary>
            {list(group)}
          </details>
        );
      })}
    </nav>
  );
}
