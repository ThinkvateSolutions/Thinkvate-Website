const CACHE_NAME = 'thinkvate-cache-v1';
const urlsToCache = [
  '/index.html',
  '/Thinkvate.css',
  '/nav.min.js',
  '/_Welcome_to_Thinkvate_V1.mp4', // Consider removing this if file is large

  // WebP images
  '/Arun.webp',
  '/Energy_AI.webp',
  '/Engineer.webp',
  '/female.webp',
  '/hari.webp',
  '/hero-image.webp',
  '/hero.webp',
  '/Industrail.webp',
  '/Infrastructure.webp',
  '/kishore.webp',
  '/Logo.webp',
  '/mani.webp',
  '/Manufacturing.webp',
  '/MSME.webp',
  '/OEM\'s.webp',
  '/Oil.webp',
  '/Radha.webp',
  '/Santosh.webp',
  '/sravani.webp',
  '/whoare.webp',

  // JPEG fallback
  '/who%20we%20are%20img.jpeg', // URL-encoded space
];

// Install SW and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Fetch requests and serve from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          if (
            event.request.method === 'GET' &&
            networkResponse.type === 'basic' &&
            event.request.url.startsWith(self.location.origin)
          ) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});

// Cleanup old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
