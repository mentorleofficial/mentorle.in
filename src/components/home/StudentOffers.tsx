import { OfferCard } from "@/components/offers/OfferCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OFFERS_PATH, homeOffers, offers } from "@/data/offers";

// Homepage "Student offers": the six featured offers in the mentor grid's layout, with a link to /offers.
export function StudentOffers() {
  const featured = offers.filter((offer) => offer.featured).slice(0, 6);
  return (
    <section aria-labelledby="home-offers-title" className="bg-dots py-[3.6rem] md:py-[5.4rem] lg:py-[7.3125rem]">
      <div className="container-page">
        <SectionHeader
          id="home-offers-title"
          eyebrow={homeOffers.eyebrow}
          title={homeOffers.title}
          description={homeOffers.description(offers.length)}
          action={
            <ButtonLink href={OFFERS_PATH} variant="brand">
              {homeOffers.action}
            </ButtonLink>
          }
        />
        <ul data-animate="stagger" className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} onSurface={false} />
          ))}
        </ul>
      </div>
    </section>
  );
}
