"use client";

import { useState, type ReactNode } from "react";
import { TopBar } from "./top-bar";
import { UserSidebar } from "./user-sidebar";

/** Fixed frame of the user panel: the navy sidebar, the top bar, and the page. The collapsed state and the search text are temporary. */
export function UserShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <div className="flex h-dvh bg-background">
      <UserSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} query={query} onQueryChange={setQuery} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar query={query} onQueryChange={setQuery} />
        <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
