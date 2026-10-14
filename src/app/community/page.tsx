import type { Metadata } from "next";
import { CommunityPillars } from "@/components/community/CommunityPillars";
import { FeatureSplit } from "@/components/community/FeatureSplit";
import { MentorBanner } from "@/components/home/MentorBanner";
import { PageHero } from "@/components/ui/PageHero";
import { communityPage } from "@/data/community";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Weekly Saturday masterclasses, jobs and hackathons near your campus, and an open expert hour every quarter. No pass needed to take a seat.",
};

export default function CommunityPage() {
  const { hero, pillars, features, banner } = communityPage;

  return (
    <>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        background={hero.background}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        subtitleSize="base"
        subtitleWidth="max-w-[35rem]"
        contentOffset="md:pt-[6.25rem]"
      />
      <CommunityPillars pillars={pillars} />
      <FeatureSplit features={features} />
      <MentorBanner title={banner.title} primaryCta={banner.primaryCta} secondaryCta={banner.secondaryCta} />
    </>
  );
}
