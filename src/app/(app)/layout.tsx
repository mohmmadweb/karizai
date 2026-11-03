import type { ReactNode } from "react";
import { UserShell } from "@/features/user-shell/components/user-shell";

/** The user panel frame. Its state (chats, Agents, workflows, policies, the demo user switch …) lives in `src/app/shared-providers.tsx`. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <UserShell>{children}</UserShell>;
}
