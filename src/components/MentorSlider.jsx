"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Link from "next/link";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function CompanyLogo({ logoUrl, fallbackUrl, alt }) {
  const [src, setSrc] = useState(logoUrl || fallbackUrl || null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(logoUrl || fallbackUrl || null);
    setFailed(false);
  }, [logoUrl, fallbackUrl]);

  if (!src || failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      className="w-[37px] h-[37px] md:w-[50px] md:h-[50px] rounded-md object-contain bg-white"
      onError={() => {
        if (logoUrl && src === logoUrl && fallbackUrl) {
          setSrc(fallbackUrl);
          return;
        }
        setFailed(true);
      }}
    />
  );
}

function MentorCardContent({ mentor }) {
  const [imgFailed, setImgFailed] = useState(false);
  const designation =
    mentor.designation || mentor.current_role || mentor.headline || "Mentor";
  const profileHref = `/mentor/${mentor.slug || mentor.user_id}`;

  return (
    <Link
      href={profileHref}
      className="relative w-full flex flex-col items-center h-full justify-between"
    >
      <div className="flex flex-col items-center">
        {mentor.profilePicUrl && !imgFailed ? (
          <img
            src={mentor.profilePicUrl}
            alt={mentor.name || "Mentor"}
            className="w-[120px] h-[120px] object-cover rounded-full border-4 border-white shadow-lg"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
            {getInitials(mentor.name)}
          </div>
        )}

        <h3 className="mt-5 text-md md:text-lg font-semibold text-gray-900 text-center">
          {mentor.name || "Mentor"}
        </h3>

        <p className="text-sm md:text-base h-[50px] text-gray-600 text-center max-w-[280px] leading-relaxed line-clamp-2 mt-2">
          {designation}
          {mentor.current_organization
            ? ` at ${mentor.current_organization}`
            : ""}
        </p>
      </div>

      <div className="flex flex-col items-center mt-8 min-h-[50px] justify-center">
        <CompanyLogo
          logoUrl={mentor.companyLogoUrl}
          fallbackUrl={mentor.companyLogoFallbackUrl}
          alt={mentor.current_organization || mentor.name || "Company"}
        />
      </div>
    </Link>
  );
}

export default function MentorSlider() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/mentors");
        if (!response.ok) {
          setMentors([]);
          return;
        }
        const payload = await response.json();
        const list = (payload.data || []).filter(
          (mentor) =>
            mentor?.company_url &&
            String(mentor.company_url).trim() !== "" &&
            mentor?.profilePicUrl &&
            String(mentor.profilePicUrl).trim() !== ""
        );
        setMentors(list);
      } catch (error) {
        console.warn("Mentor slider unavailable:", error?.message || error);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <>
        <div className="h-[2px] bg-[#0000003a] w-[90%] mx-auto" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center mb-10 tracking-tight my-10">
          Connect with Experts from the World&apos;s Top Companies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-10">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-[320px] rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
        <div className="h-[2px] bg-[#0000003a] w-[90%] mx-auto mb-20 mt-20" />
      </>
    );
  }

  if (!mentors.length) return null;

  return (
    <>
      <div className="h-[2px] bg-[#0000003a] w-[90%] mx-auto" />
      <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center mb-10 tracking-tight my-10">
        Connect with Experts from the World&apos;s Top Companies
      </h2>
      <Swiper
        slidesPerView={1.2}
        spaceBetween={30}
        breakpoints={{
          600: { slidesPerView: 2, spaceBetween: 25 },
          750: { slidesPerView: 3, spaceBetween: 30 },
          1000: { slidesPerView: 4, spaceBetween: 35 },
          1350: { slidesPerView: 5, spaceBetween: 40 },
        }}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={2500}
        loop={mentors.length > 4}
        modules={[Autoplay]}
        className="mySwiper text-black px-2 py-10 overflow-visible"
      >
        {mentors.map((mentor) => (
          <SwiperSlide
            key={mentor.user_id || mentor.profile_id}
            className="mentorcard bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0px_15px_35px_rgba(0,0,0,0.3)] flex flex-col items-center w-[280px] h-[380px] min-h-[380px] overflow-visible mt-6 mb-6"
          >
            <MentorCardContent mentor={mentor} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="h-[2px] bg-[#0000003a] w-[90%] mx-auto mb-20 mt-20" />
    </>
  );
}
