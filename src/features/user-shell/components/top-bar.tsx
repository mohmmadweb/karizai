"use client";

import Link from "next/link";
import { BellIcon, Building2Icon, ChevronDownIcon, LogOutIcon, MoonIcon, SettingsIcon, SunIcon } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCurrentUser, getDemoUsers } from "@/features/user-session/data/session";
import { useUserSwitch } from "@/features/user-session/components/user-session-boundary";
import { useLayoutStyle } from "@/lib/use-layout-style";
import { useTheme } from "@/lib/use-theme";
import { MobileMenu } from "./mobile-menu";
import { TopBarSearch } from "./top-bar-search";

type TopBarProps = { query: string; onQueryChange: (query: string) => void };

const organization = "پارسا پلیمر شریف";

/** Pill switch for the theme; the sun or the moon sits on the thumb. The choice is temporary. */
function ThemeSwitch() {
  const { toggleTheme } = useTheme();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={false}
      aria-label="تغییر بین حالت روشن و تیره"
      onClick={toggleTheme}
      className="relative hidden h-8 w-14 shrink-0 items-center rounded-full bg-accent outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex dark:justify-end"
    >
      <span className="mx-0.5 flex size-7 items-center justify-center rounded-full bg-card text-primary shadow-sm">
        <SunIcon className="size-4 dark:hidden" aria-hidden />
        <MoonIcon className="hidden size-4 dark:block" aria-hidden />
      </span>
    </button>
  );
}

/** Top bar: user, search, organization, notifications, theme, and sign-out. Below `lg` it also holds the menu button. */
export function TopBar({ query, onQueryChange }: TopBarProps) {
  const user = getCurrentUser();
  const { userId, switchUser } = useUserSwitch();
  const { classic } = useLayoutStyle();
  if (classic) {
    // Classic look: only a small bar below `lg` with the menu button and the logo.
    return (
      <header className="flex h-12 shrink-0 items-center gap-2 border-b page-gutter lg:hidden">
        <MobileMenu query={query} onQueryChange={onQueryChange} />
        <BrandLockup alt="کاریز" markClassName="w-8" textClassName="w-20" />
      </header>
    );
  }
  return (
    <header className="z-sticky flex h-[4.75rem] shrink-0 items-center gap-3 border-b bg-card page-gutter">
      <MobileMenu query={query} onQueryChange={onQueryChange} />
      <span className="flex lg:hidden"><BrandLockup alt="کاریز" markClassName="w-7" textClassName="w-16" /></span>
      <DropdownMenu>
        <DropdownMenuTrigger render={<button type="button" aria-label="پروفایل" className="flex h-11 items-center gap-3 rounded-lg px-1 text-start outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50" />}>
          <span className="hidden text-body-lg font-semibold lg:block">{user.name}</span>
          <PersonAvatar seed={user.id} name={user.name} className="size-10" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuItem render={<Link href="/settings" />}><SettingsIcon aria-hidden />تنظیمات</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>تغییر کاربر</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={userId} onValueChange={switchUser}>
              {getDemoUsers().map((item) => <DropdownMenuRadioItem key={item.id} value={item.id}>{item.name}</DropdownMenuRadioItem>)}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex min-w-0 flex-1 justify-center"><TopBarSearch query={query} onQueryChange={onQueryChange} /></div>
      <div className="ms-auto flex items-center gap-2 md:ms-0">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type="button" variant="outline" className="hidden h-10 gap-2 xl:flex" aria-label="سازمان" />}>
            <Building2Icon aria-hidden />{organization}<ChevronDownIcon aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>سازمان</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked>{organization}</DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" aria-label="اعلان‌ها" />}><BellIcon aria-hidden /></DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel>اعلان‌ها</DropdownMenuLabel>
              <DropdownMenuItem disabled>اعلان تازه‌ای ندارید.</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeSwitch />
        <Button nativeButton={false} render={<Link href="/login" />} variant="ghost" className="h-10 gap-2 text-destructive hover:text-destructive"><LogOutIcon aria-hidden className="rtl:rotate-180" /><span className="hidden sm:inline">خروج</span></Button>
      </div>
    </header>
  );
}
