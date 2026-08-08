"use client";
import Link from "next/link";
import Image from "next/image";

import dynamic from "next/dynamic";
import Button from "@/components/Button";
import AchievementPopup from "@/components/AchievementPopup";
import { PLATFORM_URL, PLATFORM_BECOME_MENTOR_URL } from "@/lib/platform";

const MentorSlider = dynamic(() => import("@/components/MentorSlider"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded" />,
});
const InstructorsSection = dynamic(() => import("@/components/InstructorsSection"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded" />,
});
const TestimonialsSection = dynamic(() => import("@/components/TestimonialNew"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded" />,
});
const FAQ = dynamic(() => import("@/sections/FAQ"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded" />,
});
const FGLIPage = dynamic(() => import("@/components/FgliPage"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded" />,
});
const LifeAtMentorleMarquee = dynamic(
  () => import("@/components/LifeAtMentorleMarquee"),
  {
    loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded my-10" />,
  }
);
const PricingSection = dynamic(() => import("@/components/PricingSection"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded my-10" />,
});

import { label1, label2 } from "./constant";

const TRUSTED_UNIVERSITIES = [
  { name: "CGC University", src: "/CGC.webp" },
  { name: "GNDU", src: "/GNDU.png" },
  { name: "CT University", src: "/CT.png" },
  { name: "IKGPTU", src: "/IKGPTU.png" },
];

const LIFE_HIGHLIGHTS = [
  "Student clubs",
  "Founder talks",
  "Hands-on projects",
];

export default function Home() {
  return (
    <>
      <main>
        <AchievementPopup />
        <section className="mt-20 lg:mt-18 px-4 sm:px-6 md:px-10 lg:px-24 flex flex-col lg:flex-row justify-around items-center mb-12 sm:mb-20 gap-8 lg:gap-0">
          <div className="w-full lg:w-[45%]">
            <h1 className="text-black text-2xl font-extrabold sm:text-3xl lg:text-5xl text-center lg:text-left break-words">
            Learn from experts who build, not just talk.
            </h1>
            <p className="text-base font-normal sm:text-lg lg:text-xl text-black mt-4 mb-5 text-center lg:text-left break-words">
              Get mentored by people who have already done it at the world&apos;s best companies.
            </p>
            <a
              href={PLATFORM_URL}
              className="flex justify-center lg:block"
            >
              <Button text="Start exploring Mentorle" />
            </a>
          </div>
          <div className="hidden lg:block w-full lg:w-auto">
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/hero_no.1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9oZXJvX25vLjEucG5nIiwiaWF0IjoxNzQzNjI4MTI5LCJleHAiOjIwNTg5ODgxMjl9.UzjWC9D1sNE7FBZ0IEy70kkt_lXvRBMz8K7h-okIZY8"
              alt="Hero Image"
              width={700}
              height={700}
              className="w-full max-w-[550px] -mt-16"
            />
          </div>
        </section>

        {/* <section className="my-12 sm:my-16 px-4 md:px-10 lg:px-24 bg-gray-400 rounded-full p-10">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-center break-words">
            Trusted by
          </h2>
          <div className="flex flex-wrap pb-5 items-center  gap-6 sm:gap-8 md:gap-10 lg:gap-14 justify-evenly mx-auto mt-8 w-full">
            {TRUSTED_UNIVERSITIES.map((uni) => (
              <Image
                key={uni.name}
                src={uni.src}
                alt={uni.name}
                width={200}
                height={100}
                className="w-[80px] sm:w-[100px] md:w-[120px] h-auto object-contain"
              />
            ))}
          </div>
        </section> */}

        <MentorSlider />
        <InstructorsSection />

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

        <LifeAtMentorleMarquee />

        <section className="md:w-[90%] md:rounded-[30px] bg-[#eeeeee] mx-auto p-10 flex gap-16 items-center text-black mt-10">
          <div>
            <h2 className="text-3xl lg:text-5xl text-black font-semibold">
              {label1}
            </h2>
            <p className="text-base lg:text-lg text-black mt-2">{label2}</p>

            <div className="mt-3 flex gap-5 items-center object-cover">
              <a href={PLATFORM_BECOME_MENTOR_URL}>
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
        <TestimonialsSection />

        <PricingSection />

        <section className=" flex flex-col lg:flex-row gap-5 lg:gap-20 justify-center mt-20 mb-20 px-8 md:px-24 text-black ">
          <FAQ />
        </section>
      </main>
    </>
  );
}
