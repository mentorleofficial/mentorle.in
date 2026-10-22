import type { Metadata } from "next";
import { MentorFaq } from "@/components/become-a-mentor/MentorFaq";
import { TierGrid } from "@/components/become-a-mentor/TierGrid";
import { WaysToMentor } from "@/components/become-a-mentor/WaysToMentor";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MentorBanner } from "@/components/home/MentorBanner";
import { IconCardSection } from "@/components/ui/IconCardSection";
import { PageHero } from "@/components/ui/PageHero";
import { becomeAMentorPage } from "@/data/become-a-mentor";

export const metadata: Metadata = {
  title: "Become a Mentor",
  description:
    "Share what you know and help someone move forward. Mentor on your terms with voice-note reviews, short calls or deep dives, and see how mentor tiers work.",
};

export default function BecomeAMentorPage() {
  const { hero, why, recognition, expectations, application, banner } = becomeAMentorPage;

  return (
    <>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        background={hero.background}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        subtitleSize="base"
        subtitleWidth="max-w-[31.25rem]"
        contentOffset="md:pt-[3.75rem]"
      />
      <IconCardSection id="why-title" background="dots" columns={3} cardHeight="lg:min-h-[16.5rem]" {...why} />
      <HowItWorks steps={recognition} ariaLabel="Mentor recognition and privacy" />
      <WaysToMentor />
      <TierGrid />
      <IconCardSection id="expectations-title" background="ink" columns={4} cardHeight="lg:min-h-[22.1875rem]" {...expectations} />
      {/* Target of the hero's "See how it works". */}
      <div id="application" className="scroll-mt-4">
        <IconCardSection id="application-title" background="surface" columns={3} cardHeight="lg:min-h-[16.5rem]" {...application} />
      </div>
      <MentorBanner title={banner.title} primaryCta={banner.primaryCta} secondaryCta={banner.secondaryCta} />
      <MentorFaq />
    </>
  );
}
