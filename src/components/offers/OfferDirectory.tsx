"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { scrollToElement } from "@/components/motion/SmoothScroll";
import { OfferCard } from "@/components/offers/OfferCard";
import { Pagination } from "@/components/ui/Pagination";
import { offerCategories, offersPage } from "@/data/offers";
import type { Offer, OfferCategory } from "@/data/offers";

const copy = offersPage.directory;
const PER_PAGE = 12; // 4 rows of 3 (6 of 2 on tablets)
const categoryLabel = (slug: OfferCategory) => offerCategories.find((category) => category.slug === slug)?.label ?? "";
const isCategory = (value: string | null): value is OfferCategory => offerCategories.some((category) => category.slug === value);

const matches = (offer: Offer, query: string) => {
  if (!query) return true;
  const haystack = [offer.brand, offer.title, offer.description, offer.eligibility, categoryLabel(offer.category)].join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
};

// The filter bar (Find a Mentor's pattern): search, then category tabs with counts (they scroll sideways on phones
// and wrap from lg), then 12 cards a page with page numbers under them. Counts follow the search. The category and
// page live in the URL (?category=design&page=2) so a filtered page can be shared and survives a reload; changing
// the search or category goes back to page 1.
export function OfferDirectory({ offers }: { offers: Offer[] }) {
  const [category, setCategory] = useState<OfferCategory | "">("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const trimmed = query.trim();

  const searched = useMemo(() => offers.filter((offer) => matches(offer, trimmed)), [offers, trimmed]);
  // "All" opens with the featured offers (the homepage six), then the rest by category.
  const results = category ? searched.filter((offer) => offer.category === category) : [...searched.filter((offer) => offer.featured), ...searched.filter((offer) => !offer.featured)];
  const pageCount = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const shownOffers = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const tabs = [
    { slug: "" as const, label: copy.all, count: searched.length },
    ...offerCategories.map((entry) => ({ slug: entry.slug, label: entry.label, count: searched.filter((offer) => offer.category === entry.slug).length })),
  ];

  // The prerendered page is "All, page 1"; pick up ?category= and ?page= once in the browser.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("category");
    const pageFromUrl = Number(params.get("page"));
    queueMicrotask(() => {
      if (isCategory(fromUrl)) setCategory(fromUrl);
      if (Number.isInteger(pageFromUrl) && pageFromUrl > 1) setPage(pageFromUrl);
    });
  }, []);

  // Keep the URL in step (replace, not push, so Back leaves the page instead of stepping through filters).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (category) params.set("category", category);
    else params.delete("category");
    if (current > 1) params.set("page", String(current));
    else params.delete("page");
    const search = params.toString();
    const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(window.history.state, "", url);
  }, [category, current]);

  const choose = (next: OfferCategory | "") => {
    setCategory(next);
    setPage(1);
  };
  const goTo = (next: number) => {
    setPage(next);
    // Back to the top of the list (below the fixed header), so the new page starts at its first card.
    if (rootRef.current) scrollToElement(rootRef.current, 120);
  };

  // Animate only when what's shown changes (see MentorDirectory for why a first-run flag isn't enough).
  const shown = useRef({ category, query: trimmed, page: current });
  useGSAP(
    () => {
      const previous = shown.current;
      if (previous.category === category && previous.query === trimmed && previous.page === current) return;
      shown.current = { category, query: trimmed, page: current };
      const cards = gridRef.current?.children;
      if (!cards?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(cards, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: 0.04, overwrite: true });
    },
    { dependencies: [category, trimmed, current], scope: gridRef },
  );

  return (
    <div ref={rootRef}>
      <div data-animate="fade-up">
        <label className="relative block w-full lg:w-[29.5625rem]">
          <span className="sr-only">{copy.searchLabel}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute top-1/2 left-[1.125rem] size-4 -translate-y-1/2 text-ink" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={copy.searchPlaceholder}
            className="h-[2.3125rem] w-full border border-[#dadada] bg-transparent pr-4 pl-[2.75rem] text-sm text-ink transition-colors duration-300 placeholder:text-ink/70 hover:border-ink/50 focus:border-ink focus:outline-none"
          />
        </label>

        <div role="group" aria-label={copy.label} className="no-scrollbar -mx-[var(--gutter)] mt-4 flex gap-3 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
          {tabs.map((tab) => {
            const active = category === tab.slug;
            return (
              <button
                key={tab.slug || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => choose(tab.slug)}
                className={`inline-flex h-[2.3125rem] shrink-0 items-center gap-2 border px-[1.125rem] text-sm whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  active ? "border-ink bg-ink text-white" : "border-[#dadada] text-ink hover:border-ink"
                }`}
              >
                {tab.label}
                <span className={`tabular-nums ${active ? "text-white/70" : "text-ink-soft"}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {copy.results(results.length)}
        {pageCount > 1 ? `, ${copy.pageOf(current, pageCount)}` : ""}
      </p>

      {results.length > 0 ? (
        <>
          <ul ref={gridRef} data-animate="stagger" className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {shownOffers.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} />
            ))}
          </ul>
          <div className="mt-10 md:mt-12">
            <Pagination
              page={current}
              pageCount={pageCount}
              onChange={goTo}
              label={copy.pagination}
              summary={copy.showing((current - 1) * PER_PAGE + 1, Math.min(current * PER_PAGE, results.length), results.length)}
            />
          </div>
        </>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center md:mt-12">
          <p className="text-base text-muted">{copy.empty}</p>
          <button
            type="button"
            onClick={() => {
              choose("");
              setQuery("");
            }}
            className="text-sm text-ink underline underline-offset-4 hover:text-brand"
          >
            {copy.clear}
          </button>
        </div>
      )}
    </div>
  );
}
