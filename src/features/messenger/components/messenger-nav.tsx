"use client";

import { useState } from "react";
import { ArrowRightIcon, BellRingIcon, ChevronDownIcon, SparklesIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getColleagues } from "../data/colleagues";
import { alertsThreadId } from "../types";
import { useMessenger } from "./messenger-provider";
import { NavLink } from "./nav-link";

type MessengerNavProps = { pathname: string; collapsed: boolean; onNavigate?: () => void };

/** The sidebar of the messenger: the workflow alerts, the assistant, and the colleagues. */
export function MessengerNav({ pathname, collapsed, onNavigate }: MessengerNavProps) {
  const { unreadOf } = useMessenger();
  const [colleaguesOpen, setColleaguesOpen] = useState(true);
  const open = collapsed || colleaguesOpen;
  const common = { collapsed, onNavigate };
  return (
    <nav aria-label="پیام‌رسان" className="flex flex-col gap-3">
      <NavLink {...common} href="/chat" label="بازگشت به موشکاف" icon={<ArrowRightIcon className="size-5 shrink-0" aria-hidden />} current={false} />
      <section aria-label="میزکار" className="flex flex-col gap-0.5">
        {collapsed ? null : <h2 className="px-3 pb-1 text-label text-sidebar-foreground/60">میزکار</h2>}
        <NavLink {...common} href="/messenger" label="هشدارهای جریان‌ها" icon={<BellRingIcon className="size-5 shrink-0" aria-hidden />} current={pathname === "/messenger"} count={unreadOf(alertsThreadId)} />
        <NavLink {...common} href="/chat" label="دستیار هوشمند من" icon={<SparklesIcon className="size-5 shrink-0" aria-hidden />} current={false} />
      </section>
      <section aria-label="همکاران" className={cn("flex flex-col gap-1", collapsed && "border-t border-sidebar-border pt-3")}>
        {collapsed ? null : (
          <button type="button" aria-expanded={open} onClick={() => setColleaguesOpen((value) => !value)} className="flex h-9 items-center justify-between rounded-lg px-3 text-start text-label outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50">
            همکاران
            <ChevronDownIcon className={cn("size-4 text-sidebar-foreground/70 transition-transform", open && "rotate-180")} aria-hidden />
          </button>
        )}
        {open ? (
          <ul className="flex flex-col gap-0.5">
            {getColleagues().map((person) => (
              <li key={person.id}>
                <NavLink
                  {...common}
                  href={`/messenger/${person.id}`}
                  label={person.name}
                  icon={<Avatar className="size-6 shrink-0"><AvatarFallback className="text-caption">{person.name.slice(0, 1)}</AvatarFallback></Avatar>}
                  current={pathname === `/messenger/${person.id}`}
                  count={unreadOf(person.id)}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </nav>
  );
}
