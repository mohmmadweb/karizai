"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

/**
 * A value from the address, such as `?id=…`. Next's `useSearchParams` leaves a built page empty until
 * all its scripts have loaded; this one lets the page show at once and picks the value up right after.
 */
export function useQueryParam(name: string): string | null {
  return useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get(name), () => null);
}
