"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useLayoutStyle } from "@/lib/use-layout-style";
import { cn } from "@/lib/utils";
import { SidebarBody } from "./sidebar-body";

type UserSidebarProps = { collapsed: boolean; onToggleCollapse: () => void; query: string; onQueryChange: (query: string) => void };

function SidebarWithPath(props: UserSidebarProps) {
  return <SidebarBody pathname={usePathname()} query={props.query} onQueryChange={props.onQueryChange} collapsed={props.collapsed} onToggleCollapse={props.onToggleCollapse} />;
}

/**
 * Fixed sidebar for wide screens. In the messenger look the `dark` class gives everything
 * inside it the dark tokens in both themes, so conversation rows and hovers read well on the navy surface.
 * The pathname is runtime data, so it is read inside Suspense.
 */
export function UserSidebar(props: UserSidebarProps) {
  const { classic } = useLayoutStyle();
  return (
    <aside className={cn(!classic && "dark", "sticky top-0 z-sticky hidden h-dvh shrink-0 border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 motion-reduce:transition-none lg:block", props.collapsed ? (classic ? "w-16" : "w-[4.5rem]") : "w-72")}>
      <Suspense fallback={null}>
        <SidebarWithPath {...props} />
      </Suspense>
    </aside>
  );
}
