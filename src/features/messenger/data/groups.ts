import { getChannels } from "@/features/social/data/channels";
import { getGroups as getTeamGroups } from "@/features/social/data/groups";
import type { Group } from "../types";

/** The groups and channels of the social network, listed beside the chats; each opens on its own page. */
const groups: Group[] = [
  ...getTeamGroups().map((item): Group => ({ id: item.id, name: item.name, description: item.description, kind: "group", href: `/messenger/groups?id=${item.id}` })),
  ...getChannels().map((item): Group => ({ id: item.id, name: item.name, description: item.description, kind: "channel", href: `/messenger/channels?id=${item.id}` })),
];

export function getGroups(): Group[] {
  return groups;
}

export function getGroupById(id: string): Group | undefined {
  return groups.find((item) => item.id === id);
}
