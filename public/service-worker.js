const FILES_TO_CACHE = [
   
];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
      caches.open(STATIC_CACHE)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(FILES_TO_CACHE);
        })
    );
  });