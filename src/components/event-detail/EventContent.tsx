import { eventDetailCopy } from "@/data/event-details";
import type { EventDetail } from "@/data/event-details";

const { sections } = eventDetailCopy;
const heading = "text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]";

// Main column: About, What You'll Learn (check-list on a surface panel) and Prerequisites (square bullets).
export function EventContent({ event }: { event: EventDetail }) {
  return (
    <div className="min-w-0">
      <section aria-labelledby="about-title" data-animate="fade-up">
        <h2 id="about-title" className={heading}>
          {sections.about}
        </h2>
        <p className="mt-5 text-base leading-[1.8125] text-ink">{event.about}</p>
      </section>

      {event.learn.length > 0 && (
        <>
          <hr className="my-10 border-line md:my-12" />
          <section aria-labelledby="learn-title" data-animate="fade-up">
            <h2 id="learn-title" className={heading}>
              {sections.learn}
            </h2>
            <ul className="mt-6 bg-surface px-5 py-2 md:px-6">
              {event.learn.map((item) => (
                <li key={item} className="flex items-start gap-4 border-[#cbcbcb] py-[1.125rem] text-base leading-6 text-ink not-last:border-b md:gap-5">
                  <svg viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-[0.4375rem] h-[0.6875rem] w-4 shrink-0 text-brand" aria-hidden>
                    <path d="M1 5.5L5.5 10 15 1" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {event.prerequisites.length > 0 && (
        <section aria-labelledby="prerequisites-title" data-animate="fade-up" className="mt-10 md:mt-12">
          <h2 id="prerequisites-title" className={heading}>
            {sections.prerequisites}
          </h2>
          <ul className="mt-6 space-y-5">
            {event.prerequisites.map((item) => (
              <li key={item} className="flex items-start gap-3.5 text-base leading-6 text-ink">
                <span className="mt-2.5 size-1 shrink-0 bg-ink-soft" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
