import { PlanCard } from "@/components/pricing/PlanCard";
import { plans, pricingPage } from "@/data/pricing";

export function PricingPlans() {
  const { terms } = pricingPage;

  return (
    <section id="plans" aria-label="Mentorle Plus plans" className="bg-dots pt-16 pb-16 md:py-24 lg:pt-[8.5rem] lg:pb-[8.125rem]">
      <div className="container-page">
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
