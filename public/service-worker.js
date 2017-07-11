self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('assets-v4').then(cache => {
      return cache.addAll([
        '/',
        './main.css',
        './javascript.js',
        './images/kimon-maritz-181128-min.jpg'
      ])
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('activate', e => {
  let cacheWhitelist = ['assets-v4']; //list of asset(s) to retain

  e.waitUntil(
    caches.keys().then( keyList => {
      return Promise.all(keyList.map( key => {
        if(cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
