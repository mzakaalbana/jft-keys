self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open('jft-keys-v1').then(async cache => {
      const cached = await cache.match(e.request);
      if (cached) return cached;
      try {
        const res = await fetch(e.request);
        if (e.request.method === 'GET' && res.ok && new URL(e.request.url).origin === location.origin) {
          cache.put(e.request, res.clone());
        }
        return res;
      } catch {
        return new Response('Offline', {status: 503});
      }
    })
  );
});