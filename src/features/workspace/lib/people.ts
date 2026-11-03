import { getColleagueById } from "@/features/messenger/data/colleagues";
import { getCurrentUser } from "@/features/user-session/data/session";

export const currentUserId = () => getCurrentUser().id;

/** Name of a person id: the current user or a colleague. */
export function personName(id: string): string {
  const me = getCurrentUser();
  return id === me.id ? me.name : getColleagueById(id)?.name ?? "";
}
