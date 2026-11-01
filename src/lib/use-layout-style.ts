"use client";

import { useSyncExternalStore } from "react";

/**
 * The panel has two looks: the messenger look (navy sidebar, top bar) and the classic
 * look it had before. The classic look is the `classic` class on <html>. The choice is
 * temporary like the theme: nothing is stored, so a refresh returns to the messenger look.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains("classic");
const getServerSnapshot = () => false;

export function useLayoutStyle() {
  const classic = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { classic, setClassic: (next: boolean) => document.documentElement.classList.toggle("classic", next) };
}
