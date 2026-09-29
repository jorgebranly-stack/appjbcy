// Guarda la app en el celular para que abra sin internet. Sube el número al publicar cambios.
const C = 'registro-v5';
const F = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'logo.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(F)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // El Apps Script siempre va directo a la red: sus datos cambian y dependen de la clave.
  if (e.request.method !== 'GET' || u.hostname.indexOf('script.google.com') > -1) return;
  // Todo lo demás (la app y librerías como Chart.js) se guarda la primera vez que carga con internet,
  // para que el Informe también pueda abrirse sin conexión después.
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
