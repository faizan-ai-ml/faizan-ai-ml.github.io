const CACHE_NAME = 'faizan-portfolio-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/assets/images/profile.jpg',
    '/assets/images/profile.webp',
    '/assets/images/og-banner.svg',
    '/assets/images/favicon.svg',
    '/faizan-haider-cv.pdf',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request).then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                return response;
            });
        })
    );
});
