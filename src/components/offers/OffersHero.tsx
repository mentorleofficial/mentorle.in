import { offerCategories, offersPage, offers, OFFERS_CHECKED_AT } from "@/data/offers";

const copy = offersPage.hero;
const checked = new Date(`${OFFERS_CHECKED_AT}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

// The dark band used by pages without a photo (account, legal), with the catalogue's numbers in a row underneath
// (the homepage stats' style: large muted numbers, hairline dividers).
export function OffersHero() {
  const stats = [
    { value: offers.length, label: copy.stats.offers },
    { value: offers.filter((offer) => offer.kind === "free").length, label: copy.stats.free },
    { value: offerCategories.length, label: copy.stats.categories },
  ];
  return (
    <section aria-labelledby="offers-title" className="bg-ink text-white">
      <div className="container-page pt-28 pb-12 md:pt-[10.5rem] md:pb-16 xl:pt-[12.125rem]">
        <p data-hero="1" className="text-sm tracking-[0.06em] text-white/75 uppercase">
          {copy.eyebrow}
        </p>
        <h1 id="offers-title" data-hero="2" className="mt-4 max-w-[48rem] text-[2.125rem] leading-[1.18] font-medium tracking-[-0.01em] whitespace-pre-line md:text-5xl">
          {copy.title}
        </h1>
        <p data-hero="3" className="mt-5 max-w-[42rem] text-base leading-snug text-white/90 md:text-lg">
          {copy.subtitle}
        </p>
        <div data-hero="4" className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6 border-t border-white/15 pt-8 md:mt-14 md:gap-x-16">
          <dl className="grid w-full grid-cols-3 gap-6 sm:flex sm:w-auto sm:gap-12 md:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-white/75">{stat.label}</dt>
                <dd className="text-[2.5rem] leading-none font-medium tracking-[-0.02em] tabular-nums md:text-[3.5rem]">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-white/60 md:ml-auto">{copy.stats.checked(checked)}</p>
        </div>
      </div>
    </section>
  );
}
