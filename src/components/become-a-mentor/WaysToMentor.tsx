import { SectionHeader } from "@/components/ui/SectionHeader";
import { becomeAMentorPage } from "@/data/become-a-mentor";

// "Ways to mentor · Choose how you can help." Four numbered format cards: number and format label on top,
// title and description pinned to the bottom (same border and hover as IconCard).
export function WaysToMentor() {
  const { ways } = becomeAMentorPage;
  return (
    <section aria-labelledby="ways-title" className="bg-surface py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader id="ways-title" eyebrow={ways.eyebrow} title={ways.title} description={ways.description} />
        <ol data-animate="stagger" className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {ways.formats.map((format) => (
            <li
              key={format.number}
              className="flex min-h-[15rem] flex-col border border-[#cbcbcb] px-6 pt-7 pb-6 transition-[border-color,background-color] duration-300 hover:border-ink/40 hover:bg-white lg:min-h-[18.625rem]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[2.25rem] leading-none font-medium text-ink tabular-nums" aria-hidden>
                  {format.number}
                </span>
                <span className="text-right text-lg text-ink lg:text-xl">{format.label}</span>
              </div>
              <div className="mt-auto pt-10">
                <h3 className="text-xl font-medium text-ink lg:text-2xl">{format.title}</h3>
                <p className="mt-2 text-sm leading-snug text-ink lg:text-base">{format.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
