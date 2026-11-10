/* KMC Connect service worker — offline support. Bump VERSION when you change any file. */
const VERSION = 'kmc-connect-v2.1.1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/styles.css',
  './js/config.js', './js/i18n.js', './js/content-parent.js', './js/content-hcp.js', './js/app.js',
  './icons/favicon-64.png', './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // stale-while-revalidate for app files
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(req, { ignoreSearch: true });
    const net = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
