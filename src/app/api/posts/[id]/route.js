import { NextResponse } from 'next/server';
import { calculateReadingTime, validatePostData } from '@/lib/blogUtils';
import { getUserRole } from '@/lib/auth';
import { ROLES } from '@/lib/roles';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// GET - Fetch a single post by ID
export async function GET(request, { params }) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    let userRole = null;

    if (userId) {
      userRole = await getUserRole(userId, supabase);
    }

    let query = supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    // If not admin/mentor, only show published posts
    if (!userRole || (userRole !== ROLES.ADMIN && userRole !== ROLES.MENTOR)) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching post:', error);
      return NextResponse.json(
        { error: 'Failed to fetch post' },
        { status: 500 }
      );
    }

    // Fetch author email
    let author = null;
    try {
      const { data: mentorData } = await supabase
        .from('mentor_data')
        .select('email, name')
        .eq('user_id', data.author_id)
        .maybeSingle();
      
      if (mentorData) {
        author = { id: data.author_id, email: mentorData.email };
      } else {
        const { data: menteeData } = await supabase
          .from('mentee_data')
          .select('email, name')
          .eq('user_id', data.author_id)
          .maybeSingle();
        
        if (menteeData) {
          author = { id: data.author_id, email: menteeData.email };
        }
      }
    } catch (err) {
      console.error('Error fetching author:', err);
    }

    return NextResponse.json({ data: { ...data, author } });
  } catch (error) {
    console.error('Error in post GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update a post (author, mentor, or admin only)
export async function PATCH(request, { params }) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userRole = await getUserRole(userId, supabase);

    // Check if post exists and get author
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check permissions: author, mentor, or admin
    const isAuthor = existingPost.author_id === userId;
    const canEdit = isAuthor || userRole === ROLES.ADMIN || userRole === ROLES.MENTOR;

    if (!canEdit) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this post' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, summary, content, content_json, tags, status, featured, cover_url } = body;

    // Validate post data
    const validation = validatePostData({ 
      title: title || existingPost.title, 
      content: content || existingPost.content, 
      status: status || existingPost.status 
    });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title.trim();
    if (summary !== undefined) updateData.summary = summary?.trim() || null;
    if (content !== undefined) {
      updateData.content = content.trim();
      updateData.reading_time_minutes = calculateReadingTime(content);
    }
    if (content_json !== undefined) updateData.content_json = content_json;
    if (tags !== undefined) updateData.tags = tags;
    if (status !== undefined) {
      updateData.status = status;
      // Set published_at if publishing for the first time
      if (status === 'published' && !existingPost.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (featured !== undefined) updateData.featured = featured;
    if (cover_url !== undefined) updateData.cover_url = cover_url || null;

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Post updated successfully',
      data
    });
  } catch (error) {
    console.error('Error in post PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post (author, mentor, or admin only)
export async function DELETE(request, { params }) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userRole = await getUserRole(userId, supabase);

    // Check if post exists and get author
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check permissions: author, mentor, or admin
    const isAuthor = existingPost.author_id === userId;
    const canDelete = isAuthor || userRole === ROLES.ADMIN || userRole === ROLES.MENTOR;

    if (!canDelete) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this post' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error in post DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

