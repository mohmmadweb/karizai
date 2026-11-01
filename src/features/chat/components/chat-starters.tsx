"use client";

import { BookOpenIcon, DatabaseIcon, FlaskConicalIcon, GaugeIcon, ReceiptTextIcon, WrenchIcon, type LucideIcon } from "lucide-react";
import { getCapabilities } from "@/features/user-session/data/session";
import { getStarters, type StarterIcon } from "../data/starters";
import { useChat } from "./chat-provider";

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
                <Icon className="size-5 text-muted-foreground" aria-hidden />
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
