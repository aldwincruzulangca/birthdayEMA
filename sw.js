// Offline cache for EMA's birthday invite.
// Only ever registered when the visitor opts in via the "view offline"
// prompt in index.html — see the registration/unregister logic there.
// Bump CACHE_NAME only when this file's caching logic changes; the page
// itself always prefers a fresh network fetch (see networkFirst below),
// so routine content updates don't need a version bump here.
var CACHE_NAME = 'ema-birthday-v1';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

// <img>/<video>/<audio> src loads hit the SW as no-cors requests, which
// resolve to opaque responses (status 0, .ok always false) even though
// Cloudinary's CDN actually served them fine — so opaque responses are
// cached too, alongside normal ok ones.
function cacheable(response) {
  return response && (response.ok || response.type === 'opaque');
}

function networkFirst(request) {
  return fetch(request)
    .then(function (response) {
      if (cacheable(response)) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
      }
      return response;
    })
    .catch(function () {
      return caches.match(request);
    });
}

function cacheFirst(request) {
  return caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request).then(function (response) {
      if (cacheable(response)) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
      }
      return response;
    });
  });
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  if (url.origin === self.location.origin) {
    // The page shell itself: always try the network first (so updates show
    // up right away), falling back to the last cached copy when offline.
    event.respondWith(networkFirst(req));
  } else if (url.hostname === 'res.cloudinary.com') {
    // Photos/videos/audio: URLs are unique per upload and never edited in
    // place, so it's safe to serve straight from cache once seen.
    event.respondWith(cacheFirst(req));
  } else if (url.hostname === 'api.jsonbin.io') {
    // RSVP/wishes/gallery manifest: prefer fresh data, fall back to the
    // last-known snapshot when there's no signal.
    event.respondWith(networkFirst(req));
  }
});
