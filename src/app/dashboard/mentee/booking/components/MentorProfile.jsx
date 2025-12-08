// import Image from "next/image";
// import { Linkedin, Globe, MapPin, MessageCircle, Award } from "lucide-react";

// export default function MentorProfile({ mentor, avatarUrl, imageLoading, handleImageError }) {     

//   return (
//     <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Avatar Section */}
//         <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
//           <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
//             {imageLoading ? (
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
//             ) : avatarUrl ? (
//               <Image
//                 src={avatarUrl}
//                 alt={mentor.name}
//                 width={160}
//                 height={160}
//                 className="object-cover w-full h-full"
//                 onError={handleImageError}
//               />
//             ) : (
//               <span className="text-6xl font-bold text-black">
//                 {mentor.first_name?.charAt(0).toUpperCase()}
//                 {mentor.last_name?.charAt(0).toUpperCase()}
//               </span>
//             )}
//           </div>
          
//           {/* Social Links */}
//           <div className="flex gap-3 mt-4">
//             {mentor.linkedin_url && (
//               <a
//                 href={mentor.linkedin_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
//                 title="LinkedIn Profile"
//               >
//                 <Linkedin size={18} />
//               </a>
//             )}

//             {mentor.portfolio_url && (
//               <a
//                 href={mentor.portfolio_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
//                 title="Portfolio Website"
//               >
//                 <Globe size={18} />
//               </a>
//             )}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 space-y-6">
//           {/* Header */}
//           <div className="text-center lg:text-left">
//             <h1 className="text-4xl font-black mb-2 text-black">
//               {mentor.name}
//             </h1>
//             <p className="text-xl font-semibold text-gray-700 mb-2">
//               {mentor.current_role}
//             </p>
//             <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
//               <MapPin size={16} />
//               <span>{mentor.location}</span>
//             </div>
//           </div>

//           {/* Industry */}
//           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//             <h3 className="font-bold text-black mb-2">Industry</h3>
//             <p className="text-gray-700">{mentor.Industry}</p>
//           </div>

//           {/* Languages */}
//           {mentor.languages_spoken && mentor.languages_spoken.length > 0 && (
//             <div>
//               <div className="flex items-center gap-2 mb-3">
//                 <MessageCircle size={18} className="text-black" />
//                 <h3 className="font-bold text-black">Languages Spoken</h3>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {mentor.languages_spoken.map((language, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 bg-black text-white text-sm rounded-full font-medium"
//                   >
//                     {language}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Expertise Areas */}
//           {mentor.expertise_area && mentor.expertise_area.length > 0 && (
//             <div>
//               <div className="flex items-center gap-2 mb-3">
//                 <Award size={18} className="text-black" />
//                 <h3 className="font-bold text-black">Areas of Expertise</h3>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {mentor.expertise_area.map((expertise, index) => (
//                   <span
//                     key={index}
//                     className="px-4 py-2 bg-white border-2 border-black text-black text-sm rounded-full font-medium hover:bg-black hover:text-white transition-colors"
//                   >
//                     {expertise}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import Image from "next/image";
import { Linkedin, Globe, MapPin, MessageCircle, Award, Briefcase } from "lucide-react";

export default function MentorProfile({ mentor, avatarUrl, imageLoading, handleImageError }) {
  return (
  <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      {/* Avatar Section */}
      <div className="flex-shrink-0 mx-auto sm:mx-0">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
          {imageLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          ) : avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={mentor.name}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              onError={handleImageError}
            />
          ) : (
            <span className="text-2xl font-bold text-gray-600">
              {mentor.first_name?.charAt(0).toUpperCase()}
              {mentor.last_name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-1">
            {mentor.name}
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
            {mentor.current_role}
          </p>

          {/* Quick Info Row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Briefcase size={14} className="text-blue-600" />
              <span>{mentor.Industry}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-green-600" />
              <span>{mentor.location}</span>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Expertise Areas */}
          {mentor.expertise_area?.length > 0 && (
            <div className="flex items-start gap-2">
              <Award size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {mentor.expertise_area.map((expertise, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs rounded-md font-medium hover:bg-amber-100 transition-colors"
                  >
                    {expertise}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {mentor.languages_spoken?.length > 0 && (
            <div className="flex items-start gap-2">
              <MessageCircle size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {mentor.languages_spoken.map((language, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-medium"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-2 mt-4">
          {mentor.linkedin_url && (
            <a
              href={mentor.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
          )}

          {mentor.portfolio_url && (
            <a
              href={mentor.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              <Globe size={14} />
              Portfolio
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

}