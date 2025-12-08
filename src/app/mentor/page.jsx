export const dynamic = "force-dynamic";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import ShareButton from "./components/ShareButton";
import { nameToSlug } from "@/lib/slugUtils";

export default async function Mentors() {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  // Fetch approved mentor profiles, ordered by creation date (newest first)
  const { data: mentors, error } = await supabase
    .from("mentor_data")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching mentors:", error);
    return <div className="p-6">Error loading mentors.</div>;
  }

  // Generate public URLs for profile images
  const mentorsWithPics = mentors.map((mentor) => {
    let profilePicUrl = null;
    if (mentor.profile_url) {
      // If profile_url is already a public URL, use it as-is
      if (mentor.profile_url.startsWith("http")) {
        profilePicUrl = mentor.profile_url;
      } else {
        // Convert storage path to public URL
        const { data } = supabase.storage
          .from("media")
          .getPublicUrl(mentor.profile_url);
        profilePicUrl = data?.publicUrl || null;
      }
    }
    return { ...mentor, profilePicUrl };
  });

  // Sort mentors: those with profile pics first, then by creation date (newest first)
  const sortedMentors = mentorsWithPics.sort((a, b) => {
    // First priority: mentors with profile pictures
    if (a.profilePicUrl && !b.profilePicUrl) return -1;
    if (!a.profilePicUrl && b.profilePicUrl) return 1;
    
    // Second priority: newer mentors first (by created_at)
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB - dateA;
  });

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
    <div className="max-w-8xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
          Meet Our Expert Mentors
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with industry professionals who are passionate about sharing their knowledge and helping you grow.
        </p>
      </div>

      {sortedMentors.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Mentors Available</h3>
          <p className="text-gray-600">We're working on bringing amazing mentors to our platform. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedMentors.map((mentor) => (
            <div
              key={mentor.user_id}
              className="group relative rounded-xl bg-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            >
              {/* Profile Image Section */}
              <div className="aspect-[3/4] relative overflow-hidden">
                {mentor.profilePicUrl ? (
                  <Image
                    src={mentor.profilePicUrl}
                    alt={mentor.name || 'Mentor Profile'}
                    className="object-cover w-full h-full bg-black"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-6xl font-bold text-gray-400">
                      {mentor.name ? mentor.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) : '?'}
                    </span>
                  </div>
                )}
                
                {/* Glare Effect Overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <Image
                    src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/glare.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9nbGFyZS5wbmciLCJpYXQiOjE3NTI5MzUzMzQsImV4cCI6MTc4NDQ3MTMzNH0.3AWaXC_2qRMM01tL5mreReiPH_Sa4RVyOw4NyArL2XI"
                    alt="Glare effect"
                    fill 
                    sizes="(max-width: 768px) 100vw, 20vw"
                    priority={false}
                  />
                </div>
                
                {/* Top-left Badge */}
                {typeof mentor.badge === 'string' && mentor.badge.trim() !== '' && (
                  <span
                    className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      mentor.badge.toLowerCase() === 'instructor' ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                  >
                    {mentor.badge.charAt(0).toUpperCase() + mentor.badge.slice(1)}
                  </span>
                )}
                
                {/* Share Button */}
                <div className="absolute top-4 right-4 z-20">
                  <ShareButton 
                    mentorName={mentor.name || 'Mentor'}
                    mentorUrl={`${mentor.name ? nameToSlug(mentor.name) : mentor.user_id}`}
                  />
                </div>
              </div>
              
              {/* Info Section - Absolute positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white z-10">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold">
                    {mentor.name || 'Unknown Mentor'}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">
                  {mentor.current_role}
                </p>
                

                {/* Expertise Tags */}
                {mentor.expertise_area && mentor.expertise_area.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mentor.expertise_area.slice(0, 3).map((area, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-md"
                      >
                        {area}
                      </span>
                    ))}
                    {mentor.expertise_area.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-md">
                        +{mentor.expertise_area.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Experience and View Profile Button in one row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center">
                    <div className="text-lg font-bold mr-1">{mentor.experience_years || 5}</div>
                    <div className="text-xs text-gray-300">Years Exp.</div>
                  </div>
                  
                  <Link href={`/mentor/${mentor.name ? nameToSlug(mentor.name) : mentor.user_id}`} className="flex-grow">
                    <Button className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-2 rounded-md transition-all duration-300">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-all duration-300 pointer-events-none z-30"></div>
              {/* Border Highlight Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/30 rounded-xl transition-all duration-300 pointer-events-none z-30"></div>
            </div>
          ))}
        </div>
      )}

      {/* Coming Soon Section */}
      {sortedMentors.length > 0 && (
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Mentorship Sessions Coming Soon!</h2>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              We're working hard to bring you the best mentorship experience. Connect with amazing mentors and transform your career - coming very soon!
            </p>
            <div className="bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold cursor-not-allowed opacity-75 inline-block">
              Booking Coming Soon
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}