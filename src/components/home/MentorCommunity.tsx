import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MentorCard } from "@/components/mentors/MentorCard";
import { getFeaturedMentors } from "@/lib/mentors/queries";

export async function MentorCommunity() {
  const featuredMentors = await getFeaturedMentors();
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
        {/* Only the mentors an admin featured; with none picked the section keeps its header and button. */}
        {featuredMentors.length > 0 && (
          <div data-animate="stagger" className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
            {featuredMentors.map((mentor) => (
              <MentorCard key={mentor.slug} mentor={mentor} href={`/mentors/${mentor.slug}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
