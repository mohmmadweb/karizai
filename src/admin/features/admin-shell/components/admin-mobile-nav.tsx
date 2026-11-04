"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { AdminSectionGroup } from "../types";
import { AdminNavList } from "./admin-nav-list";

/** Menu button plus a sheet from the start side, shown below `lg`. */
export function AdminMobileNav({ groups }: { groups: AdminSectionGroup[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="باز کردن منو"
            className="lg:hidden"
          />
        }
      >
        <MenuIcon aria-hidden />
      </SheetTrigger>
      <SheetContent className="dark bg-sidebar text-sidebar-foreground">
        <SheetHeader>
          <BrandLockup alt="کاریز" tone="white" markClassName="w-9" textClassName="w-24" />
          <SheetTitle className="sr-only">منوی پنل ادمین</SheetTitle>
          <SheetDescription className="sr-only">
            بخش‌های پنل ادمین
          </SheetDescription>
        </SheetHeader>
        <div className="px-3">
          <AdminNavList groups={groups} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
