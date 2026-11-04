"use client";

import { useState } from "react";
import Link from "@/components/shared/app-link";
import { BellIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLive } from "@/features/live/components/live-provider";
import { notificationIconOf } from "@/features/live/lib/effect-meta";
import { formatDay, formatTime } from "@/features/social/lib/jalali";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/** The bell of the top bar: what workflows and alerts told the user, with the unread count and a link for each item. */
export function NotificationsBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useLive();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger aria-label={unreadCount > 0 ? `اعلان‌ها، ${formatNumber(unreadCount)} خوانده‌نشده` : "اعلان‌ها"} className="relative flex size-10 shrink-0 items-center justify-center rounded-lg outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
        <BellIcon aria-hidden className="size-5" />
        {unreadCount > 0 ? <span key={unreadCount} className="absolute -top-0.5 -end-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-caption text-primary-foreground tabular-nums motion-safe:animate-in motion-safe:zoom-in-50">{formatNumber(unreadCount)}</span> : null}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="flex w-96 flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <h2 className="text-label">اعلان‌ها</h2>
          <Button type="button" variant="ghost" size="xs" disabled={unreadCount === 0} onClick={markAllRead}>همه خوانده شد</Button>
        </div>
        <ul className="flex max-h-96 flex-col gap-0.5 overflow-y-auto">
          {notifications.map((item) => {
            const Icon = notificationIconOf(item.icon);
            const body = (
              <>
                <span aria-hidden className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg", item.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")}><Icon className="size-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-body-sm", !item.read && "font-medium")}>{item.title}</span>
                  {item.description ? <span className="block truncate text-caption text-muted-foreground">{item.description}</span> : null}
                  <time dateTime={item.at} className="block text-caption text-muted-foreground tabular-nums">{formatDay(item.at)} · {formatTime(item.at)}</time>
                </span>
                {item.read ? null : <span aria-label="خوانده‌نشده" className="mt-2 size-2 shrink-0 rounded-full bg-primary" />}
              </>
            );
            const row = "flex w-full items-start gap-2 rounded-lg p-2 text-start outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50";
            return (
              <li key={item.id}>
                {item.href ? <Link href={item.href} className={row} onClick={() => { markRead(item.id); setOpen(false); }}>{body}</Link> : <button type="button" className={row} onClick={() => markRead(item.id)}>{body}</button>}
              </li>
            );
          })}
        </ul>
        <Link href="/live" onClick={() => setOpen(false)} className="rounded-md border-t px-1 pt-2 text-center text-body-sm text-primary outline-none hover:underline focus-visible:underline">فعالیت زنده</Link>
      </PopoverContent>
    </Popover>
  );
}
