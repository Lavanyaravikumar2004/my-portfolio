const CACHE_NAME = 'grade-calc-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './grade.css',
  './grade.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './fonts/Poppins-Regular.ttf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        console.warn('⛔ Failed to fetch resource:', event.request.url);
        return new Response('', {
          status: 503,
          statusText: 'Offline or fetch failed',
        });
      });
    })
  );
});
