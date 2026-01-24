/**
 * Blog Cache Management Utility
 * Provides functions for cache invalidation and management
 */

/**
 * Invalidate the blog list cache
 * Call this after creating, updating, or deleting a blog post
 * 
 * @returns {Promise<boolean>} Success status
 */
export async function invalidateBlogCache() {
  try {
    const response = await fetch('/api/posts/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.NEXT_PUBLIC_REVALIDATION_SECRET || 'default-secret'
      })
    });

    if (!response.ok) {
      console.error('Failed to invalidate blog cache:', response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('Blog cache invalidated:', data);
    return true;
  } catch (error) {
    console.error('Error invalidating blog cache:', error);
    return false;
  }
}

/**
 * Prefetch blog posts for better performance
 * Call this on hover or when user is likely to navigate to blogs
 * 
 * @param {number} page - Page number to prefetch
 * @param {number} limit - Number of posts per page
 */
export async function prefetchBlogPosts(page = 1, limit = 12) {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    // Use fetch with high priority for prefetching
    fetch(`/api/posts/list?${params}`, {
      priority: 'high',
      headers: {
        'Cache-Control': 'public, s-maxage=120'
      }
    }).catch(() => {
      // Silently fail prefetch
    });
  } catch (error) {
    // Silently fail prefetch
  }
}

/**
 * Get cache statistics (for debugging)
 * 
 * @returns {Object} Cache statistics
 */
export function getBlogCacheStats() {
  if (typeof window === 'undefined') return null;

  const cacheKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('blog-cache-')) {
      cacheKeys.push(key);
    }
  }

  return {
    totalCachedPages: cacheKeys.length,
    cacheKeys,
    storageUsed: new Blob(cacheKeys.map(k => localStorage.getItem(k))).size
  };
}

/**
 * Clear all blog cache (for debugging or manual refresh)
 */
export function clearBlogCache() {
  if (typeof window === 'undefined') return;

  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('blog-cache-')) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`Cleared ${keysToRemove.length} blog cache entries`);
}

/**
 * Optimized blog post fetcher with smart caching
 * 
 * @param {Object} options - Fetch options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Posts per page
 * @param {string} options.status - Post status filter
 * @param {boolean} options.useCache - Whether to use cache
 * @returns {Promise<Object>} Blog posts data
 */
export async function fetchBlogPosts({ 
  page = 1, 
  limit = 12, 
  status = 'published',
  useCache = true 
}) {
  const cacheKey = `blog-cache-${status}-${page}-${limit}`;
  
  // Check cache first
  if (useCache && typeof window !== 'undefined') {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // Cache valid for 5 minutes
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return data;
        }
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }
  }

  // Fetch from API
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const endpoint = status === 'published' 
    ? `/api/posts/list?${params}` 
    : `/api/posts?status=${status}&${params}`;

  const response = await fetch(endpoint, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog posts');
  }

  const data = await response.json();

  // Cache the response
  if (useCache && typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      // Storage full, clear old entries
      clearBlogCache();
    }
  }

  return data;
}
