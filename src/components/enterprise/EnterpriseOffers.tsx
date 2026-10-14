import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { EnterpriseAudience } from "@/data/enterprise";

type EnterpriseOffersProps = {
  audiences: EnterpriseAudience[];
  contactCta: { label: string; href: string };
};

// Hairline dividers run edge to edge of the viewport; each cell draws its own so the grid can reflow.
const fullBleedRule =
  "relative after:pointer-events-none after:absolute after:bottom-0 after:-left-[100vw] after:-right-[100vw] after:h-px after:bg-line";

export function EnterpriseOffers({ audiences, contactCta }: EnterpriseOffersProps) {
  const rows = Math.max(...audiences.map((audience) => audience.offers.length)) + 1;

  return (
    <section aria-label="Partnership offers" className="overflow-x-clip bg-dots pt-16 pb-16 md:pt-24 md:pb-24 lg:pt-[8.125rem] lg:pb-[8.25rem]">
      <div
        data-animate="stagger"
        className="container-page grid md:grid-flow-col md:grid-cols-2 md:gap-x-10 xl:grid-cols-[46.9375rem_1fr] xl:gap-x-0"
        style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
      >
        {audiences.map((audience) => [
          <h2
            key={audience.id}
            id={audience.id}
            className={`scroll-mt-28 pb-8 text-[1.625rem] leading-tight font-medium text-ink md:pb-[4.3125rem] md:text-[2rem] md:[&:not(:first-child)]:mt-0 [&:not(:first-child)]:mt-14 ${fullBleedRule}`}
          >
            {audience.title}
          </h2>,
          ...audience.offers.map((offer) => (
            <div key={offer.title} className={`group flex gap-3.5 pt-8 pb-8 md:pt-[3.3125rem] md:pb-[2.875rem] ${fullBleedRule}`}>
              <Image
                src={offer.icon.src}
                alt=""
                width={offer.icon.width}
                height={offer.icon.height}
                className="mt-[0.3125rem] h-5 w-auto shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <div>
                <h3 className="text-xl font-medium text-ink md:text-2xl">{offer.title}</h3>
                <p className="mt-2 max-w-[17.25rem] text-base leading-snug text-ink">{offer.description}</p>
              </div>
            </div>
          )),
        ])}
      </div>
      <div data-animate="fade-up" className="mt-12 flex justify-center md:mt-16">
        <ButtonLink href={contactCta.href} variant="brand">
          {contactCta.label}
        </ButtonLink>
      </div>
    </section>
  );
}
