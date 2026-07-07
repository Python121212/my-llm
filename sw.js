const CACHE_NAME = 'local-ai-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// インストール時にUI資産をキャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// ネットワークファースト (最新のUIを常に取得、オフライン時はキャッシュ)
self.addEventListener('fetch', (e) => {
  // 外部CDN(TailwindやWebLLMのモデルデータ)はサービスワーカーのキャッシュから除外して直接通す
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
