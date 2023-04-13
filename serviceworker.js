const assets = ["/", "style.css", "app.js", "sw-register.js", 
"https://fonts.googleapis.com/css2?family=Noto+Sans&family=Poppins:wght@700&display=swap", "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"];

self.addEventListener("install", event => {
  event.waitUntil( // If a file is heavy and take a long time before loading
    caches.open("assets").then( cache => {
        cache.addAll(assets);
    })
  )
});