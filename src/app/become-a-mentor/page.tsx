import type { Metadata } from "next";
import { DiscountExplainer } from "@/components/become-a-mentor/DiscountExplainer";
import { EarningsTable } from "@/components/become-a-mentor/EarningsTable";
import { IconCardSection } from "@/components/ui/IconCardSection";
import { RankingWeights } from "@/components/become-a-mentor/RankingWeights";
import { RateCalculator } from "@/components/become-a-mentor/RateCalculator";
import { TeardownFlow } from "@/components/become-a-mentor/TeardownFlow";
import { TierGrid } from "@/components/become-a-mentor/TierGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MentorBanner } from "@/components/home/MentorBanner";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { becomeAMentorPage } from "@/data/become-a-mentor";

export const metadata: Metadata = {
  title: "Become a Mentor",
  description:
    "Name your hourly take-home and keep all of it. See what you would earn per session, how payouts work, and how mentor tiers and directory ranking are decided.",
};

export default function BecomeAMentorPage() {
  const { hero, calculator, payments, recognition, expectations, application, banner } = becomeAMentorPage;

  return (
    <>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        background={hero.background}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        subtitleSize="base"
        contentOffset="md:pt-[3.75rem]"
      />

      <section aria-label="Mentor earnings" className="bg-dots pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-20 lg:pb-[8.125rem]">
        <div className="container-page">
          <DiscountExplainer />
          <EarningsTable />
        </div>
      </section>

      <section id="calculator" aria-labelledby="calculator-title" className="scroll-mt-4 bg-surface py-16 md:py-24 lg:py-[8.125rem]">
        <div className="container-page">
          <SectionHeader id="calculator-title" eyebrow={calculator.eyebrow} title={calculator.title} description={calculator.description} />
          <div data-animate="fade-up" className="mt-12 md:mt-16">
            <RateCalculator config={calculator} />
          </div>
          <div className="mt-8 flex justify-center">
            <ButtonLink href={calculator.cta.href} external={calculator.cta.external} variant="brand">
              {calculator.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <TeardownFlow />

      <IconCardSection id="payments-title" background="surface" columns={4} cardHeight="lg:min-h-[20rem]" {...payments} />

      <TierGrid />

      <HowItWorks steps={recognition} ariaLabel="Mentor recognition and privacy" />

      <RankingWeights />

      <IconCardSection id="expectations-title" background="ink" columns={4} cardHeight="lg:min-h-[22.1875rem]" {...expectations} />

      <IconCardSection id="application-title" background="surface" columns={3} cardHeight="lg:min-h-[16.5rem]" {...application} />

      <MentorBanner
        title={banner.title}
        primaryCta={banner.primaryCta}
        secondaryCta={banner.secondaryCta}
      />
    </>
  );
}
