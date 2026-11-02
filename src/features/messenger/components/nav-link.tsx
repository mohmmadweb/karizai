"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { itemClass } from "@/features/user-shell/components/sidebar-nav";
import { cn } from "@/lib/utils";

type NavLinkProps = { href: string; label: string; icon: ReactNode; current: boolean; count?: number; collapsed: boolean; onNavigate?: () => void };

export function NavLink({ href, label, icon, current, count = 0, collapsed, onNavigate }: NavLinkProps) {
  const badge = count > 0 ? <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-caption text-sidebar-primary-foreground">{count.toLocaleString("fa-IR")}</span> : null;
  const aria = current ? ("page" as const) : undefined;
  if (!collapsed) {
    return (
      <Link href={href} aria-current={aria} onClick={onNavigate} className={itemClass}>
        {icon}<span className="truncate">{label}</span>{badge}
      </Link>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger render={<Link href={href} aria-current={aria} aria-label={count > 0 ? `${label} (${count.toLocaleString("fa-IR")} خوانده‌نشده)` : label} onClick={onNavigate} className={cn(itemClass, "justify-center px-0")} />}>{icon}</TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}
