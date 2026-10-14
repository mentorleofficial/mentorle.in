import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { CommunityFeature } from "@/data/community";

// Alternating image/text rows split down the middle by a hairline, with full-width hairlines between rows.
// The image sits inset 18px inside its half; the text half is vertically centred. Content is capped at the
// 1440-design width (90rem, which scales with the root font) and centred; the row hairlines stay full-bleed.
export function FeatureSplit({ features }: { features: CommunityFeature[] }) {
  return (
    <section aria-label="How the community works" className="bg-dots pb-16 md:pb-24 lg:pb-[8.125rem]">
      {features.map((feature, index) => {
        const imageFirst = index % 2 === 0;
        const titleId = `feature-${index}-title`;
        return (
          <article key={feature.eyebrow} aria-labelledby={titleId} className="border-b border-line">
            <div className="relative mx-auto grid max-w-[90rem] lg:grid-cols-2 lg:after:pointer-events-none lg:after:absolute lg:after:inset-y-0 lg:after:left-1/2 lg:after:w-px lg:after:bg-line">
            <div data-animate="image" className={`relative m-4 aspect-[684/412] overflow-hidden md:m-8 lg:m-[1.125rem] ${imageFirst ? "" : "lg:order-2"}`}>
              <Image src={feature.image.src} alt={feature.image.alt} fill sizes="(min-width: 1024px) min(50vw, 45rem), 100vw" className="object-cover" />
            </div>
            <div
              data-animate="stagger"
              className={`flex flex-col items-start justify-center px-[var(--gutter)] pt-4 pb-12 md:pt-2 md:pb-14 lg:py-10 ${
                imageFirst ? "lg:pr-[var(--gutter)] lg:pl-12" : "lg:order-1 lg:pr-12"
              }`}
            >
              <p className="text-xl tracking-[-0.02em] text-ink md:text-2xl">{feature.eyebrow}</p>
              <h2 id={titleId} className="mt-2 max-w-[24.5rem] text-[1.625rem] leading-[1.38] font-medium text-ink md:mt-3 md:text-[2rem]">
                {feature.title}
              </h2>
              <p className="mt-3 max-w-[25.25rem] text-base leading-snug text-ink">{feature.description}</p>
              <ButtonLink href={feature.cta.href} variant="brand" className="mt-6">
                {feature.cta.label}
              </ButtonLink>
            </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
