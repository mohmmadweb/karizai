"use client";

import { useState } from "react";
import { CalendarDaysIcon, ChevronDownIcon, ContactRoundIcon, FolderKanbanIcon, FolderOpenIcon, LayoutDashboardIcon, ListChecksIcon, MegaphoneIcon, NewspaperIcon, SparklesIcon, UsersRoundIcon } from "lucide-react";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { cn } from "@/lib/utils";
import { getBots } from "../data/bots";
import { getColleagues } from "../data/colleagues";
import { ChatRow } from "./chat-row";
import { NavLink } from "./nav-link";

type MessengerNavProps = { pathname: string; collapsed: boolean; onNavigate?: () => void };

function SectionTitle({ collapsed, children }: { collapsed: boolean; children: string }) {
  return collapsed ? <hr className="border-sidebar-border" /> : <h2 className="px-3 pb-1 text-label text-sidebar-foreground/60">{children}</h2>;
}

/** The sidebar of the messenger: chats (the two bots and the colleagues), and the workspace with projects and tasks. */
export function MessengerNav({ pathname, collapsed, onNavigate }: MessengerNavProps) {
  const { tasks } = useWorkspace();
  const [chatsOpen, setChatsOpen] = useState(true);
  const open = collapsed || chatsOpen;
  const common = { collapsed, onNavigate };
  const openTasks = tasks.filter((task) => task.assigneeId === currentUserId() && task.status !== "done").length;
  const threadPath = (id: string) => `/messenger/${id}`;
  return (
    <nav aria-label="پیام‌رسان" className="flex flex-col gap-3">
      <section aria-label="گفتگوها" className="flex flex-col gap-1">
        {collapsed ? <hr className="border-sidebar-border" /> : (
          <button type="button" aria-expanded={open} onClick={() => setChatsOpen((value) => !value)} className="flex h-9 items-center justify-between rounded-lg px-3 text-start text-label text-sidebar-foreground/60 outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50">
            گفتگوها
            <ChevronDownIcon className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
          </button>
        )}
        {open ? (
          <ul className="flex flex-col gap-0.5">
            {getBots().map((bot) => <li key={bot.id}><ChatRow {...common} threadId={bot.id} name={bot.name} current={pathname === threadPath(bot.id)} /></li>)}
            {getColleagues().map((person) => <li key={person.id}><ChatRow {...common} threadId={person.id} name={person.name} current={pathname === threadPath(person.id)} /></li>)}
          </ul>
        ) : null}
      </section>
      <section aria-label="فضای کاری" className="flex flex-col gap-0.5">
        <SectionTitle collapsed={collapsed}>پروژه‌ها و فعالیت‌ها</SectionTitle>
        <NavLink {...common} href="/messenger/projects" label="پروژه‌ها" icon={<FolderKanbanIcon className="size-5 shrink-0" aria-hidden />} current={pathname.startsWith("/messenger/projects")} />
        <NavLink {...common} href="/messenger/tasks" label="فعالیت و وظایف من" icon={<ListChecksIcon className="size-5 shrink-0" aria-hidden />} current={pathname === "/messenger/tasks"} count={openTasks} />
        <NavLink {...common} href="/chat" label="دستیار هوشمند من" icon={<SparklesIcon className="size-5 shrink-0" aria-hidden />} current={false} />
      </section>
    </nav>
  );
}
