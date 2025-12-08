import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch mentee profile
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('mentee_data')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching mentee profile:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in mentee profile GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update mentee profile
export async function PUT(request) {
  try {
    const body = await request.json();
    const { user_id, ...profileData } = body;

    console.log('Profile update request:', { user_id, profileData });

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validation
    if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

     if (profileData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profileData.phone.replace(/\s/g, ''))) {
       return NextResponse.json(
         { error: 'Invalid phone number format' },
         { status: 400 }
       );
     }

     // Social media URL validation
     const isValidUrl = (url, expectedDomain) => {
       if (!url) return true; // Empty URLs are allowed
       try {
         const urlObj = new URL(url);
         return urlObj.hostname.includes(expectedDomain);
       } catch {
         return false;
       }
     };

     if (profileData.linkedin_url && !isValidUrl(profileData.linkedin_url, 'linkedin.com')) {
       return NextResponse.json(
         { error: 'Invalid LinkedIn URL format' },
         { status: 400 }
       );
     }

     if (profileData.github_url && !isValidUrl(profileData.github_url, 'github.com')) {
       return NextResponse.json(
         { error: 'Invalid GitHub URL format' },
         { status: 400 }
       );
     }

     if (profileData.instagram_url && !isValidUrl(profileData.instagram_url, 'instagram.com')) {
       return NextResponse.json(
         { error: 'Invalid Instagram URL format' },
         { status: 400 }
       );
     }

    const updateData = {
      ...profileData,
      updated_at: new Date().toISOString()
    };

    console.log('Update data being sent to database:', updateData);

    const { data, error } = await supabase
      .from('mentee_data')
      .upsert({
        user_id,
        ...updateData
      })
      .select()
      .single();

    console.log('Database response:', { data, error });

    if (error) {
      console.error('Error updating mentee profile:', error);
      return NextResponse.json(
        { error: `Failed to update profile: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      data 
    });
  } catch (error) {
    console.error('Error in mentee profile PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create mentee profile
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, email, ...profileData } = body;

    if (!user_id || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    // Validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const createData = {
      user_id,
      email,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('mentee_data')
      .insert(createData)
      .select()
      .single();

    if (error) {
      console.error('Error creating mentee profile:', error);
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Profile created successfully',
      data 
    });
  } catch (error) {
    console.error('Error in mentee profile POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
