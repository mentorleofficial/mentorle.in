import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { mentorBanner } from "@/data/home";
import { BECOME_A_MENTOR_URL } from "@/data/site";

export function MentorBanner() {
  return (
    <section
      aria-labelledby="mentor-banner-title"
      className="relative isolate flex min-h-[26.25rem] items-center overflow-hidden md:min-h-[34.6875rem]"
    >
      <div className="absolute inset-x-0 -top-[15%] -bottom-[15%] -z-10" data-parallax="10">
        {/* The exported PNG has the headline and buttons baked in; heavy blur hides them until a clean background is supplied. */}
        <Image src={mentorBanner.image.src} alt="" fill sizes="100vw" className="scale-125 object-cover blur-2xl" />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/25" aria-hidden />
      <div data-animate="stagger" className="container-page pb-6 text-center text-white">
        <h2
          id="mentor-banner-title"
          className="mx-auto max-w-[43.75rem] text-[2.125rem] leading-[1.2] font-medium tracking-[-0.01em] md:text-5xl"
        >
          {mentorBanner.title}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-[2.125rem]">
          <ButtonLink href={BECOME_A_MENTOR_URL} external variant="ghost">
            Become a Mentor
          </ButtonLink>
          <ButtonLink href={mentorBanner.secondaryCta.href} variant="light">
            {mentorBanner.secondaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
