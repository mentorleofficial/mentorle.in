"use client";

import { Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const EmptyState = ({ filterStatus }) => {
  const router = useRouter();
  
  return (
    <div className="text-center py-16">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-6 inline-block mb-6">
        <Calendar className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">No sessions found</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        {filterStatus === 'all'
          ? "Ready to start your mentoring journey? Connect with experienced mentors to accelerate your growth."
          : `You don't have any ${filterStatus} sessions at the moment.`}
      </p>
      <Button
        onClick={() => router.push("/dashboard/mentee/findmentor")}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        <Star className="h-4 w-4 mr-2" />
        Find a Mentor
      </Button>
    </div>
  );
};

export default EmptyState;
