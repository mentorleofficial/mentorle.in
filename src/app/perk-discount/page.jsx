// import Image from "next/image";
// import { ChevronDown, ChevronRight, Menu } from "lucide-react";

// export default function DesignlabPerksPage() {
//   return (
//     <div className="min-h-screen flex flex-col font-sans">
//       <main className="flex-grow">
//         <section className="bg-gradient-to-r from-black text-white py-20 px-6">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-6">
//               Get Big Discounts On Top Tools
//             </h1>
//             <p className="text-xl md:text-2xl mb-8">
//               Maximize the value of your Mentorle experience with our wide
//               selection of partnership perks, available exclusively to enrolled
//               students.
//             </p>
//             <a
//               href="#"
//               className="inline-flex items-center bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
//             >
//               Explore Courses
//               <ChevronRight className="ml-2 h-5 w-5" />
//             </a>
//           </div>
//         </section>

//         <section className="py-20 px-6 bg-gray-50">
//           <div className="max-w-7xl mx-auto">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
//               {perks.map((perk, index) => (
//                 <div
//                   key={index}
//                   className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300"
//                 >
//                   <div className="text-blue-600 mb-4">
//                     <Image
//                       src={`/placeholder.svg?text=${perk.icon}&width=48&height=48`}
//                       alt={perk.title}
//                       width={48}
//                       height={48}
//                     />
//                   </div>
//                   <h2 className="text-2xl font-semibold mb-4">{perk.title}</h2>
//                   <p className="text-gray-600">{perk.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="py-20 px-6 bg-white">
//           <div className="max-w-7xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12">
//               Why Mentorle?
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//               {whyDesignlab.map((item, index) => (
//                 <div key={index} className="flex items-start">
//                   <div className="flex-shrink-0 mr-4">
//                     <Image
//                       src={`/placeholder.svg?text=${item.icon}&width=32&height=32`}
//                       alt={item.title}
//                       width={32}
//                       height={32}
//                     />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//                     <p className="text-gray-600">{item.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="py-20 px-6 bg-gray-50">
//           <div className="max-w-7xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12">
//               Ready to change your future?
//             </h2>
//             <div className="bg-white p-8 rounded-lg shadow-md">
//               <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
//                 <div className="w-32 h-32 rounded-full overflow-hidden">
//                   <Image
//                     src="/placeholder.svg?text=Student&width=128&height=128"
//                     alt="Student"
//                     width={128}
//                     height={128}
//                     className="object-cover"
//                   />
//                 </div>
//                 <div>
//                   <p className="text-lg mb-4">
//                     Learn all the essential visual and UI design skills it takes
//                     to take your career to the next level with 1:1 mentorship
//                     from a professional designer.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="py-20 px-6 bg-white">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12">
//               Frequently Asked Questions
//             </h2>
//             {faqs.map((faq, index) => (
//               <div key={index} className="mb-6">
//                 <button className="flex justify-between items-center w-full text-left font-semibold text-lg py-4 border-b border-gray-200">
//                   {faq.question}
//                   <ChevronDown className="h-5 w-5 text-gray-500" />
//                 </button>
//                 {/* Add logic to show/hide answer */}
//                 <p className="mt-4 text-gray-600 hidden">{faq.answer}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

// const perks = [
//   {
//     icon: "👨‍🏫",
//     title: "Expert-Led Curriculum",
//     description:
//       "Learn from industry professionals with years of experience in design and education.",
//   },
//   {
//     icon: "👥",
//     title: "1-on-1 Mentorship",
//     description:
//       "Get personalized feedback and guidance from experienced designers throughout your course.",
//   },
//   {
//     icon: "🚀",
//     title: "Project-Based Learning",
//     description:
//       "Apply your skills to real-world projects and build a professional portfolio.",
//   },
//   {
//     icon: "🤝",
//     title: "Supportive Community",
//     description:
//       "Connect with fellow students and alumni for networking and collaboration opportunities.",
//   },
//   {
//     icon: "💡",
//     title: "Flexible Learning",
//     description:
//       "Study at your own pace with our online platform, accessible anytime, anywhere.",
//   },
//   {
//     icon: "🎁",
//     title: "Career Support",
//     description:
//       "Receive guidance on job searching, interviewing, and portfolio preparation post-graduation.",
//   },
// ];

// const whyDesignlab = [
//   {
//     icon: "📚",
//     title: "Comprehensive Curriculum",
//     description:
//       "Our courses cover all aspects of UX/UI design, from research to prototyping and beyond.",
//   },
//   {
//     icon: "👨‍🎓",
//     title: "Industry-Experienced Mentors",
//     description:
//       "Learn from professionals who have worked at top companies and bring real-world insights.",
//   },
//   {
//     icon: "💼",
//     title: "Career-Focused Approach",
//     description:
//       "We prepare you for the job market with portfolio reviews, mock interviews, and job search strategies.",
//   },
//   {
//     icon: "🌐",
//     title: "Global Community",
//     description:
//       "Join a diverse network of designers from around the world, fostering collaboration and growth.",
//   },
// ];

// const faqs = [
//   {
//     question: "How long does it take to complete a course?",
//     answer:
//       "Course duration varies depending on the program. Our UX Academy typically takes 15-28 weeks, while shorter courses like Design 101 can be completed in 4 weeks.",
//   },
//   {
//     question: "Do I need any prior experience in design?",
//     answer:
//       "For our introductory courses like Design 101, no prior experience is necessary. For more advanced programs like UX Academy, we recommend having some basic design knowledge or completing our Design 101 course first.",
//   },
//   {
//     question: "How does the mentorship program work?",
//     answer:
//       "You'll be paired with an experienced design professional who will provide one-on-one guidance throughout your course. Mentorship sessions are typically held weekly via video call.",
//   },
//   // Add more FAQs as needed
// ];

"use client";
import Image from "next/image";
import {
  GraduationCap,
  Users,
  Rocket,
  Lightbulb,
  Gift,
  Handshake,
} from "lucide-react";

const perks = [
  {
    icon: <GraduationCap size={48} className="text-blue-600" />,
    title: "Expert-Led Curriculum",
    description:
      "Learn from industry professionals with years of experience in design and education.",
  },
  {
    icon: <Users size={48} className="text-blue-600" />,
    title: "1-on-1 Mentorship",
    description:
      "Get personalized feedback and guidance from experienced designers throughout your course.",
  },
  {
    icon: <Rocket size={48} className="text-blue-600" />,
    title: "Project-Based Learning",
    description:
      "Apply your skills to real-world projects and build a professional portfolio.",
  },
  {
    icon: <Handshake size={48} className="text-blue-600" />,
    title: "Supportive Community",
    description:
      "Connect with fellow students and alumni for networking and collaboration opportunities.",
  },
  {
    icon: <Lightbulb size={48} className="text-blue-600" />,
    title: "Flexible Learning",
    description:
      "Study at your own pace with our online platform, accessible anytime, anywhere.",
  },
  {
    icon: <Gift size={48} className="text-blue-600" />,
    title: "Career Support",
    description:
      "Receive guidance on job searching, interviewing, and portfolio preparation post-graduation.",
  },
];

export default function DesignlabPerksPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-grow">
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {perks.map((perk, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="text-blue-600 mb-4">
                    <Image
                      src={`/placeholder.svg?text=${encodeURIComponent(
                        perk.icon
                      )}&width=48&height=48`}
                      alt={perk.title}
                      width={48}
                      height={48}
                    />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">{perk.title}</h2>
                  <p className="text-gray-600">{perk.description}</p>
                </div>
              ))}
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {perks.map((perk, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="mb-4">{perk.icon}</div>
                  <h2 className="text-2xl font-semibold mb-4">{perk.title}</h2>
                  <p className="text-gray-600">{perk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
