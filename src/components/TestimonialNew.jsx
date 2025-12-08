"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ThumbsUp, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const starVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.5 },
  },
};

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" },
  },
};

export default function TestimonialsSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Suryansh Nagar",
      image:
        "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/testimonial1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS90ZXN0aW1vbmlhbDEuanBnIiwiaWF0IjoxNzQzNTk0MTkwLCJleHAiOjIwNTg5NTQxOTB9.29hU1vUH4LNSgr9RyaM-aoXppSWZ24U3oJTWPxB-M8k",
      text: "I'm grateful to Mentorle for organizing such engaging events that have enhanced my skills and expanded my horizons in the IT field.",
      role: "Student at Netaji Subhas University of Technology",
      icon: "quote",
    },
    {
      id: 2,
      name: "Anugrah Kumar",
      image:
        "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/testimonial2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS90ZXN0aW1vbmlhbDIuanBnIiwiaWF0IjoxNzQzNTk0MTk4LCJleHAiOjIwNTg5NTQxOTh9.mm2ixZLJ5he_Iz9oSmcEL47auslSVAbr61uJEbAc7BA",
      text: "As a member of Mentorle's community, I had the chance to participate in hackathons and events that further enriched my learning experience.",
      role: "Student at Kurukshetra University",
      icon: "quote",
    },
    {
      id: 3,
      name: "Vaibhav Pal",
      image:
        "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/testimonial3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS90ZXN0aW1vbmlhbDMuanBnIiwiaWF0IjoxNzQzNTk0MjA5LCJleHAiOjIwNTg5NTQyMDl9.JwZ4fwgRlak_3iLwB62YiHi4V4nkQhXMUdh7aoH5HIg",
      text: "My journey with Mentorle has been incredibly rewarding, thanks to their comprehensive approach to student development.",
      role: "Student at Delhi Technological University",
      icon: "quote",
    },
  ];

  if (!isMounted) return null;

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        {/* Left side content */}
        <motion.div className="flex-1" variants={itemVariants}>
          <div className="relative h-16 w-16 mb-6">
            <svg
              viewBox="0 0 100 100"
              className="absolute top-0 left-0 w-full h-full"
              fill="none"
              stroke="#8a5cf6"
              strokeWidth="3"
            >
              <motion.path
                d="M20,50 Q40,20 60,50 Q80,80 95,40"
                variants={lineVariants}
              />
            </svg>
            <motion.div
              className="absolute right-0 top-0"
              variants={starVariants}
            >
              <div className="h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center transform rotate-12">
                <span className="text-white text-lg">★</span>
              </div>
            </motion.div>
          </div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            What Our <br className="hidden md:block" />
            Customers Say
          </motion.h2>

          <motion.p className="text-gray-600 mb-6" variants={itemVariants}>
            Relating so in confined smallest children unpacked delicate. Why sir
            end believe uncivil respect. Always get adieus nature day course for
            common.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link
              href="/mentor"
              className="border-black border-2 hover:bg-black hover:text-white text-black px-6 py-4 rounded-full"
            >
              Book Now
            </Link>
          </motion.div>
        </motion.div>

        {/* Right side testimonials */}
        {/* border-purple-200 */}
        <motion.div
          className="flex-1 border-l-0 md:border-l-4 border-[#C5C5C5] pl-0 md:pl-8"
          variants={itemVariants}
        >
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                variants={itemVariants}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <div className="relative">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-gray-200"
                  />
                </div>

                <div className="flex-1 gap-2">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {testimonial.name}
                      </h3>
                      <span className="text-gray-600 text-md">
                        {testimonial.role}
                      </span>
                    </div>
                    {testimonial.icon === "quote" && (
                      <ThumbsUp className="h-5 w-5 text-blue-500" />
                    )}
                  </div>

                  <p className="text-gray-600 text-sm">
                    {testimonial.icon === "quote" && (
                      <Quote className="h-4 w-4 text-gray-400 inline mr-1 rotate-180" />
                    )}
                    {testimonial.text}
                    {testimonial.icon === "quote" && (
                      <Quote className="h-4 w-4 text-gray-400 inline ml-1" />
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
