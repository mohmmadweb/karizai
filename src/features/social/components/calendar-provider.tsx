"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { getEvents } from "@/features/desk/data/events";
import type { CalendarEvent } from "../types";

type CalendarContextValue = {
  events: CalendarEvent[];
  /** Adds an event (by hand, from «✦ پیشنهاد زمان جلسه», or from a workflow) and returns its id. */
  addEvent: (event: Omit<CalendarEvent, "id">) => string;
};

const CalendarContext = createContext<CalendarContextValue | null>(null);

/** Events of «تقویم کاری من», shared so a workflow can book a meeting the calendar page shows. In memory only. */
export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState(getEvents);
  const counter = useRef(0);
  const value = useMemo<CalendarContextValue>(() => ({
    events,
    addEvent: (event) => {
      const id = `ev-new-${++counter.current}`;
      setEvents((list) => [...list, { ...event, id }]);
      return id;
    },
  }), [events]);
  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar(): CalendarContextValue {
  const value = useContext(CalendarContext);
  if (!value) throw new Error("useCalendar must be used inside CalendarProvider");
  return value;
}
