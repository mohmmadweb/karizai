"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Switches the admin can flip during a demo that the user panel reacts to in
 * the same visit, for example «شبیه‌سازی قطع اینترنت». Nothing is stored: a
 * refresh turns everything off again.
 */
type DemoFlags = {
  /** Internet is cut: external models are unavailable, only internal models answer. */
  offline: boolean;
  setOffline: (value: boolean) => void;
};

const DemoFlagsContext = createContext<DemoFlags | null>(null);

export function DemoFlagsProvider({ children }: { children: ReactNode }) {
  const [offline, setOffline] = useState(false);
  const value = useMemo(() => ({ offline, setOffline }), [offline]);
  return <DemoFlagsContext.Provider value={value}>{children}</DemoFlagsContext.Provider>;
}

export function useDemoFlags(): DemoFlags {
  const value = useContext(DemoFlagsContext);
  if (!value) throw new Error("useDemoFlags must be used inside DemoFlagsProvider");
  return value;
}
