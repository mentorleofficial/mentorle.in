import { NextResponse } from 'next/server';
import { createSlug } from '@/lib/slugify';
import { calculateReadingTime, validatePostData } from '@/lib/blogUtils';
import { getUserRole } from '@/lib/auth';
import { ROLES } from '@/lib/roles';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// In-memory cache for posts (microservice pattern)
const postsCache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute cache

// GET - Fetch all published posts (public) or all posts for mentor/admin
export async function GET(request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;
    
    // Create cache key
    const cacheKey = `${status}-${page}-${limit}`;

    // Get current user for role check
    let userId = null;
    let userRole = null;
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      userId = session.user.id;
    } else {
      // Try Authorization header
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) {
          userId = user.id;
        }
      }
    }

    if (userId) {
      userRole = await getUserRole(userId, supabase);
    }
    
    // Check cache for public requests (non-authenticated users)
    const isPublicRequest = !userRole || (userRole !== ROLES.ADMIN && userRole !== ROLES.MENTOR);
    if (isPublicRequest && status === 'published') {
      const cached = postsCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json(cached.data, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            'CDN-Cache-Control': 'public, s-maxage=60',
            'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
          }
        });
      }
    }

    // Build optimized query - only fetch necessary fields for listing
    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        summary,
        tags,
        status,
        featured,
        cover_url,
        reading_time_minutes,
        view_count,
        published_at,
        created_at,
        author_id
      `, { count: 'exact' })
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    // If not admin/mentor, only show published posts
    if (!userRole || (userRole !== ROLES.ADMIN && userRole !== ROLES.MENTOR)) {
      query = query.eq('status', 'published');
    } else if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    // Fetch author emails separately from mentor_data or mentee_data
    const postsWithAuthors = await Promise.all(
      (data || []).map(async (post) => {
        try {
          // Try to get from mentor_data first
          const { data: mentorData } = await supabase
            .from('mentor_data')
            .select('email, name')
            .eq('user_id', post.author_id)
            .maybeSingle();
          
          if (mentorData) {
            return {
              ...post,
              author: { id: post.author_id, email: mentorData.email }
            };
          }

          // Try mentee_data
          const { data: menteeData } = await supabase
            .from('mentee_data')
            .select('email, name')
            .eq('user_id', post.author_id)
            .maybeSingle();
          
          if (menteeData) {
            return {
              ...post,
              author: { id: post.author_id, email: menteeData.email }
            };
          }

          return { ...post, author: null };
        } catch {
          return { ...post, author: null };
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
    
    // Cache public requests
    if (isPublicRequest && status === 'published') {
      postsCache.set(cacheKey, {
        data: responseData,
        timestamp: Date.now()
      });
      
      // Clean old cache entries (simple LRU)
      if (postsCache.size > 50) {
        const firstKey = postsCache.keys().next().value;
        postsCache.delete(firstKey);
      }
    }
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': isPublicRequest ? 'public, s-maxage=60, stale-while-revalidate=300' : 'no-cache',
        'CDN-Cache-Control': isPublicRequest ? 'public, s-maxage=60' : 'no-cache',
        'Vercel-CDN-Cache-Control': isPublicRequest ? 'public, s-maxage=60' : 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error in posts GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new post (mentor/admin only)
export async function POST(request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Try to get session from cookies first
    let session = null;
    let userId = null;
    
    const { data: { session: cookieSession } } = await supabase.auth.getSession();
    
    if (cookieSession?.user) {
      session = cookieSession;
      userId = cookieSession.user.id;
      console.log('✅ Auth via cookies');
    } else {
      // Fallback: Try Authorization header
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (user && !error) {
          userId = user.id;
          console.log('✅ Auth via Bearer token');
        }
      }
    }
    
    console.log('🔍 Session check:', {
      hasSession: !!session,
      hasUserId: !!userId,
      userId: userId
    });
    
    if (!userId) {
      console.error('❌ No authentication found');
      return NextResponse.json(
        { 
          error: 'Unauthorized - Please log in', 
          details: 'No valid session or token found',
          hint: 'Try logging out and logging back in'
        },
        { status: 401 }
      );
    }

    console.log('✅ Authenticated user:', userId);
    
    const userRole = await getUserRole(userId, supabase);
    console.log('👤 User role:', userRole);

    // Check if user is mentor, pending mentor, or admin
    if (userRole !== ROLES.MENTOR && userRole !== ROLES.PENDING_MENTOR && userRole !== ROLES.ADMIN) {
      return NextResponse.json(
        { 
          error: 'Only mentors and admins can create posts',
          userRole: userRole,
          requiredRoles: [ROLES.MENTOR, ROLES.PENDING_MENTOR, ROLES.ADMIN]
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, summary, content, content_json, tags, status, featured, cover_url, published_at } = body;

    // Validate post data
    const validation = validatePostData({ title, content: content || "", status: status || 'draft' });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Generate slug
    let slug = createSlug(title);
    
    // Check if slug exists
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existingPost) {
      // Append timestamp to make it unique
      slug = `${slug}-${Date.now()}`;
    }

    // Calculate reading time
    const readingTime = calculateReadingTime(content || "");

    // Determine published_at value
    let publishedAtValue = null;
    if (status === 'published') {
      publishedAtValue = new Date().toISOString();
    } else if (status === 'scheduled' && published_at) {
      publishedAtValue = new Date(published_at).toISOString();
    }

    // Prepare post data matching the schema
    const postData = {
      author_id: userId,
      title: title.trim(),
      slug,
      summary: summary?.trim() || null,
      content: content?.trim() || "",
      content_json: content_json || null,
      tags: tags || null,
      status: status || 'draft',
      featured: featured || false,
      cover_url: cover_url || null,
      reading_time_minutes: readingTime,
      published_at: publishedAtValue,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { error: 'Failed to create post', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Post created successfully',
      data
    }, { status: 201 });
  } catch (error) {
    console.error('Error in posts POST:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

