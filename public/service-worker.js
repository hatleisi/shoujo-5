"use strict"; //forces all errors, help you write cleaner code

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/client.js",
  "/addserviceworker.js",
  "/style.css",
  "/manifest.json",
  "/images/android-icon-144x144.png",
  "/images/apple-icon-152x152.png",
  "/images/apple-icon180x180.png",
  "/images/apple-icon512x512.png",
  "/images/favicon.ico"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = 'data-cache-v2';

self.addEventListener("install", evt => {
  console.log("[ServiceWorker] Install");

  // CODELAB: Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[Service Worker] Activate');
  
  // remove previously cached files from disk
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
      
        if (key !== CACHE_NAME  &&  key !== DATA_CACHE_NAME){
          console.log('[Service worker] Removing old cache', key);
          return caches.delete(key); 
        }
      }));
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", evt => {
  console.log("[Service Worker] Fetch", evt.request.url);
  if (evt.request.url.includes("/edge")) {
    console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            //if the response was good, clone it and store it in cache
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      })
    );
    return;
  } // if

  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});

