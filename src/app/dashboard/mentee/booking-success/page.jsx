"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useMentorStore from "@/store/store";

export default function DashboardBookingSuccess() {
  const router = useRouter();
  const mentorData = useMentorStore((state) => state.mentorData);

  useEffect(() => {
    // If there's no mentor data, redirect to findmentor page
    if (!mentorData && !localStorage.getItem("mentor-storage")) {
      router.push("/dashboard/mentee/findmentor");
    }
  }, [mentorData, router]);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-2">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="text-green-600 w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold text-center">Booking Confirmed!</h1>
          <p className="text-gray-600 mt-2 text-center">
            Your mentoring session has been scheduled successfully.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Session Confirmation</p>
                <p className="text-gray-600 text-sm">
                  You'll receive an email confirmation with the meeting details.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Mentor Review</p>
                <p className="text-gray-600 text-sm">
                  Your mentor will review the booking and may reach out with
                  additional questions.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Meeting Link</p>
                <p className="text-gray-600 text-sm">
                  A Google Meet or Zoom link will be provided before your
                  session.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <p className="font-medium">Session Time</p>
                <p className="text-gray-600 text-sm">
                  Join the meeting at your scheduled time and enjoy your
                  mentoring session!
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link href="/dashboard/mentee/sessions">
              <Calendar className="w-4 h-4" />
              View My Sessions
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/dashboard/mentee/findmentor">
              Find More Mentors
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
