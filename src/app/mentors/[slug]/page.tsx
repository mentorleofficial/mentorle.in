import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MentorBanner } from "@/components/home/MentorBanner";
import { MentorAbout, MentorExpertise, MentorExperience, MentorHero, MentorSessions } from "@/components/mentor-details/MentorProfileSections";
import { getMentorProfile, getMentorSlugs, mentorDetailCopy } from "@/data/mentor-details";

// Every profile in the data is prerendered. Cache Components needs at least one slug; with the database,
// return the active mentors' slugs (new ones render on first visit).
export async function generateStaticParams() {
  return getMentorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/mentors/[slug]">): Promise<Metadata> {
  const mentor = getMentorProfile((await params).slug);
  if (!mentor) return {};
  const role = [mentor.currentRole, mentor.currentOrganization].filter(Boolean).join(" at ");
  return { title: mentor.fullName, description: [role, mentor.headline ?? mentor.expertise.join(", ")].filter(Boolean).join(". ").slice(0, 160) };
}

// `params` is read inside Suspense so navigations stay instant (same pattern as /events/[slug]).
export default function MentorProfilePage({ params }: PageProps<"/mentors/[slug]">) {
  return (
    <Suspense fallback={<div className="h-[40rem] bg-white" aria-hidden />}>
      {params.then(({ slug }) => (
        <MentorView slug={slug} />
      ))}
    </Suspense>
  );
}

function MentorView({ slug }: { slug: string }) {
  const mentor = getMentorProfile(slug);
  if (!mentor) notFound();
  const { banner } = mentorDetailCopy;
  return (
    <>
      <MentorHero mentor={mentor} />
      <MentorAbout mentor={mentor} />
      <MentorSessions mentor={mentor} />
      <MentorExpertise mentor={mentor} />
      <MentorExperience mentor={mentor} />
      <MentorBanner title={banner.title} primaryCta={banner.primaryCta} secondaryCta={banner.secondaryCta} />
    </>
  );
}
