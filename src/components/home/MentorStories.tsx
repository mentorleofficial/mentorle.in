import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mentorQuotes } from "@/data/home";

export function MentorStories() {
  return (
    <section aria-labelledby="mentor-stories-title" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader
          id="mentor-stories-title"
          eyebrow="Mentor Stories"
          title="Why they give back"
          description="Hear directly from our top operators on why they dedicate their time to Mentorle."
        />
        <div data-animate="stagger" className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {mentorQuotes.map((item, index) => (
            <figure
              key={index}
              className="flex flex-col border border-line bg-white p-5 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-ink/40 lg:p-6"
            >
              <Image src="/homepage/quote-vector.svg" alt="" width={30} height={29} className="h-[1.8125rem] w-auto self-start" />
              <blockquote className="mt-6 flex-1 text-base leading-[1.35] text-ink lg:text-xl">
                <p>{item.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-8 lg:mt-10">
                <p className="text-lg font-medium text-ink lg:text-xl">{item.name}</p>
                <p className="mt-1 text-sm text-ink/85 lg:text-base">{item.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
