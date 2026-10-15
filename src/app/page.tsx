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
import { homePlans } from "@/data/home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnerStrip />
      <AboutStats />
      <LiveGatherings />
      <MentorCommunity />
      <MentorStories />
      <MentorBanner />
      <CareerComparison />
      <HowItWorks />
      <LifeAtMentorle />
      <PricingPlans header={homePlans} className="pb-16 md:pb-24 lg:pb-[8.125rem]" />
      <PlusBenefits />
      <SuccessStories />
    </>
  );
}
