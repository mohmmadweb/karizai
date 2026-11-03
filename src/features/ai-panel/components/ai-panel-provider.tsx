"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getAiAnswer } from "../data/answers";
import { getPageContext } from "../data/page-contexts";
import { pickAnswer } from "../lib/pick-answer";
import type { AiAnswer, OpenPanelOptions, PageContext, PanelMessage } from "../types";

type AiPanelContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** «زمینه: …» of the panel. */
  context: string;
  /** The page the panel was opened on; it decides the quick questions. */
  page: PageContext;
  messages: PanelMessage[];
  /** Opens the side panel, optionally with a question or a prepared answer. */
  openPanel: (options?: OpenPanelOptions) => void;
  ask: (question: string) => void;
  /** «نمایش لایه AI»: outlines everything marked with `data-ai`. */
  aiLayer: boolean;
  setAiLayer: (on: boolean) => void;
};

const AiPanelContext = createContext<AiPanelContextValue | null>(null);

/** The answer appears after a short pause, like a model that is thinking. */
const answerDelay = 700;

/** State of the AI side panel of the user panel. Everything is temporary and resets on reload. */
export function AiPanelProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState("");
  const [page, setPage] = useState<PageContext>(() => getPageContext(pathname));
  const [messages, setMessages] = useState<PanelMessage[]>([]);
  const [aiLayer, setAiLayer] = useState(false);
  const counter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach(clearTimeout);
  }, []);

  const reply = useCallback((answer: AiAnswer) => {
    const id = `ai-msg-${++counter.current}`;
    setMessages((list) => [...list, { id, role: "assistant", answer: null }]);
    timers.current.push(setTimeout(() => setMessages((list) => list.map((item) => (item.id === id ? { id, role: "assistant", answer } : item))), answerDelay));
  }, []);

  const ask = useCallback(
    (question: string, answer?: AiAnswer) => {
      setMessages((list) => [...list, { id: `ai-msg-${++counter.current}`, role: "user", text: question }]);
      reply(answer ?? getAiAnswer(pickAnswer(question)));
    },
    [reply],
  );

  const openPanel = useCallback(
    (options: OpenPanelOptions = {}) => {
      const current = getPageContext(pathname);
      setPage(current);
      setContext(options.context ?? current.title);
      setMessages([]);
      setOpen(true);
      const answer = typeof options.answer === "string" ? getAiAnswer(options.answer) : options.answer;
      if (options.question) ask(options.question, answer);
      else if (answer) reply(answer);
    },
    [ask, pathname, reply],
  );

  const value = useMemo<AiPanelContextValue>(
    () => ({ open, setOpen, context, page, messages, openPanel, ask: (question) => ask(question), aiLayer, setAiLayer }),
    [open, context, page, messages, openPanel, ask, aiLayer],
  );

  return <AiPanelContext.Provider value={value}>{children}</AiPanelContext.Provider>;
}

export function useAiPanel(): AiPanelContextValue {
  const value = useContext(AiPanelContext);
  if (!value) throw new Error("useAiPanel must be used inside AiPanelProvider");
  return value;
}
