import { SectionHeader } from "@/components/ui/SectionHeader";
import { becomeAMentorPage } from "@/data/become-a-mentor";

export function TierGrid() {
  const { tiers } = becomeAMentorPage;

  return (
    <section id="tiers" aria-labelledby="tiers-title" className="scroll-mt-4 bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader id="tiers-title" eyebrow={tiers.eyebrow} title={tiers.title} description={tiers.description} />
        <div data-animate="stagger" className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {tiers.cards.map((tier) => {
            const featured = "featured" in tier && tier.featured;
            return (
              <article
                key={tier.level}
                className={`flex min-h-[15.25rem] flex-col border p-6 transition-colors duration-300 ${
                  featured ? "border-ink bg-ink text-white md:col-span-2" : "border-line text-ink hover:border-ink/40"
                }`}
              >
                <p className="text-base">{tier.level}</p>
                <p
                  className={`mt-2.5 inline-flex h-[2.125rem] items-center self-start px-2 text-base text-white ${
                    featured ? "bg-brand" : "bg-ink"
                  }`}
                >
                  {tier.badge}
                </p>
                <p className={`mt-5 max-w-[54rem] text-base leading-snug ${featured ? "text-white/90" : ""}`}>{tier.description}</p>
                <p className="mt-auto flex items-baseline gap-1 pt-6">
                  <span className="text-2xl font-semibold">{tier.price}</span>
                  <span className="text-base">{tier.unit}</span>
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
