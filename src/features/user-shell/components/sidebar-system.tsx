"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Building2Icon, BellIcon, ChevronDownIcon, HeadsetIcon, InfoIcon, SettingsIcon, ShieldCheckIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { itemClass } from "./sidebar-nav";

type RowProps = { label: string; icon: ReactNode; href?: string; current?: boolean; collapsed: boolean; onNavigate?: () => void; /** A small count after the name. */ count?: number; /** Opens another app in a new tab. */ external?: boolean; /** Stands out from the other rows: used for the most important entry. */ emphasis?: boolean };

/** A row with a page opens it; a row without one is shown but does not respond yet. */
export function Row({ label, icon, href, current, collapsed, onNavigate, count = 0, external, emphasis }: RowProps) {
  const className = cn(itemClass, emphasis && "h-12 border-sidebar-primary/50 bg-sidebar-accent text-body font-semibold hover:border-sidebar-primary", collapsed && "justify-center px-0", !href && "cursor-default opacity-60 hover:bg-transparent");
  const content = <>{icon}{collapsed ? null : <span className="flex-1 truncate">{label}</span>}{collapsed || count === 0 ? null : <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-caption text-sidebar-primary-foreground">{count.toLocaleString("fa-IR")}</span>}</>;
  const element = href && external
    ? <a href={href} target="_blank" rel="noopener noreferrer" aria-label={collapsed ? label : undefined} className={className}>{content}</a>
    : href
    ? <Link href={href} aria-current={current ? "page" : undefined} aria-label={collapsed ? label : undefined} onClick={onNavigate} className={className}>{content}</Link>
    : <span aria-disabled="true" aria-label={collapsed ? label : undefined} className={className}>{content}</span>;
  if (!collapsed) return element;
  return (
    <Tooltip>
      <TooltipTrigger render={element} />
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}

type SidebarSystemProps = { pathname: string; collapsed: boolean; onNavigate?: () => void };

/** Role, access and system settings at the foot of the sidebar. */
export function SidebarSystem({ pathname, collapsed, onNavigate }: SidebarSystemProps) {
  const [open, setOpen] = useState(false);
  const icon = (Icon: typeof SettingsIcon) => <Icon className="size-5 shrink-0" aria-hidden />;
  const common = { collapsed, onNavigate };
  return (
    <div className={cn("flex shrink-0 flex-col gap-0.5 border-t border-sidebar-border pt-3")}>
      <Row {...common} label="نقش و دسترسی من" icon={icon(ShieldCheckIcon)} />
      {collapsed ? (
        <Row {...common} label="تنظیمات عمومی" href="/settings" current={pathname === "/settings"} icon={icon(SettingsIcon)} />
      ) : (
        <>
          <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex h-10 items-center gap-3 rounded-lg px-3 text-start text-label outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50">
            {icon(SettingsIcon)}
            <span className="flex-1 truncate">تنظیمات سامانه</span>
            <ChevronDownIcon className={cn("size-4 text-sidebar-foreground/70 transition-transform", open && "rotate-180")} aria-hidden />
          </button>
          {open ? (
            <ul className="flex flex-col gap-0.5 ps-3">
              <li><Row {...common} label="تنظیمات عمومی" href="/settings" current={pathname === "/settings"} icon={icon(SettingsIcon)} /></li>
              <li><Row {...common} label="تنظیمات سازمان" icon={icon(Building2Icon)} /></li>
              <li><Row {...common} label="مدیریت اعلان" icon={icon(BellIcon)} /></li>
              <li><Row {...common} label="تیکت پشتیبانی" icon={icon(HeadsetIcon)} /></li>
              <li className="flex h-10 items-center gap-3 px-3 text-label text-sidebar-foreground/70">{icon(InfoIcon)}نسخه: ۰٫۰٫۱</li>
            </ul>
          ) : null}
        </>
      )}
    </div>
  );
}
