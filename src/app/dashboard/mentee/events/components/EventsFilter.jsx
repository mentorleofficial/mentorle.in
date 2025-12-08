// "use client";

// import { Filter } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function EventsFilter({ filterType, setFilterType, events }) {  const getEventCount = (type) => {
//     if (type === "all") return events.length;
    
//     const now = new Date();
    
//     const filteredEvents = events.filter(event => {
//       // Skip events without start_date
//       if (!event.start_date) return false;
      
//       const startDate = new Date(event.start_date);
//       const endDate = event.end_date ? new Date(event.end_date) : null;
      
//       // Skip invalid dates
//       if (isNaN(startDate.getTime())) return false;
//       if (endDate && isNaN(endDate.getTime())) return false;
      
//       switch (type) {
//         case "upcoming":
//           return startDate > now;
//         case "ongoing":
//           return startDate <= now && (!endDate || endDate >= now);
//         case "completed":
//           return endDate ? endDate < now : startDate < now;
//         default:
//           return false;
//       }
//     });
//     return filteredEvents.length;
//   };

//   const filters = [
//     { value: "all", label: "All Events", count: getEventCount("all") },
//     { value: "upcoming", label: "Upcoming", count: getEventCount("upcoming") },
//     { value: "ongoing", label: "Ongoing", count: getEventCount("ongoing") },
//     { value: "completed", label: "Completed", count: getEventCount("completed") }
//   ];

//   return (
//     <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-2">
//       <div className="flex items-center gap-3 mb-4">
//         <Filter className="h-5 w-5 text-gray-500" />
//         <h3 className="font-medium text-gray-900">Filter Events</h3>
//       </div>
//       <div className="flex flex-wrap gap-3">
//         {filters.map(filter => (
//           <Button
//             key={filter.value}
//             onClick={() => setFilterType(filter.value)}
//             variant={filterType === filter.value ? 'default' : 'outline'}
//             size="sm"
//             className={`relative transition-all duration-200 ${
//               filterType === filter.value 
//                 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
//                 : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
//             }`}
//           >
//             {filter.label}
//             {filter.count > 0 && (
//               <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
//                 filterType === filter.value 
//                   ? 'bg-blue-500 text-white' 
//                   : 'bg-gray-100 text-gray-600'
//               }`}>
//                 {filter.count}
//               </span>
//             )}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }
