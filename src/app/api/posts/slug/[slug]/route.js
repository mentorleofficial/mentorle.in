import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// GET - Fetch a single published post by slug
export async function GET(request, { params }) {
  try {
    const supabase = await createServerSupabaseClient();
    const { slug } = await params;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

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
    console.error('Error in post GET by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
