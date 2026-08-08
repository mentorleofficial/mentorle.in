"use client";

import { useState, useEffect } from "react";
import MentorCard from "./MentorCard";
import Link from "next/link";

export default function InstructorsSection() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch("/api/mentors?badge=instructor&limit=6");
        if (!response.ok) {
          setInstructors([]);
          return;
        }

        const payload = await response.json();
        setInstructors(payload.data || []);
      } catch (error) {
        console.warn(
          "Instructors unavailable:",
          error?.message || "Request failed"
        );
        setInstructors([]);
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
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 mx-auto" />
                <div className="h-3 bg-gray-200 rounded mb-4 w-1/2 mx-auto" />
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded" />
                  <div className="h-2 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (instructors.length === 0) {
    return null;
  }

  return (
    <section className="py-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Learn from Industry <span className="text-green-600">Experts</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our verified instructors are industry professionals with years of
            experience ready to guide you through your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {instructors.map((instructor, index) => (
            <MentorCard
              key={instructor.user_id || `instructor-${index}`}
              Industry={instructor.Industry}
              Name={instructor.name || "Instructor"}
              mentorData={instructor}
            />
          ))}
        </div>

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
