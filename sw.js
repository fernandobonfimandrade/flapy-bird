const staticCacheName = 'site-static-v0';
const assets = ['flapy-bird/index.html',  
'flapy-bird/efeitos/efeitos_hit.wav',
'flapy-bird/img/icon-192x192.png',
'flapy-bird/img/icon-256x256.png',
'flapy-bird/img/icon-384x384.png',
'flapy-bird/img/icon-512x512.png',
'flapy-bird/js/game.js',
'flapy-bird/css/style.css'];
self.addEventListener('install', evt => {
    evt.waitUntil(caches.open(staticCacheName).then((cache) => {
        console.log('Cacheando arquivos estaticos...');
        cache.addAll(assets);
    }));
});
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if (key === staticCacheName) { return; }
            return caches.delete(key);
        }))
    }));
});
self.addEventListener('fetch', (e) => {
    e.respondWith((async() => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }
        const response = await fetch(e.request);
        const cache = await caches.open(staticCacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});