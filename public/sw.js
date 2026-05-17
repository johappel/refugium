const CACHE_NAME = 'refugium-core-v1';
const ROOM_PACKAGES_CACHE = 'refugium-packages-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW: Some assets could not be cached during install', err);
      });
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== ROOM_PACKAGES_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Check if request is for a room package asset
  if (url.pathname.startsWith('/packages/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(ROOM_PACKAGES_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          return new Response('Offline room package asset not available', { status: 503 });
        });
      })
    );
    return;
  }

  // Standard Cache-First for core app
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache dynamic assets if valid
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Message Event: Allow client to trigger caching of room packages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_ROOM_PACKAGE') {
    const { packageId, assets } = event.data;
    event.waitUntil(
      caches.open(ROOM_PACKAGES_CACHE).then((cache) => {
        return Promise.all(
          assets.map((assetUrl) => {
            return fetch(assetUrl).then((response) => {
              if (response.ok) {
                return cache.put(assetUrl, response);
              }
            }).catch((err) => console.warn(`Failed to cache package asset: ${assetUrl}`, err));
          })
        );
      })
    );
  }
});