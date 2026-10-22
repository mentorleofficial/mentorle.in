import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { eventsPage } from "@/data/events";

type FeatureIcon = (typeof eventsPage.proPass.features)[number]["icon"];

// Small line icons for the three feature points (the design draws them inline; there are no asset files).
const icons: Record<FeatureIcon, React.ReactNode> = {
  cap: <path d="M2 8.5L12 4l10 4.5-10 4.5L2 8.5zM6 10.5V15c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5M22 8.5V14" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v5.5c0 4.5-3.4 8.3-8 9.5-4.6-1.2-8-5-8-9.5V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
};

// "Exclusive for Pro Pass members · Mentorle × Huptle" (Events & Summits, updated design 2026-10-22):
// copy, button and three feature points on the left, the partner illustration on the right.
export function ProPassPartner() {
  const { proPass } = eventsPage;
  return (
    <section aria-labelledby="pro-pass-title" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      {/* Stacked below lg; two equal columns at lg (tablets in landscape); the design's fixed 645px illustration
          column only from xl, where the text column still has room. */}
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:grid-cols-[minmax(0,1fr)_40.3125rem]">
        {/* The design sits the text block ~24px below the illustration's centre. */}
        <div data-animate="stagger" className="xl:mt-12">
          <p className="text-xl tracking-[-0.02em] text-ink md:text-2xl">{proPass.eyebrow}</p>
          <h2 id="pro-pass-title" className="mt-2 text-[1.625rem] leading-[1.375] font-medium text-ink md:mt-3 md:text-[2rem]">
            {proPass.title}
            <br />
            {proPass.subtitle}
          </h2>
          <p className="mt-3 max-w-[26.25rem] text-base leading-[1.375rem] text-ink">{proPass.description}</p>
          <ButtonLink href={proPass.cta.href} variant="brand" className="mt-3.5 h-[2.125rem] px-2 text-base">
            {proPass.cta.label}
          </ButtonLink>
          <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
            {proPass.features.map((feature) => (
              <li key={feature.title} className="grid grid-cols-[1.25rem_1fr] gap-x-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-5 text-ink" aria-hidden>
                  {icons[feature.icon]}
                </svg>
                <p className="text-[1.0625rem] text-ink">{feature.title}</p>
                <p className="col-start-2 mt-0.5 text-xs text-ink">{feature.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-xs text-ink md:mt-[4.25rem]">{proPass.fineprint}</p>
        </div>
        <div data-animate="fade-up">
          <Image
            src={proPass.image.src}
            alt={proPass.image.alt}
            width={proPass.image.width}
            height={proPass.image.height}
            sizes="(min-width: 1024px) 40.3125rem, 100vw"
            className="mx-auto h-auto w-full max-w-[40.3125rem]"
          />
        </div>
      </div>
    </section>
  );
}
