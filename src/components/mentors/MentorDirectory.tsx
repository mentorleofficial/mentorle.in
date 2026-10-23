"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";
import { MentorCard } from "@/components/mentors/MentorCard";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { experienceRanges } from "@/data/mentors";
import type { Mentor, SessionType } from "@/data/mentors";

type MentorDirectoryProps = {
  mentors: Mentor[];
  sessionTypes: SessionType[]; // the types at least one mentor offers
  labels: { all: string; experience: string; anyExperience: string; sessionType: string; anySessionType: string };
  searchPlaceholder: string;
  emptyState: string;
};

const matchesQuery = (mentor: Mentor, query: string) => {
  if (!query) return true;
  const haystack = [mentor.name, mentor.role, mentor.company ?? "", ...mentor.expertise].join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
};

const matchesExperience = (mentor: Mentor, range: string) => {
  const bounds = experienceRanges.find((entry) => entry.value === range);
  return !bounds || (mentor.years >= bounds.min && mentor.years <= bounds.max);
};

export function MentorDirectory({ mentors, sessionTypes, labels, searchPlaceholder, emptyState }: MentorDirectoryProps) {
  const [experience, setExperience] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const results = useMemo(
    () =>
      mentors.filter(
        (mentor) =>
          matchesExperience(mentor, experience) &&
          (!sessionType || mentor.sessionTypes.includes(sessionType as SessionType)) &&
          matchesQuery(mentor, trimmedQuery),
      ),
    [mentors, experience, sessionType, trimmedQuery],
  );
  const filtered = experience !== "" || sessionType !== "";

  // Animate only when the filter or search actually changes. A "skip the first run" flag isn't enough: React
  // runs effects twice on mount in development, which fired this on page load and fought the scroll fade-in
  // (cards flashed visible, vanished, then faded in).
  const shownFilter = useRef({ experience, sessionType, query: trimmedQuery });
  useGSAP(
    () => {
      const previous = shownFilter.current;
      if (previous.experience === experience && previous.sessionType === sessionType && previous.query === trimmedQuery) return;
      shownFilter.current = { experience, sessionType, query: trimmedQuery };
      const cards = gridRef.current?.children;
      if (!cards?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        cards,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: 0.06, overwrite: true },
      );
    },
    { dependencies: [experience, sessionType, trimmedQuery], scope: gridRef },
  );

  const reset = () => {
    setExperience("");
    setSessionType("");
    setQuery("");
  };

  return (
    <div>
      {/* z-20: the open dropdown list must sit above the (animated) card grid. */}
      <div data-animate="fade-up" className="relative z-20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Wraps instead of scrolling sideways, which would clip the open lists. */}
        <div role="group" aria-label="Filter mentors" className="flex flex-wrap gap-3">
          <button
            type="button"
            aria-pressed={!filtered}
            onClick={() => {
              setExperience("");
              setSessionType("");
            }}
            className={`inline-flex h-[2.3125rem] shrink-0 items-center border px-[1.125rem] text-sm whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              filtered ? "border-[#dadada] text-ink hover:border-ink" : "border-ink bg-ink text-white"
            }`}
          >
            {labels.all}
          </button>
          <FilterDropdown
            label={labels.experience}
            anyLabel={labels.anyExperience}
            options={experienceRanges.map((range) => ({ value: range.value, label: range.label }))}
            value={experience}
            onChange={setExperience}
          />
          {sessionTypes.length > 0 && (
            <FilterDropdown
              label={labels.sessionType}
              anyLabel={labels.anySessionType}
              options={sessionTypes.map((type) => ({ value: type, label: type }))}
              value={sessionType}
              onChange={setSessionType}
            />
          )}
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
