"use client";

import { useState, type ReactNode } from "react";
import { getAdminSectionGroups, getAdminSections } from "../data/admin-sections";
import { getNotifications } from "../data/notifications";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

/** Fixed frame of the admin panel. The collapsed state is temporary. */
export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const sections = getAdminSections();
  const groups = getAdminSectionGroups();

  return (
    <div className="flex min-h-dvh bg-background">
      <AdminSidebar groups={groups} collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          sections={sections}
          groups={groups}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
          notifications={getNotifications()}
        />
        <main className="page-gutter w-full min-w-0 flex-1 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
