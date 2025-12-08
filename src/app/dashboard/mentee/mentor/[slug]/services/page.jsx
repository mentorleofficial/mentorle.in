"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

// Import microservices
import MentorService from "./api/mentorService";

// Loading and Error States
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading mentor services...</p>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Mentor Not Found</h1>
        <Link 
          href="/dashboard/mentee/findmentor"
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          ← Back to Find Mentors
        </Link>
      </div>
    </div>
  );
}

export default function MentorServicesPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [mentor, setMentor] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchMentorAndServices();
  }, [params.slug]);

  const fetchMentorAndServices = async () => {
    try {
      setLoading(true);

      const result = await MentorService.fetchMentorComplete(params.slug);
      
      if (result.error || !result.mentor) {
        console.error("Error fetching mentor data:", result.error);
        toast({
          title: "Error",
          description: "Mentor not found",
          variant: "destructive",
        });
        router.push("/dashboard/mentee/findmentor");
        return;
      }

      setMentor(result.mentor);
      setServices(result.services);
      setImageUrl(result.imageUrl);
      
      if (result.error) {
        console.error("Error fetching services:", result.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load mentor data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!mentor) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {mentor.name} - Services
              </h1>
              <p className="text-gray-600 mt-2">Discover mentorship offerings designed for your success</p>
            </div>
            <Link 
              href="/dashboard/mentee/findmentor"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to Mentors
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Mentor Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-8">
              {/* Profile Image Section */}
              <div className="relative">
                <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {imageUrl && !imageError ? (
                    <Image
                      src={imageUrl}
                      alt={mentor.name || 'Mentor Profile'}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-purple-600">
                          {mentor.name ? mentor.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) : '?'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Glare Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Badge */}
                  {mentor.badge && (
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      mentor.badge.toLowerCase() === 'instructor' ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      {mentor.badge.charAt(0).toUpperCase() + mentor.badge.slice(1)}
                    </span>
                  )}
                </div>
                
                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white">
                  <h2 className="text-2xl font-bold mb-1">{mentor.name}</h2>
                  {mentor.current_role && (
                    <p className="text-gray-200">{mentor.current_role}</p>
                  )}
                </div>
              </div>
              
              {/* Profile Details */}
              <div className="p-6">
                {/* Experience and Location */}
                {(mentor.experience_years || mentor.location) && (
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    {mentor.experience_years && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">{mentor.experience_years}</span>
                        <span>years exp</span>
                      </div>
                    )}
                    {mentor.location && (
                      <span>{mentor.location}</span>
                    )}
                  </div>
                )}
                
                {/* Bio */}
                {mentor.bio && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                      {mentor.bio}
                    </p>
                  </div>
                )}
                
                {/* Expertise Areas */}
                {mentor.expertise_area && mentor.expertise_area.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise_area.slice(0, 4).map((area, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                      {mentor.expertise_area.length > 4 && (
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{mentor.expertise_area.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Rating Display */}
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-gray-900">4.9</span>
                  </div>
                  <span className="text-gray-500 text-sm">• Verified Mentor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services Content */}
          <div className="lg:col-span-2">
            {/* Coming Soon Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Services Coming Soon!
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
                We're working hard to bring you amazing mentorship services. Connect with {mentor.name} and unlock your potential - coming very soon!
              </p>
              <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-4 rounded-xl font-semibold cursor-not-allowed opacity-75 inline-block">
                Booking Coming Soon
              </div>
              
              {/* Feature Preview */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">1:1 Video Calls</h3>
                  <p className="text-gray-600 text-sm">Personalized mentorship sessions</p>
                </div>
                
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Learning Resources</h3>
                  <p className="text-gray-600 text-sm">Curated materials and guides</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
