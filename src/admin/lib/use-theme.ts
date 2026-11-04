"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/**
 * Runs before first paint (inline in the root layout). The panel always
 * starts in the light theme. Changes made with the toggle are temporary:
 * nothing is stored, so a refresh returns to light.
 */
export const themeInitScript = "document.documentElement.classList.remove('dark')";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const getServerSnapshot = (): Theme => "light";

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setTheme = (next: Theme) =>
    document.documentElement.classList.toggle("dark", next === "dark");
  return { theme, setTheme, toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark") };
}
