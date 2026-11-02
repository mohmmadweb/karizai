"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeftIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarSectionProps = {
  title: string;
  icon: LucideIcon;
  /** Classic look: no divider and plainer colours. */
  classic?: boolean;
  /** Extra classes for the section while it is open, for example its share of the height. */
  openClassName?: string;
  children: ReactNode;
};

/** A quiet list under the navigation; its title is a button that folds the whole list away. */
export function SidebarSection({ title, icon: Icon, classic = false, openClassName, children }: SidebarSectionProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className={cn("flex flex-col gap-1", !classic && "border-t border-sidebar-border pt-3", open && openClassName)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn("flex h-8 w-full items-center gap-2 rounded-lg px-3 text-start outline-none transition-colors hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/50", classic ? "text-caption text-muted-foreground" : "text-label text-sidebar-foreground/60")}
      >
        <Icon className="size-4" aria-hidden />
        {title}
        <ChevronLeftIcon className={cn("size-4 transition-transform motion-reduce:transition-none", open && "-rotate-90")} aria-hidden />
      </button>
      {open ? children : null}
    </div>
  );
}
