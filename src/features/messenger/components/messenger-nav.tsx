"use client";

import { getBots } from "../data/bots";
import { getColleagues } from "../data/colleagues";
import { ChatRow } from "./chat-row";

type MessengerChatsProps = { pathname: string; collapsed: boolean; onNavigate?: () => void };

/**
 * The messenger chats (the two bots and the colleagues) for the one shared sidebar.
 * Workspace pages (desk, groups, projects, tasks …) are regular sidebar items.
 */
export function MessengerChats({ pathname, collapsed, onNavigate }: MessengerChatsProps) {
  const common = { collapsed, onNavigate };
  const threadPath = (id: string) => `/messenger/${id}`;
  return (
    <ul className="flex flex-col gap-0.5">
      {getBots().map((bot) => <li key={bot.id}><ChatRow {...common} threadId={bot.id} name={bot.name} current={pathname === threadPath(bot.id)} /></li>)}
      {getColleagues().map((person) => <li key={person.id}><ChatRow {...common} threadId={person.id} name={person.name} current={pathname === threadPath(person.id)} /></li>)}
    </ul>
  );
}
