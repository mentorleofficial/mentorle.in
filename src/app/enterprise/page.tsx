import type { Metadata } from "next";
import { EnterpriseOffers } from "@/components/enterprise/EnterpriseOffers";
import { PageHero } from "@/components/ui/PageHero";
import { enterprisePage } from "@/data/enterprise";

export const metadata: Metadata = {
  title: "For Universities & Enterprise",
  description:
    "Campus summits, white-label alumni mentoring, employee upskilling and mentor-directory API integrations for universities and companies.",
};

export default function EnterprisePage() {
  const { hero, audiences, contactCta } = enterprisePage;

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
      <EnterpriseOffers audiences={audiences} contactCta={contactCta} />
    </>
  );
}
