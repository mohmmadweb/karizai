import Link from "@/components/shared/app-link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";
import type { AdminSectionGroup } from "../types";
import { AdminNavList } from "./admin-nav-list";

type AdminSidebarProps = {
  groups: AdminSectionGroup[];
  collapsed: boolean;
};

/** Fixed sidebar for wide screens: logo and sections. The collapse button is in the top bar. */
export function AdminSidebar({ groups, collapsed }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "dark sticky top-0 z-sticky hidden h-dvh shrink-0 flex-col gap-4 border-e border-sidebar-border bg-sidebar p-3 text-sidebar-foreground transition-[width] duration-200 motion-reduce:transition-none lg:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <Link
        href="/admin"
        className="flex h-14 items-center justify-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {collapsed ? (
          <BrandLogo alt="کاریز" variant="kariz" tone="white" className="w-9" />
        ) : (
          <BrandLockup alt="کاریز" tone="white" markClassName="w-9" textClassName="w-24" />
        )}
      </Link>
      <div className="flex-1 overflow-y-auto">
        <AdminNavList groups={groups} collapsed={collapsed} />
      </div>
    </aside>
  );
}
