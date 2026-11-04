"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => undefined;

/**
 * Renders its children only in the browser. For pages drawn around today's date:
 * the static build cannot know the visit's date, so they show the fallback in the
 * built HTML and the real content right after the page loads.
 */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return mounted ? children : fallback;
}
