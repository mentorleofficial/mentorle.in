import type { Metadata } from "next";
import { SpeakerRoster } from "@/components/speakers/SpeakerRoster";
import { PageHero } from "@/components/ui/PageHero";
import { speakerHubPage } from "@/data/speakers";

export const metadata: Metadata = {
  title: "Speaker Hub",
  description:
    "Book top founders and industry leaders for your conference, university summit or corporate retreat through Mentorle's Speaker Hub.",
};

export default function SpeakerHubPage() {
  const { hero } = speakerHubPage;

  return (
    <>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        background={hero.background}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        subtitleSize="base"
        contentOffset="md:pt-[3.75rem]"
      />
      <SpeakerRoster />
    </>
  );
}
