"use client";

import Link from "next/link";
import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { CurrentUser } from "@/features/user-session/types";
import { useTheme } from "@/lib/use-theme";
import { cn } from "@/lib/utils";

type SidebarProfileProps = { user: CurrentUser; collapsed?: boolean; onNavigate?: () => void };

/** Classic look only: profile at the bottom of the sidebar with settings, theme, and sign-out. */
export function SidebarProfile({ user, collapsed = false, onNavigate }: SidebarProfileProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type="button" aria-label="پروفایل" className={cn("flex h-12 w-full items-center gap-3 rounded-lg px-2 text-start outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50", collapsed && "justify-center px-0")} />}
      >
        <Avatar size="sm"><AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback></Avatar>
        {collapsed ? null : <span className="truncate text-label">{user.name}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="min-w-52">
        <DropdownMenuItem render={<Link href="/settings" onClick={onNavigate} />}><SettingsIcon aria-hidden />تنظیمات</DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "dark" ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
          {theme === "dark" ? "حالت روشن" : "حالت تیره"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/login" />}><LogOutIcon aria-hidden className="rtl:rotate-180" />خروج</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
