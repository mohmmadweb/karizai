"use client";

import {
  FolderKanbanIcon, ListChecksIcon, MessagesSquareIcon, ShieldCheckIcon,
} from "lucide-react";
import { useMessenger } from "@/features/messenger/components/messenger-provider";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { cn } from "@/lib/utils";
import { Row } from "./sidebar-system";

/** The admin panel is a separate app: locally on port 3000, otherwise its deployed address. */
const adminUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000/admin" : "https://moshekaf-admin.vercel.app/admin";

type SidebarSocialProps = { pathname: string; collapsed: boolean; onNavigate?: () => void };

function Title({ collapsed, children }: { collapsed: boolean; children: string }) {
  return collapsed ? <hr className="border-sidebar-border" /> : <h2 className="px-3 pb-1 text-label text-sidebar-foreground/60">{children}</h2>;
}

/** The organization side of the one sidebar: chats with colleagues and bots, groups, channels, news, projects, tasks, and system management. */
export function SidebarSocial({ pathname, collapsed, onNavigate }: SidebarSocialProps) {
  const { unreadTotal } = useMessenger();
  const { tasks } = useWorkspace();
  const openTasks = tasks.filter((task) => task.assigneeId === currentUserId() && task.status !== "done").length;
  const common = { collapsed, onNavigate };
  const icon = (Icon: typeof MessagesSquareIcon) => <Icon className="size-5 shrink-0" aria-hidden />;
  const inChats = pathname.startsWith("/messenger") && !pathname.startsWith("/messenger/projects") && !pathname.startsWith("/messenger/tasks");
  return (
    <div className={cn("flex flex-col gap-3 border-t border-sidebar-border pt-3")}>
      <section aria-label="شبکه اجتماعی" className="flex flex-col gap-0.5">
        <Title collapsed={collapsed}>شبکه اجتماعی</Title>
        <Row {...common} label="گفتگوها" emphasis href="/messenger" current={inChats} count={unreadTotal} icon={icon(MessagesSquareIcon)} />
      </section>
      <section aria-label="پروژه‌ها و فعالیت‌ها" className="flex flex-col gap-0.5">
        <Title collapsed={collapsed}>پروژه‌ها و فعالیت‌ها</Title>
        <Row {...common} label="پروژه‌های من" href="/messenger/projects" current={pathname.startsWith("/messenger/projects")} icon={icon(FolderKanbanIcon)} />
        <Row {...common} label="فعالیت و وظایف من" href="/messenger/tasks" current={pathname === "/messenger/tasks"} count={openTasks} icon={icon(ListChecksIcon)} />
      </section>
      <section aria-label="مدیریت سیستم" className="flex flex-col gap-0.5">
        <Title collapsed={collapsed}>مدیریت سیستم</Title>
        <Row {...common} label="مدیریت هوش مصنوعی" href={adminUrl} external icon={icon(ShieldCheckIcon)} />
      </section>
    </div>
  );
}
