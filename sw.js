const CACHE_NAME = 'arcade-v1';
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
  '/favicon.ico',
  '/assets/sounds/menu.mp3',
  '/assets/sounds/jogo.mp3',
  '/assets/sounds/grito.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Se estiver offline e o recurso não estiver no cache, retorna uma página offline simples
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/');
        }
      });
    })
  );
});
