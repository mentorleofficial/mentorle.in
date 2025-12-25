"use client";

import { User, Edit3 } from "lucide-react";
import Image from "next/image";

export default function ProfileHeader({ profile, isEditing, onEdit }) {
  const getInitials = () => {
    if (profile?.name) {
      const nameParts = profile.name.split(' ');
      return nameParts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Avatar */}
          {profile?.profile_url ? (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
              <Image
                src={profile.profile_url}
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-xl font-semibold text-white">
                {getInitials()}
              </span>
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 break-words">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
              <span className="truncate">Profile</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
              {profile?.name ? `${profile.name}'s Profile` : 'Manage your profile information'}
            </p>
          </div>
        </div>
        
        {!isEditing && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            <Edit3 className="h-4 w-4" />
            <span className="hidden sm:inline">Edit Profile</span>
            <span className="sm:hidden">Edit</span>
          </button>
        )}
      </div>
    </div>
  );
}
