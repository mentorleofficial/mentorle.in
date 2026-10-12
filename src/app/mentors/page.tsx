import type { Metadata } from "next";
import { MentorDirectory } from "@/components/mentors/MentorDirectory";
import { PageHero } from "@/components/ui/PageHero";
import { domainFilters, mentorDirectoryPage, mentors } from "@/data/mentors";

export const metadata: Metadata = {
  title: "Find a Mentor",
  description:
    "Browse vetted mentors across IT & software, startups and academics. Get real, actionable insights from professionals who have already navigated your path.",
};

export default function FindAMentorPage() {
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
            filters={domainFilters}
            searchPlaceholder={mentorDirectoryPage.searchPlaceholder}
            emptyState={mentorDirectoryPage.emptyState}
          />
        </div>
      </section>
    </>
  );
}
