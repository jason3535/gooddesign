// 图片缓存优先：文件名带内容哈希，所以缓存里的永远是对的；页面本身不缓存，保证每次打开拿到最新版
const CACHE = 'gd-img-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || !/\/(img\/.*\.[0-9a-f]{8}\.webp|fonts\/.*\.woff2)$/.test(u.pathname)) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request); if (hit) return hit;
    const r = await fetch(e.request); if (r.ok) c.put(e.request, r.clone()); return r;
  }));
});
