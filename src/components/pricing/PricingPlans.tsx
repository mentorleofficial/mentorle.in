import { PlanCard } from "@/components/pricing/PlanCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { planCopy, pricingPage } from "@/data/pricing";
import { getPlans } from "@/lib/plans/queries";

type PricingPlansProps = {
  // Shown where no page hero introduces the cards (the homepage); the pricing page leaves it out.
  header?: { eyebrow: string; title: string; description: string };
  // Section padding override.
  className?: string;
  // The homepage puts the plans on a grey section; the pricing page on dots.
  background?: "dots" | "surface";
};

// The plans admins have on sale, in their order: one card each, three to a row from lg (centred when fewer).
export async function PricingPlans({ header, className = "pt-16 pb-16 md:py-24 lg:pt-[8.5rem] lg:pb-[8.125rem]", background = "dots" }: PricingPlansProps) {
  const { terms } = pricingPage;
  const plans = await getPlans();
  const columns = plans.length >= 3 ? "lg:grid-cols-3 lg:max-w-none" : plans.length === 2 ? "lg:grid-cols-2 lg:max-w-[57rem]" : "";

  return (
    <section
      id="plans"
      {...(header ? { "aria-labelledby": "plans-title" } : { "aria-label": "Mentorle Plus plans" })}
      className={`${background === "surface" ? "bg-surface" : "bg-dots"} ${className}`}
    >
      <div className="container-page">
        {header && (
          <div className="mb-12 md:mb-16">
            <SectionHeader id="plans-title" eyebrow={header.eyebrow} title={header.title} description={header.description} />
          </div>
        )}
        {plans.length === 0 ? (
          <p className="text-center text-base text-ink-soft">{planCopy.empty}</p>
        ) : (
          <div data-animate="stagger" className={`mx-auto grid max-w-[34rem] gap-5 ${columns}`}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onSurface={background === "surface"} />
            ))}
          </div>
        )}
        <p data-animate="fade-up" className="mx-auto mt-10 max-w-[60rem] text-center text-base text-ink md:mt-12">
          {terms.lead} <strong className="font-semibold">{terms.emphasis}</strong>
          {terms.tail}
        </p>
      </div>
    </section>
  );
}
