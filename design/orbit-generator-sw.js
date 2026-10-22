// עובד-הרקע של מסך המחולל — שמרני, באותו דפוס של maor-system public/sw.js:
// רק GET. הדף והקבצים שלו: רשת-קודם (תמיד טרי), נפילה למטמון כשאין אינטרנט.
// גופנים מ-Google: מטמון-קודם (לא משתנים), כדי שהמסך ייראה נכון גם בלי אינטרנט.
const CACHE = 'orbit-gen-v1';
const CORE = ['orbit-generator.html', 'orbit-generator.webmanifest', 'assets/orbit-gen-192.png', 'assets/orbit-gen-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('orbit-gen-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }))));
    return;
  }
  if (url.origin !== self.location.origin) return;
  e.respondWith(fetch(req).then((res) => {
    if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('orbit-generator.html'))));
});
