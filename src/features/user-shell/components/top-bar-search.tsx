"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, SparklesIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAiPanel } from "@/features/ai-panel/components/ai-panel-provider";
import { useChat } from "@/features/chat/components/chat-provider";
import { cn } from "@/lib/utils";

type TopBarSearchProps = { query: string; onQueryChange: (query: string) => void };
type Mode = "search" | "ai";

const modeClass = "h-8 shrink-0 rounded-lg px-2.5 text-label outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Search in the top bar, with two modes. «جستجو» filters the recent conversations as you type and
 * opens the first match; «✦ پرسش از AI» sends the question to the AI panel. Ctrl+K focuses the box.
 */
export function TopBarSearch({ query, onQueryChange }: TopBarSearchProps) {
  const router = useRouter();
  const { state } = useChat();
  const { openPanel } = useAiPanel();
  const [mode, setMode] = useState<Mode>("search");
  const [question, setQuestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const needle = query.trim();
  const first = needle ? state.conversations.find((item) => item.title.includes(needle) || (state.messages[item.id] ?? []).some((message) => message.text.includes(needle))) : undefined;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        // The box is hidden on phones; there the shortcut opens the AI panel instead.
        if (inputRef.current?.offsetParent) inputRef.current.focus();
        else openPanel({ context: "جستجوی سراسری" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPanel]);

  function submit() {
    if (mode === "ai") {
      const text = question.trim();
      if (!text) return;
      openPanel({ context: "جستجوی سراسری", question: text });
      setQuestion("");
      return;
    }
    if (first) router.push(`/chat/${first.id}`);
  }

  function choose(next: Mode) {
    setMode(next);
    inputRef.current?.focus();
  }

  return (
    <form
      role="search"
      onSubmit={(event) => { event.preventDefault(); submit(); }}
      className="relative hidden h-11 min-w-0 max-w-xl flex-1 items-center gap-1 rounded-xl border bg-card pe-1.5 md:flex"
    >
      {mode === "ai"
        ? <SparklesIcon aria-hidden className="pointer-events-none absolute start-3 size-4 text-primary" />
        : <SearchIcon aria-hidden className="pointer-events-none absolute start-3 size-4 text-muted-foreground" />}
      <Input
        ref={inputRef}
        type="search"
        aria-label={mode === "ai" ? "پرسش از کاریز AI" : "جستجو در گفتگوها"}
        placeholder={mode === "ai" ? "از کاریز AI بپرسید…" : "جستجو سراسری..."}
        value={mode === "ai" ? question : query}
        onChange={(event) => (mode === "ai" ? setQuestion(event.target.value) : onQueryChange(event.target.value))}
        className="h-full min-w-0 border-0 bg-transparent ps-9 shadow-none focus-visible:ring-0"
      />
      <kbd dir="ltr" className="hidden shrink-0 rounded-md border bg-muted px-1.5 text-caption text-muted-foreground 2xl:inline">Ctrl K</kbd>
      <button type="button" data-ai aria-pressed={mode === "ai"} onClick={() => choose(mode === "ai" ? "search" : "ai")} className={cn(modeClass, mode === "ai" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/70")}>✦ از AI بپرس</button>
      <button type="submit" className={cn(modeClass, "bg-primary text-primary-foreground hover:bg-primary/90")}>{mode === "ai" ? "بپرس" : "جستجو"}</button>
    </form>
  );
}
