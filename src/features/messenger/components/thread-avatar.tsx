import { BellRingIcon, MegaphoneIcon, UsersIcon, WorkflowIcon } from "lucide-react";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { cn } from "@/lib/utils";
import { getBotById } from "../data/bots";
import { getGroupById } from "../data/groups";
import { getColleagueById } from "../data/colleagues";
import { alertsThreadId } from "../types";

/** The picture of the other side of a chat: a bot icon, or the colleague's profile picture. */
export function ThreadAvatar({ threadId, className }: { threadId: string; className?: string }) {
  const bot = getBotById(threadId);
  if (bot) {
    const alerts = bot.id === alertsThreadId;
    const Icon = alerts ? BellRingIcon : WorkflowIcon;
    return (
      <span aria-hidden className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", alerts ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-sky-500/15 text-sky-600 dark:text-sky-400", className)}>
        <Icon className="size-1/2" />
      </span>
    );
  }
  const group = getGroupById(threadId);
  if (group) {
    const Icon = group.kind === "channel" ? MegaphoneIcon : UsersIcon;
    return <span aria-hidden className={cn("flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary", className)}><Icon className="size-1/2" /></span>;
  }
  const person = getColleagueById(threadId);
  return <PersonAvatar seed={threadId} name={person?.name ?? ""} className={className} />;
}
