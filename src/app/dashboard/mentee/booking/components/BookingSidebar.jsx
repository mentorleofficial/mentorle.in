import { Star, Shield, MessageCircle } from "lucide-react";

export default function BookingSidebar() {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg sticky top-6">
      <h2 className="text-2xl font-bold text-black mb-6">Contact Mentor</h2>

      <div className="text-center py-6 bg-blue-50 rounded-xl border border-blue-200 mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="text-blue-500" size={24} />
        </div>
        <p className="text-gray-700 font-medium mb-3">
          Booking System Coming Soon
        </p>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          We're working on a new booking system. For now, please contact the mentor directly for scheduling sessions.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Shield className="text-amber-500" size={20} />
          </div>
          <div>
            <p className="font-medium text-black">Verified Expertise</p>
            <p className="text-xs text-gray-500">
              This mentor has been verified by our team
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center mb-1">
            <Star className="text-amber-400 mr-1" size={14} />
            <Star className="text-amber-400 mr-1" size={14} />
            <Star className="text-amber-400 mr-1" size={14} />
            <Star className="text-amber-400 mr-1" size={14} />
            <Star className="text-amber-400 mr-1" size={14} />
          </div>
          <p className="text-xs text-gray-500">
            This mentor has proven expertise in their field with excellent feedback from mentees.
          </p>
        </div>
      </div>
    </div>
  );
}