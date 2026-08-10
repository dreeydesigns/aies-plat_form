importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'core-assets',
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
