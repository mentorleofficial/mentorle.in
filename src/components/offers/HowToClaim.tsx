import { SectionHeader } from "@/components/ui/SectionHeader";
import { offers, offersPage } from "@/data/offers";

// "How it works · Claim an offer in three steps": Become a Mentor's numbered format cards, three across.
export function HowToClaim() {
  const { steps } = offersPage;
  const packCount = offers.filter((offer) => offer.via === "github-pack").length;
  return (
    <section aria-labelledby="claim-steps-title" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader id="claim-steps-title" eyebrow={steps.eyebrow} title={steps.title} description={steps.description} />
        <ol data-animate="stagger" className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {steps.items.map((step) => (
            <li
              key={step.number}
              className="flex min-h-[13rem] flex-col border border-line bg-white px-6 pt-7 pb-6 transition-colors duration-300 hover:border-ink/40 lg:min-h-[15.5rem]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[2.25rem] leading-none font-medium text-ink tabular-nums" aria-hidden>
                  {step.number}
                </span>
                <span className="text-right text-lg text-ink lg:text-xl">{step.label}</span>
              </div>
              <div className="mt-auto pt-10">
                <h3 className="text-xl font-medium text-ink lg:text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-snug text-ink lg:text-base">{step.description(packCount)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
