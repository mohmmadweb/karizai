"use client";

import type { ReactNode } from "react";

/**
 * The admin «سیاست‌ها» pages read and save through the one policies store the
 * root layout mounts for both panels, so an edit here reaches the user chat in
 * the same visit. No second store is created here.
 */
export { usePoliciesAdmin as usePolicies } from "@/features/policies/components/policies-provider";

/** Kept for the admin tree's shape; the real provider is mounted once in the root layout. */
export function PoliciesProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
