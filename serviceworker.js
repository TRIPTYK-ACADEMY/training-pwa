const assets = ["/", "style.css", "app.js", "sw-register.js", 
"https://fonts.googleapis.com/css2?family=Noto+Sans&family=Poppins:wght@700&display=swap", "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200", "https://fonts.gstatic.com/s/materialsymbolsoutlined/v105/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsLjBuVY.woff2", "https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNr5TRASf6M7Q.woff2", "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2"];

self.addEventListener("install", event => {
  event.waitUntil( // If a file is big and take a long time before loading
    caches.open("assets").then( cache => {
        cache.addAll(assets);
    })
  )
});

// Cache first
// self.addEventListener("fetch", event => {
//   if (event.request.url === 'http://localhost:3000/fake') {
//     const response = new Response(`Hello, je suis une réponse de ${event.request.url}`);
//     event.respondWith(response);
//   } else {
//     event.respondWith(caches.match(event.request).then(response => {
//         if (response) {
//           // Cache HIT
//           return response;
//         } else {
//           // Cache Miss
//           return fetch(event.request)
//         }
//       })
//     )
//   }
// })

// Network first
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request) // I go to the network ALWAYS
      .catch(error => {  // if the network is down, I go to the cache
          return caches.open("assets")
            .then( cache => {
              return cache.match(request);
            });
      })
  );
});

// Stale while revalidate strategy
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//         .then( response => {
//             // Even if the response is in the cache, we fetch it
//             // and update the cache for future usage
//             const fetchPromise = fetch(event.request).then(
//                   networkResponse => {
//                     caches.open("assets").then( cache => {
//                         cache.put(event.request, networkResponse.clone());
//                         return networkResponse;
//                     });
//                 });
//             // We use the currently cached version if it's there
//             return response || fetchPromise; // cached or a network fetch
//         })
//   );
// }); 

self.addEventListener('push', function(e) {
  const data = e.data.json();
  self.registration.showNotification(
      data.title,
      {
          body: data.body,
      }
  );
})