import { PersonAvatar } from "@/components/shared/person-avatar";
import { personName } from "../lib/people";

export function AuthorLine({ id, note }: { id: string; note?: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-body-sm">
      <PersonAvatar seed={id} name={personName(id)} className="size-7" />
      <span className="truncate">{personName(id)}</span>
      {note ? <span className="text-caption text-muted-foreground">{note}</span> : null}
    </span>
  );
}
