import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Earlier releases registered a service worker that cached HTML and scripts
// stale-while-revalidate. That can pin users to an old, broken deployment.
// Remove those registrations and their caches until offline support has a
// versioned precache strategy.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}

if ('caches' in window) {
  caches.keys().then((cacheNames) => {
    cacheNames
      .filter((cacheName) => cacheName === 'core-assets')
      .forEach((cacheName) => caches.delete(cacheName));
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
