"use client";

import Link from "@/components/shared/app-link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { itemClass } from "@/features/user-shell/components/sidebar-nav";
import { cn } from "@/lib/utils";
import { useMessenger } from "./messenger-provider";
import { ThreadAvatar } from "./thread-avatar";

type ChatRowProps = { threadId: string; name: string; current: boolean; collapsed: boolean; onNavigate?: () => void; /** Where the row opens; a chat thread by default (groups and channels have their own pages). */ href?: string };

/** One chat in the list, like a messenger: picture, name, the start of the last message, and the unread count. */
export function ChatRow({ threadId, name, current, collapsed, onNavigate, href = `/messenger/${threadId}` }: ChatRowProps) {
  const { lastOf, unreadOf } = useMessenger();
  const last = lastOf(threadId);
  const unread = unreadOf(threadId);
  const aria = current ? ("page" as const) : undefined;
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<Link href={href} aria-current={aria} aria-label={unread > 0 ? `${name} (${unread.toLocaleString("fa-IR")} خوانده‌نشده)` : name} onClick={onNavigate} className={cn(itemClass, "justify-center px-0")} />}>
          <ThreadAvatar threadId={threadId} className="size-7" />
        </TooltipTrigger>
        <TooltipContent side="left">{name}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <Link href={href} aria-current={aria} onClick={onNavigate} className={cn(itemClass, "h-14 gap-3 py-1")}>
      <ThreadAvatar threadId={threadId} className="size-9" />
      <span className="flex min-w-0 flex-1 flex-col text-start">
        <span className="truncate">{name}</span>
        {last ? <span className="truncate text-caption font-normal opacity-70">{last.from === "me" ? "شما: " : ""}{last.alert?.title ?? last.text}</span> : null}
      </span>
      {unread > 0 ? <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-caption text-sidebar-primary-foreground">{unread.toLocaleString("fa-IR")}</span> : null}
    </Link>
  );
}
