import { formatDate } from "@/lib/format";
import { kindLabels, type CalendarEntry } from "./calendar-entries";

/** The same dated items as a list, earliest first, grouped by day. */
export function CalendarList({ entries, onOpen }: { entries: CalendarEntry[]; onOpen: (eventId: string) => void }) {
  const days = [...new Set(entries.map((entry) => formatDate(entry.date)))];
  return (
    <ol className="flex flex-col gap-4">
      {days.map((day) => (
        <li key={day} className="flex flex-col gap-2">
          <h2 className="text-label text-muted-foreground">{day}</h2>
          <ul className="flex flex-col gap-2">
            {entries.filter((entry) => formatDate(entry.date) === day).map((entry) => (
              <li key={entry.id}>
                {(() => {
                  const body = <><span>{entry.kind === "suggestion" ? "✦ " : ""}{entry.title}</span><span className="text-caption text-muted-foreground">{entry.time ? `${formatDate(entry.time, { timeStyle: "short" })} · ` : ""}{kindLabels[entry.kind]}{entry.assistant ? ` · ✦ ${entry.assistant}` : ""}</span></>;
                  const cls = "flex w-full items-center justify-between gap-3 rounded-xl border bg-card p-3 text-start";
                  return entry.eventId ? <button type="button" onClick={() => onOpen(entry.eventId!)} className={`${cls} outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50`}>{body}</button> : <div className={cls}>{body}</div>;
                })()}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
