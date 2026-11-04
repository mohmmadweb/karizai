import Link from "@/components/shared/app-link";
import { LogOutIcon } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { AdminSection, AdminSectionGroup, Notification } from "../types";
import { AdminBreadcrumb } from "./admin-breadcrumb";
import { AdminMobileNav } from "./admin-mobile-nav";
import { AdminSidebarToggle } from "./admin-sidebar-toggle";
import { NotificationsMenu } from "./notifications-menu";

type AdminTopbarProps = {
  sections: AdminSection[];
  groups: AdminSectionGroup[];
  collapsed: boolean;
  onToggleSidebar: () => void;
  notifications: Notification[];
};

export function AdminTopbar({
  sections,
  groups,
  collapsed,
  onToggleSidebar,
  notifications,
}: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-sticky flex h-16 items-center gap-3 border-b bg-background/95 page-gutter backdrop-blur">
      <div className="lg:hidden">
        <AdminMobileNav groups={groups} />
      </div>
      <div className="hidden lg:block">
        <AdminSidebarToggle collapsed={collapsed} onToggle={onToggleSidebar} />
      </div>
      <div className="min-w-0 flex-1">
        <AdminBreadcrumb sections={sections} />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link href="/chat" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex")}>
          پنل کاربر
        </Link>
        <NotificationsMenu notifications={notifications} />
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href="/login"
                aria-label="خروج"
                className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
              />
            }
          >
            <LogOutIcon aria-hidden className="rtl:rotate-180" />
          </TooltipTrigger>
          <TooltipContent>خروج</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
