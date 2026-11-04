"use client";

import { useEffect } from "react";

/**
 * Registers `public/sw.js` on the static site. GitHub Pages lets browsers keep files only for ten
 * minutes; the worker keeps the files whose names change with every build, so repeat visits are instant.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "1" || !("serviceWorker" in navigator)) return;
    const register = () => void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);
  return null;
}
