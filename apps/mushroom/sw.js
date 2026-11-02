'use strict';
const PREFIX = 'mushroom-fieldbook-' + self.registration.scope;
const CACHE = PREFIX + '-v1';
const FILES = ['./', './index.html', './iphone.css', './install.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !url.href.startsWith(self.registration.scope) || url.origin !== self.location.origin) return;
  const allowed = FILES.map(file => new URL(file, self.registration.scope).href);
  if (!allowed.includes(url.origin + url.pathname)) return;
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(url.origin + url.pathname)) || fetch(event.request)));
});
