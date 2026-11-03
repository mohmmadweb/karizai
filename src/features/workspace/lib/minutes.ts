import { getColleagues } from "@/features/messenger/data/colleagues";
import { minutesTasks, sampleMinutes } from "@/features/social/data/ai-answers";
import type { SuggestedTask } from "@/features/social/types";
import { currentUserId, personName } from "./people";
import { addDays } from "./today";

/** Tasks the assistant finds in pasted minutes: one per bullet line, with the person named in it. */
export function tasksFromMinutes(text: string, projectId: string): SuggestedTask[] {
  if (text.trim() === sampleMinutes.trim()) return minutesTasks.map((task) => ({ ...task, projectId }));
  const people = [{ id: currentUserId(), name: personName(currentUserId()) }, ...getColleagues()];
  return text.split("\n").map((line) => line.trim()).filter((line) => /^[-•*۰-۹0-9]/.test(line) && line.length > 6).slice(0, 8).map((line) => {
    const title = line.replace(/^[-•*\s۰-۹0-9.)]+/, "").replace(/^تصمیم:\s*/, "").split(/[؛;]\s*مسئول/)[0].trim();
    const owner = people.find((person) => line.includes(person.name));
    return { title, assigneeId: owner?.id ?? currentUserId(), dueDate: addDays(7), projectId };
  });
}
