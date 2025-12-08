import Image from "next/image";
import Link from "next/link";
import useMentorStore from "@/store/store";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Briefcase, MapPin, Lightbulb, ExternalLink, Linkedin, Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nameToSlug } from "@/lib/slugUtils";

const MentorCard = ({ Industry, Name, mentorData }) => {
  const setMentorData = useMentorStore((state) => state.setMentorData);
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        if (mentorData?.profile_url) {
          if (mentorData.profile_url.startsWith('http')) {
            setImageUrl(mentorData.profile_url);
            return;
          }
          const { data } = supabase.storage.from('media').getPublicUrl(mentorData.profile_url);
          setImageUrl(data?.publicUrl || "");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setImageError(true);
      }
    };
    fetchProfileImage();
  }, [mentorData?.profile_url]);

  const handleClick = () => setMentorData(mentorData);

  const getInitials = () => {
    const firstName = mentorData?.first_name || Name?.split(' ')[0] || 'M';
    const lastName = mentorData?.last_name || Name?.split(' ')[1] || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const mentorName = mentorData?.name || Name;
    
    if (!mentorName) {
      toast({
        title: "Error",
        description: "Unable to share: Mentor name not found",
        variant: "destructive",
      });
      return;
    }

    // Create slug from mentor name
    const mentorSlug = nameToSlug(mentorName);
    const shareUrl = `${window.location.origin}/mentor/${mentorSlug}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Book a session with ${mentorName}`,
          text: `Connect with ${mentorName}, ${Industry || 'Mentor'} on Mentorle`,
          url: shareUrl,
        });
        toast({ title: "Shared!", description: "Mentor profile shared successfully" });
        return;
      }
      
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast({ title: "Link copied!", description: "Mentor profile link copied to clipboard" });
    } catch (error) {
      if (error.name === 'AbortError') return;
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast({ title: "Link copied!", description: "Mentor profile link copied to clipboard" });
    }
  };

  const expertise = Array.isArray(mentorData?.expertise_area) 
    ? mentorData.expertise_area 
    : mentorData?.expertise_area ? [mentorData.expertise_area] : [];

  return (
    <div className="flex justify-center p-2">
      <div className="group relative rounded-xl bg-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 w-full max-w-sm">
        
        {/* Profile Image Section */}
        <div className="aspect-[3/4] relative overflow-hidden">
          {imageError || !imageUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-6xl font-bold text-gray-400">
                {getInitials()}
              </span>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={Name || "Mentor"}
              className="object-cover w-full h-full bg-black"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              onError={() => setImageError(true)}
            />
          )}
          
          {/* Glare Effect Overlay */}
          <div className="aspect-[3/4] relative overflow-hidden">
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/glare.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9nbGFyZS5wbmciLCJpYXQiOjE3NTI5MzUzMzQsImV4cCI6MTc4NDQ3MTMzNH0.3AWaXC_2qRMM01tL5mreReiPH_Sa4RVyOw4NyArL2XI"
              alt="Glare effect"
              fill 
              sizes="(max-width: 768px) 100vw, 20vw"
              priority={false}
            />
          </div>
          
          {/* Badge */}
          {mentorData?.badge && (
            <div className="absolute top-4 left-4 z-20">
              <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                mentorData.badge === 'Instructor' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {mentorData.badge.charAt(0).toUpperCase() + mentorData.badge.slice(1)}
              </span>
            </div>
          )}
          
          {/* Activity status indicator */}
          {/* <div className={`absolute top-4 w-2 h-2 bg-green-500 rounded-full z-20 ${
            mentorData?.badge ? 'left-4 top-12' : 'left-4'
          }`}></div> */}
          
          {/* Share Button */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleShare}
              className={`bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:bg-white hover:scale-110 ${
                copySuccess ? 'bg-green-500 text-white' : ''
              }`}
            >
              {copySuccess ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {/* Info Section - Absolute positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white z-10">
          <h3 className="text-2xl font-bold mb-1">
            {Name || "Unknown Mentor"}
          </h3>
          
          <p className="text-sm text-gray-300 mb-4">
            {mentorData?.current_role || Industry || "Mentor"}
          </p>
          
          {/* Expertise Tags */}
          {expertise.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {expertise.slice(0, 3).map((area, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-md"
                >
                  {area}
                </span>
              ))}
              {expertise.length > 3 && (
                <span className="inline-block px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-md">
                  +{expertise.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Experience and View Profile Button in one row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center">
              <div className="text-lg font-bold mr-1">{mentorData?.experience_years || 5}</div>
              <div className="text-xs text-gray-300">Years Exp.</div>
            </div>
            
            <Link 
              href={`/dashboard/mentee/mentor/${nameToSlug(mentorData?.name || Name)}/services`} 
              className="flex-grow" 
              onClick={handleClick}
            >
              <button className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-2 rounded-md transition-all duration-300">
                {/* View Services */}
                     View Profile
              </button>
            </Link>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-all duration-300 pointer-events-none z-30"></div>
        {/* Border Highlight Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/30 rounded-xl transition-all duration-300 pointer-events-none z-30"></div>
      </div>
    </div>
  );
};

export default MentorCard;