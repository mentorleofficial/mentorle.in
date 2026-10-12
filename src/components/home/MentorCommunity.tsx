import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MentorCard } from "@/components/home/MentorCard";
import { featuredMentors } from "@/data/home";

export function MentorCommunity() {
  return (
    <section aria-labelledby="community-title" className="bg-surface py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader
          id="community-title"
          eyebrow="Mentorle Community"
          title="The rooms you want to be in"
          description="No generic advice. Just real, actionable insights from professionals who have already navigated your path."
          action={
            <ButtonLink href="/mentors" variant="brand">
              Find Your Mentor
            </ButtonLink>
          }
        />
        <div data-animate="stagger" className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {featuredMentors.map((mentor) => (
            <div key={mentor.name} className="relative">
              <MentorCard mentor={mentor} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
