'use strict';
if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', {scope: './'}).catch(error => console.warn('Offline setup unavailable', error));
  });
}
