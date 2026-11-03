"use client";

import type { Group } from "../../types";
import { GroupMembersManager } from "./group-members-manager";

export function GroupMembersTab({ group }: { group: Group }) {
  return <GroupMembersManager group={group} idPrefix="group-tab" />;
}
