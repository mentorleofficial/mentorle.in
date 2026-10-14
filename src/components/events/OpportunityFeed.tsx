"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";
import { PeopleIcon, PinIcon, WalletIcon } from "@/components/events/OpportunityIcons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Opportunity, OpportunityFilter, OpportunityType } from "@/data/events";

type OpportunityFeedProps = {
  opportunities: Opportunity[];
  filters: OpportunityFilter[];
  ctaLabels: Record<OpportunityType, string>;
  searchPlaceholder: string;
  emptyState: string;
};

const matches = (item: Opportunity, query: string) => {
  if (!query) return true;
  const haystack = [item.title, item.source, item.organiser, item.location, item.reward, ...item.categories].join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
};

export function OpportunityFeed({ opportunities, filters, ctaLabels, searchPlaceholder, emptyState }: OpportunityFeedProps) {
  const [type, setType] = useState<OpportunityFilter["value"]>("all");
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  const hasFiltered = useRef(false);
  const trimmed = query.trim();

  const results = useMemo(
    () => opportunities.filter((item) => (type === "all" || item.type === type) && matches(item, trimmed)),
    [opportunities, type, trimmed],
  );

  useGSAP(
    () => {
      if (!hasFiltered.current) {
        hasFiltered.current = true;
        return;
      }
      const rows = listRef.current?.children;
      if (!rows?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(rows, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", stagger: 0.05, overwrite: true });
    },
    { dependencies: [type, trimmed], scope: listRef },
  );

  return (
    <div>
      <div data-animate="fade-up" className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div
          role="group"
          aria-label="Filter opportunities by type"
          className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] xl:mx-0 xl:px-0"
        >
          {filters.map((filter) => {
            const isActive = filter.value === type;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setType(filter.value)}
                className={`inline-flex h-[2.3125rem] shrink-0 items-center border px-[1.125rem] text-sm whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  isActive ? "border-ink bg-ink text-white" : "border-[#cbcbcb] text-ink hover:border-ink"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <label className="relative block w-full xl:w-[27.0625rem]">
          <span className="sr-only">Search opportunities</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="pointer-events-none absolute top-1/2 left-[1.125rem] size-5 -translate-y-1/2 text-ink"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-[2.3125rem] w-full border border-[#cbcbcb] bg-transparent pr-4 pl-[2.75rem] text-sm text-ink transition-colors duration-300 placeholder:text-ink/70 hover:border-ink/50 focus:border-ink focus:outline-none"
          />
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length === 1 ? "1 opportunity found" : `${results.length} opportunities found`}
      </p>

      {results.length > 0 ? (
        <ul ref={listRef} data-animate="stagger" className="mt-12 flex flex-col gap-[1.5625rem] md:mt-16">
          {results.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-5 border border-[#cbcbcb] px-5 py-5 transition-colors duration-300 hover:border-ink/40 md:flex-row md:items-center md:justify-between md:px-6 md:py-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-[2.3125rem] items-center bg-[#ea7146] px-[1.1875rem] text-sm text-white">{item.source}</span>
                  <span className="text-sm text-ink md:text-base">{item.categories.join(", ")}</span>
                </div>
                <h3 className="mt-4 text-xl font-medium text-ink md:mt-5 md:text-2xl">{item.title}</h3>
                <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-ink md:text-lg">
                  <li className="flex items-center gap-2">
                    <PeopleIcon />
                    <span className="sr-only">Organiser: </span>
                    {item.organiser}
                  </li>
                  <li className="flex items-center gap-2">
                    <PinIcon />
                    <span className="sr-only">Location: </span>
                    {item.location}
                  </li>
                  <li className="flex items-center gap-2">
                    <WalletIcon />
                    <span className="sr-only">Pay or prize: </span>
                    {item.reward}
                  </li>
                </ul>
              </div>
              <ButtonLink href={item.url} external variant="dark" className="min-w-[7.5rem] self-start md:self-center">
                {ctaLabels[item.type]}
                <span className="sr-only">: {item.title} on {item.source}</span>
              </ButtonLink>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-3 py-16 text-center md:mt-16">
          <p className="text-base text-muted">{emptyState}</p>
          <button
            type="button"
            onClick={() => {
              setType("all");
              setQuery("");
            }}
            className="text-sm text-ink underline underline-offset-4 hover:text-brand"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
