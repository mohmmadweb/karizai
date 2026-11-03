"use client";

import { getBots } from "../data/bots";
import { getColleagues } from "../data/colleagues";
import { getGroups } from "../data/groups";
import { ChatRow } from "./chat-row";

type MessengerChatsProps = { pathname: string; collapsed: boolean; onNavigate?: () => void };

/**
 * The messenger chats for the one shared sidebar: groups and channels (they open on the groups and
 * channels pages), then the two bots and the colleagues. Other workspace pages are regular sidebar items.
 */
export function MessengerChats({ pathname, collapsed, onNavigate }: MessengerChatsProps) {
  const common = { collapsed, onNavigate };
  const threadPath = (id: string) => `/messenger/${id}`;
  return (
    <ul className="flex flex-col gap-0.5">
      {getGroups().map((group) => <li key={group.id}><ChatRow {...common} threadId={group.id} name={group.name} href={group.href} current={false} /></li>)}
      {getBots().map((bot) => <li key={bot.id}><ChatRow {...common} threadId={bot.id} name={bot.name} current={pathname === threadPath(bot.id)} /></li>)}
      {getColleagues().map((person) => <li key={person.id}><ChatRow {...common} threadId={person.id} name={person.name} current={pathname === threadPath(person.id)} /></li>)}
    </ul>
  );
}
