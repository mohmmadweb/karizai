"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AiFab } from "@/features/ai-panel/components/ai-fab";
import { AiLayerStyle } from "@/features/ai-panel/components/ai-layer-style";
import { AiPanelProvider } from "@/features/ai-panel/components/ai-panel-provider";
import { AiPanelLazy } from "@/features/ai-panel/components/ai-panel-lazy";
import { fillsWindow } from "@/features/ai-panel/lib/page-layout";
import { cn } from "@/lib/utils";
import { TopBar } from "./top-bar";
import { UserSidebar } from "./user-sidebar";

/**
 * Fixed frame of the user panel: the navy sidebar, the top bar, the page, and the AI assistant
 * (floating button and side panel). The collapsed state and the search text are temporary.
 */
export function UserShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  return (
    <AiPanelProvider>
      <div className="flex h-dvh bg-background">
        <UserSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} query={query} onQueryChange={setQuery} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar query={query} onQueryChange={setQuery} />
          {/* The extra room at the end keeps the assistant button from covering the last line of a page. */}
          <main className={cn("flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto", !fillsWindow(pathname) && "pb-24")}>
            {children}
            {fillsWindow(pathname) ? null : <footer className="mt-auto pt-8 text-center text-caption text-muted-foreground">© ۱۴۰۵ کاریز - نسخه ۰٫۰٫۱</footer>}
          </main>
        </div>
      </div>
      <AiFab />
      <AiPanelLazy />
      <AiLayerStyle />
    </AiPanelProvider>
  );
}
