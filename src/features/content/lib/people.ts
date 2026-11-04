import { getColleagues } from "@/features/messenger/data/colleagues";
import { currentUserId, personName } from "@/features/workspace/lib/people";

export { currentUserId, personName };

/** The people of the sample organization: the current user first, then the colleagues. */
export function allPeople() {
  return [{ id: currentUserId(), name: personName(currentUserId()), role: "کارشناس کنترل کیفیت" }, ...getColleagues()];
}

export function personRole(id: string): string {
  return allPeople().find((person) => person.id === id)?.role ?? "";
}
