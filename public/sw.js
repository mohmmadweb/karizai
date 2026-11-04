// Keeps the site's unchanging files on the device, so repeat visits do not wait for the network.
const STATIC_CACHE = "kariz-static-v1";
const PAGE_CACHE = "kariz-pages-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Names under /_next/static change with every build; photos and logos rarely change.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/people/") || url.pathname.startsWith("/brand/")) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      }),
    );
    return;
  }

  // Pages: always ask the network first so a new version shows at once; a saved copy only covers a very slow or failed request.
  const isPage = request.mode === "navigate" || url.pathname.endsWith(".txt");
  if (isPage) {
    event.respondWith(
      caches.open(PAGE_CACHE).then(async (cache) => {
        const network = fetch(request).then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        });
        const hit = await cache.match(request);
        if (!hit) return network;
        const slow = new Promise((resolve) => setTimeout(() => resolve(hit), 2500));
        return Promise.race([network.catch(() => hit), slow]);
      }),
    );
  }
});
