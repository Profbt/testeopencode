const CACHE_NAME = 'streetfighter-v1';
const ASSETS = [
  'streetfighter.html',
  'streetfighter/game.js',
  'streetfighter/assets/icons/icon-192.png',
  'streetfighter/assets/icons/icon-512.png',
  'streetfighter/assets/stages/sf2-ken-stage.gif',
  'streetfighter/assets/sounds/1.wav',
  'streetfighter/assets/sounds/2.wav',
  'streetfighter/assets/sounds/Block.wav',
  'streetfighter/assets/sounds/Fight.wav',
  'streetfighter/assets/sounds/Final.wav',
  'streetfighter/assets/sounds/Highlight.wav',
  'streetfighter/assets/sounds/Hit_Hard.wav',
  'streetfighter/assets/sounds/Hit_Soft.wav',
  'streetfighter/assets/sounds/Load.wav',
  'streetfighter/assets/sounds/Lose.wav',
  'streetfighter/assets/sounds/Round.wav',
  'streetfighter/assets/sounds/Select.wav',
  'streetfighter/assets/sounds/SFMusic.mp3.wav',
  'streetfighter/assets/sounds/Win.wav',
  'streetfighter/assets/sounds/You.wav',
  'streetfighter/assets/ryu/mapping.json',
  'streetfighter/assets/ken/mapping.json',
  'streetfighter/assets/hadouken/mapping.json',
  'streetfighter/assets/kenhadouken/mapping.json',
  'streetfighter/assets/hikou/mapping.json',
  'streetfighter/assets/charging/mapping.json',
  'streetfighter/assets/announcer/mapping.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match('streetfighter.html')))
  );
});
