// Blog Performance Optimization - Service Worker
// Provides offline support and background cache for blog posts

const CACHE_NAME = 'mentorle-blog-v1';
const BLOG_CACHE_NAME = 'mentorle-blog-data-v1';

// URLs to cache for offline support
const STATIC_ASSETS = [
  '/blogs',
  '/api/posts/list?page=1&limit=12'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('mentorle-blog-') && name !== CACHE_NAME && name !== BLOG_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, falling back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle blog-related requests
  if (!url.pathname.includes('/blogs') && !url.pathname.includes('/api/posts')) {
    return;
  }

  // API requests - network first with cache fallback
  if (url.pathname.includes('/api/posts')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response
          const responseClone = response.clone();
          
          // Cache successful responses
          if (response.ok) {
            caches.open(BLOG_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return offline response
            return new Response(
              JSON.stringify({
                data: [],
                pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
                offline: true
              }),
              {
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
    return;
  }

  // Page requests - cache first with network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version and update in background
        fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          }
        });
        return cachedResponse;
      }

      // No cache, fetch from network
      return fetch(request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Background sync for cache invalidation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_BLOG_CACHE') {
    event.waitUntil(
      caches.delete(BLOG_CACHE_NAME).then(() => {
        return caches.open(BLOG_CACHE_NAME);
      })
    );
  }
  
  if (event.data && event.data.type === 'PREFETCH_BLOGS') {
    const { page, limit } = event.data;
    const url = `/api/posts/list?page=${page}&limit=${limit}`;
    
    event.waitUntil(
      fetch(url).then((response) => {
        if (response.ok) {
          return caches.open(BLOG_CACHE_NAME).then((cache) => {
            return cache.put(url, response);
          });
        }
      })
    );
  }
});
