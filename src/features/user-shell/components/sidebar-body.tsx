"use client";

import Link from "next/link";
import { HistoryIcon, ActivityIcon, PanelRightCloseIcon, PanelRightOpenIcon, SquarePenIcon } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SearchField } from "@/components/shared/search-field";
import { buttonVariants, Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessengerEntry } from "@/features/messenger/components/messenger-entry";
import { MessengerNav } from "@/features/messenger/components/messenger-nav";
import { ActiveWorkflowsList } from "@/features/workflows/components/active-workflows-list";
import { ConversationList } from "@/features/chat/components/conversation-list";
import { getCurrentUser } from "@/features/user-session/data/session";
import { useLayoutStyle } from "@/lib/use-layout-style";
import { cn } from "@/lib/utils";
import { getNewChatSection, getUserSectionGroups } from "../data/user-sections";
import { SidebarNav } from "./sidebar-nav";
import { SidebarProfile } from "./sidebar-profile";
import { SidebarSystem } from "./sidebar-system";
import { SidebarSection } from "./sidebar-section";

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
  const inMessenger = pathname.startsWith("/messenger");
  const activeFlowId = pathname.startsWith("/workflows/") ? pathname.split("/")[2] : null;
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
              <BrandLogo alt="" variant="kariz" tone={tone} className="w-8 group-hover:hidden group-focus-visible:hidden" />
              <PanelRightOpenIcon className="hidden size-5 group-hover:block group-focus-visible:block" aria-hidden />
            </TooltipTrigger>
            <TooltipContent side="left">باز کردن سایدبار</TooltipContent>
          </Tooltip>
        ) : (
          <Link href="/chat" onClick={onNavigate} className="flex items-center rounded-lg px-1 outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50">
            <BrandLockup alt="موشکاف" tone={tone} markClassName="w-9" textClassName={classic ? "w-20" : "w-24"} />
          </Link>
        )}
        {onToggleCollapse && !collapsed ? (
          <Tooltip>
            <TooltipTrigger render={<Button type="button" variant="ghost" size="icon" aria-label="بستن سایدبار" onClick={onToggleCollapse} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />}><PanelRightCloseIcon aria-hidden /></TooltipTrigger>
            <TooltipContent>بستن سایدبار</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      {/* In a short window the content scrolls; without shrink-0 the rows would be squeezed flat instead. */}
      <div className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto [&>*]:shrink-0", !classic && "p-3")}>
        {inMessenger ? (
          <MessengerNav pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />
        ) : (
          <>
            <NewChatButton collapsed={collapsed} classic={classic} onNavigate={onNavigate} />
            <MessengerEntry collapsed={collapsed} onNavigate={onNavigate} />
            <SidebarNav groups={getUserSectionGroups()} flat={classic} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />
            {collapsed ? null : (
              <SidebarSection title="گفتگوهای اخیر" icon={HistoryIcon} classic={classic} openClassName="min-h-40 flex-1">
                {classic ? <SearchField value={query} onValueChange={(value) => onQueryChange?.(value)} label="جست‌وجو در گفتگوها" placeholder="جست‌وجو در گفتگوها" className="sm:max-w-none" /> : null}
                <div className="min-h-0 flex-1 overflow-y-auto"><ConversationList activeId={activeId} onNavigate={onNavigate} query={query} /></div>
              </SidebarSection>
            )}
            {collapsed ? null : (
              <SidebarSection title="جریان‌های فعال" icon={ActivityIcon} classic={classic} openClassName="max-h-48 shrink-0">
                <div className="min-h-0 flex-1 overflow-y-auto"><ActiveWorkflowsList activeId={activeFlowId} onNavigate={onNavigate} /></div>
              </SidebarSection>
            )}
          </>
        )}
      </div>
      <div className={cn("shrink-0", !classic && "px-3 pb-3")}><SidebarSystem pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} /></div>
      {classic ? <SidebarProfile user={getCurrentUser()} collapsed={collapsed} onNavigate={onNavigate} /> : null}
    </div>
  );
}

/** The most common action gets its own button above the groups. */
function NewChatButton({ collapsed, classic, onNavigate }: { collapsed: boolean; classic: boolean; onNavigate?: () => void }) {
  const { href, title } = getNewChatSection();
  // A little narrower than the rows below it; collapsed it fills the slim sidebar.
  const narrow = collapsed ? "w-full" : "mx-2 w-[calc(100%-1rem)]";
  // The messenger look is plain classes: a button variant brings its own hover colours, which turn the light button dark on the navy surface.
  const className = classic
    ? cn(buttonVariants(), "h-11", narrow, collapsed && "px-0")
    : cn("inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sidebar-primary text-label text-sidebar-primary-foreground outline-none transition-colors hover:bg-sidebar-primary/85 focus-visible:ring-3 focus-visible:ring-sidebar-ring/50 [&_svg]:size-4", narrow, collapsed && "px-0");
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<Link href={href} aria-label={title} onClick={onNavigate} className={className} />}><SquarePenIcon aria-hidden /></TooltipTrigger>
        <TooltipContent side="left">{title}</TooltipContent>
      </Tooltip>
    );
  }
  return <Link href={href} onClick={onNavigate} className={className}><SquarePenIcon aria-hidden />{title}</Link>;
}
