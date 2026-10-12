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
      <PlusBenefits />
      <SuccessStories />
    </>
  );
}
