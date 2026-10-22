import { AboutStats } from "@/components/home/AboutStats";
import { CareerComparison } from "@/components/home/CareerComparison";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LifeAtMentorle } from "@/components/home/LifeAtMentorle";
import { LiveGatherings } from "@/components/home/LiveGatherings";
import { MentorBanner } from "@/components/home/MentorBanner";
import { MentorCommunity } from "@/components/home/MentorCommunity";
import { MentorStories } from "@/components/home/MentorStories";
import { PartnerStrip } from "@/components/home/PartnerStrip";
import { PlusBenefits } from "@/components/home/PlusBenefits";
import { SuccessStories } from "@/components/home/SuccessStories";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { IconCardSection } from "@/components/ui/IconCardSection";
import { helpWith, homePlans } from "@/data/home";

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
        padding="pb-16 md:pb-24 lg:pb-[8.125rem]"
        headerAside="wide"
        eyebrow={helpWith.eyebrow}
        title={helpWith.title}
        description={helpWith.description}
        cards={helpWith.cards}
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
      <PricingPlans header={homePlans} background="surface" />
      <HowItWorks />
      <LifeAtMentorle />
      <PlusBenefits />
      <SuccessStories />
    </>
  );
}
