const CACHE_PREFIX = 'itoken-public-v';
const BUILD_ID = new URL(self.location.href).searchParams.get('v') || '1';
const CACHE_NAME = `${CACHE_PREFIX}${BUILD_ID}`;
const OFFLINE_URL = '/offline.html';
const MANIFEST_URL = '/build/manifest.json';

function isVersionedBuildAsset(url) {
    return url.origin === self.location.origin
        && url.pathname.startsWith('/build/assets/')
        && /-[A-Za-z0-9_-]{6,}\.(?:js|css|woff2?|png|svg|webp|avif)$/.test(url.pathname);
}

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.add(OFFLINE_URL);
        try {
            const response = await fetch(MANIFEST_URL, { cache: 'no-store', credentials: 'omit' });
            if (!response.ok) return;
            const manifest = await response.json();
            const assets = new Set();
            Object.values(manifest).forEach((entry) => {
                if (entry.file) assets.add(`/build/${entry.file.replace(/^\//, '')}`);
                (entry.css ?? []).forEach((asset) => assets.add(`/build/${asset.replace(/^\//, '')}`));
                (entry.assets ?? []).forEach((asset) => assets.add(`/build/${asset.replace(/^\//, '')}`));
            });
            await Promise.all([...assets].filter((asset) => isVersionedBuildAsset(new URL(asset, self.location.origin))).map(async (asset) => {
                try { await cache.add(asset); } catch { /* A missing optional asset must not block the offline fallback. */ }
            }));
        } catch {
            // Keep the static offline fallback even when a build manifest is unavailable.
        }
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const names = await caches.keys();
        await Promise.all(names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map((name) => caches.delete(name)));
        await self.clients.claim();
    })());
});

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    if (isVersionedBuildAsset(url) && ['script', 'style', 'font', 'image'].includes(request.destination)) {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE_NAME);
            const cached = await cache.match(request);
            if (cached) return cached;
            try {
                const response = await fetch(request);
                if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
                return response;
            } catch {
                return cached ?? Response.error();
            }
        })());
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                return await fetch(new Request(request, { cache: 'no-store' }));
            } catch {
                const fallback = await caches.match(OFFLINE_URL);
                return fallback ?? Response.error();
            }
        })());
    }
});
