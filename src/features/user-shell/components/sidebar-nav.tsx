"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { isSectionPath } from "../data/user-sections";
import type { UserSection, UserSectionGroup } from "../types";

export const itemClass =
  "flex h-10 items-center gap-3 rounded-lg border border-transparent px-3 text-label text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50 aria-[current=page]:border-(--sidebar-active-border) aria-[current=page]:bg-sidebar-primary aria-[current=page]:text-sidebar-primary-foreground";

type SidebarNavProps = {
  groups: UserSectionGroup[];
  pathname: string;
  /** Icons only, with a tooltip carrying the name. */
  collapsed?: boolean;
  /** Classic look: one list without group titles. */
  flat?: boolean;
  onNavigate?: () => void;
};

function Item({ section, pathname, collapsed, onNavigate }: { section: UserSection; pathname: string; collapsed: boolean; onNavigate?: () => void }) {
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

/** Titled, collapsible groups of items; with a collapsed sidebar only the icons remain. */
export function SidebarNav({ groups, pathname, collapsed = false, flat = false, onNavigate }: SidebarNavProps) {
  const [closed, setClosed] = useState<string[]>([]);
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
    <nav aria-label="بخش‌های پنل کاربر" className="flex flex-col gap-3">
      {groups.map((group, index) => {
        const open = collapsed || !closed.includes(group.id);
        return (
          <section key={group.id} aria-label={group.title} className={cn("flex flex-col gap-1", collapsed && index > 0 && "border-t border-sidebar-border pt-3")}>
            {collapsed ? null : (
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setClosed((list) => (list.includes(group.id) ? list.filter((id) => id !== group.id) : [...list, group.id]))}
                className="flex h-9 items-center justify-between rounded-lg px-3 text-start text-label outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50"
              >
                <span className="flex items-center gap-2"><group.icon className="size-4 text-sidebar-foreground/70" aria-hidden />{group.title}</span>
                <ChevronDownIcon className={cn("size-4 text-sidebar-foreground/70 transition-transform", open && "rotate-180")} aria-hidden />
              </button>
            )}
            {open ? (
              <ul className="flex flex-col gap-0.5">
                {group.sections.map((section) => <li key={section.id}><Item section={section} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} /></li>)}
              </ul>
            ) : null}
          </section>
        );
      })}
    </nav>
  );
}
