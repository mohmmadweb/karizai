"use client";

import { BookOpenIcon, DatabaseIcon, FlaskConicalIcon, GaugeIcon, ReceiptTextIcon, WrenchIcon, type LucideIcon } from "lucide-react";
import { getCapabilities } from "@/features/user-session/data/session";
import { getStarters, type StarterIcon } from "../data/starters";
import { useChat } from "./chat-provider";

const tones: Record<StarterIcon, string> = {
  gauge: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  database: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  wrench: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  flask: "bg-green-500/15 text-green-600 dark:text-green-400",
  book: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  receipt: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

const icons: Record<StarterIcon, LucideIcon> = { gauge: GaugeIcon, database: DatabaseIcon, wrench: WrenchIcon, flask: FlaskConicalIcon, book: BookOpenIcon, receipt: ReceiptTextIcon };

/** Ready starts under the message box of a new conversation. Choosing one sets it up and fills the question; the user still sends it. */
export function ChatStarters() {
  const { updateSettings, setPrefill } = useChat();
  const capabilities = getCapabilities();
  const items = getStarters().filter((item) => !item.settings.knowledge || capabilities.includes("knowledge"));
  return (
    <section aria-label="شروع‌های آماده" className="mx-auto w-full max-w-3xl page-gutter">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = icons[item.icon];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => { updateSettings(null, item.settings); setPrefill(item.prompt); }}
                className="flex h-full w-full flex-col items-start gap-1.5 rounded-xl border bg-card p-4 text-start outline-none transition-colors hover:border-ring hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span aria-hidden className={`inline-flex size-8 items-center justify-center rounded-lg ${tones[item.icon]}`}><Icon className="size-4.5" /></span>
                <span className="text-label">{item.title}</span>
                <span className="text-caption text-muted-foreground">{item.description}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
