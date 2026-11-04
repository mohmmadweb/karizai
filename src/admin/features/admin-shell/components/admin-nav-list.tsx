"use client";

import { Suspense } from "react";
import Link from "@/components/shared/app-link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { isSectionPath } from "../data/admin-sections";
import type { AdminSectionGroup } from "../types";

type AdminNavListProps = {
  groups: AdminSectionGroup[];
  /** Icon-only mode with a tooltip carrying the name. */
  collapsed?: boolean;
  /** Called after an item is chosen, for example to close the mobile menu. */
  onNavigate?: () => void;
};

const itemClass =
  "relative flex h-10 items-center gap-3 rounded-lg px-3 text-label text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary dark:aria-[current=page]:bg-primary/20 aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-2 aria-[current=page]:before:start-0 aria-[current=page]:before:w-1 aria-[current=page]:before:rounded-full aria-[current=page]:before:bg-primary";

/** The pathname is runtime data, so it is read inside a Suspense boundary. */
export function AdminNavList(props: AdminNavListProps) {
  return (
    <Suspense fallback={<NavListView {...props} pathname="" />}>
      <NavListWithPath {...props} />
    </Suspense>
  );
}

function NavListWithPath(props: AdminNavListProps) {
  return <NavListView {...props} pathname={usePathname()} />;
}

function NavListView({
  groups,
  collapsed = false,
  onNavigate,
  pathname,
}: AdminNavListProps & { pathname: string }) {
  return (
    <nav aria-label="بخش‌های پنل ادمین" className="flex flex-col gap-4">
      {groups.map((group, index) => (
        <section
          key={group.id}
          aria-label={group.title}
          className={cn("flex flex-col gap-1", collapsed && index > 0 && "border-t pt-3")}
        >
          {collapsed ? null : (
            <h2 className="px-3 text-caption text-muted-foreground">{group.title}</h2>
          )}
          <ul className="flex flex-col gap-1">
            {group.sections.map((section) => {
              const Icon = section.icon;
              const href = `/admin/${section.slug}`;
              const current = isSectionPath(pathname, section) ? "page" : undefined;
              return (
                <li key={section.id}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Link
                            href={href}
                            aria-current={current}
                            aria-label={section.title}
                            onClick={onNavigate}
                            className={cn(itemClass, "justify-center px-0")}
                          />
                        }
                      >
                        <Icon className="size-5 shrink-0" aria-hidden />
                      </TooltipTrigger>
                      <TooltipContent side="left">{section.title}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link href={href} aria-current={current} onClick={onNavigate} className={itemClass}>
                      <Icon className="size-5 shrink-0" aria-hidden />
                      <span className="truncate">{section.title}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
