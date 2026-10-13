import type { Metadata } from "next";
import { PlusBenefits } from "@/components/home/PlusBenefits";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { PageHero } from "@/components/ui/PageHero";
import { pricingPage } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Mentorle Plus — Pricing",
  description:
    "Compare Mentorle plans: the free community tier, the ₹2,500/year Pro Pass and the ₹5,999/year All-Access pass with live 1:1 mock tokens.",
};

export default function PricingPage() {
  const { hero, benefits } = pricingPage;

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
      <PricingPlans />
      <PlusBenefits eyebrow={benefits.eyebrow} title={benefits.title} description={benefits.description} action={null} />
    </>
  );
}
