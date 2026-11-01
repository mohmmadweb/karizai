"use client";

import Link from "next/link";
import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConversationList } from "@/features/chat/components/conversation-list";
import { getCurrentUser } from "@/features/user-session/data/session";
import { useLayoutStyle } from "@/lib/use-layout-style";
import { cn } from "@/lib/utils";
import { getUserSectionGroups } from "../data/user-sections";
import { SidebarNav } from "./sidebar-nav";
import { SidebarProfile } from "./sidebar-profile";

type SidebarBodyProps = {
  pathname: string;
  /** Filters the recent conversations. In the messenger look the search box is in the top bar. */
  query?: string;
  onQueryChange?: (query: string) => void;
  collapsed?: boolean;
  /** Shown only on wide screens; the mobile sheet has no collapse button. */
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
};

/**
 * The sidebar: logo, navigation, and recent conversations. The messenger look has grouped
 * navigation on the navy surface; the classic look has a flat list, its own search box,
 * and the profile at the bottom.
 */
export function SidebarBody({ pathname, query = "", onQueryChange, collapsed = false, onToggleCollapse, onNavigate }: SidebarBodyProps) {
  const { classic } = useLayoutStyle();
  const activeId = pathname.startsWith("/chat/") ? pathname.split("/")[2] : null;
  const tone = classic ? "auto" : "white";

  return (
    <div className={cn("flex h-full min-h-0 flex-col", classic && "gap-3 p-3")}>
      <div className={cn("flex shrink-0 items-center", classic ? "h-12" : "h-[4.75rem] border-b border-sidebar-border", collapsed ? "justify-center" : cn("justify-between gap-1", !classic && "px-4"))}>
        {collapsed && onToggleCollapse ? (
          // Collapsed: the logo turns into the "open sidebar" button when hovered or focused.
          <Tooltip>
            <TooltipTrigger
              render={<button type="button" aria-label="باز کردن سایدبار" onClick={onToggleCollapse} className="group relative flex size-10 items-center justify-center rounded-lg outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50" />}
            >
              <BrandLogo alt="" variant="icon" tone={tone} className="w-8 group-hover:hidden group-focus-visible:hidden" />
              <PanelRightOpenIcon className="hidden size-5 group-hover:block group-focus-visible:block" aria-hidden />
            </TooltipTrigger>
            <TooltipContent side="left">باز کردن سایدبار</TooltipContent>
          </Tooltip>
        ) : (
          <Link href="/chat" onClick={onNavigate} className="flex items-center rounded-lg px-1 outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50">
            <BrandLogo alt="موشکاف" variant="text" tone={tone} className={classic ? "w-24" : "w-28"} />
          </Link>
        )}
        {onToggleCollapse && !collapsed ? (
          <Tooltip>
            <TooltipTrigger render={<Button type="button" variant="ghost" size="icon" aria-label="بستن سایدبار" onClick={onToggleCollapse} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />}><PanelRightCloseIcon aria-hidden /></TooltipTrigger>
            <TooltipContent>بستن سایدبار</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <div className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto", !classic && "p-3")}>
        <SidebarNav groups={getUserSectionGroups()} flat={classic} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />
        {collapsed ? null : (
          <div className={cn("flex min-h-0 flex-1 flex-col gap-1", !classic && "border-t border-sidebar-border pt-3")}>
            {classic ? <SearchField value={query} onValueChange={(value) => onQueryChange?.(value)} label="جست‌وجو در گفتگوها" placeholder="جست‌وجو در گفتگوها" className="sm:max-w-none" /> : null}
            <h2 className={cn("px-3", classic ? "text-caption text-muted-foreground" : "text-label")}>گفتگوهای اخیر</h2>
            <div className="min-h-0 flex-1 overflow-y-auto"><ConversationList activeId={activeId} onNavigate={onNavigate} query={query} /></div>
          </div>
        )}
      </div>
      {classic ? <SidebarProfile user={getCurrentUser()} collapsed={collapsed} onNavigate={onNavigate} /> : null}
    </div>
  );
}
