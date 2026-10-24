import { PlanCta } from "@/components/pricing/PlanCta";
import { planCopy } from "@/data/pricing";
import type { PricingPlan } from "@/data/pricing";

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-1 size-3.5 shrink-0" aria-hidden>
      <path d="M2 8.5l4 4.5L14.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-[0.3125rem] size-3.5 shrink-0 fill-current" aria-hidden>
      <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6L12 2z" />
    </svg>
  );
}

// "**12 expert-led masterclasses** to build…" → the lead in medium weight, the rest regular.
function Benefit({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="font-medium">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

const periodOf = (plan: PricingPlan) => (plan.billing === "free" ? planCopy.free : planCopy.perMonths(plan.accessMonths ?? 12));

// `onSurface`: on a grey section (homepage) the cards take the section colour with #cbcbcb borders instead of
// white cards with `line` borders (pricing page).
export function PlanCard({ plan, onSurface = false }: { plan: PricingPlan; onSurface?: boolean }) {
  return (
    <article id={`plan-${plan.slug}`} aria-labelledby={`plan-${plan.slug}-title`} className={`flex scroll-mt-28 flex-col ${plan.badge ? "" : "lg:pt-[2.625rem]"}`}>
      {plan.badge && <p className="flex h-[2.625rem] items-center bg-brand px-6 text-[0.9375rem] text-white">{plan.badge}</p>}
      <div
        className={`flex flex-1 flex-col border p-6 transition-colors duration-300 ${onSurface ? "bg-surface" : "bg-white"} ${
          plan.featured ? `border-brand ${plan.badge ? "border-t-0" : ""}` : `${onSurface ? "border-[#cbcbcb]" : "border-line"} hover:border-ink/40`
        }`}
      >
        <h3 id={`plan-${plan.slug}-title`} className="text-2xl font-medium text-ink">
          {plan.name}
        </h3>
        {plan.tagline && <p className="mt-1 text-base text-ink">{plan.tagline}</p>}

        <div className="mt-6 flex flex-wrap items-baseline gap-x-2">
          <p
            className={`text-[3.75rem] leading-none font-medium tracking-[-0.02em] tabular-nums lg:text-[3.25rem] xl:text-[clamp(4.5rem,5.85vw,5.25rem)] ${
              plan.featured ? "text-ink" : "text-muted"
            }`}
          >
            ₹{plan.price.toLocaleString("en-IN")}
          </p>
          <span className="text-base text-ink">{periodOf(plan)}</span>
        </div>
        <p className="mt-3 min-h-6 text-base text-ink">{plan.note}</p>

        <ul className="mt-6 flex flex-col gap-2.5">
          {plan.intro && (
            <li className="flex gap-2 text-base leading-6 font-medium text-ink">
              <StarIcon />
              <span>{plan.intro}</span>
            </li>
          )}
          {plan.benefits.map((benefit, index) => (
            <li key={index} className="flex gap-2 text-base leading-6 text-ink">
              <CheckIcon />
              <span>
                <Benefit text={benefit} />
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <PlanCta plan={plan} />
        </div>
      </div>
    </article>
  );
}
