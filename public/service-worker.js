// Files to be Cached
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/index.js",
  "/indexedDb.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/manifest.json",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
];

const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

// Installation of Event Listener
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// Activation of Event Listener, removes any old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // cache any successful get requests
  if (event.request.url.includes("/api/") && event.request.method === "GET") {
    event.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                // if response OK, code 200, clone and store to the cache 
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Response failed request, attempt to retrieve from cache
              return cache.match(event.request);
            });
        })
        .catch((error) => console.log(error))
    );
    return;
  }
  // If not an API request, serve static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
