import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Plan, PlanFeature } from "@/data/pricing";

function FeatureIcon({ kind }: { kind: PlanFeature["kind"] }) {
  if (kind === "star") {
    return (
      <svg viewBox="0 0 24 24" className="mt-[0.3125rem] size-3.5 shrink-0 fill-current" aria-hidden>
        <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6L12 2z" />
      </svg>
    );
  }
  if (kind === "cross") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-[0.375rem] size-3 shrink-0" aria-hidden>
        <path d="M3 2.5l10 11M12.5 2.5l-9 11" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-1 size-3.5 shrink-0" aria-hidden>
      <path d="M2 8.5l4 4.5L14.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const featureLabel = { check: "Included", star: "Highlight", cross: "Not included" } as const;

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={`flex flex-col ${plan.featured ? "" : "lg:pt-[2.625rem]"}`}
    >
      {plan.badge && (
        <p className="flex h-[2.625rem] items-center bg-brand px-6 text-[0.9375rem] text-white">{plan.badge}</p>
      )}
      <div
        className={`flex flex-1 flex-col border bg-white p-6 transition-colors duration-300 ${
          plan.featured ? "border-brand border-t-0" : "border-line hover:border-ink/40"
        }`}
      >
        <h3 id={`plan-${plan.id}`} className="text-2xl font-medium text-ink">
          {plan.name}
        </h3>
        <p className="mt-1 text-base text-ink">{plan.tagline}</p>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-2">
          <p
            className={`text-[3.75rem] leading-none font-medium tracking-[-0.02em] tabular-nums lg:text-[3.25rem] xl:text-[clamp(4.5rem,5.85vw,5.25rem)] ${
              plan.featured ? "text-ink" : "text-muted"
            }`}
          >
            ₹{plan.price.toLocaleString("en-IN")}
          </p>
          <span className="text-base text-ink">{plan.period}</span>
        </div>
        <p className="mt-3 min-h-6 text-base text-ink">{plan.note}</p>

        <ul className="mt-6 flex flex-col gap-2.5">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className={`flex gap-2 text-base leading-6 ${
                feature.kind === "cross" ? "text-muted" : "text-ink"
              } ${feature.kind === "star" ? "font-medium" : ""}`}
            >
              <FeatureIcon kind={feature.kind} />
              <span>
                <span className="sr-only">{featureLabel[feature.kind]}: </span>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <ButtonLink href={plan.cta.href} variant={plan.cta.variant} className="w-full">
            {plan.cta.label}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
