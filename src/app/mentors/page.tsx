import type { Metadata } from "next";
import { MentorDirectory } from "@/components/mentors/MentorDirectory";
import { PageHero } from "@/components/ui/PageHero";
import { SESSION_TYPES, mentorDirectoryPage } from "@/data/mentors";
import { getPublicMentors } from "@/lib/mentors/queries";

export const metadata: Metadata = {
  title: "Find a Mentor",
  description:
    "Browse vetted mentors across IT & software, startups and academics. Get real, actionable insights from professionals who have already navigated your path.",
};

// The mentor list is cached ("use cache" in getPublicMentors), so it's part of the prerendered page.
export default async function FindAMentorPage() {
  const mentors = await getPublicMentors();
  // Only offer session types that at least one mentor has published.
  const sessionTypes = SESSION_TYPES.filter((type) => mentors.some((mentor) => mentor.sessionTypes.includes(type)));
  const { hero } = mentorDirectoryPage;

  return (
    <>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        background={hero.background}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
      />
      <section id="directory" aria-label="Mentor directory" className="bg-surface py-16 md:py-24 lg:py-[8.125rem]">
        <div className="container-page">
          <MentorDirectory
            mentors={mentors}
            sessionTypes={sessionTypes}
            labels={mentorDirectoryPage.filters}
            searchPlaceholder={mentorDirectoryPage.searchPlaceholder}
            emptyState={mentorDirectoryPage.emptyState}
          />
        </div>
      </section>
    </>
  );
}
