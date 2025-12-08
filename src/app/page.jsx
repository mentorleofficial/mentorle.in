"use client";
import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import Button from "@/components/Button";
import MentorSlider from "@/components/MentorSlider";
import InstructorsSection from "@/components/InstructorsSection";
import OnlineCommunity from "@/components/online_community";

// import Community from "@/sections/Community";
import TestimonialSlider from "@/sections/testimonials";
import TestimonialsSection from "@/components/TestimonialNew";
import FAQ from "@/sections/FAQ";

import { label1, label2 } from "./constant";
import FGLIPage from "@/components/FgliPage";
import { Car } from "lucide-react";
// import CompanyMarquee from "@/components/CompanyMarquee";
import { px } from "framer-motion";
// import { CareerPathway } from "@/components/CareerPathway";

export default function Home() {
  const [opened, setOpened] = useState(0);

  return (
    <>
      <main>
        <section className="mt-20 lg:mt-18 px-10 sm:px-24 flex justify-around items-center mb-20">
          <div className="lg:w-[45%]">
            <h1 className="text-black text-2xl font-extrabold sm:text-3xl lg:text-5xl text-center lg:text-left ">
              Unlock Your Potential with Verified Mentors in IT & Electronics
            </h1>
            <p className="text-base font-normal sm:text-lg lg:text-xl text-black mt-4 mb-5 text-center lg:text-left">
              Connect with verified expert mentors who have real-world
              experience in IT, AI, cybersecurity, cloud computing, and more. We
              match you with mentors tailored to your specific goals, ensuring
              personalized guidance to help you succeed.
            </p>
            {/* <div className="text-black bg-[#5c5c5c29] w-fit rounded-full mt-5 ">
              <input type="text" placeholder="Enter your email" className="w-[380px] px-5 py-3 bg-transparent outline-none" />
              <Button text="JOIN OUR CLUB" />
            </div> */}
            <a
              href="/signup"
              className="flex justify-center lg:block"
            >
              <Button text="Join Mentorle Now" />
            </a>
          </div>
          <div className="hidden lg:block ">
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/hero_no.1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9oZXJvX25vLjEucG5nIiwiaWF0IjoxNzQzNjI4MTI5LCJleHAiOjIwNTg5ODgxMjl9.UzjWC9D1sNE7FBZ0IEy70kkt_lXvRBMz8K7h-okIZY8"
              alt="Hero Image"
              width={700}
              height={700}
              className="w-[550px] -mt-16"
            />
          </div>
        </section>

        <MentorSlider />
        <InstructorsSection />

        {/* <CompanyMarquee /> */}

        {/* <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pb-24">
          <div className="relative w-full h-full max-w-6xl max-h-[85vh] rounded-lg shadow-2xl overflow-hidden">
            <video
              src="/video2.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            ></video>
          </div>
        </section> */}
        <section className="relative w-full flex items-center justify-center overflow-hidden px-4">
          <div className="relative w-full max-w-7xl aspect-video rounded-lg shadow-2xl overflow-hidden mx-auto">
            <video
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/video2.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS92aWRlbzIubXA0IiwiaWF0IjoxNzQzNTk0OTYyLCJleHAiOjIwNTg5NTQ5NjJ9.Bjx6CEItBY2zwaQvFfXp3OWH8cZ3QRoWFcHSMn96EdM"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="my-16">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-center">
            Supported & Backed By
          </h2>
          <div className="flex flex-wrap pb-5 items-center gap-10 lg:gap-14 justify-center mt-5">
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/awsactivate.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hd3NhY3RpdmF0ZS5wbmciLCJpYXQiOjE3NDM1OTQ5OTIsImV4cCI6MjA1ODk1NDk5Mn0.yyXM0qTLVB8pkfFV1Qj4RRKHNas3Qy15ZhXe9_FIzI8"
              alt="AWS"
              width={200}
              height={200}
              className="w-[140px] sm:w-[190px] md:w-[200px] h-fit"
            />
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/microsoftstartups.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9taWNyb3NvZnRzdGFydHVwcy5qcGciLCJpYXQiOjE3NDM1OTUwMzIsImV4cCI6MjA1ODk1NTAzMn0.qRrh0rJbV_CCe0wOZE3-cP4zbnE6mbph78g2DmzA1Ik"
              alt="Microsoft Startups"
              width={200}
              height={200}
              className="w-[140px] sm:w-[190px] md:w-[200px] h-fit"
            />
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/startupindia.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zdGFydHVwaW5kaWEucG5nIiwiaWF0IjoxNzQzNTk1MDYyLCJleHAiOjIwNTg5NTUwNjJ9.u1FN2pHBtQ6Pa3eR_54YD3TxSL6c5ci_jjiQ118VAUc"
              alt="Startup India"
              width={200}
              height={200}
              className="w-[140px] sm:w-[190px] md:w-[200px] h-fit"
            />
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/nasscom.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9uYXNzY29tLmpwZyIsImlhdCI6MTc0MzU5NTA5MiwiZXhwIjoyMDU4OTU1MDkyfQ.2N4CQkxbXp7S8yFipY1NlNw4nERnqSX3Eeu329BtaeI"
              alt="Nasscom"
              width={200}
              height={200}
              className="w-[140px] sm:w-[190px] md:w-[200px] h-fit"
            />
          </div>
        </section>

        <section className="md:w-[90%] md:rounded-[30px] bg-[#eeeeee] mx-auto p-10 flex gap-10 items-center text-black">
          <div className="w-[500px] h-[400px] flex-shrink-0 hidden lg:block">
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/emp4.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9lbXA0LnBuZyIsImlhdCI6MTc0MzYyNzAzMSwiZXhwIjoyMDU4OTg3MDMxfQ.Hv5Vdx6QCNMwd36daj0Z-x2ZsjJCFovOPOIV7NvnztI"
              alt=""
              width={200}
              height={200}
              className="w-[500px] h-[400px] rounded-[30px] object-contain border-[2px] border-black border-solid "
            />
          </div>
          <div>
            <h2 className="text-2xl lg:text-4xl text-black font-semibold">
              Empower Your Career Journey in IT & Electronics with Mentorle
            </h2>
            <p className="text-base lg:text-lg text-black">
              Mentorle is a personalized mentorship platform designed to bridge
              the education-industry gap for IT and Electronics students in Tier
              2 and Tier 3 cities by providing verified mentors, AI-powered
              matching, and flexible learning formats.
            </p>
            <div className="w-full p-3 lg:pr-16 rounded-[30px] bg-[#fbfbfb] flex gap-5 items-center mt-5">
              <Image
                src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/oneone.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9vbmVvbmUucG5nIiwiaWF0IjoxNzQzNTk1MTY2LCJleHAiOjIwNTg5NTUxNjZ9.GS7Osw39BrAevu-OAO0BjR8cBmXpmY7syHqUIQHDyKQ"
                alt="Chat Icon"
                width={200}
                height={200}
                className="w-[80px] "
              />
              <p className="text-black opacity-90 text-sm sm:text-lg">
                Get one-on-one mentoring and guidance from our experienced
                mentors in the field of IT And Electronic.
              </p>
            </div>
            <div className="w-full p-3 lg:pr-16 rounded-[30px] bg-[#fbfbfb] flex gap-5 items-center mt-5">
              <Image
                src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/roadmap.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yb2FkbWFwLnBuZyIsImlhdCI6MTc0MzU5NTE5NywiZXhwIjoyMDU4OTU1MTk3fQ.tVSm2e1at9elfjwJOa7Lf38DW3ooaZubrcYFTGztzbs"
                alt="Chat Icon"
                width={200}
                height={200}
                className="w-[80px] "
              />
              <p className="text-black opacity-90 text-sm sm:text-lg">
                Students are provided with clear, actionable roadmaps to success
                in the IT And Electronic industry. These roadmaps are designed
                by mentors based on their own experiences and industry best
                practices.
              </p>
            </div>
            <div className="w-full p-3 lg:pr-16 rounded-[30px] bg-[#fbfbfb] flex gap-5 items-center mt-5">
              <Image
                src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/communityicon.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jb21tdW5pdHlpY29uLnBuZyIsImlhdCI6MTc0MzU5NTIzMywiZXhwIjoyMDU4OTU1MjMzfQ.CIcCweJcbOxWmhv88NW4X-ME0fAjDWXvXdKTpZMfbrg"
                width={200}
                height={200}
                alt="Chat Icon"
                className="w-[80px] "
              />
              <p className="text-black opacity-90 text-sm sm:text-lg">
                Community Access over 1k+ Members.
              </p>
            </div>

            <div className="mt-5 flex gap-5 items-center">
              <a href="/mentor">
                <Button text="Find your mentor" />
              </a>
            </div>
          </div>
        </section>

        <OnlineCommunity />

        {/* <section className="text-white communitysection relative overflow-hidden my-10 sm:mt-20 sm:mb-20 py-10 flex flex-col justify-center">
          <Image
            src="/community2.jpg"
            width={200}
            height={200}
            alt="Community"
            className="w-full h-full absolute object-cover"
          />
          <div className="bg-[#000000a6] w-full h-full absolute" />
          <div className="flex flex-col gap-3 w-[70%] mx-auto py-10 z-10">
            <h2 className="text-lg sm:text-xl lg:text-3xl font-bold">
              WELCOME TO{" "}
              <span className="inline relative text-black px-2 text-center font-bold min-w-fit sm:w-auto whitespace-nowrap">
                <span className="bg-white rounded-lg absolute w-full h-full -rotate-2 -z-10 left-0" />
                MENTORLE
              </span>
            </h2>
            <div className="text-[20px] sm:text-2xl lg:text-4xl inline-block">
              We have more than a{" "}
              <span className="relative w-fit text-black px-2 py-1 text-center font-bold min-w-fit sm:w-auto whitespace-nowrap">
                <span className="bg-white rounded-lg absolute w-full h-full -rotate-1 sm:-rotate-2 -z-10 left-0 " />
                1000+ members
              </span>{" "}
              from all around the world who can learn, code, interact together.
              Also we have our exclusive mentors network allows mentees to
              interact and get support.
            </div>
            <div className="flex mt-2">
              <Link href="https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH">
                <Button text="Join our community now" />
              </Link>
            </div>
          </div>
        </section> */}

        <section className="md:w-[90%] md:rounded-[30px] bg-[#eeeeee] mx-auto p-10 flex gap-16 items-center text-black">
          <div>
            <h2 className="text-3xl lg:text-5xl text-black font-semibold">
              {label1}
            </h2>
            <p className="text-base lg:text-lg text-black mt-2">{label2}</p>

            <div className="mt-3 flex gap-5 items-center object-cover">
              <a href="/become-mentor">
                <Button text="Become a mentor" />
              </a>
            </div>
          </div>
          <div className="w-[40%] flex-shrink-0 hidden lg:block">
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/emp1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9lbXAxLnBuZyIsImlhdCI6MTc0MzYyNTIzMiwiZXhwIjoyMDU4OTg1MjMyfQ.MBnpm0Eyzw58EEkBBgfrJZ6CpHYYse0WVROzwFDuqUo"
              alt=""
              width={200}
              height={200}
              className="w-[440px]"
            />
          </div>
        </section>

        <FGLIPage />

        {/* <div className="w-[85%] mx-auto mt-2 sm:mt-00 sm:mb-20">
          <TestimonialSlider />
        </div> */}
        <TestimonialsSection />

        {/* <CareerPathway /> */}

        <section className=" flex flex-col lg:flex-row gap-5 lg:gap-20 justify-center mt-20 mb-20 px-8 md:px-24 text-black ">
          <FAQ />
        </section>
      </main>
    </>
  );
}
