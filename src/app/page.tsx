import { Suspense } from "react";
import { AboutStats } from "@/components/home/AboutStats";
import { CareerComparison } from "@/components/home/CareerComparison";
import { Hero } from "@/components/home/Hero";
import { HomeFaq } from "@/components/home/HomeFaq";
import { LifeAtMentorle } from "@/components/home/LifeAtMentorle";
import { LiveGatherings } from "@/components/home/LiveGatherings";
import { MentorBanner } from "@/components/home/MentorBanner";
import { MentorCommunity } from "@/components/home/MentorCommunity";
import { MentorStories } from "@/components/home/MentorStories";
import { PartnerStrip } from "@/components/home/PartnerStrip";
import { PlansFallback } from "@/components/pricing/PlansFallback";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { IconCardSection } from "@/components/ui/IconCardSection";
import { helpWith, homePlans } from "@/data/home";

const homePlansPadding = "pt-[3.6rem] pb-[3.6rem] md:py-[5.4rem] lg:pt-[7.65rem] lg:pb-[7.3125rem]";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnerStrip />
      <AboutStats />
      <LiveGatherings />
      {/* Continues Live Gatherings' dotted section, so no top padding (its bottom padding is the gap). */}
      <IconCardSection
        id="help-title"
        background="dots"
        columns={3}
        cardHeight="lg:min-h-[16.5rem]"
        padding="pb-[3.6rem] md:pb-[5.4rem] lg:pb-[7.3125rem]"
        headerAside="wide"
        eyebrow={helpWith.eyebrow}
        title={helpWith.title}
        description={helpWith.description}
        cards={helpWith.cards}
        ctaTile={helpWith.ctaTile}
        action={
          <ButtonLink href={helpWith.action.href} variant="brand">
            {helpWith.action.label}
          </ButtonLink>
        }
      />
      <MentorCommunity />
      <MentorStories />
      <MentorBanner />
      <CareerComparison />
      <Suspense fallback={<PlansFallback background="surface" className={homePlansPadding} />}>
        <PricingPlans header={homePlans} background="surface" className={homePlansPadding} />
      </Suspense>
      <LifeAtMentorle />
      <HomeFaq />
    </>
  );
}
