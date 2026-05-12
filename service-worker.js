/* ════════════════════════════════════════
   편곡보드 Service Worker
   오프라인 캐싱으로 인터넷 없이도 사용 가능
════════════════════════════════════════ */

const CACHE_NAME = 'arrange-board-v2';
const ASSETS = [
  './',
  './arrange-board.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).catch(() =>
        caches.match('./arrange-board.html')
      );
    })
  );
});

