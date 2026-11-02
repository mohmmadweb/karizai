"use client";

import { MessagesSquareIcon } from "lucide-react";
import { useMessenger } from "./messenger-provider";
import { NavLink } from "./nav-link";

/** The way into the messenger, in the normal sidebar, with the number of unread messages. */
export function MessengerEntry({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { unreadTotal } = useMessenger();
  return <NavLink href="/messenger" label="پیام‌رسان" icon={<MessagesSquareIcon className="size-5 shrink-0" aria-hidden />} current={false} count={unreadTotal} collapsed={collapsed} onNavigate={onNavigate} />;
}
