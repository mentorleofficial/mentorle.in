import type { Metadata } from "next";
import { HowToClaim } from "@/components/offers/HowToClaim";
import { OfferDirectory } from "@/components/offers/OfferDirectory";
import { OffersHero } from "@/components/offers/OffersHero";
import { offers, offersPage } from "@/data/offers";

export const metadata: Metadata = {
  title: offersPage.metaTitle,
  description: offersPage.metaDescription,
};

// Static: the catalogue is a data file. The directory (search, category tabs, Details dialogs) runs in the browser.
export default function OffersPage() {
  return (
    <>
      <OffersHero />
      <section aria-label={offersPage.directory.label} className="bg-surface py-16 md:py-24 lg:py-[8.125rem]">
        <div className="container-page">
          <OfferDirectory offers={offers} />
          <p className="mx-auto mt-12 max-w-[42rem] text-center text-sm leading-snug text-ink-soft md:mt-16">{offersPage.note}</p>
        </div>
      </section>
      <HowToClaim />
    </>
  );
}
