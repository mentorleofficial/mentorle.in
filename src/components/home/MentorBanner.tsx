import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { mentorBanner } from "@/data/home";
import { BECOME_A_MENTOR_PATH } from "@/data/site";

type BannerCta = { label: string; href: string; external?: boolean };

type MentorBannerProps = {
  title?: string;
  primaryCta?: BannerCta;
  secondaryCta?: BannerCta;
};

export function MentorBanner({
  title = mentorBanner.title,
  primaryCta = { label: "Become a Mentor", href: BECOME_A_MENTOR_PATH },
  secondaryCta = mentorBanner.secondaryCta,
}: MentorBannerProps) {
  return (
    <section
      aria-labelledby="mentor-banner-title"
      className="relative isolate flex min-h-[26.25rem] items-center overflow-hidden md:min-h-[34.6875rem]"
    >
      <div className="absolute inset-x-0 -top-[15%] -bottom-[15%] -z-10" data-parallax="10">
        <Image src={mentorBanner.image.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/25" aria-hidden />
      <div data-animate="stagger" className="container-page pb-6 text-center text-white">
        <h2
          id="mentor-banner-title"
          className="mx-auto max-w-[43.75rem] text-[2.125rem] leading-[1.2] font-medium tracking-[-0.01em] md:text-5xl"
        >
          {title}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-[2.125rem]">
          <ButtonLink href={primaryCta.href} external={primaryCta.external} variant="ghost">
            {primaryCta.label}
          </ButtonLink>
          <ButtonLink href={secondaryCta.href} external={secondaryCta.external} variant="light">
            {secondaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
