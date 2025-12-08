// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// import Image from "next/image";
// import {
//   Star,
//   ChevronRight,
//   Calendar,
//   Building2,
//   Twitter,
//   Linkedin,
//   Instagram,
// } from "lucide-react";
// import Link from "next/link";
// // import Mentor from "@/app/mentor/page";

// export default function MentorProfile({ mentorData }) {
//   const [isSticky, setIsSticky] = useState(false);
//   const [activeAccordion, setActiveAccordion] = useState(null);
//   // (useState < number) | (null > null);

//   // Debug log to see what data we're receiving
//   useEffect(() => {}, [mentorData]);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsSticky(window.scrollY > 0);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const toggleAccordion = (index) => {
//     setActiveAccordion(activeAccordion === index ? null : index);
//   };

//   const router = useRouter();
//   const mentorId = mentorData?.id; // Extract ID safely
//   const handleBooking = () => {
//     router.push(`/confirmation-page?mentorId=${mentorId}`);
//   };

//   return (
//     <div className="min-h-screen text-black ">
//       <main className="container mx-auto px-4 md:px-6 py-12 max-w-[1200px]">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-8">
//             {/* Profile Section */}
//             <div className="flex flex-col sm:mx-10 items-start gap-8 mb-16">
//               <div className="flex flex-col sm:content-center md:flex-row items-center gap-6 ">
//                 {/* {mentorData.ImageUrl} */}
//                 {/* <img
//                   // src={mentorData.ImageUrl}
//                   src={
//                     mentorData.ImageUrl && mentorData.ImageUrl.trim()
//                       ? mentorData.ImageUrl
//                       : "/char.png"
//                   }
//                   alt=""
//                   className="rounded-full w-32 h-32 object-cover shadow-2xl border-zinc-800"
//                 /> */}

//                 <div className="relative w-[200px] h-[200px] flex-shrink-0 rounded-full overflow-hidden">
//                   <Image
//                     src={
//                       mentorData?.ImageUrl && mentorData.ImageUrl.trim()
//                         ? mentorData.ImageUrl
//                         : "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/char.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jaGFyLnBuZyIsImlhdCI6MTc0MzYxMjMxMiwiZXhwIjoyMDU4OTcyMzEyfQ.qQNwvszmYKG5Y-SqzmDRyKGTwyUnMHNDgzwHU9KE9hw"
//                     }
//                     fill
//                     sizes="(max-width: 768px) 200px, 200px"
//                     alt={mentorData?.Name || "Mentor profile"}
//                     className="object-cover"
//                     priority
//                     quality={100}
//                   />
//                 </div>
//                 <div className="flex-1 text-left">
//                   <h1 className="text-2xl font-semibold mb-1">
//                     {mentorData?.Name || "Mentor"}
//                   </h1>
//                   <p className="text-zinc-400 text-sm mb-4">
//                     {mentorData?.Designation || ""}
//                   </p>
//                   {/* <div className="flex items-center gap-4 flex-wrap">
//                     <div className="flex items-center gap-2 bg-[#6C5DD3]/20 px-3 py-1.5 rounded-full">
//                       <div className="w-5 h-5 rounded-full bg-[#6C5DD3] flex items-center justify-center text-[11px] font-bold">
//                         S
//                       </div>
//                       <span className="text-sm font-medium">Super Mentor</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Star className="w-4 h-4 fill-current text-white" />
//                       <span className="text-sm font-medium">5.0</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 text-zinc-400">
//                       <Calendar className="w-4 h-4" />
//                       <span className="text-sm">25+ sessions</span>
//                     </div>
//                   </div> */}
//                   <div className="flex justify-center sm:justify-start gap-4  text-gray-500 mt-2">
//                     {mentorData?.Linkedin && (
//                       <Link href={mentorData.Linkedin}>
//                         <Linkedin />
//                       </Link>
//                     )}
//                     {/* <Link href={mentorData.Instagram}>
//                       <Instagram />
//                     </Link> */}
//                     {mentorData?.Twitter && (
//                       <Link href={mentorData.Twitter}>
//                         <Twitter />
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={
//                   mentorData?.Name === "Anurag Mishra"
//                     ? handleBooking
//                     : undefined
//                 }
//                 disabled={mentorData?.Name !== "Anurag Mishra"}
//                 className={`mt-2 block w-full text-center px-6 py-3 font-semibold rounded-xl shadow-md transition duration-300 ${
//                   mentorData?.Name === "Anurag Mishra"
//                     ? "bg-black text-white hover:bg-[#525458]"
//                     : "bg-gray-400 text-gray-300 cursor-not-allowed"
//                 }`}
//               >
//                 Book Now
//               </button>
//             </div>

//             {/* About Section */}
//             <section className="mb-16 text-left">
//               <h2 className="text-2xl font-semibold mb-6">About</h2>
//               <p className="text-zinc-600 leading-relaxed text-xl">
//                 {mentorData?.about || "No information available"}
//               </p>
//             </section>

//             {/* Experience Section */}
//             <section className="mb-16 text-left">
//               <h2 className="text-2xl font-semibold mb-6">Experience</h2>
//               <div className=" rounded-xl p-4 flex gap-4 items-center">
//                 <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
//                   <Building2 className="w-10 h-10 text-gray-200" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium mb-1">
//                     {mentorData?.experience ||
//                       "No experience information available"}
//                   </h3>
//                   {/* <p className=" text-md leading-relaxed">
//                     {mentorData.experience}
//                   </p> */}
//                 </div>
//               </div>
//             </section>

//             {/* FAQ Section */}
//             <section className="py-20 text-left">
//               <div className="container mx-auto px-4">
//                 <h2 className="text-2xl md:text-4xl font-bold mb-16">
//                   Frequently Asked Questions
//                 </h2>
//                 <div className="space-y-6 max-w-3xl mx-auto">
//                   {[
//                     {
//                       question: "1. How do I book a mentor on Mentorle?",
//                       answer:
//                         "mentors, select one that fits your needs, choose an available time slot, and fill in your details. Our team will confirm your booking and send you a meeting link via email.",
//                     },
//                     {
//                       question:
//                         "2. What kind of topics can I discuss with a mentor?",
//                       answer:
//                         "You can discuss anything related to your tech journey — including DSA, development, cybersecurity, AI/ML, career guidance, resume reviews, project feedback, and more.",
//                     },
//                     {
//                       question: "3. Are the mentors verified professionals?",
//                       answer:
//                         "Yes! All our mentors are verified working professionals from top companies and startups. Each mentor goes through a screening process to ensure quality guidance and expertise.",
//                     },
//                     {
//                       question: "4. What happens after I book a session?",
//                       answer:
//                         "Once you book a session, our team reviews the request, confirms availability, and sends a calendar invite with the meeting link to your registered email within 24 hours.",
//                     },
//                   ].map((faq, index) => (
//                     <div key={index} className="border-b border-gray-200 pb-4">
//                       <button
//                         className="flex justify-between items-center w-full text-left"
//                         onClick={() => toggleAccordion(index)}
//                       >
//                         <h3 className="text-xl font-semibold">
//                           {faq.question}
//                         </h3>
//                         <svg
//                           className={`w-6 h-6 transform ${
//                             activeAccordion === index ? "rotate-180" : ""
//                           }`}
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M19 9l-7 7-7-7"
//                           ></path>
//                         </svg>
//                       </button>
//                       {activeAccordion === index && (
//                         <p className="mt-4 text-gray-600">{faq.answer}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Booking Sidebar */}
//           <div className="lg:col-span-4 relative overscroll-none">
//             <div className="rounded-xl p-6 sticky top-6 shadow-2xl">
//               <div className="text-left">
//                 <h2 className="text-xl font-semibold mb-3">Availability</h2>
//                 <p className="text-zinc-400 text-sm mb-4">
//                   Mentor Available Time{" "}
//                   {mentorData?.AvailabilityTime || "Not set"}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 mb-6">
//                 <Star className="w-4 h-4 fill-current text-[#22C55E]" />
//                 <span className="font-medium text-[#22C55E]">5.0 Rating</span>
//                 <span className="text-zinc-400 text-sm">(Mentor)</span>
//               </div>

//               <p className="text-gray-600 text-sm mb-4 text-center">
//                 Mentor is not currently accessible. Please fill out this form so
//                 that your email will be notified when the mentor becomes
//                 available. Thank you.
//               </p>
//               <a
//                 href="https://app.youform.com/forms/7x97hni2"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block w-full text-center bg-black text-white py-3 px-4 rounded-lg text-sm font-medium border-2 border-black hover:text-black hover:bg-white transition-colors"
//               >
//                 Notify me
//               </a>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
