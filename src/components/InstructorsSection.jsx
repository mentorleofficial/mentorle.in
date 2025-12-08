"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Award, ExternalLink } from "lucide-react";
import MentorCard from "./MentorCard";
import Link from "next/link";

export default function InstructorsSection() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const { data, error } = await supabase
          .from("mentor_data")
          .select("*")
          .eq("badge", "Instructor")
          .eq("status", "approved")
          .limit(6); // Show only 6 instructors on landing page

        if (error) {
          console.error("Error fetching instructors:", error);
        } else {
          // Sort instructors: those with images first, then those without
          const sortedInstructors = (data || []).sort((a, b) => {
            const aHasImage = a.profile_url && a.profile_url.trim() !== '';
            const bHasImage = b.profile_url && b.profile_url.trim() !== '';
            
            // If both have images or both don't have images, maintain original order
            if (aHasImage === bHasImage) return 0;
            
            // Those with images come first
            return aHasImage ? -1 : 1;
          });
          
          setInstructors(sortedInstructors);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-4">
          <div className="text-center mb-4">
            <p className="text-lg text-gray-600 mt-4">
              Learn from industry experts and verified instructors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (instructors.length === 0) {
    return null; // Don't show section if no instructors
  }

  return (
    <section className="py-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Learn from Industry <span className="text-green-600">Experts</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our verified instructors are industry professionals with years of experience 
            ready to guide you through your learning journey
          </p>
        </div>

        {/* Instructors Grid using MentorCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {instructors.map((instructor, index) => (
            <MentorCard
              key={instructor.id || `instructor-${index}`}
              Industry={instructor.Industry}
              Name={instructor.first_name && instructor.last_name 
                ? `${instructor.first_name} ${instructor.last_name}` 
                : instructor.Name || "Instructor"
              }
              mentorData={instructor}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/mentor">
            <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 inline-flex items-center gap-2">
              Explore Our Mentor Network
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
