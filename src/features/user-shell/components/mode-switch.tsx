"use client";

import Link from "next/link";
import { MessagesSquareIcon, SparklesIcon } from "lucide-react";
import { useMessenger } from "@/features/messenger/components/messenger-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ModeSwitchProps = { inMessenger: boolean; collapsed: boolean; onNavigate?: () => void };

/** Two sides of the app in one place: the AI platform («موشکاف») and the organization messenger («پیام‌رسان»). */
export function ModeSwitch({ inMessenger, collapsed, onNavigate }: ModeSwitchProps) {
  const { unreadTotal } = useMessenger();
  const modes = [
    { id: "ai", label: "موشکاف", href: "/chat", icon: SparklesIcon, active: !inMessenger, count: 0 },
    { id: "messenger", label: "پیام‌رسان", href: "/messenger", icon: MessagesSquareIcon, active: inMessenger, count: unreadTotal },
  ];
  return (
    <nav aria-label="بخش برنامه" className={cn("shrink-0 gap-1 rounded-xl bg-sidebar-accent p-1", collapsed ? "flex flex-col" : "grid grid-cols-2")}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const className = cn("relative flex h-9 items-center justify-center gap-2 rounded-lg text-label outline-none transition-colors focus-visible:ring-3 focus-visible:ring-sidebar-ring/50", mode.active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-border/40");
        const badge = mode.count > 0 ? <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-sidebar-primary-foreground px-1 text-caption text-sidebar-primary">{mode.count.toLocaleString("fa-IR")}</span> : null;
        if (collapsed) {
          return (
            <Tooltip key={mode.id}>
              <TooltipTrigger render={<Link href={mode.href} aria-current={mode.active ? "page" : undefined} aria-label={mode.label} onClick={onNavigate} className={className} />}><Icon className="size-4" aria-hidden /></TooltipTrigger>
              <TooltipContent side="left">{mode.label}</TooltipContent>
            </Tooltip>
          );
        }
        return <Link key={mode.id} href={mode.href} aria-current={mode.active ? "page" : undefined} onClick={onNavigate} className={className}><Icon className="size-4" aria-hidden />{mode.label}{badge}</Link>;
      })}
    </nav>
  );
}
