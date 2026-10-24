import type { Metadata } from "next";
import { OpportunityFeed } from "@/components/events/OpportunityFeed";
import { ProPassPartner } from "@/components/events/ProPassPartner";
import { GatheringsCarousel } from "@/components/home/GatheringsCarousel";
import { MentorBanner } from "@/components/home/MentorBanner";
import { IconCardSection } from "@/components/ui/IconCardSection";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { eventsPage, opportunities, opportunityCta, opportunityFilters } from "@/data/events";
import { getGatherings } from "@/lib/events/queries";

export const metadata: Metadata = {
  title: "Events & Summits",
  description:
    "Mentorle's own leadership dinners, campus summits and pitch circles, plus a curated feed of hackathons, meetups, jobs and freelance gigs.",
};

// Hosted events come from the platform (cached, so still part of the prerendered page).
export default async function EventsPage() {
  const { hero, hosted, opportunities: feed, howItWorks, banner } = eventsPage;
  const gatherings = await getGatherings();

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

      <section aria-labelledby="hosted-title" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
        <div className="container-page">
          <SectionHeader id="hosted-title" eyebrow={hosted.eyebrow} title={hosted.title} description={hosted.description} />
        </div>
        {gatherings.length > 0 && (
          <div data-animate="rise" className="mt-12 md:mt-16">
            <GatheringsCarousel events={gatherings} />
          </div>
        )}
      </section>

      <section id="opportunities" aria-labelledby="opportunities-title" className="bg-surface py-16 md:py-24 lg:py-[8.125rem]">
        <div className="container-page">
          <SectionHeader id="opportunities-title" eyebrow={feed.eyebrow} title={feed.title} description={feed.description} />
          <OpportunityFeed
            opportunities={opportunities}
            filters={opportunityFilters}
            ctaLabels={opportunityCta}
            searchPlaceholder={feed.searchPlaceholder}
            emptyState={feed.emptyState}
          />
        </div>
      </section>

      <ProPassPartner />
      <IconCardSection
        id="events-how-title"
        background="surface"
        columns={3}
        cardHeight="lg:min-h-[15.125rem]"
        headerAside="narrow"
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        description={howItWorks.description}
        cards={howItWorks.cards}
      />
      <MentorBanner title={banner.title} primaryCta={banner.primaryCta} secondaryCta={banner.secondaryCta} />
    </>
  );
}
