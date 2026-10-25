import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GatheringsCarousel } from "@/components/home/GatheringsCarousel";
import { getGatherings } from "@/lib/events/queries";

export async function LiveGatherings() {
  const gatherings = await getGatherings();
  return (
    <section aria-labelledby="gatherings-title" className="bg-dots py-[3.6rem] md:py-[5.4rem] lg:pt-[7.3125rem] lg:pb-[6.58125rem]">
      <div className="container-page">
        <SectionHeader
          id="gatherings-title"
          eyebrow="Live Gatherings"
          title="Events That Brings People Together"
          description="Explore Mentorle's workshops, universities events and builder meetups."
        />
      </div>
      {gatherings.length > 0 && (
        <div data-animate="rise" className="mt-12 md:mt-20 lg:mt-[6.25rem]">
          <GatheringsCarousel events={gatherings} />
        </div>
      )}
      <div data-animate="fade-up" className="mt-12 flex justify-center md:mt-16">
        <ButtonLink href="/events" variant="brand">
          See All Events &amp; Opportunities
        </ButtonLink>
      </div>
    </section>
  );
}
