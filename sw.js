const CACHE_VERSION = 'arcade-v2-' + Date.now();
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/streetfighter.html',
  '/plataforma.html',
  '/memoria.html',
  '/geografia.html',
  '/damas.html',
  '/dos.html',
  '/dos-game.html',
  '/manifest.json',
  '/assets/icons/icon-16.png',
  '/assets/icons/icon-32.png',
  '/assets/icons/icon-48.png',
  '/assets/icons/icon-64.png',
  '/assets/icons/icon-128.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/favicon.ico'
];

// Install event - cache assets and skip waiting
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      console.log('Caching assets:', CACHE_VERSION);
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event - claim clients and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Claim all clients immediately
      self.clients.claim(),
      // Delete old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_VERSION && cacheName.startsWith('arcade-')) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Fetch event - network-first for HTML, cache-first for assets
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // For HTML pages: network-first strategy
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the fresh response
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request).then(cachedResponse => {
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  // For other assets: cache-first strategy
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Update cache in background
        fetch(request).then(response => {
          if (response && response.status === 200) {
            caches.open(CACHE_VERSION).then(cache => {
              cache.put(request, response);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      
      // Not in cache, fetch from network
      return fetch(request).then(response => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_VERSION).then(cache => {
          cache.put(request, responseClone);
        });
        return response;
      }).catch(() => {
        // For images, return a fallback if needed
        if (request.destination === 'image') {
          return caches.match('/assets/icons/icon-192.png');
        }
      });
    })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // Force update check
    self.registration.update();
  }
});
