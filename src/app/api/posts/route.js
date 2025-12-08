import { NextResponse } from 'next/server';
import { createSlug } from '@/lib/slugify';
import { calculateReadingTime, validatePostData } from '@/lib/blogUtils';
import { getUserRole } from '@/lib/auth';
import { ROLES } from '@/lib/roles';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// GET - Fetch all published posts (public) or all posts for mentor/admin
export async function GET(request) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get current user for role check
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    let userRole = null;

    if (userId) {
      userRole = await getUserRole(userId, supabase);
    }

    // Build query
    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        summary,
        content,
        tags,
        status,
        featured,
        cover_url,
        reading_time_minutes,
        published_at,
        created_at,
        updated_at,
        author_id
      `)
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

    return NextResponse.json({
      data: postsWithAuthors,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
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
    const supabase = createServerSupabaseClient();
    
    // Try to get user first (more reliable in API routes)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      console.error('User error details:', {
        message: userError?.message,
        status: userError?.status,
        name: userError?.name
      });
      return NextResponse.json(
        { 
          error: 'Unauthorized - Please log in again', 
          details: userError?.message || 'No user found',
          code: 'AUTH_ERROR'
        },
        { status: 401 }
      );
    }

    // Get session for additional checks
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
    }

    if (!session?.user && !user) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }

    const userId = user.id;
    console.log('🔍 Checking role for user:', userId);

    const userRole = await getUserRole(userId, supabase);
    console.log('👤 User role resolved:', userRole);

    // Check if user is mentor, pending mentor, or admin
    if (userRole !== ROLES.MENTOR && userRole !== ROLES.PENDING_MENTOR && userRole !== ROLES.ADMIN) {
      console.log('❌ Access denied. User role:', userRole, 'Required: mentor, pending_mentor, or admin');
      return NextResponse.json(
        { 
          error: 'Only mentors and admins can create posts',
          userRole: userRole,
          requiredRoles: [ROLES.MENTOR, ROLES.PENDING_MENTOR, ROLES.ADMIN]
        },
        { status: 403 }
      );
    }

    console.log('✅ User authorized to create post. Role:', userRole);

    const body = await request.json();
    const { title, summary, content, content_json, tags, status, featured, cover_url } = body;

    // Validate post data
    const validation = validatePostData({ title, content, status: status || 'draft' });
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
    const readingTime = calculateReadingTime(content);

    // Prepare post data
    const postData = {
      author_id: userId,
      title: title.trim(),
      slug,
      summary: summary?.trim() || null,
      content: content.trim(),
      content_json: content_json || null,
      tags: tags || null,
      status: status || 'draft',
      featured: featured || false,
      cover_url: cover_url || null,
      reading_time_minutes: readingTime,
      published_at: status === 'published' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
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
        { error: 'Failed to create post' },
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

