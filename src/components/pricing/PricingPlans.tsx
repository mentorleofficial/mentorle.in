import { PlanCard } from "@/components/pricing/PlanCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { plans, pricingPage } from "@/data/pricing";

type PricingPlansProps = {
  // Shown where no page hero introduces the cards (the homepage); the pricing page leaves it out.
  header?: { eyebrow: string; title: string; description: string };
  // Section padding; the homepage drops the top padding because it continues the dotted section above it.
  className?: string;
};

export function PricingPlans({ header, className = "pt-16 pb-16 md:py-24 lg:pt-[8.5rem] lg:pb-[8.125rem]" }: PricingPlansProps) {
  const { terms } = pricingPage;

  return (
    <section
      id="plans"
      {...(header ? { "aria-labelledby": "plans-title" } : { "aria-label": "Mentorle Plus plans" })}
      className={`bg-dots ${className}`}
    >
      <div className="container-page">
        {header && (
          <div className="mb-12 md:mb-16">
            <SectionHeader id="plans-title" eyebrow={header.eyebrow} title={header.title} description={header.description} />
          </div>
        )}
        <div data-animate="stagger" className="mx-auto grid max-w-[34rem] gap-5 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        <p data-animate="fade-up" className="mx-auto mt-10 max-w-[60rem] text-center text-base text-ink md:mt-12">
          {terms.lead} <strong className="font-semibold">{terms.emphasis}</strong>
          {terms.tail}
        </p>
      </div>
    </section>
  );
}
