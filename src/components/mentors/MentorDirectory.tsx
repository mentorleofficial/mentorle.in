"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";
import { MentorCard } from "@/components/mentors/MentorCard";
import { MaskIcon } from "@/components/ui/MaskIcon";
import type { DomainFilter, Mentor } from "@/data/mentors";

type MentorDirectoryProps = {
  mentors: Mentor[];
  filters: DomainFilter[];
  searchPlaceholder: string;
  emptyState: string;
};

const matchesQuery = (mentor: Mentor, query: string) => {
  if (!query) return true;
  const haystack = [mentor.name, mentor.role, mentor.company, mentor.focus, ...mentor.expertise].join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
};

export function MentorDirectory({ mentors, filters, searchPlaceholder, emptyState }: MentorDirectoryProps) {
  const [domain, setDomain] = useState<DomainFilter["value"]>("all");
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const hasFiltered = useRef(false);

  const trimmedQuery = query.trim();
  const results = useMemo(
    () => mentors.filter((mentor) => (domain === "all" || mentor.domain === domain) && matchesQuery(mentor, trimmedQuery)),
    [mentors, domain, trimmedQuery],
  );

  useGSAP(
    () => {
      if (!hasFiltered.current) {
        hasFiltered.current = true;
        return;
      }
      const cards = gridRef.current?.children;
      if (!cards?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        cards,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: 0.06, overwrite: true },
      );
    },
    { dependencies: [domain, trimmedQuery], scope: gridRef },
  );

  const reset = () => {
    setDomain("all");
    setQuery("");
  };

  return (
    <div>
      <div data-animate="fade-up" className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter mentors by domain"
          className="no-scrollbar -mx-[var(--gutter)] flex gap-3 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:px-0"
        >
          {filters.map((filter) => {
            const isActive = filter.value === domain;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setDomain(filter.value)}
                className={`inline-flex h-[2.3125rem] shrink-0 items-center gap-2 border px-[1.125rem] text-sm whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  isActive ? "border-ink bg-ink text-white" : "border-[#dadada] text-ink hover:border-ink"
                }`}
              >
                {filter.icon && <MaskIcon src={filter.icon} className="h-[0.9375rem] w-[1.0625rem]" />}
                {filter.label}
              </button>
            );
          })}
        </div>

        <label className="relative block w-full lg:w-[29.5625rem]">
          <span className="sr-only">Search mentors</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute top-1/2 left-[1.125rem] size-4 -translate-y-1/2 text-ink"
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
            className="h-[2.3125rem] w-full border border-[#dadada] bg-transparent pr-4 pl-[2.75rem] text-sm text-ink transition-colors duration-300 placeholder:text-ink/70 hover:border-ink/50 focus:border-ink focus:outline-none"
          />
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length === 1 ? "1 mentor found" : `${results.length} mentors found`}
      </p>

      {results.length > 0 ? (
        <div ref={gridRef} data-animate="stagger" className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {results.map((mentor) => (
            <MentorCard key={mentor.slug} mentor={mentor} href={`/mentors/${mentor.slug}`} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-3 py-16 text-center md:mt-16">
          <p className="text-base text-muted">{emptyState}</p>
          <button type="button" onClick={reset} className="text-sm text-ink underline underline-offset-4 hover:text-brand">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
