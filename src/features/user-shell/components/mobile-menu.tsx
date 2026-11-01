"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLayoutStyle } from "@/lib/use-layout-style";
import { cn } from "@/lib/utils";
import { SidebarBody } from "./sidebar-body";

function MobileSidebar({ query, onQueryChange, onNavigate }: { query: string; onQueryChange: (query: string) => void; onNavigate: () => void }) {
  return <SidebarBody pathname={usePathname()} query={query} onQueryChange={onQueryChange} onNavigate={onNavigate} />;
}

/** Menu button shown below `lg`; the menu is the same sidebar in a sheet, on the dark navy surface. */
export function MobileMenu({ query, onQueryChange }: { query: string; onQueryChange: (query: string) => void }) {
  const [open, setOpen] = useState(false);
  const { classic } = useLayoutStyle();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="باز کردن منو" className="lg:hidden" />}><MenuIcon aria-hidden /></SheetTrigger>
      <SheetContent className={cn("bg-sidebar p-0 text-sidebar-foreground", !classic && "dark")}>
        <SheetHeader className="sr-only">
          <SheetTitle>منو</SheetTitle>
          <SheetDescription>بخش‌های پنل و گفتگوهای اخیر</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1">
          <Suspense fallback={null}><MobileSidebar query={query} onQueryChange={onQueryChange} onNavigate={() => setOpen(false)} /></Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}
