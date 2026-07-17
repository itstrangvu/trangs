// Lightweight service worker for trangs.website.
// Goal: satisfy PWA installability/offline while keeping content fresh.
// - Navigations: network-first (so Notion-synced pages never go stale),
//   falling back to cache (then the cached home page) when offline.
// - Other same-origin GETs (fonts, images, icons): stale-while-revalidate.
// Bump CACHE when the strategy or precache list changes to evict old caches.
const CACHE = "trangs-v1";
const PRECACHE = ["/"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE)
			.then((cache) => cache.addAll(PRECACHE))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", (event) => {
	const req = event.request;
	if (req.method !== "GET") return;

	const url = new URL(req.url);
	if (url.origin !== self.location.origin) return; // let cross-origin requests pass through

	// Pages: network-first, fall back to cache (then home) when offline.
	if (req.mode === "navigate") {
		event.respondWith(
			fetch(req)
				.then((res) => {
					const copy = res.clone();
					caches.open(CACHE).then((cache) => cache.put(req, copy));
					return res;
				})
				.catch(() => caches.match(req).then((cached) => cached || caches.match("/")))
		);
		return;
	}

	// Static assets: serve from cache immediately, refresh in the background.
	event.respondWith(
		caches.match(req).then((cached) => {
			const network = fetch(req)
				.then((res) => {
					const copy = res.clone();
					caches.open(CACHE).then((cache) => cache.put(req, copy));
					return res;
				})
				.catch(() => cached);
			return cached || network;
		})
	);
});
