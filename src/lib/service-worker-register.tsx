"use client";

import { useEffect } from "react";

/** Removes the service worker of earlier versions from visitors' browsers. The site no longer installs one. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.getRegistrations().then((list) => Promise.all(list.map((item) => item.update().catch(() => undefined))));
  }, []);
  return null;
}
