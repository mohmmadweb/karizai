"use client";

import { MessengerShell } from "./messenger-shell";

/** `/messenger`: the chat list with no chat open (the list is the only way into a chat). */
export function MessengerHome() {
  return <MessengerShell />;
}
