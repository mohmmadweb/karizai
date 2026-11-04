// Retired: this worker removes itself and its saved files, then reloads open pages once.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const pages = await self.clients.matchAll({ type: "window" });
      await Promise.all(pages.map((page) => page.navigate(page.url).catch(() => undefined)));
    })(),
  );
});
