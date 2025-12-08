"use client";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Autoplay, Navigation } from "swiper/modules";
import clsx from "clsx";
import Image from "next/image";
import TestimonialCard from "@/components/testimonialcard";

let dummyId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export default function TestimonialSlider() {
  return (
    <>
      <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-center">
        Testimonials
      </h2>
      <h3 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-center mt-2 lg:mt-4 mb-14">
        Don't take our word for it. <br /> Over 1000+ people trust us.
      </h3>
      <Swiper
        slidesPerView={1}
        navigation={true}
        pagination={true}
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Pagination, Autoplay]}
        loop={true}
        className="mySwiper"
      >
        <SwiperSlide className="p-10">
          <TestimonialCard
            quote="I'm grateful to Mentorle for organizing such engaging events that have enhanced my skills and expanded my horizons in the IT field."
            image="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/testimonial1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS90ZXN0aW1vbmlhbDEuanBnIiwiaWF0IjoxNzQzNTk0MTkwLCJleHAiOjIwNTg5NTQxOTB9.29hU1vUH4LNSgr9RyaM-aoXppSWZ24U3oJTWPxB-M8k"
            name="Suryansh Nagar"
            role="Student at Netaji Subhas University of Technology"
          />
        </SwiperSlide>
        <SwiperSlide className="p-10">
          <TestimonialCard
            quote="As a member of Mentorle's community, I had the chance to participate in hackathons and events that further enriched my learning experience."
            image="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/testimonial2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS90ZXN0aW1vbmlhbDIuanBnIiwiaWF0IjoxNzQzNTk0MTk4LCJleHAiOjIwNTg5NTQxOTh9.mm2ixZLJ5he_Iz9oSmcEL47auslSVAbr61uJEbAc7BA"
            name="Anugrah Kumar"
            role="Student at Kurukshetra University"
          />
        </SwiperSlide>
        <SwiperSlide className="p-10">
          <TestimonialCard
            quote="My journey with Mentorle has been incredibly rewarding, thanks to their comprehensive approach to student development."
            image="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/testimonial3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS90ZXN0aW1vbmlhbDMuanBnIiwiaWF0IjoxNzQzNTk0MjA5LCJleHAiOjIwNTg5NTQyMDl9.JwZ4fwgRlak_3iLwB62YiHi4V4nkQhXMUdh7aoH5HIg"
            name="Vaibhav Pal"
            role="Student at Delhi Technological University"
          />
        </SwiperSlide>
        <SwiperSlide className="p-10">
          <TestimonialCard
            quote="These experiences pushed me out of my comfort zone, fostered creativity, and allowed me to build meaningful connections within the IT community."
            image="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/jasleen.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9qYXNsZWVuLmpwZyIsImlhdCI6MTc0MzU5NDUwMCwiZXhwIjoyMDU4OTU0NTAwfQ.v9ExWmMIvi1gomDCR6Dn65VGC545TYfGLQiwvUA7B-Q"
            name="Jasleen Kaur"
            role="Student at Guru Nanak Dev University"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
