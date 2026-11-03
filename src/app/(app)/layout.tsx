import type { ReactNode } from "react";
import { IdleTimeout } from "@/features/auth/components/idle-timeout";
import { UserShell } from "@/features/user-shell/components/user-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UserShell>{children}</UserShell>
      <IdleTimeout />
    </>
  );
}
