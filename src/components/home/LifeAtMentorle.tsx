import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { lifeAtMentorle } from "@/data/home";
import type { LifeStory } from "@/data/home";

function StoryText({ story }: { story: LifeStory }) {
  return (
    <div className="flex flex-col justify-end p-5 md:p-6 lg:p-8">
      <h3 className="text-xl font-medium text-ink lg:text-2xl">{story.title}</h3>
      <p className="mt-3 text-base leading-snug text-ink/85">{story.description}</p>
    </div>
  );
}

const tileSizes = "(min-width: 768px) 27rem, 100vw";
const imageClasses = "object-cover transition-transform duration-700 ease-out group-hover:scale-105";

export function LifeAtMentorle() {
  const { leadershipSummit, workshop, beyondTheAlgorithm, connections } = lifeAtMentorle;

  return (
    <section aria-labelledby="life-title" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader
          id="life-title"
          eyebrow="Mentor Stories"
          title="Life at Mentorle"
          description="Catch up on our offline summits, university guest lectures, and founder mixers across the region."
        />

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          <article data-animate="fade-up" className="group grid border border-line bg-white p-3 md:col-span-2 md:grid-cols-2">
            <div data-animate="image" className="relative aspect-[433/336] overflow-hidden">
              <Image src={leadershipSummit.image.src} alt={leadershipSummit.alt} fill sizes={tileSizes} className={imageClasses} />
            </div>
            <StoryText story={leadershipSummit} />
          </article>

          <div data-animate="image" className="group relative aspect-[433/360] overflow-hidden">
            <Image src={workshop.image.src} alt={workshop.alt} fill sizes={tileSizes} className={imageClasses} />
          </div>

          <article data-animate="fade-up" className="flex min-h-[16.25rem] border border-line bg-white p-3 lg:min-h-[22.5rem]">
            <StoryText story={beyondTheAlgorithm} />
          </article>

          <article data-animate="fade-up" className="group grid border border-line bg-white p-3 md:col-span-2 md:grid-cols-2">
            <div data-animate="image" className="relative aspect-[433/336] overflow-hidden">
              <Image src={connections.image.src} alt={connections.alt} fill sizes={tileSizes} className={imageClasses} />
            </div>
            <StoryText story={connections} />
          </article>
        </div>
      </div>
    </section>
  );
}
