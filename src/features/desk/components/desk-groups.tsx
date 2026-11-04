"use client";

import Link from "next/link";
import { MegaphoneIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMessenger } from "@/features/messenger/components/messenger-provider";
import { getGroups } from "@/features/messenger/data/groups";
import { AiAction } from "@/features/social/components/ai-dialog";
import { getGroups as getTeamGroups } from "@/features/social/data/groups";
import { GroupSummaryAnswer } from "@/features/social/groups/group-summary-answer";
import { DeskPanel } from "./desk-panel";

/** My groups and channels, with what I have not read. */
export function DeskGroups() {
  const { unreadOf, lastOf } = useMessenger();
  const groups = getGroups();
  const teamGroups = getTeamGroups();
  return (
    <DeskPanel tone="info" title="گروه‌های من" icon={UsersIcon} href="/messenger" linkLabel="مشاهده‌ی همه" empty="در گروهی نیستید." isEmpty={groups.length === 0}>
      {groups.map((group) => {
        const unread = unreadOf(group.id);
        const last = lastOf(group.id);
        const Icon = group.kind === "channel" ? MegaphoneIcon : UsersIcon;
        const team = teamGroups.find((item) => item.id === group.id);
        return (
          <li key={group.id} className="flex items-center gap-2">
            <Link href={`/messenger/${group.id}`} className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg py-3 outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50">
              <span className="flex min-w-0 items-center gap-3">
                <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="flex min-w-0 flex-col">
                  <span className="text-label">{group.name}</span>
                  <span className="truncate text-body-sm text-muted-foreground">{unread > 0 ? `${unread.toLocaleString("fa-IR")} پیام خوانده‌نشده` : last?.alert?.title ?? last?.text ?? group.description}</span>
                </span>
              </span>
              {unread > 0 ? <Badge>{unread.toLocaleString("fa-IR")}</Badge> : null}
            </Link>
            {team ? <AiAction label="خلاصه" context={`گروه ${team.name}`}><GroupSummaryAnswer group={team} /></AiAction> : null}
          </li>
        );
      })}
    </DeskPanel>
  );
}
