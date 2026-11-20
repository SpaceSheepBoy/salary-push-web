// Vite prefixes this script with the cache name and the built app's URLs.
const CACHE_PREFIX = 'salarypush-shell-';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL.map(url => new Request(url, { cache: 'reload' })));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const oldCaches = keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME);
    await Promise.all(oldCaches.map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' && url.pathname === '/') {
    event.respondWith(fetch(request).catch(async () =>
      (await caches.match('/', { cacheName: CACHE_NAME })) ?? Response.error()
    ));
  } else if (!url.search && APP_SHELL.includes(url.pathname)) {
    event.respondWith(caches.match(request, { cacheName: CACHE_NAME }).then(response =>
      response ?? fetch(request)
    ));
  }
});
