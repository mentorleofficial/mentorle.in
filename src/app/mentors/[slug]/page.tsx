import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MentorBanner } from "@/components/home/MentorBanner";
import { MentorAbout, MentorExpertise, MentorExperience, MentorHero, MentorSessions } from "@/components/mentor-details/MentorProfileSections";
import { mentorDetailCopy } from "@/data/mentor-details";
import { getMentorProfile, getMentorSlugs } from "@/lib/mentors/queries";

// Every active mentor is prerendered at build time. Mentors who go live later get the page shell instantly on
// their first visit, then a cached copy (ISR with Cache Components).
export async function generateStaticParams() {
  return (await getMentorSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/mentors/[slug]">): Promise<Metadata> {
  const mentor = await getMentorProfile((await params).slug);
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

async function MentorView({ slug }: { slug: string }) {
  const mentor = await getMentorProfile(slug);
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
