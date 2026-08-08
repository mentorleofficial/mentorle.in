"use client";

import Image from "next/image";

const LIFE_CARDS = [
  {
    title: "Build Over Buzzwords",
    description:
      "Skip the theory loops. Work with mentors who ship products, raise rounds, and solve real industry problems every week.",
    image: "/moments/moment-build.webp",
  },
  {
    title: "Campus Clubs That Ship",
    description:
      "From hackathons to founder circles — student clubs at Mentorle turn ideas into demos, portfolios, and launch-ready projects.",
    image: "/moments/moment-clubs.webp",
  },
  {
    title: "Founder Talks, Live",
    description:
      "Hear directly from builders who’ve done it — honest stories on startups, careers, and the messy middle of growth.",
    image: "/moments/moment-talks.webp",
  },
  {
    title: "Workshops That Stick",
    description:
      "Hands-on sessions on AI, cloud, product, and career skills — designed so you leave with something you can use tomorrow.",
    image: "/moments/moment-workshops.webp",
  },
  {
    title: "Mentors From Top Companies",
    description:
      "Learn from people who’ve already done it at the world’s best companies — practical guidance, not recycled playbooks.",
    image: "/moments/moment-mentors.webp",
  },
  {
    title: "Grow Together",
    description:
      "A community of students and mentors collaborating across campuses — solve real problems and launch real projects.",
    image: "/moments/moment-community.webp",
  },
];

function LifeCard({ title, description, image }) {
  return (
    <div className="flex-shrink-0 w-[340px] sm:w-[420px] md:w-[480px] flex items-stretch gap-4 rounded-3xl bg-white border border-gray-300 p-3 sm:p-4 text-white">
      <div className="relative w-[130px] sm:w-[160px] md:w-[180px] aspect-square flex-shrink-0 overflow-hidden rounded-2xl bg-gray-800">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="180px"
        />
      </div>
      <div className="flex flex-col justify-center py-1 pr-1 min-w-0">
        <span className="block w-8 h-[3px] bg-black mb-3 rounded-full" />
        <h3 className="text-base text-black sm:text-lg md:text-xl font-bold leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-4">
          {description}
        </p>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction = "left", duration = 40 }) {
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden w-full">
      <div
        className={`flex gap-4 w-max ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((card, index) => (
          <LifeCard key={`${card.title}-${index}`} {...card} />
        ))}
      </div>
    </div>
  );
}

export default function LifeAtMentorleMarquee() {
  const rowOne = LIFE_CARDS.slice(0, 3);
  const rowTwo = LIFE_CARDS.slice(3);

  return (
    <section className="w-full py-12 sm:py-16 bg-white overflow-hidden">
      <div className="px-4 sm:px-6 mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black">
          Moments from Mentorle
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Clubs, workshops, founder talks, and hands-on builds — a peek into how
          students and mentors grow together.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <MarqueeRow items={rowOne} direction="left" duration={45} />
        <MarqueeRow items={rowTwo} direction="right" duration={45} />
      </div>
    </section>
  );
}
