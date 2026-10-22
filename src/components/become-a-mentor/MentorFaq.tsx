"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { becomeAMentorPage } from "@/data/become-a-mentor";

// "FAQ · Good to know." Bordered accordion rows on grey; one answer open at a time (the first, as designed).
// The answer animates open with a grid-rows transition, so no JS measuring is needed.
export function MentorFaq() {
  const { faq } = becomeAMentorPage;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-title" className="bg-surface py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader id="faq-title" eyebrow={faq.eyebrow} title={faq.title} description={faq.description} />
        <ul data-animate="stagger" className="mt-10 flex flex-col gap-4 md:mt-12">
          {faq.items.map((item, index) => {
            const isOpen = open === index;
            return (
              <li key={item.question} className={`border border-[#cbcbcb] transition-colors duration-300 ${isOpen ? "" : "hover:border-ink/40"}`}>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className={`flex w-full items-center justify-between gap-6 px-5 pt-6 text-left text-lg font-medium text-ink transition-[padding] duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand md:px-6 md:pt-7 md:text-xl ${
                      isOpen ? "pb-2" : "pb-6 md:pb-7"
                    }`}
                  >
                    {item.question}
                    {/* "+" that turns into "×" when open. */}
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      className={`size-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      aria-hidden
                    >
                      <path d="M8 1v14M1 8h14" />
                    </svg>
                  </button>
                </h3>
                <div
                  id={`faq-a-${index}`}
                  role="region"
                  aria-labelledby={`faq-q-${index}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 text-base leading-snug text-ink md:px-6">{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
