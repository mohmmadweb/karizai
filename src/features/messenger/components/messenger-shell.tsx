"use client";

import type { ReactNode } from "react";
import { UserPlusIcon } from "lucide-react";
import { RoundFab, TwoPaneShell } from "@/components/shared/moto/moto";
import { ThreadList } from "./thread-list";

/** The two-pane layout of the messenger: the chat list on the right, the open chat (or the empty note) on the left. */
export function MessengerShell({ activeId, children }: { activeId?: string; children?: ReactNode }) {
  return (
    <TwoPaneShell list={<ThreadList activeId={activeId} />} hasOpenItem={Boolean(activeId)} emptyText="یک گفتگو را انتخاب کنید" fab={<RoundFab label="گفتگوی تازه با همکاران" href="/messenger/members" icon={UserPlusIcon} />}>
      {children}
    </TwoPaneShell>
  );
}
