import { SectionHeader } from "@/components/ui/SectionHeader";
import { becomeAMentorPage } from "@/data/become-a-mentor";

export function RankingWeights() {
  const { ranking } = becomeAMentorPage;

  return (
    <section aria-labelledby="ranking-title" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader id="ranking-title" eyebrow={ranking.eyebrow} title={ranking.title} description={ranking.description} />
        <div data-animate="stagger" className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {ranking.weights.map((weight) => (
            <article
              key={weight.title}
              className="flex min-h-[16.625rem] flex-col border border-line px-6 pt-7 pb-6 transition-colors duration-300 hover:border-ink/40"
            >
              <p className="text-[4.5rem] leading-none font-medium tracking-[-0.02em] text-ink lg:text-[5.5rem]">{weight.value}</p>
              <div className="mt-auto pt-8">
                <h3 className="text-xl font-medium text-ink lg:text-2xl">{weight.title}</h3>
                <p className="mt-2 text-base leading-snug text-ink">{weight.description}</p>
              </div>
            </article>
          ))}
        </div>
        <p data-animate="fade-up" className="mx-auto mt-12 max-w-[48.5rem] text-center text-base leading-snug text-ink">
          {ranking.note}
        </p>
      </div>
    </section>
  );
}
