import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GatheringsCarousel } from "@/components/home/GatheringsCarousel";
import { gatherings } from "@/data/home";

export function LiveGatherings() {
  return (
    <section aria-labelledby="gatherings-title" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader
          id="gatherings-title"
          eyebrow="Live Gatherings"
          title="Upcoming Events & Summits"
          description="Connect online and offline through leadership dinners, tech sprints, and university bootcamps designed to inspire learning and meaningful connections."
        />
      </div>
      <div data-animate="rise" className="mt-12 md:mt-20 lg:mt-[6.25rem]">
        <GatheringsCarousel events={gatherings} />
      </div>
      <div data-animate="fade-up" className="mt-12 flex justify-center md:mt-16">
        <ButtonLink href="/events" variant="brand">
          See All Events &amp; Opportunities
        </ButtonLink>
      </div>
    </section>
  );
}
