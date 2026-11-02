/* Cache ownership includes the deployment scope: never delete sibling apps. */
const PREFIX = 'wefit:' + self.registration.scope + ':';
const CACHE = PREFIX + 'v92-iphone-1';
const ASSETS = ['./','./index.html','./iphone.css','./recipes-v69.js','./manifest.json','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/favicon-32.png'];
const ALLOWED = new Set(ASSETS.map(p => new URL(p, self.registration.scope).href));
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !ALLOWED.has(req.url)) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    if (req.mode === 'navigate') {
      try { return await fetch(req); }
      catch { return await cache.match(new URL('./index.html', self.registration.scope).href); }
    }
    return await cache.match(req) || fetch(req);
  }));
});
