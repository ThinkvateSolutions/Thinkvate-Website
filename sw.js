const CACHE_NAME = 'thinkvate-cache-v1';

const urlsToCache = [
  '/index.html',
  '/Thinkvate.css',
  '/nav.min.js',
  // Consider lazy-loading this large video in the app instead of caching
  '/transforming-industrial-connections-veed_IXzg45gD.mp4',

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
  '/OEM%27s.webp',           // ✅ Fixed special character (apostrophe encoded)
  '/Oil.webp',
  '/Radha.webp',
  '/Santosh.webp',
  '/sravani.webp',
  '/whoare.webp',

  // JPEG fallback
  '/who%20we%20are%20img.jpeg', // ✅ Space is URL-encoded
];

// Install event: cache files with error handling
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
          console.log(`✅ Cached: ${url}`);
        } catch (err) {
          console.warn(`⚠️ Failed to cache: ${url}`, err);
        }
      }
    })
  );
  self.skipWaiting(); // Activate SW immediately
});

// Fetch event: serve cached content or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          // Cache valid GET requests for same-origin resources
          if (
            event.request.method === 'GET' &&
            networkResponse.type === 'basic' &&
            event.request.url.startsWith(self.location.origin)
          ) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(err => {
        console.warn('🌐 Network fetch failed:', err);
        return new Response('Network error', { status: 408 });
      });
    })
  );
});

// Activate event: clean up old caches
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
  self.clients.claim(); // Control all pages immediately
});
