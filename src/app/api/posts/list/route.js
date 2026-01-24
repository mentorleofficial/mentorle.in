import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// Dedicated microservice for fast blog listing
// This endpoint is optimized for speed with minimal data and aggressive caching

const listCache = new Map();
const CACHE_TTL = 120 * 1000; // 2 minutes cache

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;
    
    const cacheKey = `list-${page}-${limit}`;
    
    // Check cache first
    const cached = listCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
          'CDN-Cache-Control': 'public, s-maxage=120',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=120',
          'X-Cache': 'HIT'
        }
      });
    }

    const supabase = await createServerSupabaseClient();
    
    // Ultra-optimized query - minimal fields for maximum speed
    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        summary,
        tags,
        cover_url,
        reading_time_minutes,
        view_count,
        published_at,
        author_id
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    // Fetch authors in parallel for better performance
    const postsWithAuthors = await Promise.all(
      (data || []).map(async (post) => {
        try {
          // Try mentor_data first (most blog authors are mentors)
          const { data: mentorData } = await supabase
            .from('mentor_data')
            .select('name')
            .eq('user_id', post.author_id)
            .maybeSingle();
          
          if (mentorData?.name) {
            return {
              ...post,
              author_name: mentorData.name
            };
          }

          // Fallback to mentee_data
          const { data: menteeData } = await supabase
            .from('mentee_data')
            .select('name')
            .eq('user_id', post.author_id)
            .maybeSingle();
          
          return {
            ...post,
            author_name: menteeData?.name || 'Anonymous'
          };
        } catch {
          return {
            ...post,
            author_name: 'Anonymous'
          };
        }
      })
    );

    const responseData = {
      data: postsWithAuthors,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
    
    // Cache the response
    listCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });
    
    // Clean old cache entries (simple LRU)
    if (listCache.size > 100) {
      const firstKey = listCache.keys().next().value;
      listCache.delete(firstKey);
    }
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=120',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=120',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error in posts list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Revalidate cache on POST (webhook from CMS or admin action)
export async function POST(request) {
  try {
    const { secret } = await request.json();
    
    // Verify secret to prevent unauthorized cache clearing
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }
    
    // Clear cache
    listCache.clear();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared' 
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
