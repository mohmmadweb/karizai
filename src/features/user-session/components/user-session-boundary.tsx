"use client";

import { createContext, Fragment, useContext, useState, type ReactNode } from "react";
import { setCurrentUserId } from "../data/session";

type SwitchValue = { userId: string; switchUser: (id: string) => void };

const SwitchContext = createContext<SwitchValue | null>(null);

/**
 * Holds which demo user the panel acts as. Switching remounts everything below, so every screen
 * starts again for the new user; chats, tasks and other temporary state are reset.
 */
export function UserSessionBoundary({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState("user-1");
  setCurrentUserId(userId);
  return (
    <SwitchContext.Provider value={{ userId, switchUser: setUserId }}>
      <Fragment key={userId}>{children}</Fragment>
    </SwitchContext.Provider>
  );
}

export function useUserSwitch(): SwitchValue {
  const value = useContext(SwitchContext);
  if (!value) throw new Error("useUserSwitch must be used inside UserSessionBoundary");
  return value;
}
